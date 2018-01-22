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
import SupplierInfo from './SupplierInfoFilterByPlace/index';

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
    state = {
        initSupplier: {},

    }
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
                    supplierCode: supplier.spNo,
                    supplierName: supplier.companyName,
                    adrSupId: supplierAddr.spAdrId,
                    adrSupCode: supplierAddr.providerNo,
                    adrSupName: supplierAddr.providerName
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
        const { visible, closeModal, detail } = this.props;
        const { getFieldDecorator } = this.props.form;
        const initSupplier = {
            spId: detail.supplierId,
            spNo: detail.supplierCode,
            companyName: detail.supplierName
        };
        const initSupplierAddr = {
            providerNo: detail.adrSupCode,
            providerName: detail.adrSupName,
            spAdrId: detail.adrSupId
        };

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
                                initialValue: initSupplier
                            })(
                                <SupplierInfo
                                    zIndex={1000}
                                    defaultRaw={initSupplier}
                                    queryType="1"
                                    selectedPlace={{
                                        placeType: detail.placeType,
                                        placeId: detail.placeId
                                    }}
                                />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="供应商地点" >
                            {getFieldDecorator('supplierAddr', {initialValue: initSupplierAddr})(
                                <SupplierInfo
                                    zIndex={999}
                                    queryType="2"
                                    defaultRaw={initSupplierAddr}
                                    selectedPlace={{
                                        placeType: detail.placeType,
                                        placeId: detail.placeId
                                    }}
                                />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="物流模式" >
                            {getFieldDecorator('logisticsModel', {
                                initialValue: String(detail.logisticsModel)
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
    form: PropTypes.objectOf(PropTypes.any),
    detail: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(EditSiteRelationModal));
