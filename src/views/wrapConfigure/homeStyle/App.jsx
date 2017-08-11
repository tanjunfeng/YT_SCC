import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchAreaList } from '../../../actions/wap';

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
    componentDidMount() {
        this.props.fetchAreaList();
    }
    render() {
        const { homeData } = this.props;
        return (
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
                            return <HotItem {...props} />
                        }
                        if (id.indexOf('banner-') > -1) {
                            return <BannerItem {...props} />
                        }
                        if (id.indexOf('floor-') > -1) {
                            return <FloorItem {...props} />
                        }
                        return null;
                    })
                }
            </div>
        );
    }
}

HomeStyle.propTypes = {
    fetchAreaList: PropTypes.func,
    homeData: PropTypes.objectOf(PropTypes.any),
};

export default HomeStyle;
