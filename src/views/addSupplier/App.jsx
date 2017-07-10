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
import { getSupplierDetail } from '../../actions/supplier';

// 商家信息
import SupplierMessage from './SupplierMessage';
// 公司资质
import Qualification from './Qualification';
// 联系信息
import Contact from './Contact';

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
        const { activeKey } = this.state;
        const items = [this.supplierMessage, this.qualification, this.contact];
        items[activeKey - 1].validateFields((err) => {
            if (!err) {
                this.setState({
                    activeKey: item
                })
            }
        })
    }

    render() {
        const { activeKey, edit } = this.state;
        const { detailData } = this.props;
        return (
            <Tabs
                defaultActiveKey="1"
                activeKey={activeKey}
                onTabClick={this.handleGoTo}
                style={{marginTop: '16px'}}
            >
                <TabPane tab="商家信息" key="1">
                    <SupplierMessage
                        isEdit={edit}
                        detailData={detailData}
                        onGoTo={this.handleGoTo}
                        ref={ref => { this.supplierMessage = ref }}
                    />
                </TabPane>
                <TabPane tab="公司资质" key="2">
                    <Qualification
                        isEdit={edit}
                        detailData={detailData}
                        onGoTo={this.handleGoTo}
                        ref={ref => { this.qualification = ref }}
                    />
                </TabPane>
                <TabPane tab="联系信息" key="3">
                    <Contact
                        isEdit={edit}
                        detailData={detailData}
                        onGoTo={this.handleGoTo}
                        ref={ref => { this.contact = ref }}
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
