/**
 * @file App.jsx
 * @author denglingbo
 *
 * Tree Row
 */
import React, { PureComponent } from 'react';
import { fromJS } from 'immutable';
import PropTypes from 'prop-types';
import { Tree, Row, Col, Icon, Modal } from 'antd';
import TreeRow from './TreeRow';
// 调用重写 Antd Tree 函数，禁止拖拽不限制层级
import '../rewriteAntd/tree';
import { findKeys } from './util';
import Utils from '../../util/util';

const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;

/**
 * 获取有效的数据长度，用于 TreeRow 进行输入判定
 * @param data
 * @return {number}
 */
const getValidSize = (data) => {
    let len = 0;

    data.forEach(item => {
        if (item.sort !== null) {
            len++;
        }
    });

    return len;
}

/**
 * 循环输出 treeNode 节点
 *
 * @param data
 * @param handleChangeSort
 * @param handleChangeStatus
 * @return {null}
 */
const renderTreeNode = (data, handleChangeSort, handleChangeStatus) => {
    if (!data || data.length === 0) {
        return null;
    }

    return data.map((item, i) => {
        if (!item || item.key == null) {
            return null;
        }

        const children = item.children;

        // 这里由js 自己进行序号处理
        const sort = item.sort === null ? null : item.sort;

        const validSize = getValidSize(data);

        return (
            <TreeNode
                key={item.key}
                index={i}
                sort={sort}
                parentKey={item.parentKey}
                disabled={item.status === 1}
                title={
                    <TreeRow
                        sort={sort}
                        max={validSize}
                        handleChangeSort={handleChangeSort}
                        handleChangeStatus={handleChangeStatus}
                        item={item}
                    />
                }
            >
                {children && children.length
                    ? renderTreeNode(children, handleChangeSort, handleChangeStatus)
                    : null
                }
            </TreeNode>
        );
    })
}

/**
 * LevelTree 出口
 */
class LevelTree extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            expandedKeys: [],
            isAllExpanded: false,
            nextStautsData: {},
        };

        // 所有可展开的节点
        this.allExpandedKeys = [];
        // 顶层所有第一级节点
        this.topKeys = [];

        this.handleExpand = ::this.handleExpand;
        this.handleAllExpanded = ::this.handleAllExpanded;
        this.handleAllUnExpanded = ::this.handleAllUnExpanded;
        this.handleOk = ::this.handleOk;
        this.handleCancel = ::this.handleCancel;
        this.handleChangeStatus = ::this.handleChangeStatus;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            const keys = findKeys(nextProps.data);
            this.allExpandedKeys = keys.all;
            this.topKeys = keys.top;
        }
    }

    handleOk() {
        const nextData = this.state.nextStautsData;

        this.setState({
            visible: false
        }, () => {
            this.props.handleChangeStatus(nextData.value, nextData.mkey)
        });
    }

    handleCancel() {
        this.setState({
            visible: false,
            nextStautsData: {},
        });
    }

    /**
     * TreeRow 组件触发
     * @param event
     */
    handleChangeStatus(event) {
        const value = event.key;
        const mkey = event.item.props.mkey;

        this.setState({
            nextStautsData: {
                value,
                mkey,
            }
        });

        let msg = '';

        Utils.find(fromJS(this.props.data), mkey, ($finder, deep, $child, items) => {
            msg = ` ${items.join('-')}`;
        }, {
            deepItemKey: 'name'
        });

        confirm({
            title: '提示',
            content: `是否${value === '1' ? '隐藏' : '显示'}${msg}`,
            onOk: this.handleOk,
            onCancel: this.handleCancel,
        });
    }

    /**
     * 点击收拢合并图标
     * @param expandedKeys
     */
    handleExpand(expandedKeys) {
        // 这里判断下，当前展开的所有 keys 中是否还有顶级节点
        // 如果没有顶级节点了，则手动更新状态
        const hasTopOpened = this.topKeys.findIndex(key => (
            expandedKeys.indexOf(key) >= 0
        ));

        this.setState({
            expandedKeys,
            isAllExpanded: hasTopOpened !== -1
        });
    }

    /**
     * 全部展开
     */
    handleAllExpanded() {
        this.setState({
            expandedKeys: this.allExpandedKeys,
            isAllExpanded: true,
        });
    }

    /**
     * 全部收拢
     */
    handleAllUnExpanded() {
        this.setState({
            expandedKeys: [],
            isAllExpanded: false,
        });
    }

    render() {
        const { handleDrop, handleChangeSort, data } = this.props;
        const { expandedKeys, isAllExpanded } = this.state;

        if (!data || data.length === 0) {
            return null;
        }

        return (
            <div className="level-tree">
                <Row>
                    <Col className="tree-title" span={22}>
                        {!isAllExpanded ?
                            <Icon
                                type="plus-square-o"
                                onClick={this.handleAllExpanded}
                            /> :
                            <Icon
                                type="minus-square-o"
                                onClick={this.handleAllUnExpanded}
                            />
                        }
                        分类
                    </Col>
                    <Col className="tree-title" span={2}>排序/状态</Col>
                </Row>
                <Tree
                    draggable={false}
                    className="draggable-tree"
                    // onDrop={handleDrop}
                    expandedKeys={expandedKeys}
                    // 如果使用了 expandedKeys，这个设置为 false，否则子节点展开之后，点击父节点无法收拢了
                    // autoExpandParent={false}
                    onExpand={this.handleExpand}
                >
                    {renderTreeNode(
                        data,
                        handleChangeSort,
                        this.handleChangeStatus
                    )}
                </Tree>
            </div>
        );
    }
}

LevelTree.propTypes = {
    handleDrop: PropTypes.func,
    handleChangeStatus: PropTypes.func,
    handleChangeSort: PropTypes.func,
    data: PropTypes.arrayOf(PropTypes.any),
}

export default LevelTree;
