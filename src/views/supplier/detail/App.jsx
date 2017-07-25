/**
 * @file App.jsx
 * @author shijh
 *
 * 供应商详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Tabs } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSupplierDetail } from '../../../actions/supplier';
// // 商家信息
// import SupplierMessage from './SupplierMessage';
// // 公司资质
// import Qualification from './Qualification';
// // 联系信息
// import Contact from './Contact';
// // 合作信息
// import Cooperative from './common/Cooperative';

import BasicInfo from './basicInfo';
import BankInfo from './bankInfo';
import LicenseInfo from './licenseInfo';
import SupplierSpace from './supplierSpace';
import LocationInfoManagement from '../locationInformation';

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
        const { type = 'supplier' } = this.props.match.params;
        this.state = {
            current: type === 'add' || type === 'place' ? '4' : '1'
        }
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        const { match } = this.props;
        // this.props.getSupplierDetail({spId: id});
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
        const { type = 'supplier' } = this.props.match.params;
        const props = {
            data: this.props.detailData,
            canEdit: this.canEdit,
            canExamine: this.canExamine,
            failedReason: this.showReson,
            getDtail: this.handleGetDetail,
            ...this.props
        }
        const { id } = this.props.match.params;
        // console.log(this.props.match)
        return (
            <Tabs
                defaultActiveKey="1"
                onChange={this.handleClick}
                activeKey={this.state.current}
                className="suppplier-add"
                style={{marginTop: '16px'}}
            >
                <TabPane tab="基本信息" key="1">
                    <BasicInfo id={id} />
                </TabPane>
                <TabPane tab="银行信息" key="2">
                    <BankInfo />
                </TabPane>
                <TabPane tab="证照信息" key="3">
                    <LicenseInfo />
                </TabPane>
                {
                    type === 'place' &&
                    <TabPane tab="供应商地点信息" key="4">
                        <SupplierSpace />
                    </TabPane>
                }
                {
                    type === 'add' &&
                    <TabPane tab="供应商地点信息" key="4">
                        <LocationInfoManagement />
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
