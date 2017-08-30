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
    modifyAuditAdrVisible,
    insertSupplierSettlementInfo,
    suppplierSettledAudit,
    supplierAdrSettledAudit,
    fetchQueryManageList
} from '../../../actions';
// import { validatorRebate } from '../../../util/validator';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        auditVisible: state.toJS().supplier.auditVisibled,
        visibleData: state.toJS().supplier.visibleData
    }),
    dispatch => bindActionCreators({
        modifyAuditAdrVisible,
        insertSupplierSettlementInfo,
        suppplierSettledAudit,
        supplierAdrSettledAudit,
        fetchQueryManageList
    }, dispatch)
)
class ChangeAudit extends PureComponent {
    constructor(props) {
        super(props);

        this.handleAuditCancel = ::this.handleAuditCancel;
        this.handleAuditOk = ::this.handleAuditOk;
        this.handleSelectChange = ::this.handleSelectChange;
        this.handleGetList = ::this.handleGetList;

        this.searchForm = {};
        this.current = 1;
        this.state = {
            selected: -1,
        }
    }


    /**
     * 模态框取消事件
     */
    handleAuditCancel() {
        this.props.modifyAuditAdrVisible({isVisible: false});
        this.setState({
            selected: -1
        })
    }

    /**
     * 模态框确认事件
     */
    handleAuditOk() {
        const { selected } = this.state;
        const { visibleData } = this.props;
        if (selected === '2' && visibleData.spStatus === 3) {
            message.error('供应商为已拒绝，供应商地点不能审核通过！');
            return;
        }
        if (selected === -1) {
            message.error('请选择审核结果');
            return;
        }
        if (!(selected === 1 && visibleData.spStatus === 3)) {
            this.props.form.validateFields((err) => {
                if (!err) {
                    this.props.supplierAdrSettledAudit({
                        pass: parseInt(selected, 10) === 1 ? 'false' : true,
                        id: +(visibleData.id),
                        // pass: !parseInt(selected, 10) === 1,
                        ...this.props.form.getFieldsValue()
                    }).then((res) => {
                        this.props.modifyAuditAdrVisible({isVisible: false});
                        message.success(res.message)
                        this.props.fetchQueryManageList({
                            pageNum: this.current,
                            pageSize: PAGE_SIZE,
                        })
                    }).catch(() => {
                        this.props.modifyAuditAdrVisible({isVisible: false});
                        message.error('修改审核失败')
                    })
                }
            })
        }
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

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                {
                    this.props.auditVisible &&
                    <Modal
                        title="供应商地点审核"
                        visible={this.props.auditVisible}
                        onOk={this.handleAuditOk}
                        onCancel={this.handleAuditCancel}
                        maskClosable={false}
                    >
                        <div>
                            <div className="application-modal-tip">
                                注意：审核通过，供应商的所有账号可正常登录商家后台系统。
                            </div>
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
                                this.props.auditVisible && this.state.selected === '1' &&
                                <Form layout="inline">
                                    <FormItem className="application-form-item">
                                        <span className="application-modal-label">
                                            <b className="gyssh-css-import">*</b>
                                            不通过原因：
                                        </span>
                                        {getFieldDecorator('failedReason', {
                                            rules:
                                            [{
                                                required: true,
                                                message: '请输入不通过原因',
                                                whitespace: true
                                            }]
                                        })(
                                            <Input
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
                                this.props.auditVisible && this.state.selected === '2' &&
                                <div className="gyssh-css-passCheck">
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
    modifyAuditAdrVisible: PropTypes.func,
    fetchQueryManageList: PropTypes.func,
    supplierAdrSettledAudit: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    auditVisible: PropTypes.bool,
    visibleData: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(ChangeAudit));
