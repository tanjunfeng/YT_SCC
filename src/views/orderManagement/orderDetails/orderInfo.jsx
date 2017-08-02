/**
 * @file orderInfo.jsx
 * @author caoyanxuan
 *
 * 订单管理详情页-订单信息
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Form, Icon, Row, Col, Input, Table, Button, Modal } from 'antd';
import moment from 'moment';
import { TIME_FORMAT } from '../../../constant/index';

const confirm = Modal.confirm;
const { TextArea } = Input;

const columns = [{
    title: '商品图片',
    dataIndex: 'commodifyImg',
    key: 'commodifyImg',
    render: (text) => (
        <img
            src={text}
            alt="未上传"
            style={{width: 50, height: 50 }}
        />
    )
}, {
    title: '商品编码',
    dataIndex: 'commodifyNumber',
    key: 'commodifyNumber',
}, {
    title: '商品条码',
    dataIndex: 'commodifyCode',
    key: 'commodifyCode',
}, {
    title: '商品名称',
    dataIndex: 'commodifyName',
    key: 'commodifyName',
}, {
    title: '商品分类',
    dataIndex: 'commodifyClassify',
    key: 'commodifyClassify',
    render: (text) => (
        <span>{text[0]}&gt;{text[1]}</span>
    )
}, {
    title: '数量',
    dataIndex: 'number',
    key: 'number',
}, {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
    render: (text) => (
        <span>￥{text}</span>
    )
}, {
    title: '金额',
    dataIndex: 'money',
    key: 'money',
    render: (text) => (
        <span>￥{text}</span>
    )
}];

class OrderInformation extends PureComponent {
    constructor(props) {
        super(props);
        this.handleOrderSave = ::this.handleOrderSave;
        this.handleOrderAudit = ::this.handleOrderAudit;
        this.handleOrderCancel = ::this.handleOrderCancel;

        this.state = {
            textAreaNote: '',
        }
    }

    componentDidMount() {
    }

    /**
     * 保存备注信息
     */
    handleOrderSave() {
        confirm({
            title: '保存',
            content: '确认保存备注信息？',
            onOk: () => {
                // ToDo：带数据（备注-this.state.textAreaNote）发请求
            },
            onCancel() {},
        });
    }

    /**
     * 审核该订单
     */
    handleOrderAudit() {
        // ToDo: 发请求
    }

    /**
     * 取消该订单
     */
    handleOrderCancel() {
        confirm({
            title: '取消订单',
            content: '确认取消该订单？',
            onOk: () => {
                // ToDo: 发请求
            },
            onCancel() {},
        });
    }

    render() {
        const { initialData } = this.props;
        const tableFooter = () =>
            (<div>
                <span className="table-footer-item">
                    <span>共</span>
                    <span className="red-number">{initialData.commodifyNumber}</span>
                    <span>件商品</span>
                </span>
                <span className="table-footer-item">
                    <span>总金额： ￥</span>
                    <span className="red-number">{initialData.commifyTotalMoney}</span>
                </span>
            </div>)
        return (
            <div>
                <div className="order-details-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />
                            基础信息
                        </div>
                        <div className="detail-message-body">
                            <Row>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">订单编号:</span>
                                    <span>{initialData.orderNumber}</span>
                                </Col>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">父订单编号:</span>
                                    <span>{initialData.parentOrderNumber}</span>
                                </Col>
                                <Col className="gutter-row" span={10}>
                                    <span className="details-info-lable">订单类型:</span>
                                    <span>{initialData.orderType}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">订单状态:</span>
                                    <span>{initialData.orderStatus}</span>
                                </Col>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">支付状态:</span>
                                    <span>{initialData.payStatus}</span>
                                </Col>
                                <Col className="gutter-row" span={10}>
                                    <span className="details-info-lable">物流状态:</span>
                                    <span>{initialData.logisticsStatus}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">子公司:</span>
                                    <span>{initialData.subCompany}</span>
                                </Col>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">加盟商:</span>
                                    <span>{initialData.joiner}</span>
                                </Col>
                                <Col className="gutter-row" span={10}>
                                    <span className="details-info-lable">出货仓:</span>
                                    <span>{initialData.outOfWarehouse}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={14}>
                                    <span className="details-info-lable">备注:</span>
                                    <TextArea
                                        autosize={{ minRows: 3, maxRows: 6 }}
                                        style={{resize: 'none' }}
                                        maxLength="250"
                                        onBlur={(e) => {
                                            this.setState({
                                                textAreaNote: e.target.value
                                            })
                                        }}
                                    />
                                </Col>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">下单日期:</span>
                                    <span>
                                        {moment(parseInt(initialData.orderData, 10)).format(TIME_FORMAT)}
                                    </span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <div className="order-details-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="gift" className="detail-message-header-icon" />
                            收货信息
                        </div>
                        <div className="detail-message-body">
                            <Row>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">收货人</span>
                                    <span>{initialData.consignee}</span>
                                </Col>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">所在地区:</span>
                                    <span>{initialData.localErea}</span>
                                </Col>
                                <Col className="gutter-row" span={10}>
                                    <span className="details-info-lable">街道地址:</span>
                                    <span>{initialData.streetAdress}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">手机</span>
                                    <span>{initialData.telephone}</span>
                                </Col>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">固定电话:</span>
                                    <span>{initialData.cellphone}</span>
                                </Col>
                                <Col className="gutter-row" span={10}>
                                    <span className="details-info-lable">邮编:</span>
                                    <span>{initialData.mail}</span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <div className="order-details-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="picture" className="detail-message-header-icon" />
                            商品信息
                        </div>
                        <div>
                            <Table
                                dataSource={initialData.commodifyInfo}
                                columns={columns}
                                pagination={false}
                                rowKey="commodifyNumber"
                                footer={tableFooter}
                            />
                        </div>
                    </div>
                </div>
                <div className="order-details-btns">
                    <Row>
                        <Col className="gutter-row" span={14} offset={9}>
                            <Button
                                size="default"
                                onClick={this.handleOrderSave}
                                type="primary"
                            >
                                保存
                            </Button>
                            {
                                (initialData.orderStatus === '待审核'
                                || initialData.orderStatus === '待人工审核')
                                && <Button
                                    size="default"
                                    onClick={this.handleOrderAudit}
                                >
                                    审核
                                </Button>
                            }
                            {
                                (initialData.logisticsStatus !== '待收货'
                                && initialData.logisticsStatus !== '未送达'
                                && initialData.logisticsStatus !== '已签收')
                                && <Button
                                    size="default"
                                    onClick={this.handleOrderCancel}
                                    type="danger"
                                >
                                    取消
                                </Button>
                            }
                            <Button
                                size="default"
                                onClick={() => {
                                    this.props.history.goBack();
                                }}
                            >
                                返回
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

OrderInformation.propTypes = {
    initialData: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
}

OrderInformation.defaultProps = {
}

export default withRouter(Form.create()(OrderInformation));
