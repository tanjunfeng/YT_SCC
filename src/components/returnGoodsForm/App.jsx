import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, DatePicker, Row, Col } from 'antd';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import { connect } from 'react-redux';
import Utils from '../../util/util';
import { returnGoodsStatus, goodsReceiptStatus } from '../../constant/salesManagement';
import { returnGoodsList, returnGoodsListFormData } from '../../actions';
import { pubFetchValueList } from '../../actions/pub';
import { PAGE_SIZE } from '../../constant';
import SearchMind from '../../components/searchMind';
import { SubCompanies } from '../../container/search';
import { BranchCompany } from '../../container/search';


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
        returnGoodsListFormData,
        pubFetchValueList
    }, dispatch)
)

class ReturGoodsForm extends PureComponent {
    constructor(props) {
        super(props);
        const { data, franchiseeIdName } = this.props;
        this.joiningSearchMind = null;
        this.state = {
            franchiseeId: data.franchiseeId ? data.franchiseeId : '',
            franchiseeIdName: franchiseeIdName ? franchiseeIdName : '',
            branchCompany: null
        }
    }
    componentDidMount() {
        this.requestSearch()
    }

    // 父组件page改变
    componentWillReceiveProps(nextProps) {
        if (this.props.page !== nextProps.page) {
            this.requestSearch(nextProps.page)
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
            state
            } = this.props.form.getFieldsValue();
        this.setState({ branchCompany: { ...branchCompany } })

        const startCreateTime = createTime ? Date.parse(createTime[0].format(dateFormat)) : '';
        const endCreateTime = createTime ? Date.parse(createTime[1].format(dateFormat)) : '';
        const searchParams = {
            branchCompanyId: branchCompany.id,
            id,
            orderId,
            shippingState,
            state,
            startCreateTime,
            endCreateTime
        };

        return Utils.removeInvalid(searchParams);
    }

    shouldComponentWillUpdate(nextProps, nextState) {
        if (this.state.branchCompany.id !== nextState.branchCompany.id) {
            return true;
        }
    }

    // 搜索方法
    requestSearch = (nextPage) => {
        const { returnGoodsListFormData, returnGoodsList, page } = this.props;
        const seachParams = this.getSearchParams();
        const data = {
            data: {
                pageSize: PAGE_SIZE,
                pageNum: nextPage ? nextPage : page,
                franchiseeId: this.state.franchiseeId,
                ...seachParams
            },
            franchiseeIdName: this.state.franchiseeIdName,
            branchCompany: this.state.branchCompany
        }
        returnGoodsListFormData(data)
        returnGoodsList(Utils.removeInvalid(data.data))
    }


    // 搜索

    handleSearch = (e) => {
        e.preventDefault();
        this.requestSearch()
    }


    // 重置
    handleReset = () => {
        this.handleJoiningClear();
        this.handleSubCompanyClear();
        this.joiningSearchMind.handleClear();
        this.props.form.resetFields();
    }

    // handleOrderReset() {
    //     this.setState({
    //         rengeTime: yesterdayrengeDate,
    //         isPayDisabled: false,
    //         time: {
    //             submitStartTime: yesterdayDate,
    //             submitEndTime: todayDate,
    //         }
    //     });
    //     this.handleSubCompanyClear();
    //     this.joiningSearchMind.handleClear();
    //     this.props.form.resetFields();
    // }

    /**
     * 加盟商-值清单
     */
    handleJoiningChoose = ({ record }) => {
        this.setState({
            franchiseeId: record.franchiseeId,
            franchiseeIdName: record.franchiseeId + ' - ' + record.franchiseeName
        });
    }

    /**
     * 子公司-值清单
     */
    // handleSubCompanyChoose = (branchCompanyId) => {
    //     this.setState({ branchCompanyId });
    // }

    /**
     * 加盟商-清除
     */
    handleJoiningClear() {
        this.setState({
            franchiseeId: ''
        });
    }

    /**
     * 子公司-清除
     */
    // handleSubCompanyClear() {
    //     this.setState({ branchCompanyId: '' });
    // }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props
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
                        <Col className="franchisee-item" span={8}>
                            {/* 子公司 */}
                            <FormItem>
                                {/* <div>
                                    <span className="sc-form-item-label">子公司:</span>
                                    <SubCompanies
                                        value={this.state.branchCompanyId}
                                        onSubCompaniesChooesd={this.handleSubCompanyChoose}
                                        onSubCompaniesClear={this.handleSubCompanyClear}
                                    />
                                </div> */}
                                <FormItem label="分公司">
                                    {getFieldDecorator('branchCompany', {
                                        initialValue: { ...this.state.branchCompany }
                                    })(<BranchCompany />)}
                                </FormItem>
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
                    </Row>
                    <Row gutter={40}>
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

ReturGoodsForm.propTypes = {
    returnGoodsListFormData: PropTypes.func,
    returnGoodsList: PropTypes.func,
    pubFetchValueList: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    data: PropTypes.objectOf(PropTypes.any),
    page: PropTypes.number,
    franchiseeIdName: PropTypes.string,
    branchCompanyIdName: PropTypes.string
};

export default withRouter(Form.create()(ReturGoodsForm));
