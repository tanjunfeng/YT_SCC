/**
 * @file basicInfo.jsx
 * @author shijh
 *
 * 基本信息
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Common from './common';

@Common
class BasicInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { initValue = {} } = this.props;
        return (
            <div className="detail-message-body">
                <ul className="detail-message-list">
                    <li className="detail-message-item">
                        <span>公司名称：</span>
                        <span>{initValue.companyName}</span>
                    </li>
                    <li className="detail-message-item">
                        <span>供应商编号：</span>
                        <span>{initValue.spNo}</span>
                    </li>
                    <li className="detail-message-item">
                        <span>供应商注册号：</span>
                        <span>{initValue.spRegNo}</span>
                    </li>
                    <li className="detail-message-item">
                        <span>供应商主账号：</span>
                        <span>{initValue.mainAccountNo}</span>
                    </li>
                </ul>
            </div>
        );
    }
}

BasicInfo.propTypes = {
    initValue: PropTypes.objectOf(PropTypes.any),
};

export default BasicInfo;
