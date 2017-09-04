/**
 * @file checkReason.jsx
 * @author Tan junfeng
 *
 * 供应商管理列表
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
} from 'antd';
import { PAGE_SIZE } from '../../../constant';
import {
    modifyCheckReasonVisible,
    insertSupplierSettlementInfo,
    fetchGetProductById,
    fetchEditBeforeAfter,
    suppplierSettledAudit,
    fetchQueryManageList
} from '../../../actions';
import {
    auditSupplierEditInfoAction
} from '../../../actions/supplier';
import { getListOfChanges, getAuditObject } from './helper';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        checkReasonVisible: state.toJS().supplier.checkReasonVisible,
        visibleData: state.toJS().supplier.visibleData,
        editBeforeAfters: state.toJS().supplier.editBeforeAfter,
        visibleReasonDatas: state.toJS().supplier.visibleReasonData,
    }),
    dispatch => bindActionCreators({
        modifyCheckReasonVisible,
        insertSupplierSettlementInfo,
        fetchGetProductById,
        fetchEditBeforeAfter,
        suppplierSettledAudit,
        fetchQueryManageList,
        auditSupplierEditInfoAction
    }, dispatch)
)
class CheckReason extends PureComponent {
    constructor(props) {
        super(props);

        this.handleSelectChange = ::this.handleSelectChange;
        this.handleAuditOk = ::this.handleAuditOk;
        this.handleAuditCancel = ::this.handleAuditCancel;

        this.searchForm = {};
        this.current = 1;
    }

    state = {
        selected: -1
    }

    componentDidMount() {
        const { id } = this.props.visibleReasonDatas;
        this.props.fetchEditBeforeAfter({
            spId: id
        })
    }

    /**
     * 弹框确认事件
     */
    handleAuditOk() {
        const { id } = this.props.visibleReasonDatas;
        const { selected } = this.state;
        const { editBeforeAfters } = this.props;
        if (selected === -1) {
            message.error('请选择审核结果');
            return;
        }
        this.props.form.validateFields((err) => {
            if (!err) {
                this.props.auditSupplierEditInfoAction({
                    id,
                    // pass: !parseInt(selected, 10) === 1,
                    pass: parseInt(selected, 10) === 1 ? 'false' : true,
                    ...getAuditObject(editBeforeAfters),
                    ...this.props.form.getFieldsValue()
                }).then((res) => {
                    this.props.modifyCheckReasonVisible({ isVisible: false });
                    message.success(res.message)
                    this.props.fetchQueryManageList({
                        pageNum: this.current,
                        pageSize: PAGE_SIZE,
                        ...this.searchForm
                    })
                }).catch(() => {
                    this.props.modifyCheckReasonVisible({ isVisible: false });
                    message.error('修改审核失败')
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

    /**
     * 弹框取消事件
     */
    handleAuditCancel() {
        this.props.modifyCheckReasonVisible({ isVisible: false });
        this.setState({
            selected: -1
        })
    }

    /**
     * 表单操作
     * @param {*} key 下拉菜单对应选项操作
     */
    handleSelectChange(key) {
        this.setState({
            selected: key
        })
    }

    render() {
        const columns = [{
            title: '项目',
            dataIndex: 'name',
        }, {
            title: '修改前',
            dataIndex: 'before'
        }, {
            title: '修改后',
            dataIndex: 'after'
        }];

        const { getFieldDecorator } = this.props.form;
        const { editBeforeAfters } = this.props;
        const changes = getListOfChanges(editBeforeAfters);
        return (
            <div>
                {
                    this.props.checkReasonVisible &&
                    <Modal
                        title="供应商修改资料审核"
                        visible={this.props.checkReasonVisible}
                        onOk={this.handleAuditOk}
                        onCancel={this.handleAuditCancel}
                        maskClosable={false}
                    >
                        <span>修改资料详情</span>
                        <Table
                            columns={columns}
                            dataSource={changes}
                            pagination={false}
                            size="small"
                            locale={{ emptyText: '无修改前后对比数据' }}
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
                }
            </div>
        );
    }
}

CheckReason.propTypes = {
    editBeforeAfters: PropTypes.objectOf(PropTypes.any),
    visibleReasonDatas: PropTypes.objectOf(PropTypes.any),
    modifyCheckReasonVisible: PropTypes.bool,
    checkReasonVisible: PropTypes.bool,
    form: PropTypes.objectOf(PropTypes.any),
    fetchEditBeforeAfter: PropTypes.func,
    fetchQueryManageList: PropTypes.func,
    auditSupplierEditInfoAction: PropTypes.func
}

export default withRouter(Form.create()(CheckReason));
