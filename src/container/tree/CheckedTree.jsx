/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 带复选框的树形结构
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Form, Tree } from 'antd';

const TreeNode = Tree.TreeNode;
/**
 * 拼接子公司列表
 *
 * @param {*子公司列表} companies
 */
const getCompaniesTree = (companies) => companies.map((item) => {
    if (item.children) {
        return (
            <TreeNode key={item.id} title={item.name} disableCheckbox={false}>
                {getCompaniesTree(item.children)}
            </TreeNode>
        );
    }
    return <TreeNode key={item.id} title={item.name} />;
});

class CheckedTree extends PureComponent {
    handleCheck = (checkedKeys) => {
        this.props.onCheckTreeOk(checkedKeys);
    }

    render() {
        return (
            <Tree
                checkable
                checkedKeys={this.props.checkedKeys}
                onCheck={this.handleCheck}
            >
                {getCompaniesTree(this.props.list)}
            </Tree>
        );
    }
}

CheckedTree.propTypes = {
    onCheckTreeOk: PropTypes.func,
    checkedKeys: PropTypes.arrayOf(PropTypes.string),
    list: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
}

export default withRouter(Form.create()(CheckedTree));
