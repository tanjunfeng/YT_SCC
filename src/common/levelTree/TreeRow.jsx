/**
 * @file TreeRow.jsx
 * @author denglingbo
 *
 * 每一行的dom 渲染
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select, Menu, Dropdown, Button, Icon } from 'antd';
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
        if (this.props.index !== nextProps.index) {
            this.setState({
                value: this.sort(nextProps.index + 1),
            });
        }
    }

    /**
     * 处理排序序号
     * @param value
     * @return {number}
     */
    sort(value) {
        let v = value == null ? this.props.index + 1 : value;

        return Utils.trim(v);
    }

    /**
     * 通知父组件修改排序
     * @param event
     */
    changeSort(event) {
        const { value } = this.state;

        if (value === '') {
            this.setState({
                value: this.sort(),
            });

            return;
        }

        if (value === this.sort()) {
            return;
        }

        this.props.handleChangeSort(event);
    }

    /**
     * 修改 row 的显示状态
     */
    changeStatus(value, option) {
        this.props.handleChangeStatus(value, option);
    }

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
        let value = parseInt(event.target.value);

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
                        disabled={!item.status}
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
                                {item.status
                                    ? <Menu.Item mkey={item.key} key="0">隐藏</Menu.Item>
                                    : <Menu.Item mkey={item.key} key="1">显示</Menu.Item>
                                }
                            </Menu>
                        )}
                    >
                        <Button
                            className="tree-row-dropmenu"
                        >
                            {item.status ? '显示' : '隐藏'} <Icon type="down" />
                        </Button>
                    </Dropdown>
                </span>
            </div>
        );
    }
}

TreeRow.propTypes = {
    index: PropTypes.number,
    handleChangeStatus: PropTypes.func,
    handleChangeSort: PropTypes.func,
    item: PropTypes.objectOf(PropTypes.any),
    max: PropTypes.number,
}

export default TreeRow;
