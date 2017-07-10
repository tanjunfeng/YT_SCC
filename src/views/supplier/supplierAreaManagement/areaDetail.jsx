import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Table,
    Modal
} from 'antd';

import { saleRegionsDtail, modifyAreaVisible } from '../../../actions';
import Utils from '../../../util/util';

const columns = [{
    key: 'regionName',
    title: '大区',
    dataIndex: 'regionName',
    width: '10%',
    render: (text) => (<div className="area-detail-left">{text}</div>)
}, {
    key: 2,
    title: '省市区',
    dataIndex: 'province',
    width: '90%'
}];

@connect(
    state => ({
        areaDetailData: state.toJS().supplier.areaDetailData,
        areaVisible: state.toJS().supplier.areaVisible,
        visibleData: state.toJS().supplier.visibleData
    }),
    dispatch => bindActionCreators({
        modifyAreaVisible,
        saleRegionsDtail
    }, dispatch)
)
class AreaDetail extends PureComponent {
    constructor(props) {
        super(props);

        this.handleAuditCancel = ::this.handleAuditCancel;
    }

    componentDidMount() {
        const { visibleData } = this.props;
        this.props.saleRegionsDtail({spNo: visibleData.spNo});
    }

    handleAuditCancel() {
        this.props.modifyAreaVisible({isVisible: false});
    }

    render() {
        const { visibleData, areaDetailData } = this.props;

        const list = Utils.array2string(areaDetailData)

        return (
            <Modal
                visible={this.props.areaVisible}
                onCancel={this.handleAuditCancel}
                width="900px"
                footer={null}
            >
                <div>
                    <Table
                        dataSource={list}
                        columns={columns}
                        rowKey="id"
                        title={() => visibleData.companyName}
                        pagination={false}
                        className="area-detail"
                        bordered
                    />
                </div>
            </Modal>
        );
    }
}

AreaDetail.propTypes = {
    visibleData: PropTypes.objectOf(PropTypes.any),
    areaDetailData: PropTypes.objectOf(PropTypes.any),
    areaVisible: PropTypes.bool,
    modifyAreaVisible: PropTypes.func
}

export default AreaDetail;
