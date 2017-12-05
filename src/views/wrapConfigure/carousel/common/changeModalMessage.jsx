/**
 * @file App.jsx
 * @author caoyanxuan,liujinyu
 *
 * 轮播广告管理--子组件--模态框
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Modal, Form, message, InputNumber, Radio } from 'antd';
import Utils from '../../../../util/util';
import { uploadImageBase64Data } from '../../../../service';
import LinkType from '../../common/linkType';
import {
    modifyModalVisible,
    addCarouselAd,
    modifyCarouselAd,
    fetchCarouselAdBySorting
} from '../../../../actions/wap';
import FileCut from '../../fileCut';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

@connect(
    state => ({
        modalVisible: state.toJS().wap.modalVisible,
        visibleData: state.toJS().wap.visibleData,
        modalTitle: state.toJS().wap.modalTitle
    }),
    dispatch => bindActionCreators({
        modifyModalVisible
    }, dispatch)
)
class ChangeMessage extends PureComponent {
    constructor(props) {
        super(props);
        this.handleModalOk = this.handleModalOk.bind(this);
        this.handleModalCancel = this.handleModalCancel.bind(this);
        this.handleLinkStyleChange = this.handleLinkStyleChange.bind(this);
        this.handleSortBlur = this.handleSortBlur.bind(this);
        this.state = {
            visible: false,
            img: null,
            sortErr: false,
            selectLinkType: `${props.visibleData.linkType || 1}`
        }
    }

    handleSortBlur() {
        const { sorting } = this.props.form.getFieldsValue();
        const { modalTitle, visibleData, areaId } = this.props;
        const sortData = {
            sorting,
            queryType: modalTitle === '新增轮播广告设置' ? 0 : 1,
            carouselAdId: visibleData.id,
            areaId
        }
        fetchCarouselAdBySorting({
            ...Utils.removeInvalid(sortData)
        }).then(() => {
            message.success('排序可用！');
            this.setState({
                sortErr: false
            })
        }).catch(() => {
            message.error('排序不可用！');
            this.setState({
                sortErr: true
            })
            this.props.form.setFields({
                sorting: {
                    value: sorting,
                    errors: [new Error('排序重复')],
                },
            });
        })
    }

    /**
     * 链接类型切换
     * @param {string} value 选中的option的值
     */
    handleLinkStyleChange(value) {
        this.setState({
            selectLinkType: value
        })
    }

    /**
     * 关闭模态框
     */
    handleModalCancel() {
        this.props.modifyModalVisible({isVisible: false});
    }

    /**
     * 模态框确认
     */
    handleModalOk() {
        if (this.state.sortErr) {
            return null;
        }
        const { isBase64, image } = this.imageUploader.getValue();
        if (isBase64 && !image) {
            message.error('请选择需要上传的图片！');
            return null;
        } else if (isBase64) {
            uploadImageBase64Data({
                base64Content: image
            }).then((res) => {
                const { imageDomain, suffixUrl } = res.data;
                this.saveItems(`${imageDomain}/${suffixUrl}`);
            })
        } else if (!isBase64) {
            this.saveItems(image);
        }
        return null;
    }

    /**
     * 当图片上传成功后，对新增/修改数据发请求
     * @param {string} picAddress 上传成功后的图片url地址
     */
    saveItems(picAddress) {
        const {
            sorting,
            status,
            chooseLink
        } = this.props.form.getFieldsValue();

        const linkType = chooseLink.selected;
        const linkAddress = chooseLink.link;
        const goodsId = parseInt(linkType, 10) === 1 ? chooseLink.link : '';

        const { modalTitle, areaId } = this.props;
        const { id } = this.props.visibleData;
        switch (modalTitle) {
            case '新增轮播广告设置':
                this.props.form.validateFields((err) => {
                    if (!err) {
                        addCarouselAd({
                            ...Utils.removeInvalid({
                                sorting,
                                status: parseInt(status, 10),
                                linkType,
                                goodsId,
                                linkAddress: linkAddress ? encodeURI(linkAddress) : null,
                                picAddress,
                                areaId
                            })
                        }).then(() => {
                            this.props.searchChange();
                            this.props.modifyModalVisible({
                                isVisible: false
                            });
                            message.success('新增成功！');
                        })
                    }
                })
                break;
            case '修改轮播广告设置':
                this.props.form.validateFields((err) => {
                    if (!err) {
                        modifyCarouselAd({
                            ...Utils.removeInvalid({
                                id,
                                sorting,
                                status: parseInt(status, 10),
                                linkType,
                                goodsId,
                                linkAddress: linkAddress ? encodeURI(linkAddress) : null,
                                picAddress
                            })
                        }).then(() => {
                            this.props.searchChange();
                            this.props.modifyModalVisible({
                                isVisible: false
                            });
                            message.success('修改成功！');
                        })
                    }
                })
                break;
            default:
                break;
        }
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
                width={630}
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
                            validateTrigger: 'onBlur',
                            initialValue: isShowValue ? sorting : ''
                        })(
                            <InputNumber
                                min={0}
                                placeholder="排序"
                                onBlur={this.handleSortBlur}
                            />
                        )}
                    </FormItem>
                    <FormItem className="modal-form-item">
                        <span className="modal-form-item-title">
                            <span style={{color: '#f00' }}>*</span>
                            状态
                        </span>
                        {getFieldDecorator('status', {
                            initialValue: status ? status.toString() : '0'
                        })(
                            <RadioGroup onChange={this.onRadioChange}>
                                <RadioButton value="1">启用</RadioButton>
                                <RadioButton value="0">禁用</RadioButton>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem className="modal-form-item">
                        {getFieldDecorator('chooseLink', {
                            rules: [{
                                required: true
                            }, {
                                validator: (rule, value, callback) => {
                                    if (!value.link) {
                                        callback('请输入链接')
                                    }
                                    callback()
                                }
                            }],
                            initialValue: {
                                selected: linkType,
                                link: parseInt(linkType, 10) === 1 ? goodsId : linkAddress
                            }
                        })(
                            <LinkType />
                        )}
                    </FormItem>
                    <FormItem className="modal-form-item">
                        <span className="modal-form-item-title">
                            <span style={{color: '#f00' }}>*</span>
                            轮播图片
                        </span>
                        <span>（说明：支持PNG、JPG，建议大小1080X510px，1M以内）</span>
                        <FileCut
                            ref={ref => { this.imageUploader = ref }}
                            width={1080}
                            height={510}
                            dpr={2}
                            defaultImge={picAddress}
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
    searchChange: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    visibleData: PropTypes.objectOf(PropTypes.any),
    modalTitle: PropTypes.objectOf(PropTypes.any),
    modalVisible: PropTypes.bool,
    areaId: PropTypes.string,
}

export default withRouter(Form.create()(ChangeMessage));
