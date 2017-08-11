/**
* @file app.jsx
 * @author Tan junfeng
 *
 * 商品采购关系维护
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, InputNumber, Checkbox, message, Select } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Util from '../../../util/util';
import SearchMind from '../../../components/searchMind';
import { PAGE_SIZE } from '../../../constant';
import {
    fetchTest,
} from '../../../actions/classifiedList';
import {
    fetchAddProdPurchase,
} from '../../../actions';
import {
    pubFetchValueList,
} from '../../../actions/pub';

import {
    AddProdPurchase,
    UpdateProdPurchase,
    ChangeUpdateProd,
    GetWarehouseInfo1
} from '../../../actions/producthome';

const FormItem = Form.Item;
const { Option } = Select;

@connect(
    state => ({
        prodPurchase: state.toJS().commodity.prodPurchase,
        getProductById: state.toJS().commodity.getProductById,
        getProdPurchaseByIds: state.toJS().commodity.getProdPurchaseById,
        toAddPriceVisible: state.toJS().commodity.toAddPriceVisible,
        updateProdPurchase: state.toJS().commodity.updateProdPurchase,
        purchaseCardData: state.toJS().commodity.purchaseCardData,
        getWarehouseLogicInfos: state.toJS().commodity.getWarehouseLogicInfo,
    }),
    dispatch => bindActionCreators({
        fetchAddProdPurchase,
        pubFetchValueList,
        AddProdPurchase,
        UpdateProdPurchase,
        ChangeUpdateProd,
        GetWarehouseInfo1
    }, dispatch)
)

class ProdModal extends Component {
    constructor(props) {
        super(props);
        this.handleOk = ::this.handleOk;
        this.handleCancel = ::this.handleCancel;
        this.handlePriceChange = ::this.handlePriceChange;
        this.ids = {
            // 供应商id
            spId: props.initValue.spId,
            spNo: props.initValue.spNo,
            // 供应商地点id
            supplierAddressId: props.initValue.spAdrId,
            // 仓库id
            warehouseId: props.initValue.id,
            // 分公司id
            childCompanyId: props.initValue.branchCompanyId,
        }
        this.state = {
            isDisabled: true,
            distributeWarehouseId: '',
            supplyChoose: {},
            supplyChoose1: {},
            supplyChoose2: {},

            // 回显值赋值
            spId: '',
            spAdrId: '',
            branchCompanyId: '',
            checked: props.initValue.supplierType === 1
        }
    }

    /**
     * 仓库-值清单
     */
    handleHouseChoose = ({ record }) => {
        // console.log(record)
        this.setState({
            supplyChoose: record,
        });
        this.ids.warehouseId = record.id;
    }

    handleHouseClear = () => {
        this.ids.warehouseId = null;
    }

    /**
     * 供应商-值清单
     */
    handleSupplyChoose = ({ record }) => {
        this.setState({
            supplyChoose1: record,
            supplyChoose2: {},
            supplyChoose3: {},
        });
        this.ids = {
            spId: record.spId,
            spNo: record.spNo,
            supplierAddressId: null,
            warehouseId: null,
            childCompanyId: null
        }
        this.searchMind2.reset();
        this.searchMind3.reset();
    }

    handleSupplierClear = () => {
        this.ids.spId = null;
        this.setState({
            spNo: null,
            companyName: null
        })
    }

    /**
     * 地点-值清单
     */
    handleAdressChoose = ({ record }) => {
        const { getWarehouseLogicInfos } = this.props;
        this.setState({
            supplyChoose2: record,
            supplyChoose3: {},
            isDisabled: false
        });
        this.searchMind3.reset();
        this.ids.supplierAddressId = record.spAdrid;
        this.ids.warehouseId = null;
        this.ids.childCompanyId = record.branchCompanyId;

        const { spId, spNo } = this.ids;

        if (!spId) {
            this.props.pubFetchValueList({
                condition: record.spNo,
                pageSize: 1,
                pageNum: 1
            }, 'supplierSearchBox').then((res) => {
                const { spNo, companyName, spId } = res.data.data[0];
                this.ids.spNo = spNo;
                this.ids.spId = spId;
                this.setState({
                    spNo,
                    companyName
                })
            })
        }
    }

    handleAdressClear = () => {
        this.ids.supplierAddressId = null;
        this.ids.warehouseId = null;
        this.ids.childCompanyId = null;
    }

    /**
     * 创建弹框OK时间 (当没有改变时)
     */
    handleOk() {
        const { validateFields } = this.props.form;
        const { initValue, isEdit } = this.props;
        const subPost = isEdit ? this.props.ChangeUpdateProd : this.props.AddProdPurchase;
        const { spId, supplierAddressId, childCompanyId, warehouseId } = this.ids;
        if (!spId) {
            message.error('请选择供应商');
            return;
        }
        if (!supplierAddressId) {
            message.error('请选择供应商地点');
            return;
        }
        if (!warehouseId) {
            message.error('请选择仓库');
            return;
        }
        validateFields((err, values) => {
            const subData = Util.removeInvalid({
                id: isEdit ? initValue.id : null,
                // 供应商id
                spId: this.ids.spId,
                // 供应商地点id
                spAdrId: this.ids.supplierAddressId,
                // 商品id
                productId: isEdit ? initValue.productId : initValue.id,
                // 子公司id
                branchCompanyId: this.ids.childCompanyId,
                // 供应商类型:0：一般供应商,1:主供应商
                supplierType: this.state.checked ? 1 : 0,
                purchaseInsideNumber: values.purchaseInsideNumber,
                purchasePrice: parseFloat(values.purchasePrice),
                internationalCode: values.internationalCode,
                // 仓库ID
                distributeWarehouseId: this.ids.warehouseId,
            })
            subPost(subData).then((res) => {
                message.success(res.message)
                this.handleCancel();
                this.props.goto()
            }).catch(() => {
                message.error('操作失败')
            })
        })
    }

    /**
     * 弹出层取消事件
     */
    handleCancel() {
        this.props.handleClose();
        // this.props.UpdateProdPurchase({isVisible: false, record});
    }

    handlePriceChange(result) {
        const { setFields } = this.props.form;
        const { isContinuity } = result;
        if (isContinuity) {
            setFields({
                sellSectionPrices: {
                    errors: null,
                },
            })
        }
    }

    handleCheckBox = () => {
        this.setState({
            checked: !this.state.checked
        })
    }

    render() {
        const { prefixCls, form, initValue = {}, isEdit, data } = this.props;
        const { getFieldDecorator } = form;
        const { prodPurchase = {} } = this.props;
        const { warehouseCode, warehouseName} = this.state.supplyChoose;
        const { spNo, companyName } = this.state;
        const { internationalCodes = [] } = data;
        return (
            <Modal
                title={isEdit ? '修改采购价格' : '新增采购价格'}
                visible
                className={prefixCls}
                onOk={this.handleOk}
                width={'500px'}
                onCancel={this.handleCancel}
                maskClosable={false}
            >
                <div className={`${prefixCls}-body-wrap`}>
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <div className={`${prefixCls}-item`}>
                            <div className={`${prefixCls}-item-title`}>货运条件</div>
                            <div className={`${prefixCls}-item-content`}>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*采购内装数：</span>
                                    <span className={`${prefixCls}-barcode-input`}>
                                        {getFieldDecorator('purchaseInsideNumber', {
                                            rules: [{ required: true, message: '采购内装数' }],
                                            initialValue: initValue.purchaseInsideNumber
                                        })(
                                            <InputNumber min={0} placeholder="内装数" />
                                        )}
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*采购价(元)：</span>
                                    <span className={`${prefixCls}-barcode-input`}>
                                        {getFieldDecorator('purchasePrice', {
                                            rules: [{ required: true, message: '请输入采购价!' }],
                                            initialValue: initValue.purchasePrice
                                        })(
                                            <InputNumber min={0} step={0.01} placeholder="采购价" />
                                        )}
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*条  码：</span>
                                    <span className={`${prefixCls}-barcode-input`}>
                                        {getFieldDecorator('internationalCode', {
                                            rules: [{ required: true, message: '输入商品条码!' }],
                                            initialValue: isEdit ? initValue.internationalCode : internationalCodes[0].internationalCode
                                        })(
                                            <Select
                                                placeholder="请选择商品条码"
                                                style={{width: '150px'}}
                                            >
                                                {
                                                    internationalCodes.map((item) => {
                                                        return (
                                                            <Option value={item.internationalCode}>
                                                                {item.internationalCode}
                                                            </Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </span>
                                </FormItem>
                            </div>
                        </div>
                        <div className={`${prefixCls}-item`}>
                            <div className={`${prefixCls}-item-content`}>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*供应商：</span>
                                    <span className={`${prefixCls}-data-pic`}>
                                        <SearchMind
                                            defaultValue={
                                                (spNo || initValue.spId)
                                                && `${spNo || initValue.spId} - ${companyName || initValue.spName}`}
                                            style={{ zIndex: 9 }}
                                            compKey="search-mind-key"
                                            ref={ref => { this.searchMind1 = ref }}
                                            onChoosed={this.handleSupplyChoose}
                                            onClear={this.handleSupplierClear}
                                            fetch={(params) => this.props.pubFetchValueList({
                                                condition: params.value,
                                                pageSize: params.pagination.pageSize,
                                                pageNum: params.pagination.current || 1
                                            }, 'supplierSearchBox')}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.spId} - {data.companyName}</div>
                                            )}
                                            pageSize={3}
                                            columns={[
                                                {
                                                    title: '供应商编码',
                                                    dataIndex: 'spNo',
                                                    width: 150,
                                                }, {
                                                    title: '供应商ID',
                                                    dataIndex: 'spId',
                                                    width: 200,
                                                }, {
                                                    title: '供应商名称',
                                                    dataIndex: 'companyName',
                                                    width: 200,
                                                }
                                            ]}
                                        />
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*供应商地点：</span>
                                    <span className={`${prefixCls}-data-pic`}>
                                        <SearchMind
                                            defaultValue={initValue.spAdrId && `${initValue.spAdrId} - ${initValue.spAdrName}`}
                                            style={{ zIndex: 8 }}
                                            compKey="search-mind-key1"
                                            ref={ref => { this.searchMind2 = ref }}
                                            fetch={(params) => this.props.pubFetchValueList(Util.removeInvalid({
                                                pId: this.ids.spId,
                                                condition: params.value,
                                                pageSize: params.pagination.pageSize,
                                                pageNum: params.pagination.current || 1
                                            }), 'supplierAdrSearchBox').then((res) => {
                                                const { data = [] } = res.data;
                                                if (!data || data.length === 0) {
                                                    message.warning('没有可用的数据');
                                                }
                                                return res;
                                            })}
                                            onChoosed={this.handleAdressChoose}
                                            onClear={this.handleAdressClear}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.providerNo} - {data.providerName}</div>
                                            )}
                                            pageSize={3}
                                            columns={[
                                                {
                                                    title: '供应商编码',
                                                    dataIndex: 'spNo',
                                                    width: 150,
                                                }, {
                                                    title: '地点编码',
                                                    dataIndex: 'spAdrid',
                                                    width: 150,
                                                }, {
                                                    title: '地点名称',
                                                    dataIndex: 'providerName',
                                                    width: 300,
                                                }
                                            ]}
                                        />
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>送货仓：</span>
                                    <span className={`${prefixCls}-data-pic`}>
                                        <SearchMind
                                            defaultValue={
                                                (warehouseCode || initValue.distributeWarehouseId)
                                                && `${warehouseCode || initValue.distributeWarehouseId} - ${warehouseName || initValue.distributeWarehouseName}`}
                                            style={{ zIndex: 1 }}
                                            disabled={this.state.isDisabled}
                                            compKey="search-mind-key1"
                                            ref={ref => { this.searchMind3 = ref }}
                                            fetch={(params) => this.props.pubFetchValueList(Util.removeInvalid({
                                                supplierAddressId: this.ids.supplierAddressId,
                                                condition: params.value,
                                                pageSize: params.pagination.pageSize,
                                                pageNum: params.pagination.current || 1
                                            }), 'getWarehouseInfo1').then((res) => {
                                                const { data = [] } = res.data;
                                                if (!data || data.length === 0) {
                                                    message.warning('没有可用的数据');
                                                }
                                                return res;
                                            })}
                                            onChoosed={this.handleHouseChoose}
                                            onClear={this.handleHouseClear}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.warehouseCode} - {data.warehouseName}</div>
                                            )}
                                            pageSize={3}
                                            columns={[
                                                {
                                                    title: '仓库ID',
                                                    dataIndex: 'id',
                                                    width: 150,
                                                }, {
                                                    title: '仓库编码',
                                                    dataIndex: 'warehouseCode',
                                                    width: 200,
                                                }, {
                                                    title: '仓库名称',
                                                    dataIndex: 'warehouseName',
                                                    width: 200,
                                                }
                                            ]}
                                        />
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>主供应商：</span>
                                    <span className={`${prefixCls}-warehouse-input`}>
                                        {getFieldDecorator('supplierType', {
                                            initialValue: prodPurchase.salesInsideNumber
                                        })(
                                            <Checkbox
                                                checked={this.state.checked}
                                                onChange={this.handleCheckBox}
                                            />
                                        )}
                                    </span>
                                </FormItem>
                            </div>
                        </div>
                    </Form>
                </div>
            </Modal>
        );
    }
}

ProdModal.propTypes = {
    prefixCls: PropTypes.string,
    updateProdPurchase: PropTypes.func,
    pubFetchValueList: PropTypes.func,
    UpdateProdPurchase: PropTypes.func,
    ChangeUpdateProd: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    prodPurchase: PropTypes.objectOf(PropTypes.any),
    initValue: PropTypes.objectOf(PropTypes.any),
    goto: PropTypes.func,
    isEdit: PropTypes.bool,
    data: PropTypes.objectOf(PropTypes.any),
};

ProdModal.defaultProps = {
    prefixCls: 'prod-modal',
    goto: () => {},
    data: {}
}

export default Form.create()(ProdModal);
