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
    constructor(props) {
        super(props);
        this.state = {
            checkedKeys: []
        }
        this.handleCheck = this.handleCheck.bind(this);
    }

    // 当父容器需要清空选择框时，通知本组件
    componentWillReceiveProps(nextProps) {
        if (nextProps.isEmpty) {
            this.setState({
                checkedKeys: []
            });
        }
    }

    handleCheck(checkedKeys) {
        this.setState({
            checkedKeys
        });
        this.props.onCheckTreeOk(checkedKeys);
    }

    render() {
        return (
            <Tree
                checkable
                checkedKeys={this.state.checkedKeys}
                onCheck={this.handleCheck}
            >
                {getCompaniesTree(this.props.list)}
            </Tree>
        );
    }
}

CheckedTree.propTypes = {
    onCheckTreeOk: PropTypes.func,
    isEmpty: PropTypes.bool,
    list: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
}

export default withRouter(Form.create()(CheckedTree));
