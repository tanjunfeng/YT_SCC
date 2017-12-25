import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, InputNumber, message, Select, Button, Input, Row, Col } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SearchMind from '../../../components/searchMind';
import {
    pubFetchValueList
} from '../../../actions/pub';
import { MAXGOODS } from '../../../constant'
import { productAddPriceVisible } from '../../../actions/producthome';
import { fetchAddProdPurchase } from '../../../actions';
import {
    preHarvestPinStatus,
} from '../../../constant/searchParams';
import EditableTable from './editableTable';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        toAddPriceVisible: state.toJS().commodity.toAddPriceVisible,
        getProductById: state.toJS().commodity.getProductById
    }),
    dispatch => bindActionCreators({
        productAddPriceVisible,
        fetchAddProdPurchase,
        pubFetchValueList,
    }, dispatch)
)
class SellPriceModal extends Component {
    constructor(props) {
        super(props);
        this.handleOk = this.handleOk.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleMaxChange = this.handleMaxChange.bind(this);
        this.handleMinChange = this.handleMinChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.childCompany = props.datas.branchCompanyId ? {
            branchCompanyId: props.datas.branchCompanyId,
            branchCompanyName: props.datas.branchCompanyName
        } : {};

        this.state = {
            isEditPrice: false,
            currentInside: null,
            insideValue: null,
            confirmVisible: false,
            hasZero: this.hasZero(props.datas.sellSectionPrices || [])
        }
        this.choose = 0;
        this.isDisabled = false;
        this.successPost = true;
        this.messageAlert = true;
    }

    componentDidMount() {
        const { datas } = this.props;
        const { validateFields, setFields } = this.props.form;
        validateFields((err, values) => {
            if (err) return null;
            const result = values;
            result.productId = datas.id || datas.productId;
            const priceList = [];
            priceList.forEach((obj) => {
                if (obj === null || obj === undefined) {
                    this.successPost = true;
                    setFields({
                        sellSectionPrices: {
                            errors: [new Error('价格不能为空，无法提交')],
                        },
                    })
                    return;
                }

                if (obj === 0) {
                    this.messageAlert = true;
                } else {
                    this.messageAlert = false;
                }
                if (obj >= 0) {
                    this.successPost = false;
                }
            })
            return null;
        })
    }

    getEditableTableValues = () => {
        const { isEdit, datas } = this.props;
        // console.log(datas);
        const { startNumber } = this.state;
        return {
            isEdit, startNumber, data: datas.sellSectionPrices
        };
    }

    handleOk() {
        const { datas, handlePostAdd, isEdit } = this.props;
        const { validateFields, setFields } = this.props.form;
        const choose = this.choose;
        if (!this.childCompany) {
            message.error('请选择子公司');
        }
        validateFields((err, values) => {
            if (err) return null;
            const result = values;
            result.productId = datas.id || datas.productId;
            const { branchCompanyId, branchCompanyName } = this.childCompany;
            if (!isEdit && (!branchCompanyId || !branchCompanyName)) {
                message.error('请选择子公司！');
                return null;
            }
            Object.assign(result, this.childCompany);
            if (isEdit) {
                Object.assign(result, {
                    id: datas.id,
                    productId: datas.productId
                })
            }
            const priceList = [];
            if (priceList.length === 0) {
                setFields({
                    sellSectionPrices: {
                        errors: [new Error('价格不能为空，无法提交')],
                    },
                })
                return false;
            }
            priceList.forEach((obj) => {
                if (obj === null || obj === undefined) {
                    this.successPost = true;
                    setFields({
                        sellSectionPrices: {
                            errors: [new Error('价格不能为空，无法提交')],
                        },
                    })
                    return;
                }
                if (obj === 0) {
                    this.messageAlert = true;
                } else {
                    this.messageAlert = false;
                }
                if (obj >= 0) {
                    this.successPost = false;
                }
            })
            if (this.successPost) {
                this.isDisabled = true;
                if (this.messageAlert) {
                    message.error('请仔细核对销售价格，确认为当前显示的价格!')
                }
                if (!this.isDisabled) {
                    handlePostAdd(result, isEdit, choose).then((res) => {
                        if (res.code === 200) {
                            this.isDisabled = false;
                        }
                    }).catch(() => {
                        this.isDisabled = false;
                    })
                }
            }
            if (this.successPost === false) {
                if (this.messageAlert) {
                    message.error('请仔细核对销售价格，确认为当前显示的价格!', 2, () => {
                        handlePostAdd(result, isEdit, choose);
                    })
                } else {
                    handlePostAdd(result, isEdit, choose);
                }
            }
            return null;
        })
    }

    hasZero(items) {
        const filter = items.filter(item => item.price === 0)
        return !!filter.length;
    }

    handleCancel() {
        this.props.handleClose();
    }

    handlePriceChange(result) {
        const { setFields, getFieldError } = this.props.form;
        const { isContinuity, results } = result;

        this.setState({
            hasZero: this.hasZero(results)
        })

        if (isContinuity && getFieldError('sellSectionPrices')) {
            setFields({
                sellSectionPrices: {
                    errors: null,
                },
            })
        }
        this.isDisabled = false;
    }

    handleChoose = ({ record }) => {
        this.childCompany = {
            branchCompanyId: record.id,
            branchCompanyName: record.name
        };
    }

    handleClear = () => {
        this.childCompany = null;
    }

    handleSelectChange = (item) => {
        this.choose = item === '-1' ? null : item;
    }

    /**
     * 销售内装数
     */
    handleInsideChange = (num) => {
        this.setState({
            currentInside: num
        }, () => {
            this.props.form.setFieldsValue({ minNumber: null })
        })
    }

    /**
     * 最小起订数量
     */
    handleMinChange = (num) => {
        this.setState({
            startNumber: num,
            isEditPrice: true,
        }, () => {
            this.props.form.setFieldsValue({ minNumber: num });
        })
    }

    /**
     * 最大销售数量
     */
    handleInsideChange = (num) => {
        this.setState({
            currentInside: num
        }, () => {
            this.props.form.setFieldsValue({ maxNumber: null })
        });
    }

    handleMaxChange = (num) => {
        this.props.form.setFieldsValue({ maxNumber: num });
    }

    handleConfirm = () => {
        this.setState({
            confirmVisible: true
        })
    }

    render() {
        const { prefixCls, form, datas, isEdit, getProductById } = this.props;
        const { getFieldDecorator } = form;
        const { currentInside, hasZero } = this.state;
        const newDates = JSON.parse(JSON.stringify(datas));
        const preHarvestPinStatusChange =
            (newDates.preHarvestPinStatus === 1 ? '1' : '0');
        return (
            <Modal
                title={isEdit ? '编辑销售价格' : '新增销售价格'}
                visible
                className={isEdit ? prefixCls : 'createCls'}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                maskClosable={false}
                confirmLoading={this.isDisabled}
                footer={
                    !this.state.confirmVisible && hasZero
                        ? [
                            <Button key="confirm" size="large" type="danger" onClick={this.handleConfirm}>确认价格为0提交</Button>,
                            <Button key="handleCancel" size="large" onClick={this.handleCancel}>取消</Button>
                        ]
                        : [
                            <Button key="handleOk" size="large" type="primary" onClick={this.handleOk}>确认</Button>,
                            <Button key="handleCancel" size="large" onClick={this.handleCancel}>取消</Button>
                        ]
                }
            >
                {
                    isEdit ?
                        <div>
                            <div>
                                <span style={{ width: '54%', display: 'inline-block' }}>修改前:</span>
                                <span style={{ width: '45%', display: 'inline-block' }}>修改后:</span>
                            </div>
                            <div className={`${prefixCls}-body-wrap`}>
                                <Form layout="inline" onSubmit={this.handleSubmit}>
                                    <div className={`${prefixCls}-item`}>
                                        <div className={`${prefixCls}-item-title`}>货运条件</div>
                                        <div className={`${prefixCls}-item-content`}>
                                            <Row>
                                                <Col>
                                                    <FormItem>
                                                        <span>*销售内装数：</span>
                                                        <span>
                                                            {getFieldDecorator('salesInsideNumber', {
                                                                rules: [{ required: true, message: '请输入销售内装数' }],
                                                                initialValue: newDates.salesInsideNumber
                                                            })(
                                                                <InputNumber
                                                                    min={0}
                                                                    onChange={this.handleInsideChange}
                                                                />
                                                                )}
                                                        </span>
                                                    </FormItem>
                                                    <FormItem>
                                                        <span>*起订量：</span>
                                                        <span>
                                                            {getFieldDecorator('minNumber', {
                                                                rules: [
                                                                    { required: true, message: '请输入最小起订量!' },
                                                                    {
                                                                        validator: (rule, value, callback) => {
                                                                            const { getFieldValue } = this.props.form
                                                                            if ((value / getFieldValue('salesInsideNumber')) % 1 !== 0) {
                                                                                callback('起订量需为内装数整数倍！')
                                                                            }

                                                                            callback()
                                                                        }
                                                                    }
                                                                ],
                                                                initialValue: newDates.minNumber
                                                            })(
                                                                <InputNumber
                                                                    min={0}
                                                                    onChange={this.handleMinChange}
                                                                    step={currentInside || newDates.salesInsideNumber}
                                                                />
                                                                )}
                                                        </span>
                                                    </FormItem>
                                                    <FormItem>
                                                        <span>*最大销售数量：</span>
                                                        <span>
                                                            {getFieldDecorator('maxNumber', {
                                                                initialValue: newDates.maxNumber
                                                            })(
                                                                <InputNumber
                                                                    min={0}
                                                                    onChange={this.handleMaxChange}
                                                                    step={currentInside || newDates.salesInsideNumber}
                                                                />
                                                                )}
                                                        </span>
                                                    </FormItem>
                                                    <FormItem>
                                                        <span>*承诺发货时间：下单后</span>
                                                        <span className={`${prefixCls}-day-input`}>
                                                            {getFieldDecorator('deliveryDay', {
                                                                rules: [{ required: true, message: '请输入承诺发货时间!' }],
                                                                initialValue: newDates.deliveryDay
                                                            })(
                                                                <InputNumber min={0} />
                                                                )}
                                                        </span>
                                                        天内发货
                                                    </FormItem>
                                                    <FormItem>
                                                        <span>是否整箱销售:</span>
                                                        <span className={`${prefixCls}-day-input`}>
                                                            {getProductById.sellFullCase === 1 ? '是' : '否'}
                                                        </span>
                                                    </FormItem>
                                                    <FormItem>
                                                        <span>整箱销售单位:</span>
                                                        <span className={`${prefixCls}-day-input`}>
                                                            {getProductById.fullCaseUnit || '-'}
                                                        </span>
                                                    </FormItem>
                                                    {/* 采购模式 */}
                                                    <FormItem className={`${prefixCls}-qy`}>
                                                        <span className={`${prefixCls}-select`}> 采购模式 : </span>
                                                        {getFieldDecorator('preHarvestPinStatus', {
                                                            initialValue: isEdit ? preHarvestPinStatusChange : '0'
                                                        })(
                                                            <Select
                                                                style={{ width: 90 }}
                                                                className="sc-form-item-select"
                                                                size="default"
                                                                onChange={this.handleSelectChange}
                                                            >
                                                                {
                                                                    preHarvestPinStatus.data.map((item) =>
                                                                        (<Option key={item.key} value={item.key}>
                                                                            {item.value}
                                                                        </Option>)
                                                                    )
                                                                }
                                                            </Select>
                                                            )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                    <div className={`${prefixCls}-item item-max-height`}>
                                        <div className={`${prefixCls}-item-title`}>
                                            添加阶梯价格
                                            <span className={`${prefixCls}-item-tip`}>
                                                &nbsp;(请按从小到大的顺序，最大值为{MAXGOODS})
                                            </span>
                                        </div>
                                        <div className={`${prefixCls}-item-content`}>
                                            <FormItem>
                                                {getFieldDecorator('sellSectionPrices', {
                                                    initialValue: this.getEditableTableValues()
                                                })(<EditableTable />)}
                                            </FormItem>
                                        </div>
                                        <div>
                                            <FormItem>
                                                <span>*建议零售价(元)：</span>
                                                <span>{newDates.suggestPrice}</span>
                                            </FormItem>
                                            <FormItem>
                                                <span>商品采购价格：</span>
                                                <span><i className={`new-price-state-${newDates.state}`} />{newDates.state || '-'}</span>
                                            </FormItem>
                                            <FormItem label="子公司:" className="edit-input">
                                                <span>{newDates.branchCompanyId} - {newDates.branchCompanyName}</span>
                                            </FormItem>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                            <div className={`${prefixCls}-body-wrap`} style={{ float: 'right' }}>
                                <Form layout="inline" onSubmit={this.handleSubmit}>
                                    <div className={`${prefixCls}-item`} style={{ minHeight: '211px' }}>
                                        <div className={`${prefixCls}-item-title`}>货运条件</div>
                                        <div className={`${prefixCls}-item-content`}>
                                            <FormItem>
                                                <span>*销售内装数：</span>
                                                <span>{newDates.salesInsideNumber}</span>
                                            </FormItem>
                                            <FormItem>
                                                <span>*起订量：</span>
                                                <span>{newDates.minNumber}</span>
                                            </FormItem>
                                            <FormItem>
                                                <span>*最大销售数量：</span>
                                                <span>{newDates.maxNumber}</span>
                                            </FormItem>
                                            <FormItem>
                                                <span>*承诺发货时间：下单后</span>
                                                <span>{newDates.deliveryDay}</span>
                                                天内发货
                                            </FormItem>
                                            <FormItem>
                                                <span>是否整箱销售:</span>
                                                <span>{getProductById.sellFullCase === 1 ? '是' : '否'}</span>
                                            </FormItem>
                                            <FormItem>
                                                <span>整箱销售单位:</span>
                                                <span>{getProductById.fullCaseUnit || '-'}</span>
                                            </FormItem>
                                            {/* 采购模式 */}
                                            <FormItem className={`${prefixCls}-qy`}>
                                                <span className={`${prefixCls}-select`}> 采购模式 : </span>
                                                <span>{preHarvestPinStatusChange === '0' ? '先销后采' : '先采后销'}</span>
                                            </FormItem>
                                        </div>
                                    </div>
                                    <div className={`${prefixCls}-item`}>
                                        <div className={`${prefixCls}-item-title`}>
                                            添加阶梯价格
                                            <span className={`${prefixCls}-item-tip`}>
                                                &nbsp;(请按从小到大的顺序，最大值为{MAXGOODS})
                                            </span>
                                        </div>
                                        <div className={`${prefixCls}-item-content`}>
                                            <FormItem>
                                                {getFieldDecorator('sellSectionPrices', {
                                                    initialValue: this.getEditableTableValues()
                                                })(<EditableTable />)}
                                            </FormItem>
                                        </div>
                                        <div>
                                            <FormItem>
                                                <span>*建议零售价(元)：</span>
                                                <span>{newDates.suggestPrice}</span>
                                            </FormItem>
                                            <FormItem>
                                                <span>商品采购价格：</span>
                                                <span><i className={`new-price-state-${newDates.state}`} />{newDates.state || '-'}</span>
                                            </FormItem>
                                            <FormItem label="子公司:" className="edit-input">
                                                <span>{newDates.branchCompanyId} - {newDates.branchCompanyName}</span>
                                            </FormItem>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                            <Form className="edit-state-list">
                                <FormItem>
                                    <span>提交人：</span>
                                    <span>{newDates.submit || '-'}</span>
                                </FormItem>
                                <FormItem>
                                    <span>审核人：</span>
                                    <span>{newDates.examine || '-'}</span>
                                </FormItem>
                                <FormItem>
                                    <span>售价状态：</span>
                                    <span><i className={`new-price-state-${newDates.state}`} />{newDates.state || '-'}</span>
                                </FormItem>
                            </Form>
                        </div>
                        : <div className={`${prefixCls}-body-wrap`}>
                            <Form layout="inline" onSubmit={this.handleSubmit}>
                                <div className={`${prefixCls}-item`}>
                                    <div className={`${prefixCls}-item-title`}>货运条件</div>
                                    <div className={`${prefixCls}-item-content`}>
                                        <FormItem>
                                            <span>*销售内装数：</span>
                                            <span>
                                                {getFieldDecorator('salesInsideNumber', {
                                                    rules: [{ required: true, message: '请输入销售内装数' }],
                                                    initialValue: newDates.salesInsideNumber
                                                })(
                                                    <InputNumber
                                                        min={0}
                                                        onChange={this.handleInsideChange}
                                                    />
                                                    )}
                                            </span>
                                        </FormItem>
                                        <FormItem label="*起订量：">
                                            <span>
                                                {getFieldDecorator('minNumber', {
                                                    rules: [
                                                        { required: true, message: '请输入最小起订量!' },
                                                        {
                                                            validator: (rule, value, callback) => {
                                                                const { getFieldValue } = this.props.form
                                                                if ((value / getFieldValue('salesInsideNumber')) % 1 !== 0) {
                                                                    callback('起订量需为内装数整数倍！')
                                                                }

                                                                callback()
                                                            }
                                                        }
                                                    ],
                                                    initialValue: newDates.minNumber
                                                })(
                                                    <InputNumber
                                                        min={0}
                                                        onChange={this.handleMinChange}
                                                        step={currentInside || newDates.salesInsideNumber}
                                                    />
                                                    )}
                                            </span>
                                        </FormItem>
                                        <FormItem>
                                            <span>*最大销售数量：</span>
                                            <span>
                                                {getFieldDecorator('maxNumber', {
                                                    initialValue: newDates.maxNumber
                                                })(
                                                    <InputNumber
                                                        min={0}
                                                        onChange={this.handleMaxChange}
                                                        step={currentInside || newDates.salesInsideNumber}
                                                    />
                                                    )}
                                            </span>
                                        </FormItem>
                                        <FormItem>
                                            <span>*承诺发货时间：下单后</span>
                                            <span className={`${prefixCls}-day-input`}>
                                                {getFieldDecorator('deliveryDay', {
                                                    rules: [{ required: true, message: '请输入承诺发货时间!' }],
                                                    initialValue: newDates.deliveryDay
                                                })(
                                                    <InputNumber min={0} />
                                                    )}
                                            </span>
                                            天内发货
                                    </FormItem>
                                        <FormItem>
                                            <span>是否整箱销售:</span>
                                            <span className={`${prefixCls}-day-input`}>
                                                {getProductById.sellFullCase === 1 ? '是' : '否'}
                                            </span>
                                        </FormItem>
                                        <FormItem>
                                            <span>整箱销售单位:</span>
                                            <span className={`${prefixCls}-day-input`}>
                                                {getProductById.fullCaseUnit || '-'}
                                            </span>
                                        </FormItem>
                                        {/* 采购模式 */}
                                        <FormItem className={`${prefixCls}-qy`}>
                                            <span className={`${prefixCls}-select`}> 采购模式 : </span>
                                            {getFieldDecorator('preHarvestPinStatus', {
                                                initialValue: isEdit ? preHarvestPinStatusChange : '0'
                                            })(
                                                <Select
                                                    style={{ width: 90 }}
                                                    className="sc-form-item-select"
                                                    size="default"
                                                    onChange={this.handleSelectChange}
                                                >
                                                    {
                                                        preHarvestPinStatus.data.map((item) =>
                                                            (<Option key={item.key} value={item.key}>
                                                                {item.value}
                                                            </Option>)
                                                        )
                                                    }
                                                </Select>
                                                )}
                                        </FormItem>
                                    </div>
                                </div>
                                <div className={`${prefixCls}-item item-max-height`}>
                                    <div className={`${prefixCls}-item-title`}>
                                        添加阶梯价格
                                    <span className={`${prefixCls}-item-tip`}>
                                            &nbsp;(请按从小到大的顺序，最大值为{MAXGOODS})
                                    </span>
                                    </div>
                                    <div className={`${prefixCls}-item-content`}>
                                        <FormItem>
                                            {getFieldDecorator('sellSectionPrices', {
                                                initialValue: this.getEditableTableValues()
                                            })(<EditableTable />)}
                                        </FormItem>
                                    </div>
                                    <div>
                                        <FormItem>
                                            <span>* 建议零售价(元)：</span>
                                            <span>
                                                {getFieldDecorator('suggestPrice', {
                                                    rules: [{ required: true, message: '请输入建议零售价!' }],
                                                    initialValue: newDates.suggestPrice
                                                })(
                                                    <InputNumber min={0} />
                                                    )}
                                            </span>
                                        </FormItem>
                                    </div>
                                </div>
                                <div className={`${prefixCls}-item`} style={{ display: 'flex' }}>
                                    <FormItem label="子公司:">
                                        {
                                            isEdit ?
                                                <Input defaultValue={`${newDates.branchCompanyId}-${newDates.branchCompanyName}`} readOnly />
                                                : <span className={`${prefixCls}-data-pic`}>
                                                    <SearchMind
                                                        compKey="search-mind-key1"
                                                        ref={ref => { this.searchMind = ref }}
                                                        fetch={(param) => this.props.pubFetchValueList({
                                                            branchCompanyName: param.value,
                                                            productId: newDates.productId || newDates.id
                                                        }, 'queryBranchCompanyInfo')}
                                                        placeholder="请输入公司名"
                                                        onChoosed={this.handleChoose}
                                                        disabled={isEdit}
                                                        defaultValue={
                                                            newDates.branchCompanyId ?
                                                                `${newDates.branchCompanyId} - ${newDates.branchCompanyName}` :
                                                                undefined}
                                                        onClear={this.handleClear}
                                                        renderChoosedInputRaw={(data) => (
                                                            <div>{data.id} - {data.name}</div>
                                                        )}
                                                        pageSize={6}
                                                        columns={[
                                                            {
                                                                title: '公司编号',
                                                                dataIndex: 'id',
                                                                width: 98
                                                            }, {
                                                                title: '公司名',
                                                                dataIndex: 'name',
                                                                width: 140
                                                            }
                                                        ]}
                                                    />
                                                </span>
                                        }
                                    </FormItem>
                                </div>
                            </Form>
                        </div>
                }
            </Modal>
        );
    }
}

SellPriceModal.propTypes = {
    prefixCls: PropTypes.string,
    form: PropTypes.objectOf(PropTypes.any),
    getProductById: PropTypes.objectOf(PropTypes.any),
    handlePostAdd: PropTypes.func,
    pubFetchValueList: PropTypes.func,
    handleClose: PropTypes.func,
    datas: PropTypes.objectOf(PropTypes.any),
    isEdit: PropTypes.bool,
};

SellPriceModal.defaultProps = {
    prefixCls: 'sell-modal',
    handleClose: () => { },
    datas: {},
    isEdit: false
}

export default Form.create()(SellPriceModal);
