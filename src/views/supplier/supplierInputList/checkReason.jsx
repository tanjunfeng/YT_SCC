/**
 * @file checkReason.jsx
 * @author Tan junfeng
 *
 * 供应商入驻申请列表
 */

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import {
    Form,
    Input,
    Select,
    Modal,
    message,
    Table,
    Icon
} from 'antd';

import {
    modifyCheckReasonVisible,
    insertSupplierSettlementInfo
} from '../../../actions';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        checkResonVisible: state.toJS().supplier.checkResonVisible,
        visibleData: state.toJS().supplier.visibleData,
        editBeforeAfter: state.toJS().supplier.editBeforeAfter,
    }),
    dispatch => bindActionCreators({
        modifyCheckReasonVisible,
        insertSupplierSettlementInfo
    }, dispatch)
)
class CheckReason extends PureComponent {
    constructor(props) {
        super(props);

        this.handleCheckOk = ::this.handleCheckOk;
        this.handleCheckCancel = ::this.handleCheckCancel;
        this.handleSelectChange = ::this.handleSelectChange;
        this.handleTextChange = ::this.handleTextChange;
    }

    state = {
        selected: -1
    }


    handleCheckCancel() {
        this.props.modifyCheckReasonVisible(false);
    }

    handleCheckOk() {
        const { selected } = this.state;
        const { visibleData } = this.props;
        if (selected === -1) {
            message.error('请选择审核结果');
            return;
        }
        this.props.form.validateFields((err) => {
            if (!err) {
                this.props.insertSupplierSettlementInfo({
                    id: visibleData.id,
                    status: parseInt(selected, 10),
                    ...this.props.form.getFieldsValue()
                }).then(() => {
                    this.props.getList()
                })
            }
        })
    }

    handleSelectChange(key) {
        this.setState({
            selected: key
        })
    }

    handleTextChange(value) {

    }

    render() {
        const {
            companyName,
            companyDetailAddress
        } = this.props.visibleData;
        console.log(this.props.editBeforeAfter)
        const columns = [{
            title: '项目',
            dataIndex: 'name',
        }, {
            title: '修改前',
            dataIndex: 'before',
            render: (text, row, index) => {
                if (index > 1) {
                    return <a href="#"><Icon type="picture" />{text}</a>;
                }
                return {
                    children: text,
                };
            },
        }, {
            title: '修改后',
            dataIndex: 'after',
            render: (text, row, index) => {
                if (index > 1) {
                    return <a href="#"><Icon type="picture" />{text}</a>;
                }
                return {
                    children: text,
                };
            },
        }];
        const data = [{
            key: '1',
            name: '公司所在地',
            before: companyName,
            after: companyName,
        }, {
            key: '2',
            name: '详细地址',
            before: companyDetailAddress,
            after: companyDetailAddress,
        }, {
            key: '3',
            name: '税务登记证电子版',
            before: '查看',
            after: '查看',
        }];
        const { getFieldDecorator } = this.props.form;

        return (
            <Modal
                title="供应商修改资料审核"
                visible={this.props.checkResonVisible}
                onOk={this.handleCheckOk}
                onCancel={this.handleCheckCancel}
                maskClosable={false}
            >
                <span>修改资料详情</span>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    size="small"
                />
                <div>
                    <div className="application-modal-tip">
                        注意：审核通过，供应商的所有账号可正常登录商家后台系统。
                    </div>
                    {
                        this.props.modifyCheckReasonVisible &&
                        <div className="application-modal-select">
                            <span className="application-modal-label">审核：</span>
                            <Select
                                style={{ width: '153px', marginLeft: '15px' }}
                                size="default"
                                placeholder="请选择"
                                onChange={this.handleSelectChange}
                            >
                                <Option value="2">通过</Option>
                                <Option value="1">不通过</Option>
                            </Select>
                        </div>
                    }
                    {
                        this.props.modifyCheckReasonVisible && this.state.selected === '1' &&
                        <Form layout="inline">
                            <FormItem className="application-form-item">
                                <span className="application-modal-label">*不通过原因：</span>
                                {getFieldDecorator('failedReason', {
                                    rules: [{ required: true, message: '请输入不通过原因', whitespace: true }]
                                })(
                                    <Input
                                        onChange={this.handleTextChange}
                                        type="textarea"
                                        placeholder="请输入不通过原因"
                                        className="application-modal-textarea"
                                        autosize={{ minRows: 2, maxRows: 8 }}
                                    />
                                    )}
                            </FormItem>
                        </Form>
                    }
                </div>
            </Modal>
        );
    }
}

CheckReason.propTypes = {
    modifyCheckReasonVisible: PropTypes.bool,
    checkResonVisible: PropTypes.bool,
    form: PropTypes.objectOf(PropTypes.any),
    visibleData: PropTypes.objectOf(PropTypes.any),
    insertSupplierSettlementInfo: PropTypes.objectOf(PropTypes.any),
    getList: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(CheckReason));
