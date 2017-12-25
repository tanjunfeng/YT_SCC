/**
 * @file App.jsx
 * @author shijh
 *
 * 在售商品列表
 */

import { fromJS } from 'immutable';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message, Form, Select, Button, Icon, Row, Col } from 'antd';
import Utils from '../../../util/util';
import { BranchCompany } from '../../../container/search';
import { fetchAction, receiveData } from '../../../actions/classifiedList';
import { fetchGetProductById } from '../../../actions';
import { initiateModeOptions, latestPriceStateOption } from '../../../constant/searchParams';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        user: state.toJS().user.data,
        rights: state.toJS().user.rights,
        data: state.toJS().commodity.classifiedList,
    }),
    dispatch => bindActionCreators({
        fetchAction,
        receiveData,
        fetchGetProductById
    }, dispatch)
)
class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: null,
            chooseMe: {},
        }
        this.chooseInitiate = null;
        this.chooseLatest = null;
    }

    componentDidMount() {
        this.props.fetchAction();
    }

    /**
     * 搜索
     */
    handleGetValue = () => {
        this.props.onSearch(Utils.removeInvalid({
            branchCompanyName: this.props.form.getFieldValue('branchCompany').name,
            status: this.chooseInitiate,
            state: this.chooseLatest
        }))
    }

    /**
     * 通过输入框排序
     * @param event
     */
    handleChangeSort = (event) => {
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
    handleChangeStatus = (value, mkey) => {
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
    handleDrop = (info) => {
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
    sortData = (parentKey, fromIndex, toIndex) => {
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
    handleResetValue = () => {
        this.props.form.resetFields();
        this.name = null;
        this.chooseInitiate = null;
        this.chooseLatest = null;
        this.props.onReset();
        // 点击重置时清除 seachMind 引用文本
        this.props.form.setFieldsValue({
            branchCompany: { reset: true }
        });
    }

    handleInitiateOptionsChange = (item) => {
        this.chooseInitiate = item === '-1' ? null : item;
    }

    handleLatestPriceChange = (item) => {
        this.chooseLatest = item === '-1' ? null : item;
    }

    handleAddValue = () => {
        this.props.handleAdd();
    }

    handlePriceImport = () => {
        window.open(`/orderList/orderDetails/${this.props.value}`)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { prefixCls } = this.props;
        return (
            <div className={`${prefixCls}-content manage-form`}>
                <div style={{ fontSize: 16, fontWeight: 900 }}>
                    <Icon type="desktop" className="css-appstore" />&nbsp;商品信息
                </div>
                <Form layout="inline" className={`${prefixCls}`}>
                    <Row>
                        <FormItem label="子公司">
                            {getFieldDecorator('branchCompany', {
                                initialValue: { id: '', name: '' }
                            })(<BranchCompany />)}
                        </FormItem>
                        {/* 是否启用 */}
                        <FormItem label="启用">
                            {getFieldDecorator('initiateModeOptions', {
                                initialValue: '-1'
                            })(
                                <Select
                                    size="default"
                                    style={{width: 70}}
                                    onChange={this.handleInitiateOptionsChange}
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
                        {/* 是否启用 */}
                        <FormItem label="最新售价状态：">
                            {getFieldDecorator('LatestPriceOptions', {
                                initialValue: '-1'
                            })(
                                <Select
                                    size="default"
                                    style={{width: 70}}
                                    onChange={this.handleLatestPriceChange}
                                >
                                    {
                                        latestPriceStateOption.data.map((item) =>
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
                            <Button size="default" onClick={this.handleResetValue}>
                                重置
                            </Button>
                        </FormItem>
                        <FormItem>
                            <Button
                                type="primary"
                                size="default"
                                onClick={this.handleAddValue}
                            >
                                创建
                            </Button>
                        </FormItem>
                        <FormItem>
                            <a onClick={this.handlePriceImport}>售价批量导入</a>
                        </FormItem>
                    </Row>
                </Form>
            </div>
        )
    }
}

SearchForm.propTypes = {
    data: PropTypes.objectOf(PropTypes.any),
    receiveData: PropTypes.objectOf(PropTypes.any),
    fetchAction: PropTypes.objectOf(PropTypes.any),
    prefixCls: PropTypes.string,
    form: PropTypes.objectOf(PropTypes.any),
    onSearch: PropTypes.func,
    onReset: PropTypes.func,
    handleAdd: PropTypes.func,
}

SearchForm.defaultProps = {
    user: {
        name: 'Who?'
    },
    prefixCls: 'select-line-sales',
    onSearch: () => { },
    onReset: () => { },
    handleAdd: () => { },
}

export default Form.create()(SearchForm);
