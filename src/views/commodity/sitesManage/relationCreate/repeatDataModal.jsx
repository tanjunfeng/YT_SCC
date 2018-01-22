import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
    Form,
    Table,
    Modal
} from 'antd';
import { sitesManageColumns } from '../columns';
import Utils from '../../../../util/util';
import { exportRepeatSiteRelationExcel } from '../../../../service';

class RepeatDataModal extends PureComponent {
    exportExcel = () => {
        const { reqParams } = this.props;
        Utils.exportExcel(exportRepeatSiteRelationExcel, Utils.removeInvalid(reqParams));
    }

    render() {
        const { repeatRes, closeModal, visible } = this.props;
        const { resultObject} = repeatRes;
        const columns = !sitesManageColumns[sitesManageColumns.length - 1].key ? sitesManageColumns.slice(0, -1) : sitesManageColumns;
        return (
            <Modal
                title="以下商品地点已经存在商品地点关系，不能再次生成，请确认"
                visible={visible}
                onOk={this.exportExcel}
                onCancel={closeModal}
                cancelText="确定"
                okText="下载详情"
                width="1400px"
            >
                <div style={{marginTop: '20px'}}>
                    <Table
                        rowKey={record => record.id}
                        rowSelection={this.rowSelection}
                        dataSource={resultObject}
                        columns={columns}
                    />
                    <div id="downloadDiv" style={{display: 'none'}} />
                </div>
            </Modal>
        );
    }
}

RepeatDataModal.propTypes = {
    visible: PropTypes.bool,
    repeatRes: PropTypes.objectOf(PropTypes.any),
    closeModal: PropTypes.func,
    reqParams: PropTypes.objectOf(PropTypes.any)
};

RepeatDataModal.defaultProps = {
    repeatRes: {
        resultObject: [],
        recordsTotal: 0,
        currentPage: 0
    }
}

export default withRouter(Form.create()(RepeatDataModal));
