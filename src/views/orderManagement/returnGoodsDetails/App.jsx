/**
 * @file App.jsx
 * @author liujinyu
 *
 * 退货单查看及编辑页面
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import {
    Form, Select, Icon, Modal, Row,
    Col, Button, Input, Table
} from 'antd';
import Utils from '../../../util/util';
import { reason } from '../../../constant/salesManagement';
import {
    returnGoodsDetail, returnGoodsDetailClearData,
    returnGoodsOperation, returnGoodsDetailSave
} from '../../../actions';
import { returnGoodsTableColums as columns } from '../columns';
import { DATE_FORMAT } from '../../../constant';
import GoodsTable from './goodsTable';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(state => ({
    // 详情数据
    data: state.toJS().salesManagement.detail
}), dispatch => bindActionCreators({
    returnGoodsDetailSave,
    // 请求详情数据
    returnGoodsDetail,
    // 清空详情数据
    clearData: returnGoodsDetailClearData
}, dispatch))

class ReturnGoodsDetails extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            returnQuantityList: [],
            returnQuantity: [],
            total: '',
        }
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({ id });
        this.forData({
            id,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data.items && nextProps.data.items.length > 0) {
            const items = nextProps.data.items.map(item => ({
                id: item.id,
                productCode: item.productCode,
                quantity: item.quantity,
                salePrice: item.salePrice,
                listPrice: item.listPrice
            }));
            this.setState({
                returnQuantityList: items
            });
        }
    }

    componentWillUnmount() {
        const { clearData } = this.props
        clearData()
    }

    getGoodsTableValues = () => ({
        returnQuantityList: this.state.returnQuantityList,
        data: this.props.data
    })

    // 请求数据
    forData = (id) => {
        this.props.returnGoodsDetail(id)
    }

    // 返回
    goBack = () => {
        this.props.history.replace('/returnGoodsList')
    }

    // 退货单确定或取消
    operation = (type) => (
        returnGoodsOperation({
            returnId: this.state.id,
            operateType: type
        })
            .then(res => {
                if (res.success) {
                    this.goBack()
                }
            }).catch(() => {
            })
    )

    // 确认、取消模态框弹出
    showConfirm = (type) => {
        const _this = this
        const title = type === 1 ? '确认退货' : '取消退货'
        const content = type === 1 ? '是否确认退货，此操作不可取消' : '是否取消退货，此操作不可取消'
        const confirm = Modal.confirm;
        confirm({
            title,
            content,
            onOk() {
                _this.operation(type)
            },
            onCancel() { },
        });
    }

    // 保存模态框弹出
    showConfirmSave = () => {
        Modal.error({
            title: '提示',
            content: '当退货类型为其他时，请输入相关原因',
            okText: '确认'
        });
    }

    // 保存成功模态框弹出
    showConfirmSaveSuccess = () => {
        Modal.success({
            title: '保存成功',
            content: '编辑内容已成功保存',
            okText: '确认'
        });
    }

    // 保存提交
    save = () => {
        const data = this.props.data;
        const { returnReasonType } = data;
        const {
            returnReason,
            description
        } = this.props.form.getFieldsValue();
        // 提交数据
        this.props.returnGoodsDetailSave(Utils.removeInvalid({
            returnId: this.state.id,
            returnReasonType,
            returnReason,
            description,
            items: this.state.returnQuantity
        })).then(res => {
            if (res.success) {
                this.showConfirmSaveSuccess()
            }
        })
    }

    /**
     * 商品列表改变通知
     *
     * @param {*array} goodsList 更新的商品列表
     * @param {*object} total 商品小计信息
     */
    handleGoodsListChange = (returnQuantityList, returnQuantity, total) => {
        // 刷新导入商品列表，清空报错商品列表, 清空excel导入商品列表
        this.setState({
            returnQuantityList,
            total,
            returnQuantity
        });
    }

    purchaseOrderType = () => {
        const data = this.props.data
        switch (data.returnReasonType) {
            case '':
                return '请选择';
            case 1:
                return '包装破损';
            case 2:
                return '商品破损';
            case 3:
                return '保质期临期或过期';
            case 4:
                return '商品错发或漏发';
            case 5:
                return '订错货';
            case 6:
                return '商品质量问题';
            case 7:
                return '其他';
            default:
                return '';
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { TextArea } = Input
        const data = this.props.data
        const { type, state } = this.props.match.params;
        return (
            <div className="returngoods-detail">
                <div className="basic-box">
                    <div className="header">
                        <Icon type="solution" className="header-icon" />单据信息
                    </div>
                    <div className="body">
                        <Row>
                            <Col span={6} offset={2}><div className="item"><span className="item-tit">退货单号：</span>{data.id}</div></Col>
                            <Col span={6} offset={2}><div className="item"><span className="item-tit">原订单号：</span>{data.orderId}</div></Col>
                            <Col span={6} offset={2}><div className="item"><span className="item-tit">申请时间：</span>{data.creationTime ? moment(parseInt(data.creationTime, 10)).format(DATE_FORMAT) : '-'}</div></Col>
                        </Row>
                        <Row>
                            <Col span={6} offset={2}><div className="item"><span className="item-tit">子公司：</span>{data.branchCompanyName}</div></Col>
                            <Col span={6} offset={2}><div className="item"><span className="item-tit">雅堂小超：</span>{data.franchiseeName}</div></Col>
                            <Col span={6} offset={2}><div className="item"><span className="item-tit">退货单状态：</span>{data.stateDetail}</div></Col>
                        </Row>
                        <Row>
                            <Col span={6} offset={2}><div className="item"><span className="item-tit">收货状态: </span>{data.shippingStateDetail}</div></Col>
                            <Col span={6} offset={2}><div className="item"><span className="item-tit">退货单类型:</span>{data.returnRequestType}</div></Col>
                            <Col span={6} offset={2}><div className="item"><span className="item-tit">退款状态:</span>{data.paymentStateDetail}</div></Col>
                        </Row>
                    </div>
                </div>
                <div className="basic-box">
                    <div className="header">
                        <Icon type="solution" className="header-icon" />收货信息
                    </div>
                    <div className="body">
                        <Row>
                            <Col span={22} offset={2}><div className="item"><span className="item-tit">收货人：</span>{data.consigneeName}</div></Col>
                        </Row>
                        <Row>
                            <Col span={22} offset={2}><div className="item"><span className="item-tit">所在地区：</span>{data.province} {data.city} {data.district}</div></Col>
                        </Row>
                        <Row>
                            <Col span={22} offset={2}><div className="item"><span className="item-tit">街道地址：</span>{data.detailAddress}</div></Col>
                        </Row>
                        <Row>
                            <Col span={22} offset={2}><div className="item"><span className="item-tit">手机：</span>{data.cellphone}</div></Col>
                        </Row>
                        <Row>
                            <Col span={22} offset={2}><div className="item"><span className="item-tit">固定电话：</span>{data.telephone}</div></Col>
                        </Row>
                        <Row>
                            <Col span={22} offset={2}><div className="item"><span className="item-tit">邮编：</span>{data.postcode}</div></Col>
                        </Row>
                    </div>
                </div>
                <div className="basic-box">
                    <div className="header">
                        <Icon type="solution" className="header-icon" />商品信息
                    </div>
                    <div className="body body-table">
                        {
                            state === 1 || type === '2' ?
                                <GoodsTable
                                    value={this.getGoodsTableValues()}
                                    onChange={this.handleGoodsListChange}
                                />
                                :
                                <Table
                                    dataSource={data.items}
                                    columns={columns}
                                    rowKey="productId"
                                    pagination={false}
                                />
                        }
                        <div className="bottom-text">
                            <div className="bt-left">共<span className="bt-left-num">{data.commodityTotal}</span>件商品</div>
                            <div className="bt-right"><span>退款金额：</span><span className="bt-right-num">￥{this.state.total.refundAmount || data.refundAmount}</span></div>
                            <div className="bt-right" style={{ marginRight: 20 }}><span>退货金额：</span><span className="bt-right-num">￥{this.state.total.amount || data.amount}</span></div>
                        </div>
                    </div>
                </div>
                <Form
                    layout="inline"
                    className="ant-advanced-search-form"
                >
                    <div className="basic-box">
                        <div className="header">
                            <Icon type="solution" className="header-icon" />退货原因
                    </div>
                        <div className="body body-form">
                            <Row>
                                <Col span={4}>
                                    <FormItem>
                                        {getFieldDecorator('returnReasonType', {
                                            initialValue: this.purchaseOrderType() || ''
                                        })(
                                            <Select style={{ width: '153px' }} size="default" disabled>
                                                {
                                                    reason.data.map((item) => (
                                                        <Option
                                                            key={item.key}
                                                            value={item.key}
                                                        >
                                                            {item.value}
                                                        </Option>
                                                    ))}
                                            </Select>
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={20}>
                                    <FormItem>
                                        {getFieldDecorator('returnReason', {
                                            initialValue: data.returnReason
                                        })(
                                            <TextArea className="input-ret" autosize={{ minRows: 4, maxRows: 4 }} disabled size="default" />
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="basic-box">
                        <div className="header">
                            <Icon type="solution" className="header-icon" />备注(必填)
                    </div>
                        <div className="body body-form">
                            <Row>
                                <Col span={24}>
                                    <FormItem>
                                        {getFieldDecorator('description', {
                                            initialValue: data.description,
                                        })(
                                            <TextArea className="input-des" autosize={{ minRows: 4, maxRows: 4 }} disabled={type === '1'} size="default" />
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Form>
                <div className="bt-button">
                    <div>
                        {
                            (state === 1 || type === '2') &&
                            <span>
                                <Button size="large" onClick={this.save} disabled={this.state.isSaveDisabled}>保存</Button>
                                <Button size="large" onClick={() => this.showConfirm(1)}>确认</Button>
                                <Button size="large" onClick={() => this.showConfirm(2)}>取消</Button>
                            </span>
                        }
                        <Button size="large" onClick={this.goBack}>关闭</Button>
                    </div>
                </div>
            </div>
        )
    }
}

ReturnGoodsDetails.propTypes = {
    returnGoodsDetail: PropTypes.func,
    clearData: PropTypes.func,
    returnGoodsDetailSave: PropTypes.func,
    getFieldDecorator: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    data: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(ReturnGoodsDetails));
