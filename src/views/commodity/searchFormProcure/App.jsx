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
import { message, Form, Col, Row, Select, Button, Icon } from 'antd';
import Utils from '../../../util/util';
import SearchMind from '../../../components/searchMind';
import {
    fetchAction,
    receiveData,
    fetchTest,
} from '../../../actions/classifiedList';
import {
    fetchGetProductById
} from '../../../actions';
import {
    initiateModeOptions,
    mainSupplierOptions,
} from '../../../constant/searchParams';

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

        this.handleDrop = ::this.handleDrop;
        this.handleChangeSort = ::this.handleChangeSort;
        this.handleChangeStatus = ::this.handleChangeStatus;
        this.handleResetValue = ::this.handleResetValue;
        this.handleGetValue = ::this.handleGetValue;

        // Test
        this.handleSave = ::this.handleSave;
        this.state = {
            img: null,
            chooseMe: {},
            disabled: false,
            supplyChoose: null,
        }
    }

    componentWillMount() {}

    componentDidMount() {
        this.props.fetchAction();

        setTimeout(() => {
            this.setState({
                disabled: true,
            });
        }, 2000);
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
            supplyChoose: record,
        });
    }

    /**
     * 子公司-值清单
     */
    handleCompChoose = ({ record }) => {
        this.setState({
            supplyChoose: record,
        });
    }

    /**
     * 搜索
     */
    handleGetValue() {
        this.props.fetchGetProductById({
            productId: 1001
        });
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
        this.addressSearchMind.handleClear();
        this.supplySearchMind.handleClear();
        this.supplyCompSearchMind.handleClear();
        this.props.form.resetFields();
    }

    /**
     * TEST
     */
    handleSave(event) {
        this.setState({
            img: this.imageUploader.getImageByBase64(),
        })
    }

    handleTestFetch = ({ value, pagination }) => {
        console.log(value, pagination);

        return fetchTest({
            value,
        });
    }

    handleTestChoose = ({ record, compKey, index, event }) => {
        console.log(compKey, record)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { prefixCls } = this.props;
        return (
            <div className={`${prefixCls}-content manage-form`}>
                <div style={{fontSize: 16, fontWeight: 900}}>
                    <Icon type="desktop" className="css-appstore" />&nbsp;商品信息
                </div>
                <Form layout="inline" className={`${prefixCls}-content`}>
                    <Row type="flex" justify="start" className={`${prefixCls}-flex`}>
                        {/* 供应商 */}
                        <Col span={8}>
                            <FormItem className="">
                                <div>
                                    <span className="value-list-input">
                                        <SearchMind
                                            compKey="search-mind-supply"
                                            ref={ref => { this.supplySearchMind = ref }}
                                            fetch={(value, pager) =>
                                                this.handleTestFetch(value, pager)
                                            }
                                            addonBefore="供应商"
                                            onChoosed={this.handleSupplyChoose}
                                            onClear={this.handleSupplyClear}
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
                                </div>
                            </FormItem>
                        </Col>
                        {/* 地点 */}
                        <Col span={8}>
                            <FormItem className="">
                                <div>
                                    <span className="value-list-input">
                                        <SearchMind
                                            compKey="search-mind-supply"
                                            ref={ref => { this.addressSearchMind = ref }}
                                            fetch={(value, pager) =>
                                                this.handleTestFetch(value, pager)
                                            }
                                            addonBefore="地点"
                                            onChoosed={this.handleAdressChoose}
                                            onClear={this.handleSupplyClear}
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
                                </div>
                            </FormItem>
                        </Col>
                        {/* 子公司 */}
                        <Col span={8}>
                            <FormItem className="">
                                <div>
                                    <span className="value-list-input">
                                        <SearchMind
                                            compKey="search-mind-supply"
                                            ref={ref => { this.supplyCompSearchMind = ref }}
                                            fetch={(value, pager) =>
                                                this.handleTestFetch(value, pager)
                                            }
                                            addonBefore="子公司"
                                            onChoosed={this.handleCompChoose}
                                            onClear={this.handleSupplyClear}
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
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
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
                        <span className={`${prefixCls}-select`}>供应商</span>
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
                    <div className="sc-form-button-group">
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
                                type="primary"
                                size="default"
                                onClick={this.handleAddValue}
                            >
                                创建
                            </Button>
                        </FormItem>
                        <FormItem>
                            <Button size="default" onClick={this.handleResetValue}>
                                重置
                            </Button>
                        </FormItem>
                    </div>
                </Form>
            </div>
        )
    }
}

SearchForm.propTypes = {
    fetchGetProductById: PropTypes.objectOf(PropTypes.any),
    fetchAction: PropTypes.objectOf(PropTypes.any),
    prefixCls: PropTypes.string,
    user: PropTypes.objectOf(PropTypes.string),
    form: PropTypes.objectOf(PropTypes.any),
}

SearchForm.defaultProps = {
    user: {
        name: 'Who?'
    },
    prefixCls: 'select-line',
}

export default Form.create()(SearchForm);
