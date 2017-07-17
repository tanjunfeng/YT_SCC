/**
 * @file App.jsx
 *
 * @author caoyanxuan
 *
 * 404页面广告配置--子组件--模态框
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Modal, Form, Input, message } from 'antd';
import { uploadImageBase64Data } from '../../../../service';
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
        this.saveItems = this.saveItems.bind(this);
        this.handleModalCancel = this.handleModalCancel.bind(this);
        this.uploadImageBase64 = this.uploadImageBase64.bind(this);
        this.state = {
            visible: false,
            img: null
        }
    }

    /**
     * 关闭模态框
     */
    handleModalCancel() {
        this.props.modifyModalVisible({isVisible: false});
    }

    /**
     * 判断并转换base64格式图片为服务器图片
     *
     * @param {bool} isBase64 true：base64格式；false：URL格式
     * @param {*} img base64格式/URL格式图片
     */
    uploadImageBase64(isBase64, img) {
        if (isBase64) {
            return uploadImageBase64Data({
                base64Content: img
            }).then((res) => {
                const { fileOnServerUrl } = res.data;
                return fileOnServerUrl;
            })
        }
        return img;
    }

    /**
     * 模态框确认，判断图片是否选取、及转换图片格式
     */
    handleModalOk() {
        const { isBase64: isFirstBase64, image: firstImage } = this.firstImageUploader.getValue();
        const {
            isBase64: isSecondBase64,
            image: secondImage
        } = this.secondImageUploader.getValue();
        if ((isFirstBase64 && !firstImage) || (isSecondBase64 && !secondImage)) {
            message.error('请选择需要上传的图片！');
            return null;
        } else if (firstImage && secondImage) {
            Promise.all([
                this.uploadImageBase64(isFirstBase64, firstImage),
                this.uploadImageBase64(isSecondBase64, secondImage)
            ]).then(values => {
                this.saveItems(values[0], values[1]);
            });
        } else if (!firstImage && !secondImage) {
            return null;
        }
        return null;
    }

    /**
     * 判断新增/修改，发请求新增/修改数据
     *
     * @param {string} picUrl1 图片1的地址：URL格式
     * @param {string} picUrl2 图片2的地址：URL格式
     */
    saveItems(picUrl1, picUrl2) {
        const {
            planName,
            picName1,
            linkUrl1,
            picName2,
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
                            picUrl1,
                            linkUrl1,
                            picName2,
                            picUrl2,
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
                            picUrl1,
                            linkUrl1,
                            picName2,
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
        /* eslint-disable */
        const imgPattern = {
            pattern: /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/,
            message: '请输入正确的url地址'
        }
        /* eslint-enable */
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
                            }, imgPattern
                            ],
                            initialValue: isShowValue ? linkUrl1 : ''
                        })(
                            <Input type="textarea" rows={2} placeholder="链接地址" />

                        )}
                    </FormItem>
                    <FormItem className="modal-form-item">
                        <span className="modal-form-item-title">
                            <span style={{color: '#f00' }}>*</span>
                            图片1
                        </span>
                        <FileCut
                            ref={ref => { this.firstImageUploader = ref }}
                            width={200}
                            height={200}
                            dpr={2}
                            defaultImge={picUrl1}
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
                            }, imgPattern
                            ],
                            initialValue: isShowValue ? linkUrl2 : ''
                        })(
                            <Input type="textarea" rows={2} placeholder="链接地址" />

                        )}
                    </FormItem>
                    <FormItem className="modal-form-item">
                        <span className="modal-form-item-title">
                            <span style={{color: '#f00' }}>*</span>
                            图片2
                        </span>
                        <FileCut
                            ref={ref => { this.secondImageUploader = ref }}
                            width={200}
                            height={200}
                            dpr={2}
                            defaultImge={picUrl2}
                            accept={['jpg', 'jpeg', 'png']}
                        />
                    </FormItem>
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
