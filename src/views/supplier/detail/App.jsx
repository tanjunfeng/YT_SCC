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

import {
    getSupplierDetail,
    getProviderDetail,
    queryPlaceRegion
} from '../../../actions/supplier';

import {
    pubFetchValueList
} from '../../../actions/pub';

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
        getSupplierDetail,
        getProviderDetail,
        queryPlaceRegion
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
        const current = type === 'add' || type === 'place' || type === 'edit' ? '4' : '1'
        this.state = {
            current,
            isEdit: type === 'edit'
        }
    }

    componentDidMount() {
        const { id, type } = this.props.match.params;
        if (type === 'place') {
            this.props.getProviderDetail({adrInfoId: id});
            return ;
        }
        else if (type === 'edit') {
            this.props.getProviderDetail({adrInfoId: id}).then(() => {
                this.props.queryPlaceRegion({spId: this.props.detailData.id});
            })
            return;
        }
        else if (type === 'add') {
            this.props.getSupplierDetail({spId: id}).then(() => {
                this.props.queryPlaceRegion({spId: this.props.detailData.id});
            })
            return;
        }
        this.props.getSupplierDetail({spId: id});
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
        const { detailData } = this.props;
        const detailSp = {};
        if (type === 'place' || type === 'edit') {
            Object.assign(detailData, detailData.supplierInfoDto);
            Object.assign(detailSp, detailData.supplierAdrInfoDto);
        }
        const props = {
            data: this.props.detailData,
            canEdit: this.canEdit,
            canExamine: this.canExamine,
            failedReason: this.showReson,
            getDtail: this.handleGetDetail,
            detailData,
            detailSp
        }

        return (
            <Tabs
                defaultActiveKey="1"
                onChange={this.handleClick}
                activeKey={this.state.current}
                className="suppplier-add"
                style={{marginTop: '16px'}}
            >
                <TabPane tab="基本信息" key="1">
                    <BasicInfo {...props} />
                </TabPane>
                <TabPane tab="银行信息" key="2">
                    <BankInfo {...props} />
                </TabPane>
                <TabPane tab="证照信息" key="3">
                    <LicenseInfo {...props} />
                </TabPane>
                {
                    type === 'place' &&
                    <TabPane tab="供应商地点信息" key="4">
                        <SupplierSpace {...props} />
                    </TabPane>
                }
                {
                    (type === 'add' || type === 'edit') &&
                    <TabPane tab="供应商地点信息" key="4">
                        <LocationInfoManagement
                            {...props}
                            isEdit={this.state.isEdit}
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
