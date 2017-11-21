import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, DatePicker, Row, Col } from 'antd';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import { connect } from 'react-redux';
import Utils from '../../../util/util';
import { returnGoodsStatus, productStateOption } from '../../../constant/salesManagement';
import { getExchangeGoodsListAction } from '../../../actions';
import { pubFetchValueList } from '../../../actions/pub';
import SearchMind from '../../../components/searchMind';
import { BranchCompany } from '../../../container/search';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

@connect(
    () => ({
    }),
    dispatch => bindActionCreators({
        getExchangeGoodsListAction,
        pubFetchValueList,
    }, dispatch)
)

class SearchForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            franchiseeId: '',
        }
        this.joiningSearchMind = null;
    }

    // 父组件page改变或点击确定或取消
    componentWillReceiveProps(nextProps) {
        if (this.props.refresh !== nextProps.refresh) {
            this.handleSearch()
        }
    }

    // 获取用于搜索的所有有效表单值
    getSearchParams = () => {
        const {
            branchCompany,
            id,
            orderId,
            productState,
            createTime,
            state
            } = this.props.form.getFieldsValue();
        const startCreateTime = createTime ? Date.parse(createTime[0].format(dateFormat)) : '';
        const endCreateTime = createTime ? Date.parse(createTime[1].format(dateFormat)) : '';
        const franchiseeId = this.state.franchiseeId;
        const searchParams = {
            franchiseeId,
            branchCompanyId: branchCompany.id,
            id,
            orderId,
            productState,
            state,
            startCreateTime,
            endCreateTime
        };

        return Utils.removeInvalid(searchParams);
    }

    // 搜索方法
    handleSearch = (e) => {
        // 将查询条件回传给调用页
        e.preventDefault();
        this.props.onPromotionSearch(this.getSearchParams());
    }

    // 重置
    handleReset = () => {
        this.handleJoiningClear();
        this.joiningSearchMind.reset();
        this.props.form.resetFields();
        this.props.onPromotionReset();  // 通知父页面已清空
    }

    // 加盟商-值清单
    handleJoiningChoose = ({ record }) => {
        this.setState({
            franchiseeId: record.franchiseeId,
            franchiseeIdName: `${record.franchiseeId} - ${record.franchiseeName}`
        });
    }


    // 加盟商-清除
    handleJoiningClear = () => {
        this.setState({
            franchiseeId: ''
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.state;
        return (
            <div className="search-box">
                <Form
                    layout="inline"
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSearch}
                >
                    <Row gutter={40}>
                        <Col span={8}>
                            <FormItem label="原订单号">
                                {getFieldDecorator('orderId', {
                                    initialValue: data.orderId
                                })(
                                    <Input size="default" placeholder="原订单号" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8} className="company-time">
                            {/* 子公司 */}
                            <FormItem label="分公司">
                                {getFieldDecorator('branchCompany', {
                                    initialValue: { id: '', name: '' }
                                })(<BranchCompany />)}
                            </FormItem>
                        </Col>
                        <Col span={8} className="franchisee-item">
                            <FormItem>
                                <div>
                                    <span className="sc-form-item-label">雅堂小超:</span>
                                    <SearchMind
                                        defaultValue={this.state.franchiseeIdName}
                                        rowKey="franchiseeId"
                                        compKey="search-mind-joining"
                                        ref={ref => { this.joiningSearchMind = ref }}
                                        fetch={(params) =>
                                            this.props.pubFetchValueList({
                                                param: params.value,
                                                pageNum: params.pagination.current || 1,
                                                pageSize: params.pagination.pageSize
                                            }, 'getFranchiseeInfo')
                                        }
                                        onChoosed={this.handleJoiningChoose}
                                        onClear={this.handleJoiningClear}
                                        renderChoosedInputRaw={(row) => (
                                            <div>
                                                {row.franchiseeId} - {row.franchiseeName}
                                            </div>
                                        )}
                                        pageSize={6}
                                        columns={[
                                            {
                                                title: '加盟商id',
                                                dataIndex: 'franchiseeId',
                                                width: 98
                                            }, {
                                                title: '加盟商名字',
                                                dataIndex: 'franchiseeName',
                                                width: 140
                                            }
                                        ]}
                                    />
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={40}>
                        <Col span={8}>
                            <FormItem label="换货单号">
                                {getFieldDecorator('id', {
                                    initialValue: data.id
                                })(
                                    <Input size="default" placeholder="换货单号" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem >
                                <div className="row middle">
                                    <span className="ant-form-item-label search-mind-label">换货日期</span>
                                    {getFieldDecorator('createTime', {
                                        initialValue: data.startCreateTime ? [moment(data.startCreateTime), moment(data.endCreateTime)] : null
                                    })(
                                        <RangePicker
                                            className="date-range-picker"
                                            style={{ width: 250 }}
                                            format={dateFormat}
                                            showTime={{
                                                hideDisabledOptions: true,
                                                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                            }}
                                            placeholder={['开始日期', '结束日期']}
                                            onChange={this.chooseCreateDate}
                                        />
                                        )}
                                </div>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="换货单状态">
                                {getFieldDecorator('state', {
                                    initialValue: data.state ? data.state : ''
                                })(
                                    <Select style={{ width: '200px' }} size="default">
                                        {
                                            returnGoodsStatus.data.map((item) => (
                                                <Select.Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={40}>
                        <Col span={8}>
                            <FormItem label="商品状态">
                                {getFieldDecorator('productState', {
                                    initialValue: data.productState ? data.productState : ''
                                })(
                                    <Select style={{ width: '200px' }} size="default">
                                        {
                                            productStateOption.data.map((item) => (
                                                <Select.Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={40}>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit">搜索</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                        </Col>
                    </Row>
                </Form>
            </div >
        );
    }
}

SearchForm.propTypes = {
    onPromotionSearch: PropTypes.func,
    onPromotionReset: PropTypes.func,
    pubFetchValueList: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    refresh: PropTypes.bool
};

export default withRouter(Form.create()(SearchForm));
