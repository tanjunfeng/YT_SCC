/**
 * @file App.jsx
 * @author liujinyu
 *
 * 首页样式管理、轮播管理条件查询区
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
            // 切换运营按钮是否显示
            isShowSwitch: false
        }
    }

    /**
     * 点击搜索后的回调
     * @param {object} submitObj 上传参数
     * @param {bool} headquarters 用户是否有总部权限
     * @param {bool} isShowSwitch 切换运营按钮是否显示
     */
    searchChange = (submitObj, headquarters, isShowSwitch) => {
        const { branchCompany, homePageType } = submitObj
        this.setState({
            companyName: branchCompany.name,
            isShowSwitch
        })
        // 判断用户是否可以修改当前页面
        let isHeadquarters = null
        // 判断用户是否可以修改当前快捷导航
        let isChangeQuick = null
        if (homePageType === '1') {
            if (headquarters) {
                isHeadquarters = true
                isChangeQuick = true
            } else {
                isHeadquarters = false
                isChangeQuick = false
            }
        } else {
            isHeadquarters = true
            if (headquarters) {
                isChangeQuick = true
            } else {
                isChangeQuick = false
            }
        }
        this.props.searchChange(submitObj, isHeadquarters, isChangeQuick)
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
                    isShowSwitch={this.state.isShowSwitch}
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
