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
import {
    fetchAddProdPurchase,
} from '../../../actions';
import {
    pubFetchValueList,
} from '../../../actions/pub';
import {
    supportReturnOption
} from '../../../constant/searchParams';
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
        getProductByIds: state.toJS().commodity.getProductById,
        getProdPurchaseByIds: state.toJS().commodity.getProdPurchaseById,
        toAddPriceVisible: state.toJS().commodity.toAddPriceVisible,
        updateProdPurchase: state.toJS().commodity.updateProdPurchase,
        purchaseCardData: state.toJS().commodity.purchaseCardData,
        getWarehouseLogicInfos: state.toJS().commodity.getWarehouseLogicInfo,
        hasMainSupplier: state.toJS().commodity.checkMainSupplier
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
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.ids = {
            // 供应商id
            spId: props.initValue.spId,
            spNo: props.initValue.spNo,
            // 供应商地点id
            supplierAddressId: props.initValue.spAdrId,
            // 仓库id
            warehouseId: props.initValue.distributeWarehouseId,
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
            spNo: '',
            spAdrId: '',
            branchCompanyId: '',
            checked: props.initValue.supplierType === 1
        }
    }

    /**
     * 仓库-值清单
     */
    handleHouseChoose = ({ record }) => {
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
                const { companyName } = res.data.data[0];
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
    * 获取表单数据
    */
    getFormData = () => {
        const {
            supportReturn
        } = this.props.form.getFieldsValue();
        return Util.removeInvalid({
            supportReturn
        });
    }

    /**
     * 创建弹框OK事件 (当没有改变时)
     */
    handleOk() {
        const { validateFields } = this.props.form;
        const { initValue, isEdit, getProductByIds } = this.props;
        const subPost = isEdit ? this.props.ChangeUpdateProd : this.props.AddProdPurchase;
        const { spId, supplierAddressId, warehouseId } = this.ids;
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
            if (values.purchaseInsideNumber <= 0) {
                message.error('采购内装数必须大于0');
                return;
            }
            if (values.purchasePrice < 0) {
                message.error('采购价格必须大于等于0');
                return;
            }
            const subData = Util.removeInvalid({
                id: isEdit ? initValue.id : null,
                // 供应商id
                spId: this.ids.spId,
                // 供应商地点id
                spAdrId: this.ids.supplierAddressId,
                // 商品id
                productId: isEdit ? initValue.productId : initValue.id,
                // 子公司id
                // 供应商类型:0：一般供应商,1:主供应商
                supplierType: this.state.checked ? 1 : 0,
                purchaseInsideNumber: values.purchaseInsideNumber,
                newestPrice: parseFloat(values.newestPrice),
                internationalCode: values.internationalCode,
                // 仓库ID
                distributeWarehouseId: this.ids.warehouseId,
                supportReturn: this.getFormData().supportReturn,
                productCode: getProductByIds.productCode
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
        const {
            prefixCls, form, initValue = {},
            isEdit, data, hasMainSupplier, getProductByIds
        } = this.props;
        const { getFieldDecorator } = form;
        const { prodPurchase = {}, createUserName } = this.props;
        console.log(initValue)
        const { warehouseCode, warehouseName } = this.state.supplyChoose;
        const { spNo, companyName } = this.state;
        const { internationalCodes = [] } = data;
        const { internationalCode } = getProductByIds.internationalCodes[0];
        const firstCreated = () => {
            switch (initValue.firstCreated) {
                case 0:
                    return initValue.modifyUserName;
                case 1:
                    return initValue.createUserName;
                default:
                    return null;
            }
        }
        return (
            <Modal
                title={isEdit ? '修改采购价格' : '新增采购价格'}
                visible
                className={isEdit ? prefixCls : 'creat-prod'}
                onOk={this.handleOk}
                width={'480px'}
                onCancel={this.handleCancel}
                maskClosable={false}
            >
                <div className={`${prefixCls}-body-wrap`}>
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <div className={`${prefixCls}-item`}>
                            <div className={`${prefixCls}-item-title`}>货运条件</div>
                            <div>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*采购内装数：</span>
                                    <span className={`${prefixCls}-barcode-input`}>
                                        {getFieldDecorator('purchaseInsideNumber', {
                                            rules: [{ required: true, message: '采购内装数' }],
                                            initialValue: getProductByIds.purchaseInsideNumber
                                        })(
                                            <InputNumber min={0} placeholder="内装数" />
                                            )}
                                    </span>
                                </FormItem>
                                {
                                    isEdit ?
                                        <FormItem>
                                            <span className={`${prefixCls}-label`}>*当前采购价(元)：</span>
                                            <span className={`${prefixCls}-barcode-input`}>
                                                {getFieldDecorator('purchasePrice', {
                                                    rules: [{ required: true, message: '请输入当前采购价!' }],
                                                    initialValue: getProductByIds.purchasePrice
                                                })(
                                                    <InputNumber min={0} step={0.01} placeholder="当前采购价" />
                                                    )}
                                            </span>
                                        </FormItem>
                                        : <FormItem>
                                            <span className={`${prefixCls}-label`}>*采购价(元)：</span>
                                            <span className={`${prefixCls}-barcode-input`}>
                                                {getFieldDecorator('newestPrice', {
                                                    rules: [{ required: true, message: '请输入采购价!' }],
                                                    initialValue: getProductByIds.newestPrice
                                                })(
                                                    <InputNumber min={0} step={0.01} placeholder="采购价" />
                                                    )}
                                            </span>
                                        </FormItem>
                                }
                                {
                                    isEdit ?
                                        <FormItem>
                                            <span className={`${prefixCls}-label`}>*最新采购价(元)：</span>
                                            <span className={`${prefixCls}-barcode-input`}>
                                                {getFieldDecorator('newestPrice', {
                                                    rules: [{ required: true, message: '请输入最新采购价!' }],
                                                    initialValue: initValue.newestPrice
                                                })(
                                                    <InputNumber min={0} step={0.01} placeholder="最新采购价" />
                                                    )}
                                            </span>
                                            <span className={`${prefixCls}-adjustment`}>
                                                调价百分比：{getProductByIds.percentage}%
                                            </span>
                                        </FormItem>
                                        : null
                                }
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*条  码：</span>
                                    <span className={`${prefixCls}-barcode-input`}>
                                        {getFieldDecorator('internationalCode', {
                                            rules: [{ required: true, message: '输入商品条码!' }],
                                            initialValue: isEdit ? internationalCode :
                                            internationalCodes[0].internationalCode
                                        })(
                                            <Select
                                                placeholder="请选择商品条码"
                                                style={{ width: '150px' }}
                                            >
                                                {
                                                    internationalCodes.map((item) => (
                                                        <Option
                                                            key={item.id}
                                                            value={item.internationalCode}
                                                        >
                                                            {item.internationalCode}
                                                        </Option>
                                                    )
                                                    )
                                                }
                                            </Select>
                                            )}
                                    </span>
                                </FormItem>
                                {/* 是否支持退货 */}
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*是否支持退货：</span>
                                    <span className={`${prefixCls}-barcode-input`}>
                                        {getFieldDecorator('supportReturn', {
                                            rules: [{ required: true, message: '请选择是否支持退货!' }],
                                            initialValue: supportReturnOption.defaultValue
                                        })(
                                            <Select
                                                className="sc-form-item-select"
                                                style={{ width: '150px' }}
                                                onChange={this.handleSelectChange}
                                            >
                                                {
                                                    supportReturnOption.data.map((item) =>
                                                        (<Option key={item.key} value={item.key}>
                                                            {item.value}
                                                        </Option>)
                                                    )
                                                }
                                            </Select>
                                            )}
                                    </span>
                                </FormItem>
                                {
                                    isEdit &&
                                    <div className={`${prefixCls}-sub-state`}>
                                        <FormItem>
                                            <span className={`${prefixCls}-label`}>最新采购价格状态：</span>
                                            <span>{getProductByIds.newestPrice || '-'}</span>
                                        </FormItem>
                                        <FormItem>
                                            <span className={`${prefixCls}-label`}>提交人：</span>
                                            <span>{firstCreated() || '-'}</span>
                                        </FormItem>
                                        <FormItem>
                                            <span className={`${prefixCls}-label`}>审核人：</span>
                                            <span>{getProductByIds.auditUserName || '-'}</span>
                                        </FormItem>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className={`${prefixCls}-item`}>
                            <div>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*供应商：</span>
                                    <span className={`${prefixCls}-data-pic`}>
                                        <SearchMind
                                            defaultValue={
                                                (spNo || initValue.spNo) &&
                                                `${spNo || initValue.spNo} - ${companyName ||
                                                initValue.spName}`
                                            }
                                            style={{ zIndex: 9 }}
                                            compKey="search-mind-key1"
                                            ref={ref => { this.searchMind1 = ref }}
                                            onChoosed={this.handleSupplyChoose}
                                            onClear={this.handleSupplierClear}
                                            fetch={(params) => this.props.pubFetchValueList({
                                                condition: params.value,
                                                pageSize: params.pagination.pageSize,
                                                pageNum: params.pagination.current || 1
                                            }, 'supplierSearchBox')}
                                            renderChoosedInputRaw={(row) => (
                                                <div>{row.spNo} - {row.companyName}</div>
                                            )}
                                            pageSize={3}
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
                                </FormItem>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*供应商地点：</span>
                                    <span className={`${prefixCls}-data-pic`}>
                                        <SearchMind
                                            defaultValue={
                                            initValue.spAdrId &&
                                            `${initValue.spAdrId} - ${initValue.spAdrName}`
                                            }
                                            style={{ zIndex: 8 }}
                                            compKey="search-mind-key2"
                                            ref={ref => { this.searchMind2 = ref }}
                                            fetch={(params) =>
                                            this.props.pubFetchValueList(Util.removeInvalid({
                                                pId: this.ids.spId,
                                                condition: params.value,
                                                pageSize: params.pagination.pageSize,
                                                pageNum: params.pagination.current || 1
                                            }), 'supplierAdrSearchBox').then((res) => {
                                                const dataArr = res.data.data || [];
                                                if (!dataArr || dataArr.length === 0) {
                                                    message.warning('没有可用的数据');
                                                }
                                                return res;
                                            })}
                                            onChoosed={this.handleAdressChoose}
                                            onClear={this.handleAdressClear}
                                            renderChoosedInputRaw={(res) => (
                                                <div>{res.providerNo} - {res.providerName}</div>
                                            )}
                                            pageSize={3}
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
                                </FormItem>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>送货仓：</span>
                                    <span className={`${prefixCls}-data-pic`}>
                                        <SearchMind
                                            className={`${prefixCls}-data-disable`}
                                            defaultValue={
                                                (warehouseCode ||
                                                initValue.distributeWarehouseId) &&
                                                `${warehouseCode ||
                                                initValue.distributeWarehouseId} - ${warehouseName ||
                                                initValue.distributeWarehouseName}`}
                                            style={{ zIndex: 1, color: '#666' }}
                                            disabled={this.state.isDisabled}
                                            compKey="search-mind-key3"
                                            ref={ref => { this.searchMind3 = ref }}
                                            fetch={(params) =>
                                                this.props.pubFetchValueList(Util.removeInvalid({
                                                    supplierAddressId: this.ids.supplierAddressId,
                                                    condition: params.value,
                                                    pageSize: params.pagination.pageSize,
                                                    pageNum: params.pagination.current || 1
                                                }), 'getWarehouseLogic').then((res) => {
                                                    const row = res.data.data;
                                                    if (row.length === 0) {
                                                        message.warning('没有可用的数据');
                                                    }
                                                    return res;
                                                })}
                                            onChoosed={this.handleHouseChoose}
                                            onClear={this.handleHouseClear}
                                            renderChoosedInputRaw={(row) => (
                                                <div>
                                                    {row.warehouseCode} - {row.warehouseName}
                                                </div>
                                            )}
                                            pageSize={3}
                                            columns={[
                                                {
                                                    title: '仓库编码',
                                                    dataIndex: 'warehouseCode',
                                                    width: 98
                                                }, {
                                                    title: '仓库名称',
                                                    dataIndex: 'warehouseName',
                                                    width: 140
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
                                {
                                    hasMainSupplier &&
                                    <p style={{
                                        textAlign: 'center',
                                        width: '100%',
                                        color: 'red',
                                        fontSize: 14
                                    }}
                                    >*主供应商已经存在,是否设置当前新增供应商为只供应商</p>
                                }
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
    AddProdPurchase: PropTypes.func,
    pubFetchValueList: PropTypes.func,
    ChangeUpdateProd: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    getProductByIds: PropTypes.objectOf(PropTypes.any),
    handleClose: PropTypes.func,
    prodPurchase: PropTypes.objectOf(PropTypes.any),
    initValue: PropTypes.objectOf(PropTypes.any),
    goto: PropTypes.func,
    isEdit: PropTypes.bool,
    hasMainSupplier: PropTypes.bool,
    data: PropTypes.objectOf(PropTypes.any)
};

ProdModal.defaultProps = {
    prefixCls: 'purchase-modal',
    goto: () => { },
    data: {}
}

export default Form.create()(ProdModal);
