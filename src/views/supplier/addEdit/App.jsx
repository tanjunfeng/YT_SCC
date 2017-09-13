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
import { getSupplierDetail, fetchSupplierNo, removeDetailData } from '../../../actions/supplier';

import BasicInfo from './basicInfo';
import BankInfo from './bankInfo';
import LicenseInfo from './licenseInfo';
import { TABCONTENT } from '../../../constant';

const TabPane = Tabs.TabPane;

@connect(
    state => ({
        detailData: state.toJS().supplier.detailData,
        supplierId: state.toJS().supplier.supplierId
    }),
    dispatch => bindActionCreators({
        getSupplierDetail,
        fetchSupplierNo,
        removeDetailData
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
            isLastTabHidden: true,
            edit: false,
        }
    }

    componentDidMount() {
        const { match } = this.props;
        if (match.params.type === 'supplier') {
            this.props.getSupplierDetail({ spId: match.params.id }).then(() => {
                this.setState({
                    edit: true
                })
            });
        } else {
            this.props.fetchSupplierNo({ type: 'SP' })
        }
    }

    componentWillUnmount() {
        this.props.removeDetailData();
    }

    handleGetDetail(id) {
        this.props.getSupplierDetail({ spId: id }).then(() => {
            this.setState({
                edit: true
            })
        });
    }

    handleGoTo(item) {
        if (+(item) === 2) {
            this.setState({
                isLastTabHidden: false
            });
        }
        this.setState({
            activeKey: item
        })
    }

    handleTabClick(item) {
        const tabs = ['BasicInfo', 'BankInfo', 'LicenseInfo'];
        const { activeKey } = this.state;
        TABCONTENT[tabs[+(activeKey) - 1]].handleGoTo(item);
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
                style={{ marginTop: '16px' }}
            >
                <TabPane tab="基本信息" key="1">
                    <BasicInfo
                        {...props}
                    />
                </TabPane>
                <TabPane tab="银行信息" key="2">
                    <BankInfo
                        {...props}
                    />
                </TabPane>
                {!this.state.isLastTabHidden ?
                    <TabPane tab="证照信息" key="3">
                        <LicenseInfo
                            {...props}
                        />
                    </TabPane>
                    : null
                }
            </Tabs>
        )
    }
}

AddSupplier.propTypes = {
    match: PropTypes.objectOf(PropTypes.any),
    getSupplierDetail: PropTypes.func,
    removeDetailData: PropTypes.func,
    fetchSupplierNo: PropTypes.func
}

AddSupplier.defaultProps = {
}

export default withRouter(AddSupplier);
