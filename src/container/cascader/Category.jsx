/**
 * 级联查询品类
 *
 * 不支持修改
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Cascader } from 'antd';

import { getCategoriesByParentId, clearCategoriesList } from '../../actions/promotion';
import './Category.scss';

@connect(state => ({
    categories: state.toJS().promotion.categories
}), dispatch => bindActionCreators({
    getCategoriesByParentId,
    clearCategoriesList
}, dispatch))

class Category extends PureComponent {
    state = {
        options: [],
        isLoading: false
    };

    componentDidMount() {
        this.props.getCategoriesByParentId({ parentId: '' }).then((res) => {
            this.setState({
                options: res.data.map((treeNode, index) => ({
                    key: `root-${index}`,
                    label: treeNode.categoryName,
                    value: treeNode.id,
                    isLeaf: false,
                    level: treeNode.level
                }))
            });
        });
    }

    componentWillUnmount() {
        this.props.clearCategoriesList();
    }

    /**
     * 处理级联菜单点击事件
     *
     * @param {*当前label} value
     * @param {*选中的对象} selectedOptions
     * http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/promotion/insertPromotion
     */
    handleChange = (value, selectedOptions) => {
        console.log(value, selectedOptions);
        console.log(this.props.onChange)
        if (selectedOptions.length === 0) {
            this.props.onChange(null, selectedOptions);
        } else {
            const target = selectedOptions[selectedOptions.length - 1];
            const category = {
                categoryId: target.value,
                categoryName: target.label,
                categoryLevel: target.level
            };
            this.props.onChange(category, selectedOptions);
        }
    }

    handleLoadData = (selectedOptions) => {
        const target = selectedOptions[selectedOptions.length - 1];
        this.setState({
            isLoading: target.loading = true
        });
        this.props.getCategoriesByParentId({ parentId: target.value }).then(res => {
            target.children = this.appendObject(res, target);
            this.appendOption(target.children, target.value);
            this.setState({
                isLoading: target.loading = false
            });
        });
    }

    /**
     * 拼装 selectOption 对象
     *
     * @param {*请求数据} res
     * @param {*子节点地址} target
     */
    appendObject = (res, target) => {
        const id = target.value;
        const arr = [];
        res.data.forEach((treeNode, index) => {
            arr.push({
                key: `${id}-${index}`,
                label: treeNode.categoryName,
                value: treeNode.id,
                isLeaf: treeNode.level === 4,
                level: treeNode.level
            })
        });
        return arr;
    }

    /**
     * 拼装 Options 树
     *
     * @param {*子节点地址} children
     * @param {*父节点编号} parentId
     */
    appendOption = (children, parentId) => {
        const dist = this.state.options;
        dist.forEach((obj, index) => {
            if (obj.value === parentId) {
                Object.assign(dist[index], {
                    children
                });
            }
        });
        this.setState({
            options: dist
        });
    }

    render() {
        return (
            <Cascader
                disabled={this.props.disabled}
                options={this.state.options}
                loadData={this.handleLoadData}
                onChange={this.handleChange}
                placeholder={'请选择'}
                changeOnSelect
            />
        );
    }
}

Category.propTypes = {
    getCategoriesByParentId: PropTypes.func,
    clearCategoriesList: PropTypes.func,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
}

Category.defaultProps = {
    disabled: false
}

export default withRouter(Form.create()(Category));
