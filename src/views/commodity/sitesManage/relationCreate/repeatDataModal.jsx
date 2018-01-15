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
        this.props.closeModal();
    }
    render() {
        const { data, closeModal, visible } = this.props;
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
                        rowKey={record => record.productId}
                        rowSelection={this.rowSelection}
                        dataSource={data}
                        columns={sitesManageColumns}
                    />
                </div>
            </Modal>
        );
    }
}

RepeatDataModal.propTypes = {
    visible: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.any),
    closeModal: PropTypes.func
};

export default withRouter(Form.create()(RepeatDataModal));
