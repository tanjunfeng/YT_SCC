import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
    Form,
    Select,
    Modal,
    message
} from 'antd';
import Utils from '../../../util/util';
import { logisticsList } from './constant';
import { Supplier, SupplierAdderss } from '../../../container/search';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
};

class EditSiteRelationModal extends PureComponent {
    componentWillReceiveProps(nextProps) {
        const { visible } = nextProps;
        /**
         * 弹窗关闭时清除历史数据
         */
        if (!visible) {
            this.props.form.resetFields();
        }
    }

    handleEditFetch = () => {
        const { editSiteRelation, editId } = this.props;
        const { getFieldsValue, validateFields } = this.props.form;
        const { logisticsModel, supplier, supplierAddr } = getFieldsValue();
        validateFields((err) => {
            if (!err) {
                editSiteRelation(Utils.removeInvalid({
                    logisticsModel,
                    id: editId,
                    supplierId: supplier.spId,
                    AdrSupId: supplierAddr.spAdrid
                })).then(res => {
                    if (res.success) {
                        message.success('编辑成功');
                    } else {
                        message.error('编辑失败');
                    }
                });
            }
        });
    }
    render() {
        const { visible, closeModal } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        return (
            <Modal
                title="编辑地点关系"
                visible={visible}
                onOk={this.handleEditFetch}
                onCancel={closeModal}
            >
                <div className="edit-modal-container">
                    <Form>
                        <FormItem {...formItemLayout} label="供应商">
                            {getFieldDecorator('supplier', {
                                initialValue: { spId: '', spNo: '', companyName: '' }
                            })(
                                <Supplier />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="供应商地点" >
                            {getFieldDecorator('supplierAddr', { initialValue: {
                                providerNo: '',
                                providerName: '',
                                spAdrid: ''
                            }})(<SupplierAdderss pId={getFieldValue('supplier').spId} disabled={getFieldValue('supplier').spId === ''} />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="物流模式" >
                            {getFieldDecorator('logisticsModel', {
                                initialValue: logisticsList.defaultValue
                            })(
                                <Select
                                    size="large"
                                >
                                    {
                                        logisticsList.data.map(item => (
                                            <Option key={item.key} value={item.key}>
                                                {item.value}
                                            </Option>
                                        ))
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        );
    }
}

EditSiteRelationModal.propTypes = {
    visible: PropTypes.bool,
    closeModal: PropTypes.func,
    editSiteRelation: PropTypes.func,
    editId: PropTypes.string,
    form: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(EditSiteRelationModal));
