/**
 * 促销管理查询条件
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, DatePicker, Row, Col } from 'antd';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { pubFetchValueList } from '../../../actions/pub';
import { getPromotionList } from '../../../actions/promotion';
import SearchMind from '../../../components/searchMind/SearchMind';
import { DATE_FORMAT } from '../../../constant/index';
import { promotionStatus } from '../constants';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

@connect(
    state => ({
        employeeCompanyId: state.toJS().user.data.user.employeeCompanyId
    }),
    dispatch => bindActionCreators({
        pubFetchValueList,
        getPromotionList
    }, dispatch)
)

class SearchForm extends PureComponent {
    constructor(props) {
        super(props);
        this.getStatus = this.getStatus.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        this.props.getPromotionList();
    }

    getStatus() {
        const keys = Object.keys(promotionStatus);
        return keys.map((key) => (
            <Option key={key} value={promotionStatus[key]}>
                {promotionStatus[key]}
            </Option>
        ));
    }

    handleSearch() {

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="search-box">
                <Form layout="inline">
                    <div className="search-conditions">
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem label="活动ID" >
                                    {getFieldDecorator('id', {
                                    })(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="活动名称">
                                    {getFieldDecorator('promotionName', {
                                    })(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem>
                                    <div className="scope">
                                        <span className="sc-form-item-label">使用范围</span>
                                        <SearchMind
                                            style={{ zIndex: 8 }}
                                            compKey="spId"
                                            ref={ref => { this.subCompanySearchMind = ref }}
                                            fetch={(params) =>
                                                this.props.pubFetchValueList({
                                                    branchCompanyId: !(isNaN(parseFloat(params.value))) ? params.value : '',
                                                    branchCompanyName: isNaN(parseFloat(params.value)) ? params.value : ''
                                                }, 'findCompanyBaseInfo')
                                            }
                                            onChoosed={this.handleSubCompanyChoose}
                                            onClear={this.handleSubCompanyClear}
                                            renderChoosedInputRaw={(row) => (
                                                <div>{row.id} - {row.name}</div>
                                            )}
                                            pageSize={6}
                                            columns={[
                                                {
                                                    title: '子公司id',
                                                    dataIndex: 'id',
                                                    width: 98
                                                }, {
                                                    title: '子公司名字',
                                                    dataIndex: 'name'
                                                }
                                            ]}
                                        />
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem>
                                    <div className="promotionDateRange">
                                        <span className="sc-form-item-label">活动时间</span>
                                        {getFieldDecorator('promotionDateRange', {
                                            initialValue: '',
                                            rules: [{ required: true, message: '请选择活动日期' }]
                                        })(
                                            <RangePicker
                                                style={{ width: '240px' }}
                                                className="manage-form-enterTime"
                                                format={DATE_FORMAT}
                                                placeholder={['开始时间', '结束时间']}
                                                onChange={this.onEnterTimeChange}
                                            />
                                            )}
                                    </div>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 状态 */}
                                <FormItem label="状态">
                                    {getFieldDecorator('statusCode', {
                                        initialValue: promotionStatus.defaultValue
                                    })(
                                        <Select style={{ width: '153px' }} size="default">
                                            {this.getStatus()}
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40} type="flex" justify="end">
                            <Col>
                                <FormItem>
                                    <Button type="primary" size="default" onClick={this.handleSearch}>
                                        查询
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button size="default" onClick={this.handleResetValue}>
                                        重置
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button size="default" onClick={this.handleCreate}>
                                        新增
                                    </Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div >
        );
    }
}

SearchForm.propTypes = {
    pubFetchValueList: PropTypes.func,
    getPromotionList: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any)
};

SearchForm.defaultProps = {
    prefixCls: 'PromotionList'
}

export default withRouter(Form.create()(SearchForm));
