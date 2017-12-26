/**
 * @file App.jsx
 * @author shijh
 *
 * 价格区间选择组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table, Popconfirm } from 'antd';

import EditableCell from './editableCell';

class EditableTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            prices: props.value.data
        }
        this.cacheData = props.value.data.map(item => ({ ...item }));
        this.columns = [{
            dataIndex: 'startNumber',
            title: '起始数量',
            render: (text, record) => this.renderColumnsNum(text, record, 'startNumber')
        }, {
            dataIndex: 'endNumber',
            title: '终止数量',
            render: (text, record) => this.renderColumnsNum(text, record, 'endNumber')
        }, {
            dataIndex: 'price',
            title: '最新售价/元',
            render: (text, record) => this.renderColumnsPrice(text, record, 'price')
        }, {
            dataIndex: 'operation',
            title: '操作',
            render: (text, record) => this.renderOptions(text, record)
        }];
    }

    /**
     * 只读表格去除操作列，可编辑表格显示操作列
     */
    getColumns = () => {
        const { readOnly } = this.props.value;
        return readOnly
            ? this.columns.filter((c, index) => index < 3)
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

    handleChange = (value, id, column) => {
        const newData = [...this.state.prices];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
            target[column] = value;
            this.setState({ prices: newData });
        }
    }

    renderColumnsNum = (text, record, column) => (
        <EditableCell
            editable={record.editable}
            value={Math.floor(text)}
            onChange={value => this.handleChange(value, record.id, column)}
        />
    );

    renderColumnsPrice = (text = 0, record, column) => (
        <EditableCell
            editable={record.editable}
            value={+(text).toFixed(2)}
            onChange={value => this.handleChange(value, record.id, column)}
        />
    );

    renderOptions = (text, record) => {
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
                        : <a onClick={() => this.edit(record.id)}>编辑</a>
                }
            </div>
        );
    }

    render() {
        const { prices } = this.state;
        return (
            <Table
                rowKey="id"
                columns={this.getColumns()}
                dataSource={prices}
                pagination={false}
            />
        )
    }
}

EditableTable.propTypes = {
    value: PropTypes.objectOf(PropTypes.any)
};

export default EditableTable;
