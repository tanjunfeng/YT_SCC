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
            headquarters: true
        }
    }

    /**
     * 点击搜索后的回调
     * @param {object} submitObj 上传参数
     * @param {bool} headquarters 用户是否有总部权限
     */
    searchChange = (submitObj, headquarters) => {
        const { branchCompany, homePageType } = submitObj
        this.setState({
            companyName: branchCompany.name,
            headquarters
        })
        // 判断用户是否可以修改当前页面
        let isHeadquarters = null
        if (homePageType === '1') {
            if (headquarters) {
                isHeadquarters = true
            } else {
                isHeadquarters = false
            }
        } else {
            isHeadquarters = true
        }
        this.props.searchChange(submitObj, isHeadquarters)
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
                    headquarters={this.state.headquarters}
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
