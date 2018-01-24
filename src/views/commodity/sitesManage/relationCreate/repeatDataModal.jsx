import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
    Form,
    Table,
    Modal
} from 'antd';
import { exportColumn } from '../columns';
import Utils from '../../../../util/util';
import { exportRepeatSiteRelationExcel } from '../../../../service';

class RepeatDataModal extends PureComponent {
    /**
     * 导出重复数据Excel
     */
    exportExcel = () => {
        const { reqParams } = this.props;
        Utils.exportExcel(exportRepeatSiteRelationExcel, Utils.removeInvalid(reqParams));
    }

    render() {
        const { repeatRes, closeModal, visible } = this.props;
        const { data } = repeatRes;
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
                        dataSource={data}
                        columns={exportColumn}
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
        data: [],
        total: 0,
        pageNum: 0
    }
};

export default withRouter(Form.create()(RepeatDataModal));
