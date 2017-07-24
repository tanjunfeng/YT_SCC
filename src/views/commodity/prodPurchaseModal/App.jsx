import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, InputNumber, Input, Checkbox } from 'antd';
import SteppedPrice from '../steppedPrice';
import SearchMind from '../../../components/searchMind';
import {
    fetchTest,
} from '../../../actions/classifiedList';

const FormItem = Form.Item;

class ProdPurchaseModal extends Component {
    constructor(props) {
        super(props);
        this.handleOk = ::this.handleOk;
        this.handlePriceChange = ::this.handlePriceChange;
    }

    handleOk() {
        const { validateFields } = this.props.form;
        validateFields((err, values) => {
            console.log(values);
            // TODO post data
        })
    }

    handleTestFetch = ({ value, pagination }) => {
        console.log(value, pagination);

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
        const { prefixCls, form } = this.props;
        const { getFieldDecorator } = form;
        const { prodPurchase = {} } = this.props;

        return (
            <Modal
                title="采购价格"
                visible={true}
                className={prefixCls}
                onOk={this.handleOk}
                width={'500px'}
                onCancel={this.handleCancel}
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
                                            initialValue: prodPurchase.purchaseInsideNumber
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
                                            initialValue: prodPurchase.purchasePrice
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
                                            initialValue: prodPurchase.internationalCode
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
                                            fetch={(value, pager) => this.handleTestFetch(value, pager)}
                                            onChoosed={this.handleTestChoose}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.id} - {data.name}</div>
                                            )}
                                            pageSize={2}
                                            columns={[
                                                {
                                                    title: 'Name',
                                                    dataIndex: 'name',
                                                    width: 150,
                                                }, {
                                                    title: 'Address',
                                                    dataIndex: 'address',
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
                                            fetch={(value, pager) => this.handleTestFetch(value, pager)}
                                            onChoosed={this.handleTestChoose}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.id} - {data.name}</div>
                                            )}
                                            pageSize={2}
                                            columns={[
                                                {
                                                    title: 'Name',
                                                    dataIndex: 'name',
                                                    width: 150,
                                                }, {
                                                    title: 'Address',
                                                    dataIndex: 'address',
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
                                            fetch={(value, pager) => this.handleTestFetch(value, pager)}
                                            onChoosed={this.handleTestChoose}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.id} - {data.name}</div>
                                            )}
                                            pageSize={2}
                                            columns={[
                                                {
                                                    title: 'Name',
                                                    dataIndex: 'name',
                                                    width: 150,
                                                }, {
                                                    title: 'Address',
                                                    dataIndex: 'address',
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
    form: PropTypes.objectOf(PropTypes.any),
    prodPurchase: PropTypes.objectOf(PropTypes.any),
};

ProdPurchaseModal.defaultProps = {
    prefixCls: 'prod-modal',
}

export default Form.create()(ProdPurchaseModal);