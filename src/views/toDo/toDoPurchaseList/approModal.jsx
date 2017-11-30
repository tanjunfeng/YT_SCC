/*
 * @Author: tanjf
 * @Description: 采购退货
 * @CreateDate: 2017-10-27 11:23:06
 * @Last Modified by: chenghj
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Modal,
    Table
} from 'antd';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import {
    queryCommentHis,
} from '../../../actions/procurement';

const dateFormat = 'YYYY-MM-DD';

@connect(state => ({
    approvalList: state.toJS().procurement.approvalList
}), dispatch => bindActionCreators({
    queryCommentHis,
}, dispatch))

class ApproModal extends PureComponent {
    constructor(props) {
        super(props);
        this.searchParams = {};
        this.state = {
            spId: '',   // 供应商编码
            spAdrId: '',    // 供应商地点编码
            isSupplyAdrDisabled: true, // 供应商地点禁用
            locDisabled: true,  // 地点禁用
            locationData: {},
            isVisibleModal: false,
            adrTypeCode: '',    // 地点编码
            receivedTypeCode: ''  // 收货单状态编码
        };
        this.columns = [
            {
                title: '审批人',
                dataIndex: 'handler',
                key: 'handler'
            }, {
                title: '审批时间',
                dataIndex: 'handlerDate',
                key: 'handlerDate',
                render: text => {
                    let res = text;
                    if (!text) {
                        res = '-';
                    } else {
                        res = (moment(new Date(text)).format(dateFormat))
                    }
                    return res;
                }
            }, {
                title: '审批结果',
                dataIndex: 'pass',
                key: 'pass',
                render: text => (
                    text ? '通过' : '拒绝'
                )
            }, {
                title: '审批意见',
                dataIndex: 'content',
                key: 'content',
                render: text => {
                    let res = text;
                    if (text === null || undefined === text || text === '') {
                        res = '-';
                    }
                    return res;
                }
            }
        ]
    }

    componentWillMount() {
    }

    showModal = () => {
        this.props.visible({isVisibleModal: true});
    }

    handleOk = () => {
        this.props.onOk({isVisibleModal: false});
    }
    handleCancel = () => {
        this.props.onCancel({isVisibleModal: false});
    }

    render() {
        const { approvalList } = this.props;
        return (
            <Modal
                title="审批意见"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width={1200}
            >
                <Table
                    dataSource={approvalList}
                    columns={this.columns}
                    rowKey="id"
                    scroll={{
                        x: 400
                    }}
                />
            </Modal>
        );
    }
}

ApproModal.propTypes = {
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    approvalList: PropTypes.objectOf(PropTypes.any),
};

export default withRouter(Form.create()(ApproModal));
