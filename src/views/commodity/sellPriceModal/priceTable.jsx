/**
 * @author taoqiyu
 *
 * 价格区间选择组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table, Popconfirm, Button } from 'antd';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { bindActionCreators } from 'redux';
import cs from 'classnames';

import {
    getCostPrice
} from '../../../actions/commodity';
import EditableCell from './editableCell';
import { stepPriceColumns as columns } from './columns';

function getNewData(props, mark) {
    const { isReadOnly, currentPrices, list, isEdit, shouldMark } = props.value;
    if (shouldMark && isReadOnly && isEdit) {
        currentPrices.forEach((currentRecord, index) => {
            const { startNumber, endNumber, price } = currentRecord;
            const record = list[index];
            mark.push({
                startNumber: startNumber !== record.startNumber,
                endNumber: endNumber !== record.endNumber,
                price: price !== record.price
            });
        })
    }
    return Immutable.fromJS(list).toJS();
}

@connect(
    state => ({
        costPrice: state.toJS().commodity.costPrice
    }),
    dispatch => bindActionCreators({
        getCostPrice
    }, dispatch)
)

class PriceTable extends PureComponent {
    constructor(props) {
        super(props);
        this.mark = [];
        const newData = getNewData(props, this.mark);
        this.state = {
            prices: newData,
            canAdd: true // 是否可继续添加价格
        }
        this.cacheData = newData.map(item => ({ ...item }));
        this.notify(newData);
    }

    componentWillMount() {
        columns[0].render = (text, record, index) => this.renderColumnsNum(text, record, index, 'startNumber')
        columns[1].render = (text, record, index) => this.renderColumnsNum(text, record, index, 'endNumber')
        columns[2].render = (text, record, index) => this.renderColumnsPrice(text, record, index, 'price')
        columns[3].render = (text, record, index) => this.renderGrossProfit(text, record, index)
        columns[4].render = (text, record, index) => this.renderOptions(text, record, index)
    }

    componentWillReceiveProps(nextProps) {
        // 当用户手工修改 startNumber 时，更新 prices 第一条记录并通知父组件更新
        const { startNumber } = nextProps.value;
        const { prices } = this.state;
        if (prices.length > 0 && this.props.value.startNumber !== startNumber) {
            prices[0].startNumber = startNumber === undefined ? 0 : startNumber;
            this.notify(prices);
        }
    }

    /**
     * 只读表格去除操作列，可编辑表格显示操作列
     */
    getColumns = () => {
        const { isReadOnly } = this.props.value;
        return isReadOnly
            ? columns.filter((c, index) => index < 4)
            : columns
    }

    edit = (id) => {
        const prices = [...this.state.prices];
        const target = prices.filter(item => id === item.id)[0];
        if (target) {
            target.editable = true;
            // 为空时截取掉减号
            if (this.isTextInvalid(target.price)) {
                target.price = '';
            }
            if (this.isTextInvalid(target.startNumber)) {
                target.startNumber = '';
            }
            if (this.isTextInvalid(target.endNumber)) {
                target.endNumber = '';
            }
            this.checkAddable(prices);
        }
    }

    /**
     * 校验字段是否存在有效值
     */
    isTextInvalid = text => (text === '-' || !text || isNaN(text))

    /**
     * 起始数量比终止数量还大
     * 价格为 -
     */
    isPriceInvalid = record => {
        if (!record) return false;
        const { startNumber, endNumber, price } = record;
        if (startNumber >= endNumber) {
            return true;
        }
        if (this.isTextInvalid(startNumber)) {
            return true;
        }
        if (this.isTextInvalid(endNumber)) {
            return true;
        }
        if (this.isTextInvalid(price)) {
            return true;
        }
        return false;
    }

    /**
     * 价格区间是否连续
     *
     * 如果最后一条价格的起始数量大于等于终止数量，则价格区间一定不连续
     * 本条的起始数量不是上一条的终止数量的后继，则不连续，起始数量大于等于种植数量也不连续
     */
    isContinue = (prices) => {
        const len = prices.length;
        const lastPrice = prices[len - 1];
        if (this.isPriceInvalid(lastPrice)) {
            return false;
        }
        for (let i = 0; i < len - 1; i++) {
            const price = prices[i];
            const nextPrice = prices[i + 1];
            if (price.endNumber !== nextPrice.startNumber - 1) {
                return false;
            }
            if (this.isPriceInvalid(price)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 校验是否能继续添加价格
     */
    checkAddable = prices => {
        const { value } = this.props;
        const { MAXGOODS } = value;
        const lastPrice = prices[prices.length - 1] || null;
        if (lastPrice !== null && lastPrice.endNumber < MAXGOODS - 1) {
            this.setState({
                canAdd: true, prices
            });
        } else {
            this.setState({
                canAdd: false, prices
            });
        }
    }

    notify = (prices) => {
        const { onChange } = this.props;
        if (typeof onChange === 'function') {
            onChange(prices, this.isContinue(prices));
        }
    }

    formatInteger = number => {
        const n = Number(number);
        if (isNaN(n)) {
            return '-';
        }
        return Math.ceil(n);
    }

    formatPrice = price => {
        const p = Number(price);
        if (isNaN(p)) {
            return '-';
        }
        return p.toFixed(2);
    }

    /**
     * 格式化数据
     */
    formatData = (record) => {
        const { startNumber, endNumber, price = NaN } = record;
        Object.assign(record, {
            startNumber: this.formatInteger(startNumber),
            endNumber: this.formatInteger(endNumber),
            price: this.formatPrice(price)
        })
    }

    save = (id) => {
        const prices = [...this.state.prices];
        const target = prices.filter(item => id === item.id)[0];
        if (target) {
            delete target.editable;
            this.formatData(target); // 保存时，数据格式化
            this.checkAddable(prices);
            this.cacheData = prices.map(item => ({ ...item }));
            this.notify(prices);
        }
    }

    cancel = (id) => {
        const prices = [...this.state.prices];
        const target = prices.filter(item => id === item.id)[0];
        if (target) {
            Object.assign(target, this.cacheData.filter(item => id === item.id)[0]);
            delete target.editable;
            this.checkAddable(prices);
        }
    }

    delete = (id) => {
        const prices = [...this.state.prices];
        const index = prices.findIndex(item => id === item.id);
        if (index > 0) {
            prices.splice(index, 1);
            this.cacheData = prices.map(item => ({ ...item }));
            this.checkAddable(prices);
            this.notify(prices);
        }
    }

    handleChange = (value, id, column) => {
        const prices = [...this.state.prices];
        const target = prices.filter(item => id === item.id)[0];
        if (target) {
            target[column] = value;
            this.checkAddable(prices);
        }
    }

    handleAdd = () => {
        const prices = [...this.state.prices];
        if (prices.length > 0) {
            // 取出最后一个字段的起步价
            const { endNumber, price, rate } = prices[prices.length - 1];
            prices.push({
                id: String(new Date().getTime()),
                startNumber: endNumber + 1,
                endNumber: endNumber + 2,
                price,
                rate
            });
        } else {
            const { startNumber = 1, price = '-', rate } = this.props.value;
            prices.push({
                id: String(new Date().getTime()),
                startNumber,
                endNumber: startNumber + 1,
                price,
                rate
            });
        }
        this.checkAddable(prices);
        this.notify(prices);
    }

    isMarkable = (index, column) => {
        if (this.mark.length === 0) return false;
        return this.mark[index][column];
    }

    renderColumnsNum = (text = '', record, index, column) => {
        let editable = record.editable;
        if (column === 'startNumber' && index === 0) {
            editable = false;
        }
        return (
            <EditableCell
                editable={editable}
                value={String(text)}
                mark={this.isMarkable(index, column)}
                onChange={value => this.handleChange(value, record.id, column)}
            />);
    }

    renderColumnsPrice = (text = '', record, index, column) => (
        <EditableCell
            editable={record.editable}
            value={String(text)}
            type="price"
            mark={this.isMarkable(index, column)}
            onChange={value => this.handleChange(value, record.id, column)}
        />
    );

    renderOptions = (text, record, index) => {
        const { editable } = record;
        return (
            <div className="editable-row-operations">
                {
                    editable ?
                        <span>
                            <a onClick={() => this.save(record.id)}>保存</a>
                            &nbsp;
                            <Popconfirm
                                title="确定不保存?"
                                onConfirm={() => this.cancel(record.id)}
                            >
                                <a>取消</a>
                            </Popconfirm>
                        </span>
                        :
                        <span>
                            <a onClick={() => this.edit(record.id)}>编辑</a>
                            &nbsp;
                            {index > 0 ? <Popconfirm
                                title="确定删除?"
                                onConfirm={() => this.delete(record.id)}
                            >
                                <a>删除</a>
                            </Popconfirm> : null}
                        </span>
                }
            </div>
        );
    }

    /**
     * 获取毛利率
     */
    renderGrossProfit = (text, record, index) => {
        const { isEdit, grossProfit, shouldMark } = this.props.value;
        const { price } = record;
        const costPrice = isEdit ? grossProfit : this.props.costPrice;
        if (costPrice === null || isNaN(costPrice)) {
            return (<span>-</span>);
        }
        const rate = (price - costPrice) * 100 / costPrice;
        const mark = this.isMarkable(index, 'price') && shouldMark;
        return (<span className={mark ? "red" : null}>{`${rate.toFixed(2)}%`}</span>);
    }

    render() {
        const { prices, canAdd } = this.state;
        const { isReadOnly } = this.props.value;
        return (
            <div>
                {
                    !isReadOnly ?
                        <Button
                            onClick={this.handleAdd}
                            disabled={!canAdd}
                        >添加阶梯价格</Button>
                        : null
                }
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={prices}
                    pagination={false}
                />
            </div>
        )
    }
}

PriceTable.propTypes = {
    value: PropTypes.objectOf(PropTypes.any),
    onChange: PropTypes.func,
    isReadOnly: PropTypes.bool,
    costPrice: PropTypes.number
};

export default PriceTable;
