import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
    }),
    dispatch => bindActionCreators({
        fetchAreaList,
    }, dispatch)
)

class HomeStyle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            companyName: '',
            companyId: ''
        }
    }

    componentDidMount() {
        this.props.fetchAreaList();
    }

    /**
     * 点击搜索后的回调
     * @param {object} submitObj 上传参数
     */
    searchChange = (submitObj) => {
        const { branchCompany, homePageType } = submitObj;
        this.setState({
            companyName: branchCompany.name,
            companyId: branchCompany.id
        })
        // 这里调用请求接口
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
        fetchSwitchOptWayOfHome(obj)
            .then(res => {
                console.log(res)
            })
    }

    render() {
        const { homeData } = this.props;
        return (
            <div className="home-box">
                <SearchItem
                    searchChange={this.searchChange}
                    switchChange={this.switchChange}
                    companyName={this.state.companyName}
                    companyId={this.state.companyId}
                />
                <div className="home-style">
                    {
                        homeData.map((item, index) => {
                            const { id } = item;
                            const props = {
                                index,
                                key: id,
                                data: item,
                                allLength: homeData.length,
                                fetchAreaList: this.props.fetchAreaList
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
                </div>
            </div>
        );
    }
}

HomeStyle.propTypes = {
    fetchAreaList: PropTypes.func,
    homeData: PropTypes.objectOf(PropTypes.any),
};

export default HomeStyle;
