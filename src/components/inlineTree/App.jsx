import React, { PureComponent } from 'react';
import { Tree } from 'antd';
import PropTypes from 'prop-types';
import addEventListenerWrap from 'rc-util/lib/Dom/addEventListener';
import contains from 'rc-util/lib/Dom/contains';

import Utils from '../../util/util';

const TreeNode = Tree.TreeNode;
const defaultData = ['11', '21', '31', '36', '44', '50', '61', '71'];

class InlineTree extends PureComponent {
    constructor(props) {
        super(props);
        this.defaultOpen = props.defaultOpen;
        this.getValue = ::this.getValue;
        this.state = {
            expandedKeys: this.defaultOpen,
            autoExpandParent: true,
            checkedKeys: props.checkedKeys,
            selectedKeys: props.selects,
        }
        this.checkedNodes = [];
    }

    componentDidMount() {
        const container = document.querySelector('#supplier-add-city')
        this.clickEvent = addEventListenerWrap(document.body, 'click', (e) => {
            if (!contains(container, e.target)) {
                this.setState({
                    expandedKeys: defaultData,
                    selectedKeys: []
                })
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        const { checkedKeys } = nextProps;
        if (
            checkedKeys.length > 0
            && checkedKeys.length !== this.props.checkedKeys
        ) {
            this.setState({
                checkedKeys
            })
        }
    }

    componentWillUnmount() {
        this.clickEvent.remove();
    }

    onExpand = (expandedKeys) => {
        const keys = expandedKeys;
        const diff = Utils.diff(expandedKeys, this.defaultOpen);
        if (diff.length > 1) {
            keys.splice(keys.length - 2, 1)
        }
        this.setState({
            expandedKeys: keys,
            autoExpandParent: false,
        });
    }

    onCheck = (checkedKeys, allData) => {
        this.checkedNodes = allData.checkedNodes;
        this.setState({
            checkedKeys,
            selectedKeys: [],
        }, () => {
            this.props.handleCheck(this.checkedNodes);
        });
    }

    getValue() {
        return this.checkedNodes;
    }

    onSelect = (selectedKeys) => {
        const keys = this.defaultOpen.concat(selectedKeys);
        this.setState({
            selectedKeys,
            expandedKeys: keys
        });
    }

    render() {
        const { initValue } = this.props;
        const loop = (data, parentCode, parentName) => data.map((item) => {
            let code = item.code;
            let hideTitle = item.regionName;
            if (parentCode && parentName) {
                code = `${parentCode}-${item.code}`;
                hideTitle = `${parentName}-${item.regionName}`;
            }
            if (item.regions) {
                return (
                    <TreeNode
                        key={code}
                        hideTitle={hideTitle}
                        title={item.regionName}
                    >
                        {loop(item.regions, code, hideTitle)}
                    </TreeNode>
                );
            }
            return (
                <TreeNode
                    key={code}
                    hideTitle={hideTitle}
                    title={item.regionName}
                />)
        });
        return (
            <Tree
                checkable
                className="space-choose-space"
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
                selectedKeys={this.state.selectedKeys}
                onSelect={this.onSelect}
            >
                {loop(initValue)}
            </Tree>
        );
    }
}

InlineTree.propTypes = {
    defaultOpen: PropTypes.arrayOf(PropTypes.any),
    selects: PropTypes.arrayOf(PropTypes.any),
    initValue: PropTypes.arrayOf(PropTypes.any),
    handleCheck: PropTypes.func,
    checkedKeys: PropTypes.arrayOf(PropTypes.any),
}

InlineTree.defaultProps = {
    defaultOpen: defaultData,
    selects: [],
    handleCheck: () => {},
    checkedKeys: []
}

export default InlineTree;
