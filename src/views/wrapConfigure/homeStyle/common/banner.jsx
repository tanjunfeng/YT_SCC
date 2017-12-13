/**
 * @file App.jsx
 * @author caoyanxuan,liujinyu
 *
 * 快捷导航
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { message, Form, Modal, Input } from 'antd';
import classnames from 'classnames';
import Utils from '../../../../util/util';
import Common from './common';
import FileCut from '../../fileCut';
import { saveItemAd, uploadImageBase64Data } from '../../../../service';
import LinkType from '../../common/linkType';

const defaultImge = require('../../../../images/default/1080x280.png');

const FormItem = Form.Item;
const imgConfig = {
    width: 1080,
    height: 240,
    imgWidth: 540,
    imgHeight: 120
}

@Common
class BannerItem extends Component {
    constructor(props) {
        super(props);
        this.handleUpload = :: this.handleUpload;
        this.handleOk = :: this.handleOk;
        this.handleCancel = :: this.handleCancel;
        this.saveItems = :: this.saveItems;
        const { data = {} } = props;
        const { itemAds = [] } = data;
        this.state = {
            isShow: false,
            select: itemAds[0].urlType
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
                    const { imageDomain, suffixUrl } = res.data;
                    this.saveItems(values, `${imageDomain}/${suffixUrl}`);
                })
            } else if (!isBase64) {
                this.saveItems(values);
            }
            return null;
        })
    }

    saveItems(values, ImageUrl) {
        const { data = {} } = this.props;
        const { id, itemAds = [] } = data;
        const { url, chooseLink, ...params } = values;
        const { selected, goodsId, linkAddress, linkId, linkKeyword } = chooseLink;
        const submitObj = {
            urlType: selected,
            productNo: goodsId,
            url: linkAddress,
            linkId,
            linkKeyword
        }

        saveItemAd({
            ...Utils.removeInvalid(Object.assign({
                id,
                areaId: itemAds[0].areaId,
                adType: itemAds[0].adType,
                icon: ImageUrl || itemAds[0].icon,
                ...params
            }, submitObj))
        }).then(() => {
            this.setState({
                isShow: false
            })
            this.props.fetchAreaList();
        })
    }

    handleLinkStyleChange = (type) => {
        this.setState({
            select: type
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { data = {} } = this.props;
        const { itemAds = [] } = data;
        const {
            urlType,
            url,
            productNo,
            linkId,
            linkKeyword
        } = itemAds[0]
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
                        title="横幅广告配置"
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
                                    />)}
                                <span className="change-form-tip">（说明：2~4个汉字）</span>
                            </FormItem>
                            <FormItem className="manage-form-item">
                                {getFieldDecorator('chooseLink', {
                                    rules: [{
                                        required: true
                                    }, {
                                        validator: (rule, value, callback) => {
                                            if (!value.goodsId
                                                && !value.linkAddress
                                                && !value.linkId
                                                && !value.linkKeyword) {
                                                callback('请完成表单')
                                            }
                                            callback()
                                        }
                                    }],
                                    initialValue: {
                                        selected: urlType,
                                        linkAddress: url,
                                        goodsId: productNo,
                                        linkId,
                                        linkKeyword
                                    }
                                })(
                                    <LinkType />)}
                            </FormItem>
                            <FormItem className={classnames('manage-form-item')} >
                                <span className="manage-form-label banner-form-label">快捷icon：（说明：支持PNG，建议大小1080X240px）</span>
                                <FileCut
                                    ref={ref => { this.imgRef = ref }}
                                    width={imgConfig.width}
                                    height={imgConfig.height}
                                    dpr={3}
                                    defaultImge={itemAds[0].icon}
                                    accept={['png']}
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
