/**
 * 级联查询品类
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Cascader } from 'antd';
import { getCategoriesByParentId } from '../../actions/promotion';

@connect(state => ({
    categories: state.toJS().promotion.categories
}), dispatch => bindActionCreators({
    getCategoriesByParentId
}, dispatch))

class Category extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            category: {},
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

    /**
     * 处理级联菜单点击事件
     *
     * @param {*当前label} value
     * @param {*选中的对象} selectedOptions
     * http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/promotion/insertPromotion
     */
    onChange(value, selectedOptions) {
        const target = selectedOptions[selectedOptions.length - 1];
        // 当用户选择全部子节点时，使用 parent 对象数据回传
        if (target.value === 'all') {
            Object.assign(target, {}, target.parent);
        }
        const category = {
            categoryId: target.value,
            categoryName: target.label,
            categoryLevel: target.level
        };
        this.setState({ category });
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

    appendObject(res, target) {
        const id = target.value;
        const arr = [{
            key: `${id}-all`,
            label: '全部',
            value: 'all',
            isLeaf: true,
            parent: target  // 当选择全部子节点的时候，保存完整父节点字段待用
        }];
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

    appendOption(children, id) {
        const dist = this.state.options;
        dist.forEach((obj, index) => {
            if (obj.value === id) {
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
                changeOnSelect
            />
        );
    }
}

Category.propTypes = {
    getCategoriesByParentId: PropTypes.func,
    onCategorySelect: PropTypes.func
}

export default withRouter(Form.create()(Category));
