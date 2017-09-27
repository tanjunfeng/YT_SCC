/*
 * @Author: tanjf
 * @Description: 满省 - 提示请输入整数
 * @CreateDate: 2017-09-25 09:11:12
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-09-25 09:11:32
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icon } from 'antd';

// 关键字提示
class HotLableItem extends PureComponent {
    render() {
        return (
            <span className="hot-search-item" >
                <span className="hot-search-lable" >{ this.props.hotLable }</span>
                <Tooltip placement="top" title={this.props.tooltipTitle}>
                    <Icon type="question-circle-o" style={{ fontSize: 14, color: '#108EE9' }} />
                </Tooltip>
            </span>
        );
    }
}

HotLableItem.propTypes = {
    hotLable: PropTypes.string,
    tooltipTitle: PropTypes.string,
};

export default HotLableItem;
