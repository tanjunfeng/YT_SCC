/**
 * @file App.jsx
 * @author liujinyu
 *
 * 首页样式管理条件查询区
 */
import React, { PureComponent } from 'react';
import { withRouter, Switch } from 'react-router';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import SearchBox from './SearchBox';
import SwitchBox from './SwitchBox';
const FormItem = Form.Item;

class SearchItem extends PureComponent {
    // constructor(props) {
    //     super(props)
    // }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
    }
    searchChange = (submitObj) => {
        this.props.searchChange(submitObj)
    }

    render() {
        return (
            <div>
                <SearchBox searchChange={this.searchChange} />
                <SwitchBox areaName={this.props.areaName} />
            </div>
        )
    }
}

SearchItem.propTypes = {
    searchChange: PropTypes.func,
    areaName: PropTypes.string
    // form: PropTypes.objectOf(PropTypes.any),
    // upDate: PropTypes.bool,
};

export default withRouter(Form.create()(SearchItem));
