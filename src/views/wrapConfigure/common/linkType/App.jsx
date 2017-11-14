/**
 * @file App.jsx
 * @author shijh
 *
 * 手机端配置，链接配置
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const Option = Select.Option;

class LinkType extends Component {
    static propTypes = {

    }

    handleLinkStyleChange = () => {
        
    }

    render() {
        return (
            <div>
                <Select
                    style={{ width: 240 }}
                    onChange={this.handleLinkStyleChange}
                >
                    <Option value="1">商品链接</Option>
                    <Option value="2">页面链接</Option>
                </Select>
            </div>
        )
    }
}

export default LinkType;
