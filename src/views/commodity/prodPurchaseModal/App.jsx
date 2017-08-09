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
import SearchMind from '../../../components/searchMind';
import { PAGE_SIZE } from '../../../constant';
import {
    fetchAddProdPurchase,
    fetchCheckMainSupplier,
} from '../../../actions';
import {
    pubFetchValueList,
} from '../../../actions/pub';

import {
    productAddPriceVisible,
    AddProdPurchase,
    QueryProdPurchaseExtByCondition,
    GetWarehouseInfo1
} from '../../../actions/producthome';

const FormItem = Form.Item;
const { Option } = Select;

@connect(
    state => ({
        prodPurchase: state.toJS().commodity.prodPurchase,
        getProdPurchaseByIds: state.toJS().commodity.getProdPurchaseById,
        toAddPriceVisible: state.toJS().commodity.toAddPriceVisible,
        getProductByIds: state.toJS().commodity.getProductById,
        checkMainSupplier: state.toJS().commodity.checkMainSupplier,
        getWarehouseLogicInfos: state.toJS().commodity.getWarehouseLogicInfo,
    }),
    dispatch => bindActionCreators({
        fetchAddProdPurchase,
        productAddPriceVisible,
        pubFetchValueList,
        AddProdPurchase,
        QueryProdPurchaseExtByCondition,
        fetchCheckMainSupplier,
        GetWarehouseInfo1
    }, dispatch)
)

class ProdPurchaseModal extends Component {
    constructor(props) {
        super(props);
        this.handleOk = ::this.handleOk;
        this.handleCancel = ::this.handleCancel;
        this.handlePriceChange = ::this.handlePriceChange;

        this.state = {
            isDisabled: true,
            distributeWarehouseId: null,
            supplyChoose: {},
            supplyChoose1: {},
            supplyChoose2: {},
        }
    }

    /**
     * 仓库-值清单
     */
    handleHouseChoose = ({ record }) => {
        this.setState({
            supplyChoose: record,
        });
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
        this.searchMind2.reset();
        this.searchMind0.reset();
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
        this.searchMind0.reset();
        this.props.GetWarehouseInfo1({
            supplierAddressId: record.spAdrid,
            pageNum: 1,
            pageSize: PAGE_SIZE,
        }).then((res) => {
            this.setState({
                supplyChoose: res.data.data[0]
            });
        })
    }


    /**
     * 创建弹框OK时间
     */
    handleOk() {
        const { validateFields } = this.props.form;
        const { getProductByIds } = this.props;
        // console.log(this.state.supplyChoose)
        // console.log(this.state.supplyChoose1)
        // console.log(this.state.supplyChoose2)
        validateFields((err, values) => {
            // console.log(values);
            // TODO post data
            this.props.AddProdPurchase({
                spId: this.state.supplyChoose1.spId,
                spAdrId: this.state.supplyChoose2.spAdrid || this.supplyChoose.id,
                productId: this.props.getProductByIds.id,
                branchCompanyId: this.state.supplyChoose2.branchCompanyId,
                supplierType: values.mainSupplier ? 1 : 0,
                purchaseInsideNumber: parseFloat(values.purchasePrice),
                purchasePrice: parseFloat(values.purchasePrice),
                // 条码
                internationalCode: values.internationalCode,
                // 仓库ID
                distributeWarehouseId: this.state.supplyChoose.id
            }).then((res) => {
                this.props.productAddPriceVisible({isVisible: false});
                message.success(res.message)
                this.props.goto()
            }).catch(() => {
                this.props.productAddPriceVisible({isVisible: false});
                message.error('操作失败')
            })
        })
    }

    handleCancel(record) {
        this.props.productAddPriceVisible({isVisible: false, record});
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

    render() {
        const { prefixCls, form, getProductByIds = {}, checkMainSupplier } = this.props;
        const { getFieldDecorator } = form;
        const { prodPurchase = {} } = this.props;
        const { warehouseCode, warehouseName} = this.state.supplyChoose;
        // const formData = this.props.form.getFieldsValue();
        const { internationalCodes = [] } = getProductByIds;
        return (
            <Modal
                title="新增采购价格"
                visible={this.props.toAddPriceVisible}
                className={prefixCls}
                onOk={this.handleOk}
                width={'500px'}
                onCancel={this.handleCancel}
                maskClosable={false}
            >
                {
                this.props.toAddPriceVisible &&
                <div className={`${prefixCls}-body-wrap`}>
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <div className={`${prefixCls}-item`}>
                            <div className={`${prefixCls}-item-title`}>货运条件</div>
                            <div className={`${prefixCls}-item-content`}>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*采购内装数：</span>
                                    <span className={`${prefixCls}-barcode-input`}>
                                        {getFieldDecorator('purchaseInsideNumber', {
                                            rules: [{ required: true, message: '请输入采购内装数' }],
                                            initialValue: getProductByIds.purchaseInsideNumber
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
                                            initialValue: getProductByIds.guidePurchasePrice
                                        })(
                                            <InputNumber min={0} step={0.01} placeholder="采购价" />
                                        )}
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*条   码：</span>
                                    <span className={`${prefixCls}-barcode-input`}>
                                        {getFieldDecorator('internationalCode', {
                                            rules: [{ required: true, message: '输入商品条码!' }],
                                            initialValue: getProductByIds.productCode
                                        })(
                                            <Select
                                                placeholder="请选择商品条码"
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
                                            style={{ zIndex: 9 }}
                                            compKey="spNo"
                                            ref={ref => { this.searchMind1 = ref }}
                                            onChoosed={this.handleSupplyChoose}
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
                                            style={{ zIndex: 8 }}
                                            compKey="spNo"
                                            ref={ref => { this.searchMind2 = ref }}
                                            fetch={(params) => this.props.pubFetchValueList({
                                                supplierAddressId: params.value,
                                                pageSize: params.pagination.pageSize,
                                                pageNum: params.pagination.current || 1
                                            }, 'supplierAdrSearchBox')}
                                            onChoosed={this.handleAdressChoose}
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
                                                    title: '供应商名称',
                                                    dataIndex: 'companyName',
                                                    width: 200,
                                                }, {
                                                    title: '供应商地点编码',
                                                    dataIndex: 'providerNo',
                                                    width: 200,
                                                }, {
                                                    title: '供应商地点名称',
                                                    dataIndex: 'providerName',
                                                    width: 200,
                                                }
                                            ]}
                                        />
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>送货仓：</span>
                                    <span className={`${prefixCls}-data-pic`}>
                                        <SearchMind
                                            defaultValue={`${warehouseCode || ''} - ${warehouseName || ''}`}
                                            style={{ zIndex: 7 }}
                                            compKey="id"
                                            ref={ref => { this.searchMind0 = ref }}
                                            fetch={(params) => this.props.pubFetchValueList({
                                                condition: params.value,
                                                pageSize: params.pagination.pageSize,
                                                pageNum: params.pagination.current || 1
                                            }, 'getWarehouseInfo1')}
                                            onChoosed={this.handleHouseChoose}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.warehouseCode} - {data.warehouseName}</div>
                                            )}
                                            disabled={this.state.isDisabled}
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
                                    {
                                        this.state.isDisabled &&
                                        <p style={{color: 'red', textAlign: 'center'}}>*请先选择地点信息</p>
                                    }
                                </FormItem>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>主供应商：</span>
                                    <span className={`${prefixCls}-warehouse-input`}>
                                        {getFieldDecorator('mainSupplier', {
                                            initialValue: prodPurchase.salesInsideNumber
                                        })(
                                            <Checkbox />
                                        )}
                                    </span>
                                </FormItem>
                                {
                                    checkMainSupplier &&
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
                }
            </Modal>
        );
    }
}

ProdPurchaseModal.propTypes = {
    prefixCls: PropTypes.string,
    id: PropTypes.string,
    toAddPriceVisible: PropTypes.bool,
    productAddPriceVisible: PropTypes.func,
    pubFetchValueList: PropTypes.func,
    getProductByIds: PropTypes.func,
    fetchCheckMainSupplier: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    prodPurchase: PropTypes.objectOf(PropTypes.any),
    goto: PropTypes.func,
};

ProdPurchaseModal.defaultProps = {
    prefixCls: 'prod-modal',
    goto: () => {},
}

export default Form.create()(ProdPurchaseModal);
