/**
 * @file App.jsx
 * @author caoyanxuan,liujinyu
 *
 * 快捷导航
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Common from './common';
import { format } from './utils';

const colums = [
    {
        width: 576,
        height: 574,
        prefex: 1,
        imgWidth: 286,
        imgHeight: 286
    },
    {
        width: 490,
        height: 280,
        prefex: 2,
        imgWidth: 245,
        imgHeight: 140
    },
    {
        width: 490,
        height: 280,
        prefex: 3,
        imgWidth: 245,
        imgHeight: 140
    },
    {
        width: 352,
        height: 220,
        prefex: 4,
        imgWidth: 175,
        imgHeight: 110
    },
    {
        width: 352,
        height: 220,
        prefex: 5,
        imgWidth: 175,
        imgHeight: 110
    },
    {
        width: 352,
        height: 220,
        prefex: 6,
        imgWidth: 175,
        imgHeight: 110
    }
]

@Common
class HotItem extends Component {
    handleUpload(item, i) {
        this.props.handleUpload(item, i);
    }
    render() {
        const { data } = this.props;
        this.formatData = format(data);
        const formatData = this.formatData;
        this.colums = [];
        for (let i = 0; i < colums.length; i++) {
            const id = `${data.id}-${colums[i].prefex}`;
            const item = formatData[id] ? formatData[id] : {
                id,
                areaId: data.id,
                name: `${id}号位`,
                title: null,
                subTitle: null,
                url: null,
                icon: null,
                adType: 'FLOOR'
            };
            this.colums.push(item);
        }
        return (
            <div className="home-style-hot">
                <div className="home-style-hot-top">
                    <div
                        className="home-style-hot-top-left"
                        onClick={(e) => this.handleUpload(this.colums[0], colums[0], e)}
                    >
                        <img
                            src={
                                this.colums[0].icon
                                    ? this.colums[0].icon
                                    : require(`../../../../images/default/${colums[0].width}x${colums[0].height}.png`)
                            }
                            alt="热门推荐"
                            width={colums[0].imgWidth}
                            height={colums[0].imgHeight}
                        />
                    </div>
                    <div className="home-style-hot-top-right">
                        <div
                            className="home-style-hot-item home-style-hot-item1"
                            onClick={(e) => this.handleUpload(this.colums[1], colums[1], e)}
                        >
                            <img
                                src={
                                    this.colums[1].icon
                                        ? this.colums[1].icon
                                        : require(`../../../../images/default/${colums[1].width}x${colums[1].height}.png`)
                                }
                                alt="热门推荐"
                                width={colums[1].imgWidth}
                                height={colums[1].imgHeight}
                            />
                        </div>
                        <div
                            className="home-style-hot-item"
                            onClick={(e) => this.handleUpload(this.colums[2], colums[2], e)}
                        >
                            <img
                                src={
                                    this.colums[2].icon
                                        ? this.colums[2].icon
                                        : require(`../../../../images/default/${colums[2].width}x${colums[2].height}.png`)
                                }
                                alt="热门推荐"
                                width={colums[2].imgWidth}
                                height={colums[2].imgHeight}
                            />
                        </div>
                    </div>
                </div>
                <div className="home-style-hot-bottom">
                    <div
                        className="home-style-hot-bottom-item"
                        onClick={(e) => this.handleUpload(this.colums[3], colums[3], e)}
                    >
                        <img
                            src={
                                this.colums[3].icon
                                    ? this.colums[3].icon
                                    : require(`../../../../images/default/${colums[3].width}x${colums[3].height}.png`)
                            }
                            alt="热门推荐"
                            width={colums[3].imgWidth}
                            height={colums[3].imgHeight}
                        />
                    </div>
                    <div
                        className="home-style-hot-bottom-item home-style-hot-bottom-item2"
                        onClick={(e) => this.handleUpload(this.colums[4], colums[4], e)}
                    >
                        <img
                            src={
                                this.colums[4].icon
                                    ? this.colums[4].icon
                                    : require(`../../../../images/default/${colums[4].width}x${colums[4].height}.png`)
                            }
                            alt="热门推荐"
                            width={colums[4].imgWidth}
                            height={colums[4].imgHeight}
                        />
                    </div>
                    <div
                        className="home-style-hot-bottom-item"
                        onClick={(e) => this.handleUpload(this.colums[5], colums[5], e)}
                    >
                        <img
                            src={
                                this.colums[5].icon
                                    ? this.colums[5].icon
                                    : require(`../../../../images/default/${colums[5].width}x${colums[5].height}.png`)
                            }
                            alt="热门推荐"
                            width={colums[5].imgWidth}
                            height={colums[5].imgHeight}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

HotItem.propTypes = {
    handleUpload: PropTypes.func,
    data: PropTypes.objectOf(PropTypes.any),
};

export default HotItem;
