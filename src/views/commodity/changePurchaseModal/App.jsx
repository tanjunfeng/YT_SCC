/**
* @file app.jsx
 * @author Tan junfeng
 *
 * 商品采购关系维护
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, InputNumber, Checkbox, message } from 'antd';
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

@connect(
    state => ({
        prodPurchase: state.toJS().commodity.prodPurchase,
        getProductById: state.toJS().commodity.getProductById,
        getProdPurchaseByIds: state.toJS().commodity.getProdPurchaseById,
        toAddPriceVisible: state.toJS().commodity.toAddPriceVisible,
        updateProdPurchase: state.toJS().commodity.updateProdPurchase,
        updateProdRecord: state.toJS().commodity.updateProdRecord,
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
            spId: props.updateProdRecord.spId,
            spNo: props.updateProdRecord.spNo,
            // 供应商地点id
            supplierAddressId: props.updateProdRecord.spAdrId,
            // 仓库id
            warehouseId: props.updateProdRecord.id,
            // 分公司id
            childCompanyId: props.updateProdRecord.branchCompanyId,
            distributeWarehouseId: props.updateProdRecord.distributeWarehouseId,
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
        }
    }

    componentWillReceiveProps(nextProps) {
        const { updateProdRecord = {} } = nextProps;
        if (this.props.updateProdRecord.spId !== updateProdRecord.spId) {
            this.setState({
                //
                spId: nextProps.updateProdRecord.spId,
                //
                spAdrId: nextProps.updateProdRecord.spAdrId,
                //
                branchCompanyId: nextProps.updateProdRecord.branchCompanyId,
                // 仓库ID
                distributeWarehouseId: nextProps.updateProdRecord.id,
            });
            // console.log(nextProps.updateProdRecord.spAdrId)
            this.ids = {
                // 供应商id
                spId: nextProps.updateProdRecord.spId,
                // 供应商地点id
                supplierAddressId: nextProps.updateProdRecord.spAdrId,
                // 仓库id
                warehouseId: nextProps.updateProdRecord.id,
                // 分公司id
                childCompanyId: nextProps.updateProdRecord.branchCompanyId,
                distributeWarehouseId: nextProps.updateProdRecord.distributeWarehouseId,
                spNo: null
            }
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

    /**
     * 供应商-值清单
     */
    handleSupplyChoose = ({ record }) => {
        // console.log(record)
        this.setState({
            supplyChoose1: record,
            supplyChoose2: {},
            supplyChoose3: {},
        });
        this.ids = {
            spId: record.id,
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
                const { spNo, companyName, spId } = res.data.data;
                this.ids.spNo = spNo;
                this.ids.spId = spId;
                this.setState({
                    spNo,
                    companyName
                })
            })
        }
        // this.props.GetWarehouseInfo1({
        //     supplierAddressId: record.spAdrid,
        //     pageNum: 1,
        //     pageSize: PAGE_SIZE,
        // }).then((res) => {
        //     this.setState({
        //         supplyChoose: res.data.data[0]
        //     });
        // })
    }

    /**
     * 创建弹框OK时间 (当没有改变时)
     */
    handleOk() {
        const { validateFields } = this.props.form;
        const { updateProdRecord } = this.props;
        // console.log(updateProdRecord)
        validateFields((err, values) => {
            // console.log(values);
            // TODO post data
            this.props.ChangeUpdateProd({
                id: updateProdRecord.id,
                //
                spId: this.ids.spId,
                //
                // spAdrId: updateProdRecord.spAdrId,
                spAdrId: this.ids.supplierAddressId,
                productId: updateProdRecord.productId,
                //
                // branchCompanyId: updateProdRecord.branchCompanyId,
                branchCompanyId: this.ids.childCompanyId,
                supplierType: updateProdRecord.supplierType,
                purchaseInsideNumber: values.purchaseInsideNumber,
                purchasePrice: parseFloat(values.purchasePrice),
                internationalCode: values.internationalCode,
                // 仓库ID
                // distributeWarehouseId: updateProdRecord.id,
                distributeWarehouseId: this.ids.distributeWarehouseId,
            }).then((res) => {
                this.props.UpdateProdPurchase({isVisible: false});
                message.success(res.message)
                this.props.goto()
            }).catch(() => {
                message.error('操作失败')
            })
        })
    }

    /**
     * 创建弹框OK时间 (当发生改变时)
     */
    // handleOky() {
    //     const { validateFields } = this.props.form;
    //     const { updateProdRecord } = this.props;
    //     // console.log(updateProdRecord.supplierType)
    //     // console.log(this.state.supplyChoose)
    //     // console.log(this.state.supplyChoose1)
    //     // console.log(this.state.supplyChoose2)
    //     validateFields((err, values) => {
    //         console.log(values);
    //         // TODO post data
    //         this.props.ChangeUpdateProd({
    //             id: updateProdRecord.id,
    //             // spId: this.state.supplyChoose1.spId,
    //             spId: updateProdRecord.distributeWarehouseId,
    //             // spAdrId: this.state.supplyChoose2.spAdrid,
    //             spAdrId: updateProdRecord.spAdrId,
    //             productId: this.props.getProductByIds.id,
    //             // branchCompanyId: this.state.supplyChoose2.branchCompanyId,
    //             branchCompanyId: updateProdRecord.distributeWarehouseId,
    //             supplierType: updateProdRecord.supplierType,
    //             purchaseInsideNumber:
                        // !this.props.getProductByIds.purchaseInsideNumber
                        // ? updateProdRecord.supplierType
                        // : this.props.getProductByIds.purchaseInsideNumber,
    //             purchasePrice: values.purchasePrice.toFixed(2),
    //             // 条码
    //             internationalCode: values.internationalCode,
    //             // 仓库ID
    //             // distributeWarehouseId: this.state.supplyChoose.id
    //             distributeWarehouseId: updateProdRecord.distributeWarehouseId,
    //         }).then((res) => {
    //             this.props.updateProdPurchase({isVisible: false});
    //             message.success(res.message)
    //             this.props.goto()
    //         }).catch(() => {
    //             message.error('操作失败')
    //         })
    //     })
    // }

    handleCancel(record) {
        this.props.UpdateProdPurchase({isVisible: false, record});
    }

    // handleTestChoose(record) {
    //     console.log(record);
    // }

    handleTestFetch = ({ value, pagination }) => {
        // console.log(value, pagination);

        return fetchTest({
            value,
        });
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
        const { prefixCls, form, updateProdRecord = {} } = this.props;
        const { getFieldDecorator } = form;
        const { prodPurchase = {} } = this.props;
        // const formData = this.props.form.getFieldsValue();
        // console.log(updateProdRecord)
        const { warehouseCode, warehouseName} = this.state.supplyChoose;
        const { spNo, companyName } = this.state;
        return (
            <Modal
                title="修改采购价格"
                visible={this.props.updateProdPurchase}
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
                                            initialValue: updateProdRecord.purchaseInsideNumber
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
                                            initialValue: updateProdRecord.purchasePrice
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
                                            initialValue: updateProdRecord.internationalCode
                                        })(
                                            <InputNumber min={0} placeholder="请输入商品条码" />
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
                                            defaultValue={`${spNo || updateProdRecord.spId} - ${companyName || updateProdRecord.spName}`}
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
                                                    dataIndex: 'spName',
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
                                            defaultValue={`${updateProdRecord.spAdrId} - ${updateProdRecord.spAdrName}`}
                                            style={{ zIndex: 8 }}
                                            compKey="search-mind-key1"
                                            ref={ref => { this.searchMind2 = ref }}
                                            fetch={(params) => this.props.pubFetchValueList(Util.removeInvalid({
                                                spId: this.ids.spId,
                                                condition: params.value,
                                                pageSize: params.pagination.pageSize,
                                                pageNum: params.pagination.current || 1
                                            }), 'supplierAdrSearchBox')}
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
                                            defaultValue={`${warehouseCode || updateProdRecord.distributeWarehouseId} - ${warehouseName || updateProdRecord.distributeWarehouseName}`}
                                            style={{ zIndex: 1 }}
                                            disabled={this.state.isDisabled}
                                            compKey="search-mind-key1"
                                            ref={ref => { this.searchMind3 = ref }}
                                            fetch={(params) => this.props.pubFetchValueList(Util.removeInvalid({
                                                supplierAddressId: this.ids.supplierAddressId,
                                                condition: params.value,
                                                pageSize: params.pagination.pageSize,
                                                pageNum: params.pagination.current || 1
                                            }), 'getWarehouseInfo1')}
                                            onChoosed={this.handleHouseChoose}
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
                                    {
                                        this.state.isDisabled &&
                                        <p style={{color: 'red', textAlign: 'center'}}>*请先选择地点信息</p>
                                    }
                                </FormItem>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>主供应商：</span>
                                    <span className={`${prefixCls}-warehouse-input`}>
                                        {getFieldDecorator('supplierType', {
                                            initialValue: prodPurchase.salesInsideNumber
                                        })(
                                            <Checkbox
                                                defaultChecked={
                                                    updateProdRecord.supplierType === 1 ? true : false
                                                }
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
    updateProdRecord: PropTypes.objectOf(PropTypes.any),
    goto: PropTypes.func,
};

ProdModal.defaultProps = {
    prefixCls: 'prod-modal',
    goto: () => {},
}

export default Form.create()(ProdModal);
