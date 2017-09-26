/**
 * 级联查询品类
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Cascader } from 'antd';
import { getCategoriesByParentId, clearCategoriesList } from '../../actions/promotion';

@connect(state => ({
    categories: state.toJS().promotion.categories
}), dispatch => bindActionCreators({
    getCategoriesByParentId,
    clearCategoriesList
}, dispatch))

class Category extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            isLoading: false
        };
        this.onChange = this.onChange.bind(this);
        this.loadData = this.loadData.bind(this);
        this.appendObject = this.appendObject.bind(this);
        this.appendOption = this.appendOption.bind(this);
    }

    componentDidMount() {
        this.props.getCategoriesByParentId({ parentId: '' }).then((res) => {
            this.setState({
                options: res.data.map((treeNode, index) => ({
                    key: index,
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
    onChange(value, selectedOptions) {
        const target = selectedOptions[selectedOptions.length - 1];
        const category = {
            categoryId: target.value,
            categoryName: target.label,
            categoryLevel: target.level
        };
        this.props.onCategorySelect(category);
    }

    loadData(selectedOptions) {
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
    appendObject(res, target) {
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
    appendOption(children, parentId) {
        const dist = this.state.options;
        dist.forEach((obj, index) => {
            if (obj.value === parentId) {
                dist[index].children = children
            }
        });
        this.setState({
            options: dist
        });
    }

    render() {
        return (
            <Cascader
                options={this.state.options}
                loadData={this.loadData}
                onChange={this.onChange}
                placeholder={'请选择'}
                changeOnSelect
            />
        );
    }
}

Category.propTypes = {
    getCategoriesByParentId: PropTypes.func,
    clearCategoriesList: PropTypes.func,
    onCategorySelect: PropTypes.func
}

export default withRouter(Form.create()(Category));
