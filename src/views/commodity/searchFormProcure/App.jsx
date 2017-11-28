/**
 * @file App.jsx
 * @author Tanjf
 *
 * 采购搜索框
 */

import { fromJS } from 'immutable';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { message, Form, Col, Row, Select, Button, Icon } from 'antd';

import Utils from '../../../util/util';
import SearchMind from '../../../components/searchMind';
import { BranchCompany } from '../../../container/search';
import { fetchAction, receiveData, } from '../../../actions/classifiedList';
import { QueryProdPurchaseExtByCondition } from '../../../actions/producthome';
import { fetchAddProdPurchase } from '../../../actions';
import { initiateModeOptions, mainSupplierOptions } from '../../../constant/searchParams';
import { pubFetchValueList } from '../../../actions/pub';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        user: state.toJS().user.data,
        rights: state.toJS().user.rights,
        data: state.toJS().commodity.classifiedList,
        getProductByIds: state.toJS().commodity.getProductById,
        getProdPurchaseByIds: state.toJS().commodity.getProdPurchaseById,
    }),
    dispatch => bindActionCreators({
        fetchAction,
        receiveData,
        fetchAddProdPurchase,
        pubFetchValueList,
        QueryProdPurchaseExtByCondition
    }, dispatch)
)
class SearchForm extends Component {
    constructor(props) {
        super(props);

        this.handleDrop = :: this.handleDrop;
        this.handleChangeSort = :: this.handleChangeSort;
        this.handleChangeStatus = :: this.handleChangeStatus;
        this.handleResetValue = :: this.handleResetValue;
        this.handleGetValue = :: this.handleGetValue;
        this.handleSupplyClear = :: this.handleSupplyClear;
        this.handleAdressClear = :: this.handleAdressClear;
        // Test
        // this.handleSave = ::this.handleSave;
        this.state = {
            img: null,
            chooseMe: {},
            disabled: false,
            supplyChoose: {},
            supplyChoose1: {},
            visible: true,
            sort: 1
        }
    }

    /**
     * 供应商-值清单
     */
    handleSupplyChoose = ({ record }) => {
        this.setState({
            supplyChoose: record,
        });
    }

    /**
     * 地点-值清单
     */
    handleAdressChoose = ({ record }) => {
        this.setState({
            supplyChoose1: record,
        });
    }

    /**
     * 搜索
     */
    handleGetValue() {
        const { validateFields } = this.props.form;
        validateFields((err, values) => {
            const status = values.initiateModeOptions === '-1'
                ? null
                : values.initiateModeOptions;
            const supplierType = values.mainSupplierOptions === '-1'
                ? null
                : values.mainSupplierOptions;
            this.props.onSearch(Utils.removeInvalid({
                spId: this.state.supplyChoose.spId,
                spAdrId: this.state.supplyChoose1.spAdrid,
                branchCompanyId: values.branchCompany.id,
                supplierType,
                status
            }))
        })
    }

    /**
     * 通过输入框排序
     * @param event
     */
    handleChangeSort(event) {
        const el = event.currentTarget;
        // 当前排序序号
        const sort = el.getAttribute('data-sort');
        // 当前节点的父级 key
        const parentKey = el.getAttribute('data-parentKey');

        // 转换为索引值
        const fromIndex = sort - 1;
        const toIndex = el.value - 1;

        this.sortData(parentKey, fromIndex, toIndex);
    }

    /**
     * 修改展示状态
     * @param value
     * @param mkey
     */
    handleChangeStatus(value, mkey) {
        const $data = fromJS(this.props.data);

        Utils.find($data, mkey, ($finder, deep) => {
            const $dealData = $data.setIn(
                deep.concat('status'),
                parseInt(value, 10)
            );

            this.props.receiveData($dealData);
        });
    }

    /**
     * Drop 事件
     * @param info
     */
    handleDrop(info) {
        const dropEl = info.node;
        const dragEl = info.dragNode;
        const { parentKey } = dragEl.props;
        const dropIndex = info.dropPosition;
        const dragIndex = dragEl.props.index;

        // 同层级可拖放
        if (dropEl.props.parentKey === parentKey) {
            this.sortData(parentKey, dragIndex, dropIndex);
        } else {
            message.warning('只能同级操作');
        }
    }

    /**
     * 重新根据参数排序
     * @param parentKey
     * @param fromIndex 当前的索引值
     * @param toIndex 更到到数据数组的索引值位置
     */
    sortData(parentKey, fromIndex, toIndex) {
        let $dealData = fromJS([]);
        // 格式化数据
        const $data = fromJS(this.props.data);

        Utils.find($data, parentKey, ($finder, deep, $child) => {
            // 操作跟节点
            if ($finder === null) {
                $dealData = Utils.takeTo($data, fromIndex, toIndex);
            } else {
                $dealData = $data.setIn(
                    deep.concat('children'),
                    Utils.takeTo($child, fromIndex, toIndex)
                );
            }
        });

        this.props.receiveData($dealData.toJS());

        if ($dealData) {
            message.success('操作成功');
        }
    }

    /**
     * 重置
     */
    handleResetValue() {
        this.addressSearchMind.reset();
        this.supplySearchMind.reset();
        this.setState({
            supplyChoose: {},
            supplyChoose1: {}
        })
        this.props.form.resetFields();
        this.props.onReset();
        // 点击重置时清除 seachMind 引用文本
        this.props.form.setFieldsValue({
            branchCompany: { reset: true }
        });
    }

    /**
     * 供应商清空数据
     */
    handleSupplyClear() {
        this.setState({
            supplyChoose: {},
        })
    }

    /**
     * 地点清空数据
     */
    handleAdressClear() {
        this.setState({
            supplyChoose1: {},
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { prefixCls } = this.props;
        return (
            <div className={`${prefixCls}-content manage-form`}>
                <div style={{ fontSize: 16, fontWeight: 900 }}>
                    <Icon type="desktop" className="css-appstore" />&nbsp;价格明细
                </div>
                <Form layout="inline" className={`${prefixCls}-content`}>
                    <Row type="flex" justify="start" className={`${prefixCls}-flex`}>
                        {/* 供应商 */}
                        <Col>
                            <FormItem label="供应商">
                                <span className="value-list-input">
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
                                        renderChoosedInputRaw={(data) => (
                                            <div>{data.spNo} - {data.companyName}</div>
                                        )}
                                        pageSize={6}
                                        columns={[
                                            {
                                                title: '供应商编码',
                                                dataIndex: 'spNo',
                                                width: 68
                                            }, {
                                                title: '供应商名称',
                                                dataIndex: 'companyName'
                                            }
                                        ]}
                                    />
                                </span>
                            </FormItem>
                        </Col>
                        {/* 地点 */}
                        <Col>
                            <FormItem label="地点">
                                <span className="value-list-input">
                                    <SearchMind
                                        compKey="search-mind-supply2"
                                        ref={ref => { this.addressSearchMind = ref }}
                                        fetch={(params) => this.props.pubFetchValueList({
                                            condition: params.value,
                                            pageSize: params.pagination.pageSize,
                                            pageNum: params.pagination.current || 1
                                        }, 'supplierAdrSearchBox')}
                                        onChoosed={this.handleAdressChoose}
                                        onClear={this.handleAdressClear}
                                        renderChoosedInputRaw={(data) => (
                                            <div>{data.providerNo} - {data.providerName}</div>
                                        )}
                                        pageSize={6}
                                        columns={[
                                            {
                                                title: '供应商地点编码',
                                                dataIndex: 'providerNo',
                                                width: 68
                                            }, {
                                                title: '供应商地点名称',
                                                dataIndex: 'providerName'
                                            }
                                        ]}
                                    />
                                </span>
                            </FormItem>
                        </Col>
                        {/* 子公司 */}
                        <Col span={8}>
                            <FormItem label="所属公司">
                                {getFieldDecorator('branchCompany', {
                                    initialValue: { id: '', name: '' }
                                })(<BranchCompany />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        {/* 是否启用 */}
                        <FormItem className="sc-form-item">
                            <span className={`${prefixCls}-select`}>启用</span>
                            {getFieldDecorator('initiateModeOptions', {
                                initialValue: initiateModeOptions.defaultValue
                            })(
                                <Select
                                    style={{ width: 90 }}
                                    className="sc-form-item-select"
                                    size="default"
                                    disabled={this.state.supplierType === '-1'}
                                >
                                    {
                                        initiateModeOptions.data.map((item) =>
                                            (<Option key={item.key} value={item.key}>
                                                {item.value}
                                            </Option>)
                                        )
                                    }
                                </Select>
                                )}
                        </FormItem>
                        {/* 是否为主供应商 */}
                        <FormItem className="sc-form-item">
                            <span className={`${prefixCls}-select`}>主供应商</span>
                            {getFieldDecorator('mainSupplierOptions', {
                                initialValue: mainSupplierOptions.defaultValue
                            })(
                                <Select
                                    style={{ width: 90 }}
                                    className="sc-form-item-select"
                                    size="default"
                                    disabled={this.state.supplierType === '-1'}
                                >
                                    {
                                        mainSupplierOptions.data.map((item) =>
                                            (<Option key={item.key} value={item.key}>
                                                {item.value}
                                            </Option>)
                                        )
                                    }
                                </Select>
                                )}
                        </FormItem>
                        <FormItem>
                            <Button
                                type="primary"
                                onClick={this.handleGetValue}
                                size="default"
                            >
                                搜索
                            </Button>
                        </FormItem>
                        <FormItem>
                            <Button
                                size="default"
                                onClick={this.props.handleAdd}
                            >
                                创建
                            </Button>
                        </FormItem>
                        <FormItem>
                            <Button size="default" onClick={this.handleResetValue}>
                                重置
                            </Button>
                        </FormItem>
                    </Row>
                </Form>
            </div>
        )
    }
}

SearchForm.propTypes = {
    pubFetchValueList: PropTypes.objectOf(PropTypes.any),
    handleAdd: PropTypes.func,
    prefixCls: PropTypes.string,
    form: PropTypes.objectOf(PropTypes.any),
    data: PropTypes.objectOf(PropTypes.any),
    receiveData: PropTypes.objectOf(PropTypes.any),
    onSearch: PropTypes.func,
    onReset: PropTypes.func,
}

SearchForm.defaultProps = {
    user: {
        name: 'Who?'
    },
    prefixCls: 'select-line',
    onSearch: () => { },
    onReset: () => { },
}

export default Form.create()(withRouter(SearchForm));
