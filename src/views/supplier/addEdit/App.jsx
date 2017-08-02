/**
 * @file App.jsx
 * @author shijh
 *
 * 添加共供应商/修改供应商
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Tabs } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getSupplierDetail, fetchSupplierNo } from '../../../actions/supplier';

import BasicInfo from './basicInfo';
import BankInfo from './bankInfo';
import LicenseInfo from './licenseInfo';
import LocationInformation from '../locationInformation';

const TabPane = Tabs.TabPane;

@connect(
    state => ({
        detailData: state.toJS().supplier.detailData,
        supplierId: state.toJS().supplier.supplierId
    }),
    dispatch => bindActionCreators({
        getSupplierDetail,
        fetchSupplierNo
    }, dispatch)
)
class AddSupplier extends PureComponent {
    constructor(props) {
        super(props);

        this.handleGoTo = ::this.handleGoTo;
        this.handleGetDetail = ::this.handleGetDetail;
        this.handleTabClick = ::this.handleTabClick;
        this.state = {
            activeKey: '1',
            edit: false,
        }
    }

    componentDidMount() {
        const { detailData, match } = this.props;
        this.props.fetchSupplierNo({type: 'SP'})
        if (!detailData.id && match.params.id) {
            this.props.getSupplierDetail({spId: match.params.id}).then(() => {
                this.setState({
                    edit: true
                })
            });
        }
    }

    handleGetDetail(id) {
        this.props.getSupplierDetail({spId: id}).then(() => {
            this.setState({
                edit: true
            })
        });
    }

    handleGoTo(item) {
        this.setState({
            activeKey: item
        })
    }

    handleTabClick(item) {

    }

    render() {
        const { activeKey, edit } = this.state;
        const props = {
            onGoTo: this.handleGoTo,
            isEdit: edit,
            ...this.props,
            detailSp: {}
        }
        return (
            <Tabs
                defaultActiveKey="1"
                activeKey={activeKey}
                onTabClick={this.handleTabClick}
                className="suppplier-add"
                style={{marginTop: '16px'}}
            >
                <TabPane tab="基本信息" key="1">
                    <BasicInfo
                        {...props}
                        withRef="bbbb"
                    />
                </TabPane>
                <TabPane tab="银行信息" key="2">
                    <BankInfo
                        {...props}
                        withRef="aaaa"
                    />
                </TabPane>
                <TabPane tab="证照信息" key="3">
                    <LicenseInfo
                        {...props}
                        handleGetDetail={this.handleGetDetail}
                        withRef="ccc"
                    />
                </TabPane>
            </Tabs>
        )
    }
}

AddSupplier.propTypes = {
    match: PropTypes.objectOf(PropTypes.any),
    detailData: PropTypes.objectOf(PropTypes.any),
    getSupplierDetail: PropTypes.func,
}

AddSupplier.defaultProps = {
}

export default withRouter(AddSupplier);
