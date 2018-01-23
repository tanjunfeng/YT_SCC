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

import { getRegionByCode } from '../../actions/pub';

@connect(state => ({
    region: state.toJS().pub.region
}), dispatch => bindActionCreators({
    getRegionByCode
}, dispatch))

class Address extends PureComponent {
    constructor(props) {
        super(props);
        this.getInitialData = this.getInitialData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleLoadData = this.handleLoadData.bind(this);
        this.appendObject = this.appendObject.bind(this);
        this.appendOption = this.appendOption.bind(this);
    }

    state = {
        value: '',
        options: [],
        isLoading: false
    };

    componentDidMount() {
        this.getInitialData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.reset && !this.props.reset) {
            this.setState({ value: '' }, () => {
                this.getInitialData();
            });
        }
    }

    getInitialData() {
        this.props.getRegionByCode({ code: 100000 }).then(res => {
            this.setState({
                options: res.data.map(treeNode => ({
                    key: String(treeNode.id),
                    label: treeNode.regionName,
                    value: treeNode.code,
                    isLeaf: false,
                    level: treeNode.regionType
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
    handleChange(value, selectedOptions) {
        this.setState({ value });
        if (selectedOptions.length === 0) {
            this.props.onChange(null, selectedOptions);
        } else {
            const target = selectedOptions[selectedOptions.length - 1];
            const address = {
                code: target.value,
                regionName: target.label,
                regionType: target.level
            };
            this.props.onChange(address, selectedOptions);
        }
    }

    handleLoadData(selectedOptions) {
        const target = selectedOptions[selectedOptions.length - 1];
        this.setState({
            isLoading: target.loading = true
        });
        this.props.getRegionByCode({ code: target.value }).then(res => {
            target.children = this.appendObject(res);
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
    appendObject(res) {
        const arr = [];
        res.data.forEach(treeNode => {
            arr.push({
                key: String(treeNode.id),
                label: treeNode.regionName,
                value: treeNode.code,
                isLeaf: +(treeNode.regionType) === 4,
                level: treeNode.regionType
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
        const { value } = this.state;
        return (
            <Cascader
                disabled={this.props.disabled}
                options={this.state.options}
                loadData={this.handleLoadData}
                onChange={this.handleChange}
                placeholder={'请选择'}
                value={value}
                changeOnSelect
            />
        );
    }
}

Address.propTypes = {
    getRegionByCode: PropTypes.func,
    disabled: PropTypes.bool,
    reset: PropTypes.bool,
    onChange: PropTypes.func
}

Address.defaultProps = {
    disabled: false
}

export default withRouter(Form.create()(Address));
