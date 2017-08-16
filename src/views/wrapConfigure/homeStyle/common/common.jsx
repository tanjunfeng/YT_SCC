import React, {PureComponent} from 'react';
import { Icon, Modal, Input, Form, Button, message, Select } from 'antd';
import classnames from 'classnames';
import {
    setAreaEnable, moveArea, saveItemAd,
    uploadImageBase64Data, batchUpdateQuickNavigation
} from '../../../../service';
import ImageUploader from '../../../../common/preImage';
import FileCut from '../../fileCut';

const FormItem = Form.Item;
const Option = Select.Option;

function Common(WrappedComponent) {
    @Form.create()
    class HOC extends PureComponent {
        constructor(props) {
            super(props);
            this.handleDisable = ::this.handleDisable;
            this.handleEnable = ::this.handleEnable;
            this.handleUp = ::this.handleUp;
            this.handleDown = ::this.handleDown;
            this.handleSaveItem = ::this.handleSaveItem;
            this.handleUpOk = ::this.handleUpOk;
            this.handleUpCancel = ::this.handleUpCancel;
            this.handleUpload = ::this.handleUpload;
            this.hideEditModal = ::this.hideEditModal;
            this.saveItems = ::this.saveItems;
            this.state = {
                img: '',
                isEdit: true,
                select: null
            }
        }

        handleDisable() {
            const { data, fetchAreaList } = this.props;
            setAreaEnable({
                areaId: data.id,
                isEnabled: false
            }).then(() => {
                fetchAreaList();
            })
        }

        handleEnable() {
            const { data, fetchAreaList } = this.props;
            setAreaEnable({
                areaId: data.id,
                isEnabled: true
            }).then(() => {
                fetchAreaList();
            })
        }

        handleUp() {
            const { data, fetchAreaList } = this.props;
            moveArea({
                areaId: data.id,
                isUp: true
            }).then(() => {
                fetchAreaList();
            })
        }

        handleDown() {
            const { data, fetchAreaList } = this.props;
            moveArea({
                areaId: data.id,
                isUp: false
            }).then(() => {
                fetchAreaList();
            })
        }

        handleSaveItem(data) {
            const { fetchAreaList } = this.props;
            return saveItemAd({...data}).then(() => fetchAreaList());
        }

        saveBase64(data) {
            return uploadImageBase64Data(data);
        }

        handleUpOk() {
            const { validateFields, getFieldError } = this.props.form;
            const { isBase64, image } = this.imageUploader.getValue();
            validateFields((err, values) => {
                if (err) return null;
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
                    this.saveItems(values, image);
                }
            })
        }

        saveItems(values, imgUrl) {
            const { current } = this.state;
            const { areaId, id, adType, name, icon } = current;
            const { title, subTitle, url, productNo, urlType } = values;
            saveItemAd({
                id,
                areaId,
                name,
                title,
                subTitle,
                url,
                adType,
                productNo,
                urlType,
                icon: imgUrl ? imgUrl : url
            }).then(() => {
                this.props.fetchAreaList();
                this.setState({
                    uploadVisible: false,
                })
            })
        }

        handleUpCancel() {
            this.setState({
                uploadVisible: false
            })
        }

        handleEdit() {
            this.setState({
                isEdit: true
            })
        }

        handleUpload(item, i) {
            const current = {};
            Object.assign(current, item, i);
            this.setState({
                uploadVisible: true,
                image: item.icon,
                current,
                select: item.urlType
            })
        }

        hideEditModal() {
            this.setState({
                modalVisible: false
            })
        }

        handleDisableFirst = () => {
            const { fetchAreaList, data } = this.props;
            const { itemAds } = data;
            const status = itemAds[4].status;
            const ids = [];
            itemAds.map((itemAds, index) => {
                if (index < 5) {
                    ids.push(itemAds.id)
                }
                return null;
            })
            batchUpdateQuickNavigation({
                ids,
                status: status === 1 ? 0 : 1
            }).then(() => {
                fetchAreaList()
            })
        }

        handleDisablSecond = () => {
            const { fetchAreaList, data } = this.props;
            const { itemAds } = data;
            const status = itemAds[5].status;
            const ids = [];
            itemAds.map((itemAds, index) => {
                if (index >= 5) {
                    ids.push(itemAds.id)
                }
                return null;
            })
            batchUpdateQuickNavigation({
                ids,
                status: status === 1 ? 0 : 1
            }).then(() => {
                fetchAreaList()
            })
        }

        handleLinkStyleChange = (type) => {
            this.setState({
                select: type
            })
        }

        renderModalTile = () => {
            const { type } = this.props;
            switch (type) {
                case 'hot':
                    return '热门推荐配置';
                case 'floor':
                    return '推荐管理配置';
                default:
                    break;
            }
        } 

        render() {
            const { data = {}, type } = this.props;
            const { isEnabled } = data;
            const { getFieldDecorator } = this.props.form;
            const { current } = this.state;
            return (
                <div
                    className={classnames(
                        'home-style-common',
                        {
                            'home-style-common-disable': !isEnabled,
                            'home-style-common-enable': isEnabled,
                            'home-style-common-quick': type === 'quick'
                        })}
                >
                    <WrappedComponent
                        {...this.props}
                        handleSaveItem={this.handleSaveItem}
                        handleUpload={this.handleUpload}
                        saveBase64={this.saveBase64}
                    />
                    <ul className="home-style-common-btns">
                        {
                            type !== 'quick' &&
                            <li className="home-style-common-btns1">
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={this.handleEnable}
                                >
                                    启用
                                </Button>
                            </li>
                        }
                        {
                            type !== 'quick' &&
                            <li className="home-style-common-btns2">
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={this.handleDisable}
                                >
                                    停用
                                </Button>
                            </li>
                        }
                        {
                            type === 'quick' &&
                            <li className="home-style-common-btns2">
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={this.handleDisableFirst}
                                >
                                    {
                                        data.itemAds[4].status === 0
                                        ? '启用第一栏'
                                        : '停用第一栏'
                                    }
                                </Button>
                            </li>
                            
                        }
                        {
                            type === 'quick' &&
                            <li className="home-style-common-btns2">
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={this.handleDisablSecond}
                                >
                                    {
                                        data.itemAds[5].status === 0
                                        ? '启用第二栏'
                                        : '停用第二栏'
                                    }
                                </Button>
                            </li>
                        }
                        {
                            this.props.index !== 0 &&
                            <li className="home-style-common-btns2">
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={this.handleUp}
                                >
                                    上移
                                </Button>
                            </li>
                        }
                        {
                            this.props.index < (this.props.allLength - 1) &&
                            <li className="home-style-common-btns2">
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={this.handleDown}
                                >
                                    下移
                                </Button>
                            </li>
                        }
                    </ul>
                    {
                        this.state.uploadVisible &&
                        <Modal
                            isEnabled
                            title={this.renderModalTile()}
                            visible={this.state.uploadVisible}
                            onOk={this.handleUpOk}
                            onCancel={this.handleUpCancel}
                        >
                            <Form>
                                <FormItem className="home-style-modal-input-item">
                                    <div>序号： {current.prefex}号位</div>
                                </FormItem>
                                <div>
                                    <span>主标题(推荐区域中主标题显示内容，1到20汉字)：</span>
                                    <FormItem className="home-style-modal-input-item">
                                        {getFieldDecorator('title', {
                                            rules: [
                                                {required: true, message: '请输入标题'},
                                                {max: 20, message: '最大长度20个汉字'}
                                            ],
                                            initialValue: current.title
                                        })(
                                            <Input type="text" placeholder="请输入主标题" />
                                        )}
                                    </FormItem>
                                </div>
                                <div>
                                    <span>副标题(推荐区域中副标题显示内容，1到20汉字)：</span>
                                    <FormItem className="home-style-modal-input-item">
                                        {getFieldDecorator('subTitle', {
                                            rules: [
                                                {required: true, message: '请输入标题'},
                                                {max: 20, message: '最大长度20个汉字'}
                                            ],
                                            initialValue: current.subTitle
                                        })(
                                            <Input type="text" placeholder="请输入副标题" />
                                        )}
                                    </FormItem>
                                </div>
                                <div>
                                    <FormItem className="home-style-modal-input-item">
                                        <span className="modal-form-item-title">
                                            <span style={{color: '#f00' }}>*</span>
                                            链接类型：&nbsp;
                                        </span>
                                        {getFieldDecorator('urlType', {
                                            rules: [{
                                                required: true,
                                                message: '请选择链接类型'
                                            }],
                                            initialValue: current.urlType ? `${current.urlType}` : '1'
                                        })(
                                            <Select
                                                style={{ width: 240 }}
                                                onChange={this.handleLinkStyleChange}
                                            >
                                                <Option value="1">商品链接</Option>
                                                <Option value="2">静态活动页面</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </div>
                                {
                                    `${this.state.select}` === '1'
                                    ? <div>
                                        <FormItem className="home-style-modal-input-item">
                                            <span>商品编号：</span>
                                            {getFieldDecorator('productNo', {
                                                rules: [{
                                                    required: true,
                                                    message: '请输入商品编号'
                                                }, {
                                                    max: 20, message: '最大长度20位'
                                                }, {
                                                    pattern: /^[^\u4e00-\u9fa5]+$/,
                                                    message: '不能包含中文'
                                                }],
                                                initialValue: current.productNo
                                            })(
                                                <Input className="home-style-url" type="text" placeholder="请输入商品编号" />
                                            )}
                                        </FormItem>
                                    </div>
                                    : <div>
                                        <FormItem className="home-style-modal-input-item">
                                            <span>超链接：</span>
                                            {getFieldDecorator('url', {
                                                rules: [
                                                    {required: true, message: '请输入超链接'},
                                                    /* eslint-disable */
                                                    {pattern: /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/, message: '请输入正确的url地址'}
                                                    /* eslint-enable */
                                                ],
                                                initialValue: current.url ? current.url : ''
                                            })(
                                                <Input className="home-style-url" type="textarea" rows={2} placeholder="请输入超链接" />
                                            )}
                                        </FormItem>
                                    </div>
                                }
                                <div>
                                    <span>商品icon(支持PNG，建议大小{`${current.width}x${current.height}`}px)：</span>
                                    <FileCut
                                        ref={ref => { this.imageUploader = ref }}
                                        width={current.width}
                                        height={current.height}
                                        dpr={2}
                                        defaultImge={current.icon}
                                        accept={['png']}
                                    />
                                </div>
                            </Form>
                        </Modal>
                    }
                </div>
            )
        }
    }
    return HOC
}

export default Common;
