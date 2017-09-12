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
            displayValue: '',
            options: [],
            isLoading: false
        };
        this.onChange = this.onChange.bind(this);
        this.loadData = this.loadData.bind(this);
        this.appendOption = this.appendOption.bind(this);
    }

    componentDidMount() {
        this.props.getCategoriesByParentId({ parentId: '' }).then((res) => {
            this.setState({
                options: res.data.map((treeNode, index) => ({
                    key: index,
                    label: treeNode.categoryName,
                    value: treeNode.id,
                    isLeaf: false
                }))
            });
        });
    }

    onChange = (value, selectedOptions) => {
        this.setState({
            displayValue: selectedOptions.map(o => o.label).join(', '),
        });
        this.props.onCategorySelect(value, this.state.displayValue);
    }

    loadData = (selectedOptions) => {
        const target = selectedOptions[selectedOptions.length - 1];
        this.setState({
            isLoading: target.loading = true
        });
        const id = target.value;
        this.props.getCategoriesByParentId({ parentId: id }).then(res => {
            target.children = [{
                key: `${id}-all`,
                label: '全部',
                value: '',
                isLeaf: true
            }];
            res.data.forEach((treeNode, index) => {
                target.children.push({
                    key: `${id}-${index}`,
                    label: treeNode.categoryName,
                    value: treeNode.id,
                    isLeaf: treeNode.level === 4
                })
            });
            this.appendOption(target.children, id);
            this.setState({
                isLoading: target.loading = false
            });
        });
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
