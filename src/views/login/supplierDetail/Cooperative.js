import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

class Cooperative extends PureComponent {
    constructor(props) {
        super(props);

        this.handleClick = ::this.handleClick;
    }

    handleClick() {

    }

    render() {
        return (
            <div className="supplier-detail-message">
                <div className="supplier-detail-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />合作信息
                        </div>
                        <div className="detail-message-body">
                            <ul className="detail-message-list">
                                <li className="detail-message-item"><span>入驻时间：</span><span>2016-02-15</span></li>
                                <li className="detail-message-item"><span>结算账期：</span><span>1 天</span></li>
                                <li className="detail-message-item"><span>结算账户：</span><span>商户公司银行账户</span></li>
                                <li className="detail-message-item"><span>返利（%）：</span><span>1.20%</span></li>
                                <li className="detail-message-item"><span>保证金余额：</span><span>50000.00元</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Cooperative.propTypes = {
}

Cooperative.defaultProps = {
}

export default withRouter(Cooperative);
