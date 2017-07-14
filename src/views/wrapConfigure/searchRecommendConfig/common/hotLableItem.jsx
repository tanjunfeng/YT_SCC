/**
 * @file App.jsx
 *
 * @author caoyanxuan
 *
 * 搜索推荐配置--子组件--hover提示
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
