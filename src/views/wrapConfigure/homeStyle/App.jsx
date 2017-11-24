/**
 * @file wap.js
 * @author shijh,liujinyu
 *
 * 配置移动端首页
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Message } from 'antd';
import { fetchAreaList, fetchSwitchOptWayOfHome } from '../../../actions/wap';

import SearchItem from '../common/searchItem';
import CarouselItem from './common/carousel';
import QuickItem from './common/quick';
import HotItem from './common/hot';
import BannerItem from './common/banner';
import FloorItem from './common/floor';

@connect(
    state => ({
        homeData: state.toJS().wap.homeData,
        companyData: state.toJS().wap.companyData
    }),
    dispatch => bindActionCreators({
        fetchAreaList,
        fetchSwitchOptWayOfHome
    }, dispatch)
)

class HomeStyle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            companyId: '',
            isChecked: false,
            // 用户能否修改当前的页面
            isHeadquarters: true
        }
    }

    /**
     * 点击搜索后的回调
     * @param {object} submitObj 上传参数
     * @param {bool} isHeadquarters 用户是否可以修改当前页面
     */
    searchChange = (submitObj, isHeadquarters) => {
        const { branchCompany, homePageType } = submitObj
        const companyId = branchCompany.id
        const obj = {
            companyId,
            homePageType
        }
        this.setState({
            companyId,
            isHeadquarters
        })
        this.props.fetchAreaList(obj);
    }

    /**
     * 点击切换运营方式后的回调
     * @param {bloon} isUsingNation 是否为总部运营
     */
    switchChange = (isUsingNation) => {
        const obj = {
            isUsingNation,
            companyId: this.state.companyId
        }
        this.props.fetchSwitchOptWayOfHome(obj).then(res => {
            if (res.success) {
                Message.success('切换成功')
            } else {
                Message.error(res.message)
                this.setState({
                    isChecked: !isUsingNation
                })
            }
        })
    }

    render() {
        const { homeData } = this.props;
        return (
            <div className="home-box">
                <SearchItem
                    searchChange={this.searchChange}
                    switchChange={this.switchChange}
                    isChecked={this.state.isChecked}
                />
                {
                    homeData.length > 0
                        ? <div className="home-style">
                            {
                                homeData.map((item, index) => {
                                    const { id } = item;
                                    const props = {
                                        index,
                                        key: id,
                                        data: item,
                                        allLength: homeData.length,
                                        fetchAreaList: this.props.fetchAreaList,
                                        // 用户是否可以修改
                                        headquarters: this.state.isHeadquarters
                                    }
                                    if (id.indexOf('carousel') > -1) {
                                        return <CarouselItem {...props} />
                                    }
                                    if (id.indexOf('quick-nav') > -1) {
                                        return <QuickItem type="quick" {...props} />
                                    }
                                    if (id.indexOf('hot') > -1) {
                                        return <HotItem type="hot" {...props} />
                                    }
                                    if (id.indexOf('banner-') > -1) {
                                        return <BannerItem type="banner" {...props} />
                                    }
                                    if (id.indexOf('floor-') > -1) {
                                        return <FloorItem type="floor" {...props} />
                                    }
                                    return null;
                                })
                            }
                            {
                                !this.state.isHeadquarters
                                    ? <div className="home-style-wrap" />
                                    : null
                            }
                        </div>
                        : null
                }
            </div>
        );
    }
}

HomeStyle.propTypes = {
    fetchAreaList: PropTypes.func,
    fetchSwitchOptWayOfHome: PropTypes.func,
    homeData: PropTypes.objectOf(PropTypes.any),
    companyData: PropTypes.objectOf(PropTypes.any)
};

export default HomeStyle;
