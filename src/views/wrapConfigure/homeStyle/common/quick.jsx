import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { message, Form, Modal, Input, Select } from 'antd';
import Common from './common';
import FileCut from '../../fileCut';
import { updateQuickNavigation, uploadImageBase64Data } from '../../../../service';
import LinkType from '../../common/linkType';

const defaultIcon = require('../../../../images/default/132x132.png');

const defaultText = '标题'
const FormItem = Form.Item;
const imgConfig = {
    width: 132,
    height: 132,
    imgWidth: 76,
    imgHeight: 76
}

@Common
class QuickItem extends Component {
    constructor(props) {
        super(props);
        this.handleUpload = :: this.handleUpload;
        this.handleOk = :: this.handleOk;
        this.handleCancel = :: this.handleCancel;
        this.saveItems = :: this.saveItems;
        this.state = {
            isShow: false,
            index: -1,
            select: null
        }
    }

    handleUpload(e) {
        const index = e.target.getAttribute('data-index');
        const { data = {} } = this.props;
        const { itemAds = [] } = data;
        const current = itemAds[index];
        this.setState({
            isShow: true,
            index,
            select: current.navigationType
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
                this.saveItems(values)
            }
        })
    }

    saveItems(values, url) {
        const { id, navigationPosition, picAddress } = this.current;
        const { chooseLink, ...params } = values;
        updateQuickNavigation({
            id,
            navigationPosition,
            picAddress: url ? url : picAddress,
            linkAddress: chooseLink.link,
            goodsId: parseInt(chooseLink.selected, 10) === 1 ? chooseLink.link : null,
            navigationType: chooseLink.selected,
            ...params
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
        }, () => {
            this.props.form.setFieldsValue({ navigationType: type });
        })
    }

    /**
     * 没有总部修改权限的提示
     */
    wrapClick = () => {
        Modal.error({
            title: '错误',
            content: '只有总部权限才能进行快捷导航修改操作'
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { index } = this.state;
        const { data = {} } = this.props;
        const { itemAds = [] } = data;
        const current = itemAds[index];
        this.current = current;
        return (
            <div className="home-style-quick">
                <ul className="home-style-quick-wrap home-style-wrap-1">
                    {
                        itemAds.map((item, index) => {
                            return (
                                <li
                                    className={classnames('home-style-quick-item', { 'home-style-quick-item-disabled': item.status === 0 })}
                                    key={item.id}
                                >
                                    <div
                                        className="home-style-quick-img-wrap"
                                        data-index={index}
                                        onClick={this.handleUpload}
                                    >
                                        <img
                                            data-index={index}
                                            alt="quick"
                                            src={item.picAddress ? item.picAddress : defaultIcon}
                                        />
                                    </div>
                                    <div className="home-style-quick-text">
                                        {item.navigationName ? item.navigationName : defaultText}
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
                {
                    !this.props.isChangeQuick
                        ? <div className="quick-nav-wrap" onClick={this.wrapClick} />
                        : null
                }
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
                                <span className="manage-form-label quick-form-label">序号：</span>
                                <span>{current.navigationPosition}</span>
                            </FormItem>
                            <FormItem className="manage-form-item">
                                <span className="manage-form-label quick-form-label">名称：</span>
                                {getFieldDecorator('navigationName', {
                                    rules: [{
                                        required: true,
                                        message: '请输入名称'
                                    },
                                    { max: 4, message: '最大长度4个字符' },
                                    { min: 2, message: '最小长度2个字符' }
                                    ],
                                    initialValue: current.navigationName
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
                                            if (!value.link) {
                                                callback('请输入链接')
                                            }
                                            callback()
                                        }
                                    }],
                                    initialValue: {
                                        selected: current.navigationType ? `${current.navigationType}` : '1',
                                        link: parseInt(current.navigationType, 10) === 1
                                            ? current.goodsId
                                            : current.linkAddress
                                    }
                                })(
                                    <LinkType />)}
                            </FormItem>
                            <FormItem className={
                                classnames('manage-form-item')
                            }>
                                <span className="manage-form-label quick-form-label">快捷icon：（说明：支持PNG，建议大小132X132px）</span>
                                <FileCut
                                    ref={ref => { this.imgRef = ref }}
                                    width={imgConfig.width}
                                    height={imgConfig.height}
                                    defaultImge={current.picAddress}
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

QuickItem.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    data: PropTypes.objectOf(PropTypes.any),
    fetchAreaList: PropTypes.func,
    isChangeQuick: PropTypes.bool
};

export default Form.create()(QuickItem);
