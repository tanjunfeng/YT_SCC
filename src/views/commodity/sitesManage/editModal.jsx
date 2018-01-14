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

const FormItem = Form.Item;
const Option = Select.Option;
class EditSiteRelationModal extends PureComponent {
    handleEditFetch = () => {
        const { editSiteRelation, editId } = this.props;
        const { getFieldsValue, validateFields } = this.props.form;
        const { logisticsModel } = getFieldsValue();
        validateFields((err) => {
            if (!err) {
                editSiteRelation(Utils.removeInvalid({
                    logisticsModel,
                    editId
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
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title="编辑地点关系"
                visible={visible}
                onOk={this.handleEditFetch}
                onCancel={closeModal}
            >
                <Form>
                    <FormItem label="物流模式" >
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
