/**
 * @file App.jsx
 * @author shijh
 *
 * 价格区间选择组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table, Popconfirm, Button } from 'antd';

import EditableCell from './editableCell';

class EditableTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            prices: props.value.list
        }
        this.cacheData = props.value.list.map(item => ({ ...item }));
        this.columns = [{
            dataIndex: 'startNumber',
            title: '起始数量',
            render: (text, record, index) => this.renderColumnsNum(text, record, 'startNumber', index)
        }, {
            dataIndex: 'endNumber',
            title: '终止数量',
            render: (text, record) => this.renderColumnsNum(text, record, 'endNumber')
        }, {
            dataIndex: 'price',
            title: '最新售价/元',
            render: (text, record) => this.renderColumnsPrice(text, record, 'price')
        }, {
            dataIndex: 'rate',
            title: '商品毛利率',
            render: () => '20%'
        }, {
            dataIndex: 'operation',
            title: '操作',
            render: (text, record, index) => this.renderOptions(text, record, index)
        }];
    }

    /**
     * 只读表格去除操作列，可编辑表格显示操作列
     */
    getColumns = () => {
        const { readOnly } = this.props.value;
        return readOnly
            ? this.columns.filter((c, index) => index < 4)
            : this.columns
    }

    edit = (id) => {
        const newData = [...this.state.prices];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
            target.editable = true;
            this.setState({ prices: newData });
        }
    }

    save = (id) => {
        const newData = [...this.state.prices];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
            delete target.editable;
            this.props.onChange(newData);
            this.setState({ prices: newData });
            this.cacheData = newData.map(item => ({ ...item }));
        }
    }

    cancel = (id) => {
        const newData = [...this.state.prices];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
            Object.assign(target, this.cacheData.filter(item => id === item.id)[0]);
            delete target.editable;
            this.setState({ prices: newData });
        }
    }

    delete = (id) => {
        const prices = [...this.state.prices];
        const index = prices.findIndex(item => id === item.id);
        if (index > 0) {
            prices.splice(index, 1);
            this.cacheData = prices.map(item => ({ ...item }));
            this.setState({ prices });
        }
    }

    handleChange = (value, id, column) => {
        const newData = [...this.state.prices];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
            target[column] = value;
            this.setState({ prices: newData });
        }
    }

    handleAdd = () => {
        const prices = [...this.state.prices];
        if (prices.length > 0) {
            // 取出最后一个字段的起步价
            const { endNumber, price, rate } = prices[prices.length - 1];
            prices.push({
                startNumber: endNumber + 1,
                endNumber: endNumber + 2,
                price,
                rate
            });
            this.setState({ prices });
        }
    }

    renderColumnsNum = (text, record, column, index = -1) => (
        <EditableCell
            editable={record.editable && index > 0}
            value={text}
            onChange={value => this.handleChange(value, record.id, column)}
        />
    );

    renderColumnsPrice = (text = 0, record, column) => (
        <EditableCell
            editable={record.editable}
            value={text}
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

EditableTable.propTypes = {
    value: PropTypes.objectOf(PropTypes.any),
    onChange: PropTypes.func
};

export default EditableTable;
