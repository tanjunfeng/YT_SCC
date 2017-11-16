/**
 * 直营店查询表单
 *
 * @returns 分公司编号
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Row, Modal } from 'antd';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DirectStores } from '../../../container/search';
import {
    queryDirectInfo,
    clearDirectInfo
} from '../../../actions/procurement';

const FormItem = Form.Item;

@connect(state => ({
    directInfo: state.toJS().procurement.directInfo
}), dispatch => bindActionCreators({
    queryDirectInfo,
    clearDirectInfo
}, dispatch))

class StoresForm extends PureComponent {
    state = {
        record: null,
        tmp: null,
        modalRechooseVisible: false // 提示重新选择门店的模态框
    }

    componentWillMount() {
        this.props.clearDirectInfo();
    }

    /**
     * 重新选择商品
     */
    handleRechooseOk = () => {
        this.setState({
            modalRechooseVisible: false,
            record: { ...this.state.tmp }
        }, () => {
            this.query();
        });
    }

    /**
     * 不重新选择商品，清空传入的门店信息
     */
    handleRechooseCancel = () => {
        this.setState({ modalRechooseVisible: false });
    }

    query = () => {
        const record = this.state.record;
        if (record && record.storeId) {
            this.props.queryDirectInfo({ storeId: record.storeId }).then(res => {
                // 返回分公司 id 供父页面使用
                this.props.form.setFieldsValue({
                    storeId: record.storeId
                });
                this.props.onChange({
                    storeId: record.storeId,
                    branchCompanyId: res.data.branchCompanyId,
                    deliveryWarehouseCode: res.data.deliveryWarehouseCode
                });
            });
        } else {
            this.clear();
        }
    }

    clear = () => {
        this.props.clearDirectInfo();
        // 通知父页面清空
        this.props.onChange({ storeId: '', branchCompanyId: '', deliveryWarehouseCode: '' });
        this.props.form.resetFields();
    }

    handleDirectStoresChange = ({ record }) => {
        if (this.props.value) {
            this.setState({
                tmp: { ...record },
                modalRechooseVisible: true
            });
            return;
        }
        this.setState({ record }, () => {
            this.query();
        });
    }

    render() {
        const { form, directInfo = {} } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className="direct-sales-orders-form">
                <Form layout="inline">
                    <div className="search-box">
                        <h1>门店信息</h1>
                        <Row gutter={40}>
                            <FormItem label="选择门店">
                                {getFieldDecorator('stores', {
                                    initialValue: { storeId: '', storeName: '' },
                                    rules: [{ required: true, message: '请选择门店' }]
                                })(<DirectStores
                                    onChange={this.handleDirectStoresChange}
                                />)}
                            </FormItem>
                            <FormItem label="门店编号">
                                {getFieldDecorator('storeId', {
                                    initialValue: ''
                                })(<Input size="default" disabled />)}
                            </FormItem>
                            <FormItem label="收货地址">
                                {getFieldDecorator('receivingAddress', {
                                    initialValue: directInfo.receivingAddress
                                })(<Input size="default" disabled />)}
                            </FormItem>
                            <FormItem label="收货人">
                                {getFieldDecorator('consignee', {
                                    initialValue: directInfo.consignee
                                })(<Input size="default" disabled />)}
                            </FormItem>
                            <FormItem label="手机号">
                                {getFieldDecorator('phone', {
                                    initialValue: directInfo.phone
                                })(<Input size="default" disabled />)}
                            </FormItem>
                        </Row>
                    </div>
                </Form>
                <Modal
                    title="重新选择门店"
                    visible={this.state.modalRechooseVisible}
                    onOk={this.handleRechooseOk}
                    onCancel={this.handleRechooseCancel}
                >
                    <p>这个操作将要重新选择门店并清空已选择商品，确定吗？</p>
                </Modal>
            </div>
        );
    }
}

StoresForm.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    directInfo: PropTypes.objectOf(PropTypes.any),
    value: PropTypes.bool,
    queryDirectInfo: PropTypes.func,
    clearDirectInfo: PropTypes.func,
    onChange: PropTypes.func
};

export default withRouter(Form.create()(StoresForm));
