import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { message, Form, Modal, Input, Select } from 'antd';
import classnames from 'classnames';
import Common from './common';
import FileCut from '../../fileCut';
import { saveItemAd, uploadImageBase64Data } from '../../../../service';

const defaultImge = require('../../../../images/default/1080x280.png');

const FormItem = Form.Item;
const Option = Select.Option;
const imgConfig = {
    width: 1080,
    height: 280,
    imgWidth: 540,
    imgHeight: 140
}

@Common
class BannerItem extends Component {
    constructor(props) {
        super(props);
        this.handleUpload = ::this.handleUpload;
        this.handleOk = ::this.handleOk;
        this.handleCancel = ::this.handleCancel;
        this.saveItems = ::this.saveItems;
        this.state = {
            isShow: false
        }
    }

    handleUpload() {
        this.setState({
            isShow: true
        })
    }

    handleCancel() {
        this.setState({
            isShow: false
        })
    }

    handleOk() {
        this.props.form.validateFields((err, values) => {
            if (err) return null;
            const { isBase64, image } = this.imgRef.getValue();
            if (isBase64 && !image) {
                message.error('请选择需要上传的图片！');
                return null;
            } else if (isBase64) {
                uploadImageBase64Data({
                    base64Content: image
                }).then((res) => {
                    const { fileOnServerUrl } = res.data;
                    this.saveItems(values, fileOnServerUrl);
                })
            } else if (!isBase64) {
                this.saveItems(values);
            }
        })
    }

    saveItems(values, url) {
        const { data = {} } = this.props;
        const { id, itemAds = [] } = data;
        saveItemAd({
            id,
            areaId: itemAds[0].areaId,
            adType: itemAds[0].adType,
            icon: url ? url : itemAds[0].icon,
            ...values
        }).then(() => {
            this.setState({
                isShow: false
            })
            this.props.fetchAreaList();
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { data = {} } = this.props;
        const { itemAds = [] } = data; 
        return (
            <div
                className="home-style-banner"
                onClick={this.handleUpload}
            >
                <img
                    alt="banner"
                    src={itemAds[0].icon ? itemAds[0].icon : defaultImge}
                    width={`${imgConfig.imgWidth}px`}
                    height={`${imgConfig.imgHeight}px`}
                />
                {
                    this.state.isShow &&
                    <Modal
                        title="修改快捷功能设置"
                        visible
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        okText="保存"
                    >
                        <Form className="change-form">
                            <FormItem className="manage-form-item">
                                <span className="manage-form-label banner-form-label">序号：</span>
                                <span>{itemAds[0].areaId}</span>
                            </FormItem>
                            <FormItem className="manage-form-item">
                                <span className="manage-form-label banner-form-label">类型：</span>
                                {getFieldDecorator('urlType', {
                                    rules: [{
                                        required: true,
                                        message: '请选择类型'
                                    }],
                                    initialValue: itemAds[0].urlType.toString()
                                })(
                                    <Select
                                        style={{ width: '153px' }}
                                        size="default"
                                        placeholder="请选择"
                                    >
                                        <Option value="2">静态页面</Option>
                                        <Option value="1">商品链接</Option>
                                    </Select>
                                    )}
                            </FormItem>
                            <FormItem className="manage-form-item">
                                <span className="manage-form-label banner-form-label">名称：</span>
                                {getFieldDecorator('name', {
                                    rules: [{
                                        required: true,
                                        message: '请输入名称'
                                    }],
                                    initialValue: itemAds[0].name
                                })(
                                    <Input
                                        className="manage-form-input"
                                        placeholder="名称"
                                    />
                                    )}
                                <span className="change-form-tip">（说明：2~4个汉字）</span>
                            </FormItem>
                            <FormItem className="application-form-item">
                                <span className="application-modal-label">链接地址：</span>
                                {getFieldDecorator('url', {
                                    rules: [{ required: true, message: '请输入链接地址', whitespace: true }],
                                    initialValue: itemAds[0].url
                                })(
                                    <Input
                                        onChange={this.handleTextChange}
                                        type="textarea"
                                        placeholder="请输入链接地址"
                                        className="application-modal-textarea"
                                        autosize={{ minRows: 2, maxRows: 8 }}
                                    />
                                    )}
                            </FormItem>
                            <FormItem className={
                                classnames('manage-form-item')
                            }>
                                <span className="manage-form-label banner-form-label">快捷icon：（说明：支持PNG，建议大小200X200px，100k以内）</span>
                                <FileCut
                                    ref={ref => { this.imgRef = ref }}
                                    width={imgConfig.width}
                                    height={imgConfig.height}
                                    dpr={3}
                                    defaultImge={itemAds[0].icon}
                                    accept={['jpg', 'jpeg', 'png']}
                                />
                            </FormItem>
                        </Form>
                    </Modal>
                }
            </div>
        );
    }
}

BannerItem.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    data: PropTypes.objectOf(PropTypes.any),
    fetchAreaList: PropTypes.func,
};

export default Form.create()(BannerItem);