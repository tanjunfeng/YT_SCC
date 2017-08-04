/**
 * @file TreeRow.jsx
 * @author denglingbo
 *
 * 每一行的dom 渲染
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Button, Icon } from 'antd';
import Utils from '../../util/util';

class TreeRow extends PureComponent {
    constructor(props) {
        super(props);

        this.handleKeyUp = ::this.handleKeyUp;
        this.handleChange = ::this.handleChange;
        this.changeSort = ::this.changeSort;
        this.changeStatus = ::this.changeStatus;

        // 此处通过索引进行排序展示
        this.state = {
            value: this.sort(),
        };
    }

    /**
     * 该组件必须可控，value 只能通过 state 重新驱动 render
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        if (this.props.sort !== nextProps.sort) {
            this.setState({
                value: this.sort(nextProps.sort),
            });
        }
    }

    /**
     * 处理排序序号
     * @param value
     * @return {number|string}
     */
    sort(value) {
        const { sort, max } = this.props;
        let v = value == null ? sort : value;

        if (value == null && sort === null) {
            return '';
        }

        // 本身未排序的处理方式，可输入有效数据的最大值 + 1
        if (sort === null && v > max + 1) {
            v = max + 1;
        }

        // 有排序数据的，进行输入只能输入有效数据的最大值
        if (sort !== null && v > max) {
            v = max;
        }

        return Utils.trim(v);
    }

    /**
     * 通知父组件修改排序
     * @param event
     */
    changeSort(event) {
        const { value } = this.state;
        const sort = this.sort();

        if (value === '') {
            this.setState({
                value: sort,
            });
            return;
        }

        if (value === sort) {
            return;
        }

        this.props.handleChangeSort(event);

        // 这里在输入确认之后根据 componentWillReceiveProps 的操作重新赋值给输入框
        // 避免外部请求错误之后造成的输入框内容不刷新
        if (event.currentTarget.value !== sort) {
            this.setState({
                value: sort
            })
        }
    }

    /**
     * 修改 row 的显示状态
     */
    changeStatus(value, option) {
        this.props.handleChangeStatus(value, option);
    }

    /**
     * 按回车进行排序
     * @param event
     */
    handleKeyUp(event) {
        if (event.keyCode === 13) {
            this.changeSort(event);
        }
    }

    /**
     * 修改输入框值
     * @param event
     */
    handleChange(event) {
        let value = parseInt(event.target.value, 10);

        if (isNaN(value)) {
            value = '';
        }

        this.setState({
            value: this.sort(value)
        });
    }

    render() {
        const { item } = this.props;

        return (
            <div
                ref={ref => { this.treeRow = ref }}
            >
                <span>{item.name}</span>
                <span className="absolute-right">
                    <input
                        style={{ marginLeft: 15, textAlign: 'center' }}
                        className="input-middle"
                        disabled={item.status === 1}
                        data-key={item.key}
                        data-parentKey={item.parentKey}
                        data-sort={this.sort()}
                        onKeyUp={this.handleKeyUp}
                        onBlur={this.changeSort}
                        onChange={this.handleChange}
                        value={this.state.value}
                    />
                    <Dropdown
                        trigger={['click']}
                        getPopupContainer={() => this.treeRow}
                        overlay={(
                            <Menu onClick={this.changeStatus}>
                                {item.status === 0
                                    ? <Menu.Item mkey={item.key} key="1">隐藏</Menu.Item>
                                    : <Menu.Item mkey={item.key} key="0">显示</Menu.Item>
                                }
                            </Menu>
                        )}
                    >
                        <Button
                            className="tree-row-dropmenu"
                        >
                            {item.status === 0 ? '显示' : '隐藏'} <Icon type="down" />
                        </Button>
                    </Dropdown>
                </span>
            </div>
        );
    }
}

TreeRow.propTypes = {
    sort: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    handleChangeStatus: PropTypes.func,
    handleChangeSort: PropTypes.func,
    item: PropTypes.objectOf(PropTypes.any),
    max: PropTypes.number,
}

export default TreeRow;
