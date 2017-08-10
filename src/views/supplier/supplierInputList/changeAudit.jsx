/**
 * @file changeAudit.jsx
 * @author Tan junfeng
 *
 * 供应商地点审核
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
    Form,
    Input,
    Select,
    Modal,
    message
} from 'antd';
import { PAGE_SIZE } from '../../../constant';
import {
    modifyAuditVisible,
    insertSupplierSettlementInfo,
    suppplierSettledAudit,
    fetchQueryManageList
} from '../../../actions';
// import { validatorRebate } from '../../../util/validator';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        auditVisible: state.toJS().supplier.auditVisible,
        visibleData: state.toJS().supplier.visibleData
    }),
    dispatch => bindActionCreators({
        modifyAuditVisible,
        insertSupplierSettlementInfo,
        suppplierSettledAudit,
        fetchQueryManageList
    }, dispatch)
)
class ChangeAudit extends PureComponent {
    constructor(props) {
        super(props);

        this.handleAuditCancel = ::this.handleAuditCancel;
        this.handleAuditOk = ::this.handleAuditOk;
        this.handleSelectChange = ::this.handleSelectChange;
        this.handleTextChange = ::this.handleTextChange;
        this.handleGetList = ::this.handleGetList;

        this.searchForm = {};
        this.current = 1;
        this.state = {
            selected: -1,
        }
    }

    /**
     * 弹框取消事件
     */
    handleAuditCancel() {
        this.props.modifyAuditVisible({ isVisible: false });
        this.setState({
            selected: -1
        })
    }

    /**
     * 弹框确认事件
     */
    handleAuditOk() {
        const { selected } = this.state;
        const { visibleData } = this.props;
        if (selected === -1) {
            message.error('请选择审核结果');
            return;
        }
        this.props.form.validateFields((err) => {
            if (!err) {
                this.props.suppplierSettledAudit({
                    id: visibleData.id,
                    pass: parseInt(selected, 10) === 1 ? false : true,
                    ...this.props.form.getFieldsValue()
                }).then((res) => {
                    this.props.modifyAuditVisible({ isVisible: false });
                    message.success(res.message)
                    this.props.fetchQueryManageList({
                        pageNum: this.current,
                        pageSize: PAGE_SIZE,
                        ...this.searchForm
                    })
                }).catch(() => {
                    message.error('修改审核失败')
                    this.props.modifyAuditVisible({ isVisible: false });
                })
            }
        })
    }

    /**
     * 数据列表查询
     */
    handleGetList(page) {
        const currentPage = page;
        this.props.fetchQueryManageList({
            pageSize: PAGE_SIZE,
            pageNum: currentPage,
            ...this.searchForm
        });
    }

    handleSelectChange(key) {
        this.setState({
            selected: key
        })
    }

    handleTextChange() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                {
                    this.props.auditVisible &&
                    <Modal
                        title="供应商入住审核"
                        visible={this.props.auditVisible}
                        onOk={this.handleAuditOk}
                        onCancel={this.handleAuditCancel}
                    >
                        <div>
                            <div className="application-modal-tip">注意：审核通过，供应商的所有账号可正常登录商家后台系统。</div>
                            {
                                this.props.auditVisible &&
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
                                this.state.selected === '1' && this.props.auditVisible &&
                                <Form layout="inline">
                                    <FormItem className="application-form-item" style={{ textAlign: 'left' }}>
                                        <span className="application-modal-label"><b className="gyl-css-import">*</b>不通过原因：</span>
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
                            {
                                this.state.selected === '2' &&
                                <div style={{ textAlign: 'left', paddingLeft: 90 }}>
                                    <span>确认通过审核？</span>
                                </div>
                            }
                        </div>
                    </Modal>
                }
            </div>
        );
    }
}

ChangeAudit.propTypes = {
    modifyAuditVisible: PropTypes.func,
    fetchQueryManageList: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    auditVisible: PropTypes.bool,
    visibleData: PropTypes.objectOf(PropTypes.any),
    getList: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(ChangeAudit));
