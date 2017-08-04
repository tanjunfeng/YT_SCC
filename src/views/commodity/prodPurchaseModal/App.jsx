import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, InputNumber, Checkbox } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SearchMind from '../../../components/searchMind';
import {
    fetchAddProdPurchase,
} from '../../../actions';
import {
    pubFetchValueList,
} from '../../../actions/pub';

import {
    productAddPriceVisible,
    AddProdPurchase
} from '../../../actions/producthome';

const FormItem = Form.Item;

@connect(
    state => ({
        prodPurchase: state.toJS().commodity.prodPurchase,
        getProductById: state.toJS().commodity.getProductById,
        getProdPurchaseByIds: state.toJS().commodity.getProdPurchaseById,
        toAddPriceVisible: state.toJS().commodity.toAddPriceVisible,
        getProductByIds: state.toJS().commodity.getProductById,
    }),
    dispatch => bindActionCreators({
        fetchAddProdPurchase,
        productAddPriceVisible,
        pubFetchValueList,
        AddProdPurchase
    }, dispatch)
)

class ProdPurchaseModal extends Component {
    constructor(props) {
        super(props);
        this.handleOk = ::this.handleOk;
        this.handleCancel = ::this.handleCancel;
        this.handlePriceChange = ::this.handlePriceChange;

        this.state = {
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
        console.log(this.state.supplyChoose)
    }

    /**
     * 供应商-值清单
     */
    handleSupplyChoose = ({ record }) => {
        this.setState({
            supplyChoose1: record,
        });
        console.log(this.state.supplyChoose1)
    }

    /**
     * 地点-值清单
     */
    handleAdressChoose = ({ record }) => {
        this.setState({
            supplyChoose2: record,
        });
        console.log(this.state.supplyChoose2)
    }


    /**
     * 创建弹框OK时间
     */
    handleOk() {
        const { validateFields } = this.props.form;
        const { getProductByIds } = this.props;
        validateFields((err, values) => {
            console.log(values);
            // TODO post data
            this.props.AddProdPurchase({
                spId: this.state.supplyChoose1.record.spId,
                spAdrId: this.state.supplyChoose2.record.spAdrid,
                productId: getProductByIds.record.id,
                branchCompanyId: this.state.supplyChoose.record.spId,
                supplierType: values.mainSupplier ? 1 : 0,
                purchaseInsideNumber: this.props.getProductByIds.record.purchaseInsideNumber,
                purchasePrice: this.props.getProductByIds.record.purchasePrice,
                // 条码
                internationalCode: this.props.getProductByIds.internationalCode,
                // 仓库ID
                distributeWarehouseId: this.state.supplyChoose.id
            });
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
        const { prefixCls, form } = this.props;
        const { getFieldDecorator } = form;
        const { prodPurchase = {} } = this.props;
        // const formData = this.props.form.getFieldsValue();
        const { getProductByIds } = this.props;
        return (
            <Modal
                title="采购价格"
                visible={this.props.toAddPriceVisible}
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
                                            <InputNumber min={0} placeholder="采购价" />
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
                                            <InputNumber min={0} placeholder="请输入商品条码" />
                                        )}
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>送货仓：</span>
                                    <span className={`${prefixCls}-data-pic`}>
                                        <SearchMind
                                            style={{ zIndex: 10 }}
                                            compKey="search-mind-key1"
                                            ref={ref => { this.searchMind0 = ref }}
                                            fetch={(params) => this.props.pubFetchValueList({
                                                condition: params.value
                                            }, 'getWarehouseInfo1')}
                                            onChoosed={this.handleHouseChoose}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.warehouseCode} - {data.warehouseName}</div>
                                            )}
                                            pageSize={2}
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
                            </div>
                        </div>
                        <div className={`${prefixCls}-item`}>
                            <div className={`${prefixCls}-item-content`}>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*供应商：</span>
                                    <span className={`${prefixCls}-data-pic`}>
                                        <SearchMind
                                            style={{ zIndex: 9 }}
                                            compKey="search-mind-key2"
                                            ref={ref => { this.searchMind1 = ref }}
                                            onChoosed={this.handleSupplyChoose}
                                            fetch={(params) => this.props.pubFetchValueList({
                                                condition: params.value
                                            }, 'supplierSearchBox')}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.spId} - {data.companyName}</div>
                                            )}
                                            pageSize={2}
                                            columns={[
                                                {
                                                    title: 'Name',
                                                    dataIndex: 'spNo',
                                                    width: 150,
                                                }, {
                                                    title: 'spNo',
                                                    dataIndex: 'spId',
                                                    width: 200,
                                                }, {
                                                    title: 'companyName',
                                                    dataIndex: 'companyName',
                                                    width: 200,
                                                }, {
                                                    title: 'spAdrid',
                                                    dataIndex: 'spAdrid',
                                                    width: 200,
                                                }, {
                                                    title: 'providerNo',
                                                    dataIndex: 'providerNo',
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
                                            compKey="search-mind-key2"
                                            ref={ref => { this.searchMind2 = ref }}
                                            fetch={(params) => this.props.pubFetchValueList({
                                                supplierAddressId: params.value
                                            }, 'supplierAdrSearchBox')}
                                            onChoosed={this.handleAdressChoose}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.providerNo} - {data.providerName}</div>
                                            )}
                                            pageSize={2}
                                            columns={[
                                                {
                                                    title: 'Name',
                                                    dataIndex: 'spNo',
                                                    width: 150,
                                                }, {
                                                    title: 'spId',
                                                    dataIndex: 'spId',
                                                    width: 200,
                                                }, {
                                                    title: 'spAdrid',
                                                    dataIndex: 'spAdrid',
                                                    width: 200,
                                                }, {
                                                    title: 'companyName',
                                                    dataIndex: 'companyName',
                                                    width: 200,
                                                }, {
                                                    title: 'providerNo',
                                                    dataIndex: 'providerNo',
                                                    width: 200,
                                                }, {
                                                    title: 'providerName',
                                                    dataIndex: 'providerName',
                                                    width: 200,
                                                }
                                            ]}
                                        />
                                    </span>
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
                            </div>
                        </div>
                    </Form>
                </div>
            </Modal>
        );
    }
}

ProdPurchaseModal.propTypes = {
    prefixCls: PropTypes.string,
    toAddPriceVisible: PropTypes.bool,
    productAddPriceVisible: PropTypes.func,
    pubFetchValueList: PropTypes.func,
    getProductByIds: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    prodPurchase: PropTypes.objectOf(PropTypes.any),
};

ProdPurchaseModal.defaultProps = {
    prefixCls: 'prod-modal',
}

export default Form.create()(ProdPurchaseModal);
