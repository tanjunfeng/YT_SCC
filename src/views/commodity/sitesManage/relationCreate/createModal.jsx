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
import { logisticsList, placeTypeListCreate, placeFieldMap } from '../constant';
import Sites from '../../../../container/search/Sites';
import { PAGE_SIZE } from '../../../../constant';
import SupplierInfo from '../SupplierInfoFilterByPlace/index';

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

class CreateModal extends PureComponent {
    state = {
        initialPlaceValue: {}
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible !== this.props.visible) {
            this.props.form.resetFields();
        }
    }

    handleCreateRelation = () => {
        const { createRelations, selectedIds, openRepeatModel, saveParams } = this.props;
        const { getFieldsValue, validateFields } = this.props.form;
        const {
            logisticsModel,
            placeType,
            place,
            supplier,
            supplierAddr
        } = getFieldsValue();

        const params = {
            logisticsModel: parseInt(logisticsModel, 10),
            placeType: parseInt(placeType, 10),
            placeId: place.record ? place.record[placeFieldMap[placeType]] : '',
            supplierId: supplier.spId,
            supplierCode: supplier.spNo,
            supplierName: supplier.companyName,
            adrSupId: supplierAddr.spAdrId,
            adrSupCode: supplierAddr.providerNo,
            adrSupName: supplierAddr.providerName,
            productIds: selectedIds,
            pageNum: 1,
            pageSize: PAGE_SIZE

        };

        validateFields((err, values) => {
            if (!err) {
                if (!values.place.record) {
                    message.error('请选择地点');
                    return;
                }

                if (!values.supplier.spId) {
                    message.error('请选择供应商');
                    return;
                }

                if (!values.supplierAddr.spAdrId) {
                    message.error('请选择供应商地点');
                    return;
                }
                const reqParams = Utils.removeInvalid(params);
                /**
                 * 保存添加的请求参数, 下载重复数据时重用
                 */
                saveParams(reqParams);
                createRelations(reqParams).then(res => {
                    if (res.success) {
                        /**
                         * 有数据重复
                         */
                        if (res.data.data) {
                            openRepeatModel(res.data);
                        } else {
                            message.success('添加商品地点关系成功');
                            this.props.closeModal();
                        }
                    } else {
                        message.error('添加商品地点关系失败');
                    }
                });
            }
        });
    }

    handPlaceTypeChange = val => {
        /**
         * 根据地点类型，动态设置地点初始值
        */

        if (
            parseInt(val, 10) === 1 ||
            parseInt(val, 10) === 3
        ) {
            this.setState({
                initialPlaceValue: {
                    id: '',
                    name: ''
                }
            });
        }

        if (parseInt(val, 10) === 2) {
            this.setState({
                initialPlaceValue: {
                    id: '',
                    areaGroupName: ''
                }
            });
        }
    }

    /**
     * 地点改变时清空供应商(地址)
     */

    handleSiteChange = () => {
        const { resetFields, setFieldsValue } = this.props.form;
        resetFields(['supplier', 'supplierAddr']);
        setFieldsValue({
            supplier: { reset: true }
        });
        setFieldsValue({
            supplierAddr: { reset: true }
        });
    }

    render() {
        const { visible, closeModal } = this.props;
        const { initialPlaceValue } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        return (
            <Modal
                title="创建商品地点关系"
                visible={visible}
                onOk={this.handleCreateRelation}
                onCancel={closeModal}
            >
                <div className="create-modal" style={{display: 'flex', justifyContent: 'center'}} >
                    <Form>
                        <FormItem {...formItemLayout} label="地点类型" >
                            {getFieldDecorator('placeType', {
                                initialValue: placeTypeListCreate.defaultValue,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择地点类型'
                                    }
                                ]
                            })(
                                <Select
                                    size="large"
                                    placeholder="请选择"
                                    onChange={this.handPlaceTypeChange}
                                >
                                    {
                                        placeTypeListCreate.data.map(item => (
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
                                initialValue: initialPlaceValue,
                                rules: [
                                    {
                                        required: true
                                    }
                                ]
                            })(
                                <Sites
                                    onChange={this.handleSiteChange}
                                    disabled={getFieldValue('placeType') === ''}
                                    siteTypeCode={getFieldValue('placeType')}
                                    placeFieldMap={placeFieldMap}
                                    zIndex={1001}
                                />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="供应商">
                            {getFieldDecorator('supplier', {
                                initialValue: { spId: '', spNo: '', companyName: '' },
                                rules: [
                                    {
                                        required: true
                                    }
                                ]
                            })(
                                <SupplierInfo
                                    zIndex={1000}
                                    queryType="1"
                                    disabled={!getFieldValue('place').record}
                                    selectedPlace={{
                                        placeType: getFieldValue('placeType'),
                                        placeId: getFieldValue('place').record ? getFieldValue('place').record[placeFieldMap[getFieldValue('placeType')]] : ''
                                    }}
                                />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="供应商地点" >
                            {getFieldDecorator('supplierAddr', { initialValue: {
                                providerNo: '',
                                providerName: '',
                                spAdrid: ''
                            },
                            rules: [
                                {
                                    required: true
                                }
                            ]})(
                                <SupplierInfo
                                    zIndex={999}
                                    queryType="2"
                                    disabled={!getFieldValue('place').record}
                                    selectedPlace={{
                                        placeType: getFieldValue('placeType'),
                                        placeId: getFieldValue('place').record ? getFieldValue('place').record[placeFieldMap[getFieldValue('placeType')]] : ''
                                    }}
                                />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="物流模式" >
                            {getFieldDecorator('logisticsModel', {
                                initialValue: logisticsList.defaultValue,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择物流模式'
                                    }
                                ]
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
    saveParams: PropTypes.func,
    closeModal: PropTypes.func,
    createRelations: PropTypes.func,
    openRepeatModel: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.string),
    form: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(CreateModal));
