import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Carousel, Icon } from 'antd';
import Common from './common';

@Common
class CarouselItem extends Component {
    render() {
        return (
            <div className="home-style-carousel">
                <Carousel dots={false}>
                    <div><h3>1</h3></div>
                    <div><h3>2</h3></div>
                    <div><h3>3</h3></div>
                    <div><h3>4</h3></div>
                </Carousel>
            </div>
        );
    }
}

CarouselItem.propTypes = {

};

export default CarouselItem;