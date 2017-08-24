/**
 * @file App.jsx
 *
 * @author caoyanxuan
 *
 * 搜索推荐配置--子组件--模态框
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Modal, Form, Input, InputNumber, message } from 'antd';
import Utils from '../../../../util/util';
import { PAGE_SIZE } from '../../../../constant';
import { modifyModalVisible, fetchAllHot, addSaveHOT, modifyUpdateHot } from '../../../../actions/wap';

const FormItem = Form.Item;

@connect(
    state => ({
        modalVisible: state.toJS().wap.modalVisible,
        visibleData: state.toJS().wap.visibleData,
        modalTitle: state.toJS().wap.modalTitle
    }),
    dispatch => bindActionCreators({
        modifyModalVisible,
        fetchAllHot,
        addSaveHOT,
        modifyUpdateHot,
    }, dispatch)
)
class ChangeMessage extends PureComponent {
    constructor(props) {
        super(props);
        this.handleModalOk = this.handleModalOk.bind(this);
        this.handleModalCancel = this.handleModalCancel.bind(this);
    }

    /**
     * 关闭模态框
     */
    handleModalCancel() {
        this.props.modifyModalVisible({isVisible: false});
    }

    /**
     * 确认模态框，提交表单
     */
    handleModalOk() {
        const { content, sort } = this.props.form.getFieldsValue();
        const { modalTitle, visibleData } = this.props;
        const { id } = visibleData;
        const data = { content, sort, id }
        switch (modalTitle) {
            case '新增':
                this.props.form.validateFields((err) => {
                    if (!err) {
                        this.props.addSaveHOT({
                            ...Utils.removeInvalid(data)
                        }).then(() => {
                            message.success('新增成功！');
                            if ((content !== '') && (sort !== '')) {
                                this.props.fetchAllHot({pageSize: PAGE_SIZE, pageNum: 1});
                                this.props.modifyModalVisible({isVisible: false});
                            }
                        }).catch((error) => {
                            message.error(error.message);
                        });
                    }
                })
                break;
            case '修改':
                this.props.form.validateFields((err) => {
                    if (!err) {
                        this.props.modifyUpdateHot({
                            ...Utils.removeInvalid(data)
                        }).then(() => {
                            message.success('修改成功！');
                            if (content !== '' && sort !== '') {
                                this.props.modifyModalVisible({isVisible: false});
                                this.props.fetchAllHot({pageSize: PAGE_SIZE, pageNum: 1});
                            }
                        }).catch((error) => {
                            message.error(error.message);
                        });
                    }
                })
                break;
            default:
                break;
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { content, sort } = this.props.visibleData;
        const mtitle = this.props.modalTitle;
        return (
            <Modal
                title={typeof (mtitle) === 'string' ? mtitle : ''}
                visible={this.props.modalVisible}
                onOk={this.handleModalOk}
                onCancel={this.handleModalCancel}
                width="440px"
            >
                <Form>
                    <FormItem className="modal-form-item">
                        <span className="modal-form-item-title">
                            <span style={{color: '#f00' }}>*</span>
                            参数内容
                        </span>
                        {getFieldDecorator('content', {
                            rules: [{
                                required: true,
                                message: '请输入参数内容'
                            },
                            {
                                max: 10,
                                message: '不能输入超过10个字'
                            }
                            ],
                            initialValue: mtitle === '修改' ? content : ''
                        })(
                            <Input
                                placeholder="参数内容"
                                maxLength={11}
                            />
                        )}
                    </FormItem>
                    <FormItem className="modal-form-item">
                        <span className="modal-form-item-title">
                            <span style={{color: '#f00' }}>*</span>
                            排序
                        </span>
                        {getFieldDecorator('sort', {
                            rules: [{
                                required: true,
                                message: '请输入排序'
                            }],
                            initialValue: mtitle === '修改' ? sort : ''
                        })(
                            <InputNumber min={0} placeholder="排序" />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

ChangeMessage.propTypes = {
    modifyModalVisible: PropTypes.func,
    fetchAllHot: PropTypes.func,
    addSaveHOT: PropTypes.func,
    modifyUpdateHot: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    visibleData: PropTypes.objectOf(PropTypes.any),
    modalTitle: PropTypes.objectOf(PropTypes.any),
    modalVisible: PropTypes.bool,
}

export default withRouter(Form.create()(ChangeMessage));
