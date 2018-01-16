import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
    Form,
    Select,
    Modal,
    message
} from 'antd';
import Utils from '../../../../util/util';
import { logisticsList, placeTypeList, placeFieldMap } from '../constant';
import Sites from '../../../../container/search/Sites';
import { Supplier, SupplierAdderss } from '../../../../container/search';
import { repeatData } from './RepeatTestData';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
};

class CreateModal extends PureComponent {
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible !== this.props.visible) {
            this.props.form.resetFields();
        }
    }
    handleCreateRelation = () => {
        const { createRelations, selectedIds, openRepeatModel } = this.props;
        const { getFieldsValue, validateFields } = this.props.form;
        const {
            logisticsModel,
            placeType,
            place,
            supplier,
            supplierAddr
        } = getFieldsValue();
        const params = {
            logisticsModel,
            placeType,
            placeId: place.record ? place.record[placeFieldMap[placeType]] : '',
            supplierId: supplier.spId,
            AdrSupId: supplierAddr.spAdrid,
            productIds: selectedIds
        };
        validateFields((err) => {
            if (!err) {
                createRelations(Utils.removeInvalid(params)).then(res => {
                    if (res.success) {
                        message.success('添加商品地点关系成功');
                        this.props.closeModal();
                        openRepeatModel(repeatData);
                    } else {
                        message.error('添加商品地点关系失败');
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
                title="创建商品地点关系"
                visible={visible}
                onOk={this.handleCreateRelation}
                onCancel={closeModal}
            >
                <div className="create-modal" >
                    <Form>
                        <FormItem {...formItemLayout} label="地点类型" >
                            {getFieldDecorator('placeType', {
                                initialValue: placeTypeList.defaultValue
                            })(
                                <Select
                                    size="large"
                                >
                                    {
                                        placeTypeList.data.map(item => (
                                            <Option key={item.key} value={item.key}>
                                                {item.value}
                                            </Option>
                                        ))
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="地点" >
                            {getFieldDecorator('place', {
                                initialValue: {}
                            })(
                                <Sites disabled={getFieldValue('placeType') === '0'} siteTypeCode={getFieldValue('placeType')} />
                            )}
                        </FormItem>
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

CreateModal.propTypes = {
    visible: PropTypes.bool,
    closeModal: PropTypes.func,
    createRelations: PropTypes.func,
    openRepeatModel: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.string),
    form: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(CreateModal));
