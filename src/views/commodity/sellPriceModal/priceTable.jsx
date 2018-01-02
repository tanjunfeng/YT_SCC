/**
 * @author taoqiyu
 *
 * 价格区间选择组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table, Popconfirm, Button } from 'antd';

import EditableCell from './editableCell';
import { stepPriceColumns as columns } from './columns';

class PriceTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            prices: props.value.list
        }
        this.cacheData = props.value.list.map(item => ({ ...item }));
        columns[0].render = (text, record, index) => this.renderColumnsNum(text, record, 'startNumber', index)
        columns[1].render = (text, record) => this.renderColumnsNum(text, record, 'endNumber')
        columns[2].render = (text, record) => this.renderColumnsPrice(text, record, 'price')
        columns[3].render = () => '20%'
        columns[4].render = (text, record, index) => this.renderOptions(text, record, index)
    }

    componentWillReceiveProps(nextProps) {
        // 当用户手工修改 startNumber 时，更新 prices 第一条记录并通知父组件更新
        const { startNumber } = nextProps.value;
        const { prices } = this.state;
        if (prices.length > 0) {
            prices[0].startNumber = startNumber;
        }
        this.setState({ prices });
        this.notify(prices);
    }

    /**
     * 只读表格去除操作列，可编辑表格显示操作列
     */
    getColumns = () => {
        const { readOnly } = this.props.value;
        return readOnly
            ? columns.filter((c, index) => index < 4)
            : columns
    }

    edit = (id) => {
        const prices = [...this.state.prices];
        const target = prices.filter(item => id === item.id)[0];
        if (target) {
            target.editable = true;
            this.setState({ prices });
        }
    }

    /**
     * 起始数量比终止数量还大
     */
    isPriceInvalid = price => (price.startNumber >= price.endNumber)

    /**
     * 价格区间是否连续
     *
     * 如果最后一条价格的起始数量大于等于终止数量，则价格区间一定不连续
     * 本条的起始数量不是上一条的终止数量的后继，则不连续，起始数量大于等于种植数量也不连续
     */
    isContinue = (prices) => {
        const len = prices.length;
        if (this.isPriceInvalid(prices[len - 1])) {
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

    notify = (prices) => {
        this.props.onChange(prices, this.isContinue(prices));
    }

    save = (id) => {
        const prices = [...this.state.prices];
        const target = prices.filter(item => id === item.id)[0];
        if (target) {
            delete target.editable;
            this.setState({ prices });
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
            this.setState({ prices });
        }
    }

    delete = (id) => {
        const prices = [...this.state.prices];
        const index = prices.findIndex(item => id === item.id);
        if (index > 0) {
            prices.splice(index, 1);
            this.cacheData = prices.map(item => ({ ...item }));
            this.setState({ prices });
            this.notify(prices);
        }
    }

    handleChange = (value, id, column) => {
        const prices = [...this.state.prices];
        const target = prices.filter(item => id === item.id)[0];
        if (target) {
            target[column] = value;
            this.setState({ prices });
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
            const { startNumber = 1, price = 100.00, rate } = this.props.value;
            prices.push({
                id: String(new Date().getTime()),
                startNumber,
                endNumber: startNumber + 1,
                price,
                rate
            });
        }
        this.setState({ prices });
        this.notify(prices);
    }

    renderColumnsNum = (text, record, column, index) => {
        let editable = record.editable;
        if (column === 'startNumber' && index === 0) {
            editable = false;
        }
        return (
            <EditableCell
                editable={editable}
                value={text}
                onChange={value => this.handleChange(value, record.id, column)}
            />);
    }

    renderColumnsPrice = (text = 0, record, column) => (
        <EditableCell
            editable={record.editable}
            value={text}
            type="price"
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

    render() {
        const { prices } = this.state;
        return (
            <div>
                <Button onClick={this.handleAdd}>添加阶梯价格</Button>
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
    onChange: PropTypes.func
};

export default PriceTable;
