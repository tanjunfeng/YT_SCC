/**
 * @file FormContent.jsx
 * @author shijh
 *
 * 采购退货单form
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { is, fromJS } from 'immutable';
import moment from 'moment';
import {
    Row, Col, Select, DatePicker,
    Input, Tooltip, Icon, message
} from 'antd';
import SearchMind from '../../../components/searchMind';

const Option = Select.Option;
const { TextArea } = Input;


class FormContent extends PureComponent {
    static propTypes = {
        prefixCls: PropTypes.string,
        refundNumber: PropTypes.string,
        defaultValue: PropTypes.objectOf(PropTypes.any),
        type: PropTypes.string,
        onClearList: PropTypes.func,
        onGetListValue: PropTypes.func,
    }

    static defaultProps = {
        prefixCls: 'return-goods-top'
    }

    constructor(props) {
        super(props);

        const timeRange = new Date * 1 + 7 * 86400000;

        this.state = {
            locDisabled: true,
            spaceType: '0',
            locationData: {
                code: 'warehouseCode',
                name: 'warehouseName'
            },
            defaultTime: moment(new Date(timeRange), 'YYYY-MM-DD')
        }

        this.submit = {
            currencyCode: 'CNY',
            adrType: '0',
            purchaseRefundNo: props.refundNumber,
            refundTimeEarly: timeRange
        };
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        const { defaultValue, refundNumber, type } = nextProps;
        if (!is(fromJS(this.props.defaultValue), fromJS(defaultValue))) {
            const { ...prop } = defaultValue;

            this.submit = prop;
            this.setState({
                pId: prop.spId,
                spaceType: prop.adrType,
                remark: prop.remark,
                defaultTime: moment(new Date(defaultValue.refundTimeEarly), 'YYYY-MM-DD')
            })
        }
        if (type === 'new' && refundNumber !== this.props.refundNumber) {
            this.submit.purchaseRefundNo = refundNumber;
        }
    }

    getValue = () => {
        const {
            spAdrId, spAdrNo, spAdrName,
            spId, spNo, spName,
            refundAdrCode, refundAdrName
        } = this.submit;
        if (!spId || !spNo || !spName) {
            message.error('请选择供应商');
            return false;
        }
        if (!spAdrId || !spAdrNo || !spAdrName) {
            message.error('请选择供应商地点');
            return false;
        }
        if (!refundAdrCode || !refundAdrName) {
            message.error('请选择退货地点');
            return false;
        }
        return this.submit;
    }

    handleSupplyChoose = (data) => {
        const { record } = data;
        this.submit.spId = record.spId;
        this.submit.spNo = record.spNo;
        this.submit.spName = record.companyName;

        this.setState({
            pId: record.spId
        })
    }

    handleSupplyClear = () => {
        delete this.submit.spId;
        delete this.submit.spNo;
        delete this.submit.spName;
    }

    handleAdressChoose = (data) => {
        const { record } = data;
        this.submit.spAdrId = record.spAdrid;
        this.submit.spAdrNo = record.providerNo;
        this.submit.spAdrName = record.providerName;
    }

    handleAdressClear = () => {
        delete this.submit.spAdrId;
        delete this.submit.spAdrNo;
        delete this.submit.spAdrName;
    }

    handleTypeChange = (type) => {
        this.setState({
            spaceType: type
        }, () => {
            this.submit.adrType = type;
            this.poAddress.handleClear();
        })
    }

    handleTimeChange = (date) => {
        this.setState({
            defaultTime: date
        }, () => {
            this.submit.refundTimeEarly = new Date(date._d) * 1;
        })
    }

    handleCurrencyChange = () => {

    }

    handleGetAddressMap = (param) => {
        const { spaceType } = this.state;
        let locationTypeParam = '';
        if (spaceType === '0') {
            locationTypeParam = 'getWarehouseInfo1';
            this.setState({
                locationData: {
                    code: 'warehouseCode',
                    name: 'warehouseName'
                }
            })
        }
        if (spaceType === '1') {
            locationTypeParam = 'getStoreInfo';
            this.setState({
                locationData: {
                    code: 'id',
                    name: 'name'
                }
            })
        }
        return this.props.pubFetchValueList({
            param: param.value,
            pageNum: param.pagination.current || 1,
            pageSize: param.pagination.pageSize
        }, locationTypeParam);
    }

    handleAddressChoose = (data) => {
        const { locationData } = this.state;
        const { record } = data;

        const spaceId = record[locationData.code];

        this.clearList(() => {
            this.submit.refundAdrCode = record[locationData.code];
            this.submit.refundAdrName = record[locationData.name];
        })
    }

    handleAddressClear = () => {
        this.clearList(() => {
            delete this.submit.refundAdrCode;
            delete this.submit.refundAdrName;
        })
    }

    clearList = (callBack) => {
        const lists = this.props.onGetListValue();

        if (lists.length) {
            this.props.onClearList();
            callBack();
        } else {
            callBack()
        }
    }

    handleRemark = (e) => {
        const value = e.target.value;

        this.setState({
            remark: value
        }, () => {
            this.submit.remark = value
        })
    }

    renderStatus = (type, defaultValue) => {
        if (type === 'edit') {
            const status = parseInt(defaultValue.status, 10);
            switch (status) {
                case 0:
                    return '制单';
                case 1:
                    return '已提交';
                case 2:
                    return '已审核';
                case 3:
                    return '已拒绝';
                case 4:
                    return '待退货';
                case 5:
                    return '已退货';
                case 6:
                    return '已取消';
                case 7:
                    return '取消失败';
                case 8:
                    return '异常';
                default:
                    break;
            }
        } else {
            return '制单';
        }
    }

    render() {
        const { prefixCls, refundNumber, type, defaultValue = {} } = this.props;
        const { spaceType, locationData } = this.state;
        const isEdit = type === 'edit';

        const cls = classnames(
            `${prefixCls}-modify`,
            {
                [`${prefixCls}-modify-${this.type}`]: this.type
            }
        )

        /**
         * 供应商/供应商地点tooltip组件
         * @param {string} title 提示的文本
         */
        const tooltipItem = (title) => (
            <Tooltip title={title}>
                <Icon type="question-circle-o" className="detail-tooltip-icon" />
            </Tooltip>
        )

        return (
            <div
                className={cls}
            >
                <Row>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            退货单号
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            {defaultValue.purchaseRefundNo || refundNumber}
                        </span>
                    </Col>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            *供应商
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            <SearchMind
                                compKey="search-mind-supply1"
                                ref={ref => { this.supplySearchMind = ref }}
                                fetch={(params) => this.props.pubFetchValueList({
                                    condition: params.value,
                                    pageSize: params.pagination.pageSize,
                                    pageNum: params.pagination.current || 1
                                }, 'supplierSearchBox')}
                                onChoosed={this.handleSupplyChoose}
                                onClear={this.handleSupplyClear}
                                defaultValue={isEdit ? `${defaultValue.spNo}-${defaultValue.spName}` : ''}
                                renderChoosedInputRaw={(data) => (
                                    <div>{data.spNo} - {data.companyName}</div>
                                )}
                                style={{ zIndex: 103 }}
                                pageSize={6}
                                columns={[
                                    {
                                        title: '供应商编码',
                                        dataIndex: 'spNo',
                                        width: 98
                                    }, {
                                        title: '供应商名称',
                                        dataIndex: 'companyName',
                                        width: 140
                                    }
                                ]}
                            />
                        </span>
                    </Col>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            *供应商地点
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            <SearchMind
                                compKey="search-mind-supply2"
                                ref={ref => { this.addressSearchMind = ref }}
                                fetch={(params) => this.props.pubFetchValueList({
                                    condition: params.value,
                                    pId: this.state.pId,
                                    pageSize: params.pagination.pageSize,
                                    pageNum: params.pagination.current || 1
                                }, 'supplierAdrSearchBox')}
                                onChoosed={this.handleAdressChoose}
                                onClear={this.handleAdressClear}
                                defaultValue={isEdit ? `${defaultValue.spAdrNo}-${defaultValue.spAdrName}` : ''}
                                disabled={!this.state.pId}
                                renderChoosedInputRaw={(data) => (
                                    <div>{data.providerNo} - {data.providerName}</div>
                                )}
                                pageSize={6}
                                columns={[
                                    {
                                        title: '供应商地点编码',
                                        dataIndex: 'providerNo',
                                        width: 98
                                    }, {
                                        title: '供应商地点名称',
                                        dataIndex: 'providerName'
                                    }
                                ]}
                            />
                        </span>
                    </Col>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            状态
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            {
                                this.renderStatus(type, defaultValue)
                            }
                        </span>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            *退货地点类型
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            <Select
                                value={`${spaceType}`}
                                style={{ width: 120 }}
                                onChange={this.handleTypeChange}
                            >
                                <Option value="0">仓库</Option>
                                <Option value="1">门店</Option>
                            </Select>
                            {tooltipItem('修改类型会清空退货商品列表')}
                        </span>
                    </Col>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            *退货地点
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            <SearchMind
                                style={{ zIndex: 101 }}
                                compKey="comPoAddress"
                                ref={ref => { this.poAddress = ref }}
                                onClear={this.handleAddressClear}
                                fetch={this.handleGetAddressMap}
                                onChoosed={this.handleAddressChoose}
                                renderChoosedInputRaw={(row) => (
                                    <div>
                                        {row[this.state.locationData.code]}
                                        - {row[this.state.locationData.name]
                                        }
                                    </div>
                                )}
                                pageSize={6}
                                defaultValue={isEdit ? `${defaultValue.refundAdrCode}-${defaultValue.refundAdrName}` : ''}
                                columns={[
                                    {
                                        title: '编码',
                                        dataIndex: this.state.locationData.code,
                                        width: 80
                                    }, {
                                        title: '名称',
                                        dataIndex: this.state.locationData.name
                                    }
                                ]}
                            />
                        </span>
                        {tooltipItem('修改退货地点会清空退货商品列表')}
                    </Col>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            退货日期早于
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            <DatePicker
                                value={this.state.defaultTime}
                                onChange={this.handleTimeChange}
                            />
                        </span>
                    </Col>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            货币类型
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            <Select
                                defaultValue="CNY"
                                style={{ width: 120 }}
                                onChange={this.handleCurrencyChange}
                            >
                                <Option value="CNY">CNY</Option>
                            </Select>
                        </span>
                    </Col>
                </Row>
                {
                    type === 'edit' &&
                    <Row>
                        <Col span={6}>
                            <span
                                className={`${prefixCls}-modify-item-left`}
                            >
                                创建人
                            </span>
                            <span
                                className={`${prefixCls}-modify-item-right`}
                            >
                                {defaultValue.createUserId}
                            </span>
                        </Col>
                        <Col span={6}>
                            <span
                                className={`${prefixCls}-modify-item-left`}
                            >
                                创建日期
                            </span>
                            <span
                                className={`${prefixCls}-modify-item-right`}
                            >
                                {moment(new Date(defaultValue.createTime)).format('YYYY-MM-DD')}
                            </span>
                        </Col>
                        <Col span={6}>
                            <span
                                className={`${prefixCls}-modify-item-left`}
                            >
                                审核人
                            </span>
                            <span
                                className={`${prefixCls}-modify-item-right`}
                            >
                                {defaultValue.auditUserId}
                            </span>
                        </Col>
                        <Col span={6}>
                            <span
                                className={`${prefixCls}-modify-item-left`}
                            >
                                退货日期
                            </span>
                            <span
                                className={`${prefixCls}-modify-item-right`}
                            >
                                {defaultValue.refundTimeEarly && moment(new Date(defaultValue.refundTimeEarly)).format('YYYY-MM-DD')}
                            </span>
                        </Col>
                    </Row>
                }
                <Row>
                    <Col span={12} style={{ marginTop: '10px' }}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            备注
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            <TextArea
                                placeholder="请填写备注"
                                autosize
                                value={this.state.remark}
                                onChange={this.handleRemark}
                            />
                        </span>
                    </Col>
                </Row>
            </div>
        )
    }
}

FormContent.propTypes = {
    pubFetchValueList: PropTypes.func
}

export default FormContent
