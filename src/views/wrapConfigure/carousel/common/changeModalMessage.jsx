/**
 * @file App.jsx
 *
 * @author caoyanxuan
 *
 * 轮播广告管理--子组件--模态框
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Modal, Form, Input, message, InputNumber, Radio, Select } from 'antd';
import { modifyModalVisible, addAdPlanList, modifyAdPlanList, fetchAllAdPlanList } from '../../../../actions/wap';
import FileCut from '../../fileCut';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

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
        this.onRadioChange = this.onRadioChange.bind(this);
        this.handleLinkStyleChange = this.handleLinkStyleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.state = {
            visible: false,
            img: null,
            selectLinkType: this.props.visibleData.linkType,
        }
    }
    onRadioChange(e) {
        console.log(`radio checked:${e.target.value}`);
    }
    handleLinkStyleChange(value) {
        this.setState({
            selectLinkType: value.key
        })
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
            case '新增轮播广告设置':
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
            case '修改轮播广告设置':
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
    handleBlur() {
        const { goodsId } = this.props.form.getFieldsValue();
        console.log(goodsId)
    }
    render() {
        const {
            sorting,
            linkType,
            goodsId,
            linkAddress,
            picAddress,
            status,
        } = this.props.visibleData;
        const { getFieldDecorator } = this.props.form;
        const mtitle = this.props.modalTitle;
        const isShowValue = (mtitle === '修改轮播广告设置');
        return (
            <Modal
                title={typeof (mtitle) === 'string' ? mtitle : ''}
                visible={this.props.modalVisible}
                onOk={this.handleModalOk}
                onCancel={this.handleModalCancel}
                maskClosable={false}
                className="add-carousel-modal"
            >
                <Form>
                    <FormItem className="modal-form-item">
                        <span className="modal-form-item-title">
                            <span style={{color: '#f00' }}>*</span>
                            排序
                        </span>
                        {getFieldDecorator('sorting', {
                            rules: [{
                                required: true,
                                message: '请输入排序'
                            }],
                            initialValue: isShowValue ? sorting : ''
                        })(
                            <InputNumber min={0} placeholder="排序" />
                        )}
                    </FormItem>
                    <FormItem className="modal-form-item">
                        <span className="modal-form-item-title">
                            <span style={{color: '#f00' }}>*</span>
                            方案名称
                        </span>
                        <RadioGroup onChange={this.onRadioChange} defaultValue={status ? status.toString() : '0'}>
                            <RadioButton value="1">启用</RadioButton>
                            <RadioButton value="0">禁用</RadioButton>
                        </RadioGroup>
                    </FormItem>
                    <FormItem className="modal-form-item">
                        <span className="modal-form-item-title">
                            <span style={{color: '#f00' }}>*</span>
                            链接类型
                        </span>
                        <Select
                            labelInValue
                            defaultValue={{ key: linkType }}
                            style={{ width: 240 }}
                            onChange={this.handleLinkStyleChange}
                        >
                            <Option value="商品链接">商品链接</Option>
                            <Option value="静态活动页面">静态活动页面</Option>
                        </Select>
                    </FormItem>
                    { (this.state.selectLinkType === '商品链接') &&
                        <FormItem className="modal-form-item">
                            <span className="modal-form-item-title">
                                <span style={{color: '#f00' }}>*</span>
                                商品编号
                            </span>
                            {getFieldDecorator('goodsId', {
                                rules: [{
                                    required: true,
                                    message: '请输入商品编号'
                                }],
                                initialValue: isShowValue ? goodsId : ''
                            })(
                                <Input
                                    placeholder="商品编号"
                                    onBlur={this.handleBlur}
                                />
                            )}
                            <div className="form-description">
                                （在商品管理中查看商品编号，
                                <a>商品管理</a>
                                ）
                            </div>
                        </FormItem>
                    }
                    { (this.state.selectLinkType === '静态活动页面') &&
                        <FormItem className="modal-form-item">
                            <span className="modal-form-item-title">
                                <span style={{color: '#f00' }}>*</span>
                                链接地址
                            </span>
                            {getFieldDecorator('linkAddress', {
                                rules: [{
                                    required: true,
                                    message: '请输入链接地址'
                                }],
                                initialValue: isShowValue ? linkAddress : ''
                            })(
                                <Input
                                    type="textarea"
                                    disabled={this.state.selectLinkType === '商品链接'}
                                    rows={2}
                                    placeholder="链接地址"
                                />

                            )}
                            <div className="form-description">（填写商品编号之后保存，自动获取商品链接地址）</div>
                        </FormItem>
                    }
                    <FormItem className="modal-form-item">
                        <span className="modal-form-item-title">
                            <span style={{color: '#f00' }}>*</span>
                            轮播图片
                        </span>
                        <span>（说明：支持PNG、JPG，建议大小600X400pix，1M以内）</span>
                        <FileCut
                            ref={ref => { this.imageUploader = ref }}
                            width={200}
                            height={200}
                            dpr={2}
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
