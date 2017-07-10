import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Modal, Form, Input, message } from 'antd';
import { modifyModalVisible, addAdPlanList, modifyAdPlanList, fetchAllAdPlanList } from '../../../../actions/wap';
import FileCut from '../../fileCut';

const FormItem = Form.Item;

@connect(
    state => ({
        modalVisible: state.toJS().wap.modalVisible,
        visibleData: state.toJS().wap.visibleData,
        modalTitle: state.toJS().wap.modalTitle
    }),
    dispatch => bindActionCreators({
        modifyModalVisible,
        addAdPlanList,
        modifyAdPlanList,
        fetchAllAdPlanList
    }, dispatch)
)
class ChangeMessage extends PureComponent {
    constructor(props) {
        super(props);
        this.handleModalOk = this.handleModalOk.bind(this);
        this.handleModalCancel = this.handleModalCancel.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.state = {
            visible: false,
            img: null
        }
    }
    handleModalCancel() {
        this.props.modifyModalVisible({isVisible: false});
    }

    handleModalOk() {
        const {
            planName,
            picName1,
            picUrl1,
            linkUrl1,
            picName2,
            picUrl2,
            linkUrl2
        } = this.props.form.getFieldsValue();
        const { modalTitle, visibleData } = this.props;
        const { id } = visibleData;
        switch (modalTitle) {
            case '新增广告方案':
                this.props.form.validateFields((err) => {
                    if (!err) {
                        this.props.addAdPlanList({
                            planName,
                            picName1,
                            picUrl1: '132132121321',
                            linkUrl1,
                            picName2,
                            picUrl2: '1232132132132132',
                            linkUrl2
                        }, () => {
                            this.props.fetchAllAdPlanList();
                            this.props.modifyModalVisible({isVisible: false});
                            message.success('新增成功！');
                        });
                    }
                })
                break;
            case '修改广告方案':
                this.props.form.validateFields((err) => {
                    if (!err) {
                        this.props.modifyAdPlanList({
                            id,
                            planName,
                            picName1,
                            picUrl1: '132132121321',
                            linkUrl1,
                            picName2: '1232132132132132',
                            picUrl2,
                            linkUrl2
                        }, () => {
                            this.props.fetchAllAdPlanList();
                            this.props.modifyModalVisible({isVisible: false});
                            message.success('修改成功！');
                        });
                    }
                })
                break;
            default:
                break;
        }
    }

    handleSave() {
        this.setState({
            img: this.imageUploader.getImageByBase64(),
        })
    }
    render() {
        const {
            planName,
            picName1,
            picUrl1,
            linkUrl1,
            picName2,
            picUrl2,
            linkUrl2
        } = this.props.visibleData;
        const { getFieldDecorator } = this.props.form;
        const mtitle = this.props.modalTitle;
        const isShowValue = (mtitle === '修改广告方案');
        return (
            <Modal
                title={typeof (mtitle) === 'string' ? mtitle : ''}
                visible={this.props.modalVisible}
                onOk={this.handleModalOk}
                onCancel={this.handleModalCancel}
            >
                <Form>
                    <FormItem className="modal-form-item">
                        <span className="modal-form-item-title">
                            <span style={{color: '#f00' }}>*</span>
                            方案名称
                        </span>
                        {getFieldDecorator('planName', {
                            rules: [{
                                required: true,
                                message: '请输入方案名称'
                            }],
                            initialValue: isShowValue ? planName : ''
                        })(
                            <Input
                                placeholder="方案名称"
                            />
                        )}
                    </FormItem>
                    <FormItem className="modal-form-item">
                        <span className="modal-form-item-title">
                            <span style={{color: '#f00' }}>*</span>
                            图片1名称
                        </span>
                        {getFieldDecorator('picName1', {
                            rules: [{
                                required: true,
                                message: '请输入图片1名称'
                            }],
                            initialValue: isShowValue ? picName1 : ''
                        })(
                            <Input
                                placeholder="图片1名称"
                            />
                        )}
                    </FormItem>
                    <FormItem className="modal-form-item">
                        <span className="modal-form-item-title">
                            <span style={{color: '#f00' }}>*</span>
                            链接地址
                        </span>
                        {getFieldDecorator('linkUrl1', {
                            rules: [{
                                required: true,
                                message: '请输入链接地址'
                            }],
                            initialValue: isShowValue ? linkUrl1 : ''
                        })(
                            <Input type="textarea" rows={2} placeholder="链接地址" />

                        )}
                    </FormItem>
                    <FormItem className="modal-form-item">
                        <FileCut
                            ref={ref => { this.imageUploader = ref }}
                            width={200}
                            height={200}
                            dpr={2}
                            defaultImge={'http://sit.image.com/group1/M00/00/EC/rB4KPFlfd8qAc5OmAAA4gy54Q7o815.jpg'}
                            accept={['jpg', 'jpeg', 'png']}
                        />
                    </FormItem>
                    <FormItem className="modal-form-item">
                        <span className="modal-form-item-title">
                            <span style={{color: '#f00' }}>*</span>
                            图片2名称
                        </span>
                        {getFieldDecorator('picName2', {
                            rules: [{
                                required: true,
                                message: '请输入图片2名称'
                            }],
                            initialValue: isShowValue ? picName2 : ''
                        })(
                            <Input
                                placeholder="图片2名称"
                            />
                        )}
                    </FormItem>
                    <FormItem className="modal-form-item">
                        <span className="modal-form-item-title">
                            <span style={{color: '#f00' }}>*</span>
                            链接地址
                        </span>
                        {getFieldDecorator('linkUrl2', {
                            rules: [{
                                required: true,
                                message: '请输入链接地址'
                            }],
                            initialValue: isShowValue ? linkUrl2 : ''
                        })(
                            <Input type="textarea" rows={2} placeholder="链接地址" />

                        )}
                    </FormItem>
                    {/*<FormItem className="modal-form-item">
                        <span className="modal-form-item-title">
                            <span style={{color: '#f00' }}>*</span>
                           图片2
                        </span>
                        <Button
                            type="primary"
                            onClick={this.handleSave}
                            style={{
                            }}
                        >截取图片</Button>
                        <div
                            style={{
                            }}
                        >
                            <ImageUploader
                                ref={ref => { this.imageUploader = ref }}
                                accept={['jpg', 'jpeg', 'png']}
                            />
                        </div>
                        <div
                            style={{
                            }}
                        >
                            {this.state.img
                                ? <img
                                    style={{
                                        display: 'block'
                                    }}
                                    src={this.state.img}
                                />
                                : null
                            }
                        </div>
                    </FormItem>*/}
                </Form>
            </Modal>
        )
    }
}

ChangeMessage.propTypes = {
    modifyModalVisible: PropTypes.func,
    addAdPlanList: PropTypes.func,
    fetchAllAdPlanList: PropTypes.func,
    modifyAdPlanList: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    visibleData: PropTypes.objectOf(PropTypes.any),
    modalTitle: PropTypes.objectOf(PropTypes.any),
    modalVisible: PropTypes.bool,
}

export default withRouter(Form.create()(ChangeMessage));
