import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'antd';
import Common from './common';

@Common
class CarouselItem extends Component {
    render() {
        const { data = {}, isEnabled } = this.props;
        const { itemAds = [] } = data;
        return (
            <div className="home-style-carousel">
                <Carousel
                    autoplay={isEnabled}
                >
                    {
                        itemAds.map((item) =>
                            (
                                <div key={item.id} style={{height: '255px'}}>
                                    <img alt="" src={item.icon} height={'255px'} />
                                </div>
                            )
                        )
                    }
                </Carousel>
            </div>
        );
    }
}

CarouselItem.propTypes = {
    data: PropTypes.objectOf(PropTypes.any),
    isEnabled: PropTypes.bool,
};

export default CarouselItem;
