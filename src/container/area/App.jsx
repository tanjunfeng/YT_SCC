/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 选择区域，一级树形结构
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Form, Tree } from 'antd';

const TreeNode = Tree.TreeNode;

const getNodeTree = (data) => data.map((item) => {
    if (item.children) {
        return (
            <TreeNode key={item.id} title={item.name} disableCheckbox={false}>
                {getNodeTree(item.children)}
            </TreeNode>
        );
    }
    return <TreeNode key={item.id} title={item.name} />;
});

class AreaTree extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checkedKeys: []
        }
        this.onCheck = this.onCheck.bind(this);
    }

    onCheck = (checkedKeys) => {
        this.setState({
            checkedKeys
        });
    }

    render() {
        return (
            <Tree
                checkable
                onCheck={this.onCheck}
                onSelect={this.onCheck}
                checkedKeys={this.state.checkedKeys}
            >
                {getNodeTree(this.props.companies)}
            </Tree>
        );
    }
}

AreaTree.propTypes = {
    companies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
}

export default withRouter(Form.create()(AreaTree));
