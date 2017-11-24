/**
 * @file App.jsx
 * @author liujinyu
 *
 * 首页样式管理条件查询区
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import SearchBox from './SearchBox';
import SwitchBox from './SwitchBox';

class SearchItem extends PureComponent {
    /**
     * 点击搜索后的回调
     * @param {object} submitObj 上传参数
     */

    searchChange = (submitObj) => {
        this.props.searchChange(submitObj)
    }

    /**
     * 点击切换运营方式后的回调
     * @param {bloon} isUsingNation 是否为总部运营
     */
    switchChange = (isUsingNation) => {
        this.props.searchChange(isUsingNation)
    }

    render() {
        return (
            <div>
                <SearchBox searchChange={this.searchChange} />
                <SwitchBox
                    switchChange={this.switchChange}
                    companyName={this.props.companyName}
                    companyId={this.props.companyId}
                />
            </div>
        )
    }
}

SearchItem.propTypes = {
    searchChange: PropTypes.func,
    companyName: PropTypes.string,
    companyId: PropTypes.string
};

export default withRouter(Form.create()(SearchItem));
