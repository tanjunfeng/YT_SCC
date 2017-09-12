/**
 * 级联查询品类
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Form, Cascader } from 'antd';

const options = [{
    value: 'zhejiang',
    label: 'Zhejiang',
    isLeaf: false,
}, {
    value: 'jiangsu',
    label: 'Jiangsu',
    isLeaf: false,
}];

class Category extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            options,
        };
        this.onChange = this.onChange.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    onChange = (value, selectedOptions) => {
        this.setState({
            inputValue: selectedOptions.map(o => o.label).join(', '),
        });
    }

    loadData = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        // load options lazily
        setTimeout(() => {
            targetOption.loading = false;
            targetOption.children = [{
                label: `${targetOption.label} Dynamic 1`,
                value: 'dynamic1',
            }, {
                label: `${targetOption.label} Dynamic 2`,
                value: 'dynamic2',
            }];
            this.setState({
                options: [...this.state.options],
            });
        }, 1000);
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
    onCheckTreeOk: PropTypes.func,
    isEmpty: PropTypes.bool,
    list: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
}

export default withRouter(Form.create()(Category));
