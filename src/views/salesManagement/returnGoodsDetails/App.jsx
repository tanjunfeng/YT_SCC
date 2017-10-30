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
import Immutable, { fromJS } from 'immutable';
import {
    Table, Form, Select, Icon, Modal, Row,
    Col, Button, Input
} from 'antd';
import Utils from '../../../util/util';
import { returnGoodsDetailColumns as columns } from '../columns';
import { reason } from '../../../constant/salesManagement';
import { returnGoodsDetail, returnGoodsDetailClearData } from '../../../actions';
import { getReturnGoodsOperation } from '../../../service';

const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';


@connect(state => ({
    // 详情数据
    data: state.toJS().salesManagement.detail
}), dispatch => bindActionCreators({
    // 请求详情数据
    returnGoodsDetail,
    clearData: () => {
        dispatch(returnGoodsDetailClearData({}))
    }
}, dispatch))

class ReturnGoodsDetails extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            returnReasonType: '',
            returnReason: ''
        }
    }

    componentDidMount() {
        const { id, type } = this.props.match.params
        this.setState({
            id: id
        })
        this.forData(id)
    }

    // componentWillUnmount() {
    //     const { clearData } = this.props
    //     clearData()
    // }

    //请求数据
    forData(id) {
        this.props.returnGoodsDetail(id)
    }

    // 返回
    goBack = () => {
        this.props.history.replace('/returnGoodsList')
    }

    // 退货单确定或取消
    operation = (type) => {
        getReturnGoodsOperation({
            returnId: this.state.id,
            operateType: type
        })
            .then(res => {
                if (res.success) {
                    this.goBack()
                }
            })
            .catch(err => {
                reject(err);
            })
    }

    //确认、取消模态框弹出
    showConfirm = (type) => {
        let _this = this
        let title = type === 1 ? '确认退货' : '取消退货'
        let content = type === 1 ? '是否确认退货，此操作不可取消' : '是否取消退货，此操作不可取消'
        const confirm = Modal.confirm;
        confirm({
            title: title,
            content: content,
            onOk() {
                _this.operation(type)
            },
            onCancel() { },
        });
    }

    //保存模态框弹出
    showConfirmSave = () => {
        const confirm = Modal.confirm;
        confirm({
            title: "提示",
            content: "换货类型为其他时，请输入相关原因",
            onOk() { },
            onCancel() { },
        });
    }

    //退货原因选择
    handleChange = (value) => {
        this.setState({
            returnReasonType: value
        })
    }

    //退货原因输入
    inputChange = (ev) => {
        this.setState({
            returnReason: ev.target.value
        })
    }

    //点击保存
    save = () => {
        if (this.state.returnReasonType == '7' && this.state.returnReason == '') {
            this.showConfirmSave()
        } else {
            // 等后端接口
            console.log(this.state.returnReasonType)
            console.log(this.state.returnReason)
        }
    }


    render() {
        const { getFieldDecorator } = this.props.form
        const { TextArea } = Input
        const data = this.props.data
        const { type } = this.props.match.params
        return (
            data ? (
                <div className="returngoods-detail">
                    <div className="basic-box">
                        <div className="header">
                            <Icon type="solution" className="header-icon" />单据信息
                    </div>
                        <div className="body">
                            <Row>
                                <Col span={6} offset={2}><div className="item"><span className="item-tit">换货单号：</span>{data.id}</div></Col>
                                <Col span={6} offset={2}><div className="item"><span className="item-tit">原订单号：</span>{data.orderId}</div></Col>
                                <Col span={6} offset={2}><div className="item"><span className="item-tit">申请时间：</span>{moment(parseInt(data.creationTime, 10)).format(dateFormat)}</div></Col>
                            </Row>
                            <Row>
                                <Col span={6} offset={2}><div className="item"><span className="item-tit">子公司：</span>{data.branchCompanyName}</div></Col>
                                <Col span={6} offset={2}><div className="item"><span className="item-tit">雅堂小超：</span>{data.franchiseeName}</div></Col>
                                <Col span={6} offset={2}><div className="item"><span className="item-tit">换货单状态：</span>{data.stateDetail}</div></Col>
                            </Row>
                            <Row>
                                <Col span={6} offset={2}><div className="item"><span className="item-tit">商品状态：</span>{data.productStateDetail}</div></Col>
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
                            <Table
                                dataSource={data.items}
                                columns={columns}
                                rowKey="productId"
                                pagination={false}
                            />
                            <div className="bottom-text">
                                <div className="bt-left">共<span className="bt-left-num">{data.commodityTotal}</span>件商品</div>
                                <div className="bt-right"><span>总金额：</span><span className="bt-right-num">￥{data.amount}</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="basic-box">
                        <div className="header">
                            <Icon type="solution" className="header-icon" />换货原因
                    </div>
                        <div className="body body-form">
                            <Row>
                                <Col span={4}>
                                    <Select onChange={this.handleChange} disabled={type == 2 ? false : true} defaultValue={data.returnReasonType} style={{ width: '153px' }} size="default">
                                        {
                                            reason.data.map((item) => (
                                                <Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                </Col>
                                <Col span={20}>
                                    <TextArea onChange={this.inputChange} disabled={type == 2 ? false : true} rows={4} size="default" defaultValue={data.returnReason} />
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="bt-button">
                        {type == 2 ? (
                            <span>
                                <Button size="large" onClick={this.save}>保存</Button>
                                <Button size="large" onClick={() => this.showConfirm(1)}>确认</Button>
                                <Button size="large" onClick={() => this.showConfirm(2)}>取消</Button>
                            </span>
                        ) : null}
                        <Button size="large" onClick={this.goBack}>关闭</Button>
                    </div>
                </div>
            ) : null
        )
    }
}

ReturnGoodsDetails.propTypes = {
    returnGoodsDetail: PropTypes.func
}

export default withRouter(Form.create()(ReturnGoodsDetails));
