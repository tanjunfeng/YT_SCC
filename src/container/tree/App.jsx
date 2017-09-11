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
const getTree = (data) => data.map((item) => {
    if (item.children) {
        return (
            <TreeNode key={item.id} title={item.name} disableCheckbox={false}>
                {getTree(item.children)}
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

    componentWillMount() {
        this.setState({ checkedKeys: [] });
    }

    componentWillUnmount() {
        this.setState({
            checkedKeys: []
        });
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
                {getTree(this.props.list)}
            </Tree>
        );
    }
}

CheckedTree.propTypes = {
    onCheckTreeOk: PropTypes.func,
    list: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
}

export default withRouter(Form.create()(CheckedTree));
