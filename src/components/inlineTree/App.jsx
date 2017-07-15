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
        this.state = {
            expandedKeys: this.defaultOpen,
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: props.selects,
        }
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

    onCheck = (checkedKeys) => {
        this.setState({
            checkedKeys,
            selectedKeys: [],
        });
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
        const loop = data => data.map((item) => {
            if (item.regions) {
                return (
                    <TreeNode key={item.code} title={item.regionName}>
                        {loop(item.regions)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.code} title={item.regionName} />;
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
}

InlineTree.defaultProps = {
    defaultOpen: defaultData,
    selects: []
}

export default InlineTree;
