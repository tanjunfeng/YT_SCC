import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Carousel, Icon } from 'antd';
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
                        itemAds.map((item) => {
                            return (
                                <div key={item.id}>
                                    <img src={item.icon} />
                                </div>
                            )
                        })
                    }
                    
                </Carousel>
            </div>
        );
    }
}

CarouselItem.propTypes = {
    isEnabled: PropTypes.bool,
};

export default CarouselItem;