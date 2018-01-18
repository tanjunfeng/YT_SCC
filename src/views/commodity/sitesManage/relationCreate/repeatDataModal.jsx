import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
    Form,
    Table,
    Modal
} from 'antd';
import { sitesManageColumns } from '../columns';

class RepeatDataModal extends PureComponent {
    exportExcel = () => {
        const { reqParams, exportExcel, closeModal } = this.props;
        exportExcel(reqParams).then(res => {
            if (res.success) {
                closeModal();
            }
        });
    }
    render() {
        const { repeatRes, closeModal, visible } = this.props;
        // recordsTotal, currentPage
        const { resultObject} = repeatRes;
        return (
            <Modal
                title="以下商品地点已经存在商品地点关系，不能再次生成，请确认"
                visible={visible}
                onOk={this.exportExcel}
                onCancel={closeModal}
                cancelText="确定"
                okText="下载详情"
                width="1000px"
            >
                <div style={{marginTop: '20px'}}>
                    <Table
                        rowKey={record => record.id}
                        rowSelection={this.rowSelection}
                        dataSource={resultObject}
                        columns={sitesManageColumns}
                    />
                </div>
            </Modal>
        );
    }
}

RepeatDataModal.propTypes = {
    visible: PropTypes.bool,
    repeatRes: PropTypes.objectOf(PropTypes.any),
    closeModal: PropTypes.func,
    exportExcel: PropTypes.func,
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
