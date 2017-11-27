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
    constructor(props) {
        super(props)
        this.state = {
            companyName: '未选择',
            companyId: ''
        }
    }

    /**
     * 点击搜索后的回调
     * @param {object} submitObj 上传参数
     */

    searchChange = (submitObj) => {
        this.props.searchChange(submitObj)
        const { branchCompany } = submitObj
        this.setState({
            companyName: branchCompany.name,
            companyId: branchCompany.id
        })
    }

    /**
     * 点击切换运营方式后的回调
     * @param {bloon} isUsingNation 是否为总部运营
     */
    switchChange = (isUsingNation) => {
        this.props.switchChange(isUsingNation)
    }

    render() {
        return (
            <div>
                <SearchBox searchChange={this.searchChange} />
                <SwitchBox
                    switchChange={this.switchChange}
                    companyName={this.state.companyName}
                    companyId={this.state.companyId}
                    isChecked={this.props.isChecked}
                />
            </div>
        )
    }
}

SearchItem.propTypes = {
    searchChange: PropTypes.func,
    switchChange: PropTypes.func,
    isChecked: PropTypes.bool
};

export default withRouter(Form.create()(SearchItem));
