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
const getAreaTree = (data) => data.map((item) => {
    if (item.children) {
        return (
            <TreeNode key={item.id} title={item.name} disableCheckbox={false}>
                {getAreaTree(item.children)}
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
        this.onAreaCheck = this.onAreaCheck.bind(this);
    }

    onAreaCheck = (checkedKeys) => {
        this.setState({
            checkedKeys
        });
        this.props.onCheckCompanies(checkedKeys);
    }

    render() {
        return (
            <Tree
                checkable
                onCheck={this.onAreaCheck}
                checkedKeys={this.state.checkedKeys}
            >
                {getAreaTree(this.props.companies)}
            </Tree>
        );
    }
}

AreaTree.propTypes = {
    onCheckCompanies: PropTypes.func,
    companies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
}

export default withRouter(Form.create()(AreaTree));
