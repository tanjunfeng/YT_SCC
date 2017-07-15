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
import { getSupplierDetail } from '../../../actions/supplier';

import BasicInfo from './basicInfo';
import BankInfo from './BankInfo';
import LicenseInfo from './licenseInfo';
import LocationInformation from '../locationInformation';

const TabPane = Tabs.TabPane;

@connect(
    state => ({
        detailData: state.toJS().supplier.detailData
    }),
    dispatch => bindActionCreators({
        getSupplierDetail
    }, dispatch)
)
class AddSupplier extends PureComponent {
    constructor(props) {
        super(props);

        this.handleGoTo = ::this.handleGoTo;
        this.state = {
            activeKey: '1',
            edit: false
        }
    }

    componentDidMount() {
        const { detailData, match } = this.props;
        if (!detailData.id && match.params.id) {
            this.props.getSupplierDetail({spId: match.params.id}).then(() => {
                this.setState({
                    edit: true
                })
            });
        } else if (detailData.id && match.params.id) {
            this.setState({
                edit: true
            })
        }
    }

    handleGoTo(item) {
        this.setState({
            activeKey: item
        })
        const { activeKey } = this.state;
        const items = [this.supplierMessage, this.qualification, this.contact];
        // items[activeKey - 1].validateFields((err) => {
        //     if (!err) {
        //         this.setState({
        //             activeKey: item
        //         })
        //     }
        // })
    }

    render() {
        const { activeKey, edit } = this.state;
        const { detailData } = this.props;
        return (
            <Tabs
                defaultActiveKey="1"
                activeKey={activeKey}
                onTabClick={this.handleGoTo}
                className="suppplier-add"
                style={{marginTop: '16px'}}
            >
                <TabPane tab="基本信息" key="1">
                    <BasicInfo />
                </TabPane>
                <TabPane tab="银行信息" key="2">
                    <BankInfo />
                </TabPane>
                <TabPane tab="证照信息" key="3">
                    <LicenseInfo />
                </TabPane>
                <TabPane tab="供应商地点信息" key="4">
                    <LocationInformation />
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
