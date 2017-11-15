import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, DatePicker, Row, Col } from 'antd';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import { connect } from 'react-redux';
import Utils from '../../../util/util';
import { returnGoodsStatus, goodsReceiptStatus, returnType } from '../../../constant/salesManagement';
import { returnGoodsList, returnGoodsListFormDataClear } from '../../../actions';
import { pubFetchValueList } from '../../../actions/pub';
import SearchMind from '../../../components/searchMind';
import { BranchCompany } from '../../../container/search';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

@connect(
    state => ({
        data: state.toJS().pageParameters.returnGoodsParams.data,
        franchiseeIdName: state.toJS().pageParameters.returnGoodsParams.franchiseeIdName,
        branchCompany: state.toJS().pageParameters.returnGoodsParams.branchCompany
    }),
    dispatch => bindActionCreators({
        returnGoodsList,
        pubFetchValueList,
        returnGoodsListFormDataClear
    }, dispatch)
)

class SearchForm extends PureComponent {
    constructor(props) {
        super(props);
        const { data, franchiseeIdName } = this.props;
        this.state = {
            franchiseeId: data.franchiseeId || '',
            franchiseeIdName: franchiseeIdName || ''
        }
        this.joiningSearchMind = null;
        this.branchCompany = this.props.branchCompany;
    }

    // 父组件page改变或点击确定或取消
    componentWillReceiveProps(nextProps) {
        if (this.props.upDate !== nextProps.upDate) {
            this.handleSearch()
        }
    }

    // 获取用于搜索的所有有效表单值
    getSearchParams = () => {
        const {
            branchCompany,
            id,
            orderId,
            shippingState,
            createTime,
            state,
            returnRequestType
            } = this.props.form.getFieldsValue();
        const startCreateTime = createTime ? Date.parse(createTime[0].format(dateFormat)) : '';
        const endCreateTime = createTime ? Date.parse(createTime[1].format(dateFormat)) : '';
        this.branchCompany = { ...branchCompany };
        const searchParams = {
            branchCompanyId: branchCompany.id,
            id,
            orderId,
            shippingState,
            state,
            startCreateTime,
            endCreateTime,
            returnRequestType
        };

        return Utils.removeInvalid(searchParams);
    }

    // 搜索方法
    handleSearch = () => {
        // 将查询条件回传给调用页
        this.props.onPromotionSearch(this.getSearchParams());
    }

    // 重置
    handleReset = () => {
        this.handleJoiningClear();
        this.joiningSearchMind.reset();
        this.props.form.resetFields();
        this.branchCompany = { id: '', name: '' };
        this.props.returnGoodsListFormDataClear()
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
        const { data } = this.props;
        return (
            <div className="search-box">
                <Form
                    layout="inline"
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSearch}
                >
                    <Row gutter={40}>
                        <Col span={8}>
                            <FormItem label="退货单类型">
                                {getFieldDecorator('returnRequestType', {
                                    initialValue: data.state ? data.state : ''
                                })(
                                    <Select style={{ width: '200px' }} size="default">
                                        {
                                            returnType.data.map((item) => (
                                                <Select.Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
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
                            {/* 分公司 */}
                            <FormItem>
                                <FormItem label="分公司">
                                    {getFieldDecorator('branchCompany', {
                                        initialValue: { ...this.branchCompany }
                                    })(<BranchCompany />)}
                                </FormItem>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={40}>
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
                        <Col span={8}>
                            <FormItem label="退货单号">
                                {getFieldDecorator('id', {
                                    initialValue: data.id
                                })(
                                    <Input size="default" placeholder="退货单号" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="退货单状态">
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
                            <FormItem label="收货状态">
                                {getFieldDecorator('shippingState', {
                                    initialValue: data.shippingState ? data.shippingState : ''
                                })(
                                    <Select style={{ width: '200px' }} size="default">
                                        {
                                            goodsReceiptStatus.data.map((item) => (
                                                <Select.Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem >
                                <div className="row middle">
                                    <span className="ant-form-item-label search-mind-label">退货日期</span>
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
    returnGoodsListFormDataClear: PropTypes.func,
    returnGoodsList: PropTypes.func,
    pubFetchValueList: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    data: PropTypes.objectOf(PropTypes.any),
    branchCompany: PropTypes.objectOf(PropTypes.any),
    page: PropTypes.number,
    refresh: PropTypes.bool,
    upDate: PropTypes.bool,
    franchiseeIdName: PropTypes.string,
};

export default withRouter(Form.create()(SearchForm));
