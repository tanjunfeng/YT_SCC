import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Tabs } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSupplierDetail } from '../../actions/supplier';
// 商家信息
import SupplierMessage from './SupplierMessage';
// 公司资质
import Qualification from './Qualification';
// 联系信息
import Contact from './Contact';
// 合作信息
import Cooperative from './common/Cooperative';

const TabPane = Tabs.TabPane;

@connect(
    state => ({
        detailData: state.toJS().supplier.detailData
    }),
    dispatch => bindActionCreators({
        getSupplierDetail
    }, dispatch)
)
class SupplierDetail extends PureComponent {
    constructor(props) {
        super(props);

        this.handleClick = ::this.handleClick;
        this.handleGetDetail = :: this.handleGetDetail;
        this.canEdit = false;
        this.canExamine = false;
        this.showReson = false;
        this.state = {
            current: '1'
        }
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        const { match } = this.props;
        this.props.getSupplierDetail({spId: id});
        if (match.path.indexOf('/supplierList') > -1) {
            this.canEdit = true;
        } else if (match.path.indexOf('/modifyApplication') > -1) {
            this.canExamine = true;
        } else if (match.path.indexOf('/applicationList') > -1) {
            this.showReson = true;
        }
    }

    handleClick(goto) {
        this.setState({
            current: goto
        })
    }

    handleGetDetail() {
        const { id } = this.props.match.params;
        return this.props.getSupplierDetail({spId: id});
    }

    render() {
        const props = {
            data: this.props.detailData,
            canEdit: this.canEdit,
            canExamine: this.canExamine,
            failedReason: this.showReson,
            getDtail: this.handleGetDetail,
            ...this.props
        }
        return (
            <Tabs
                defaultActiveKey="1"
                onChange={this.handleClick}
                activeKey={this.state.current}
                style={{marginTop: '16px'}}
            >
                <TabPane tab="商家信息" key="1">
                    <SupplierMessage
                        {...props}
                    />
                </TabPane>
                <TabPane tab="公司资质" key="2">
                    <Qualification
                        {...props}
                    />
                </TabPane>
                <TabPane tab="联系信息" key="3">
                    <Contact
                        {...props}
                    />
                </TabPane>
                {
                    !this.showReson &&
                    <TabPane tab="合作信息" key="4">
                        <Cooperative
                            {...props}
                            title="合作信息"
                        />
                    </TabPane>
                }
            </Tabs>
        )
    }
}

SupplierDetail.propTypes = {
    match: PropTypes.objectOf(PropTypes.any),
    getSupplierDetail: PropTypes.func,
    detailData: PropTypes.objectOf(PropTypes.any),
}

SupplierDetail.defaultProps = {
}

export default withRouter(SupplierDetail);
