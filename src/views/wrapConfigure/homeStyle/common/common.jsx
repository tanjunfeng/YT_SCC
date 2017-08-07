import React, {PureComponent} from 'react';
import { Icon, Modal, Input, Form, Button, message } from 'antd';
import classnames from 'classnames';
import { setAreaEnable, moveArea, saveItemAd, uploadImageBase64Data } from '../../../../service';
import ImageUploader from '../../../../common/preImage';
import FileCut from '../../fileCut';

const  FormItem = Form.Item;

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
                isEdit: true
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
                        const { fileOnServerUrl } = res.data;
                        this.saveItems(values, fileOnServerUrl);
                    })
                } else if (!isBase64) {
                    this.saveItems(values);
                }
            })
        }

        saveItems(values, imgUrl) {
            const { current } = this.state;
            const { areaId, id, adType, name, icon } = current;
            const { title, subTitle, url, productNo } = values;
            saveItemAd({
                id,
                areaId,
                name,
                title,
                subTitle,
                url,
                adType,
                productNo,
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
                current
            })
        }

        hideEditModal() {
            this.setState({
                modalVisible: false
            })
        }

        render() {
            const { data = {} } = this.props;
            const { isEnabled } = data;
            const { getFieldDecorator } = this.props.form;
            const { current } = this.state;
            return (
                <div
                    className={classnames(
                        'home-style-common',
                        {
                            'home-style-common-disable': !isEnabled,
                            'home-style-common-enable': isEnabled
                        })}
                >
                    <WrappedComponent
                        {...this.props}
                        handleSaveItem={this.handleSaveItem}
                        handleUpload={this.handleUpload}
                        saveBase64={this.saveBase64}
                    />
                    <ul className="home-style-common-btns">
                        <li className="home-style-common-btns1">
                            <Button
                                type="primary"
                                size="large"
                                onClick={this.handleEnable}
                            >
                                启用
                            </Button>
                        </li>
                        <li className="home-style-common-btns2">
                            <Button
                                type="primary"
                                size="large"
                                onClick={this.handleDisable}
                            >
                                停用
                            </Button>
                        </li>
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
                            title={current.name}
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
                                    <span>商品编号(须填写对应商品编号/非必填)：</span>
                                    <FormItem className="home-style-modal-input-item">
                                        {getFieldDecorator('productNo', {
                                            rules: [
                                                {max: 20, message: '最大长度20个汉字'}
                                            ],
                                            initialValue: current.productNo
                                        })(
                                            <Input type="text" placeholder="请输入商品编号" />
                                        )}
                                    </FormItem>
                                </div>
                                <div>
                                    <span>超链接：</span>
                                    <FormItem className="home-style-modal-input-item">
                                        {getFieldDecorator('url', {
                                            rules: [
                                                {required: true, message: '请输入超链接'},
                                                /* eslint-disable */
                                                {pattern: /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/, message: '请输入正确的url地址'}
                                                /* eslint-enable */
                                            ],
                                            initialValue: current.url
                                        })(
                                            <Input type="textarea" rows={2} placeholder="请输入超链接" />
                                        )}
                                    </FormItem>
                                </div>
                                <div>
                                    <span>商品icon(支持PNG，建议大小{`${current.width}x${current.height}`}px，100k以内)：</span>
                                    <FileCut
                                        ref={ref => { this.imageUploader = ref }}
                                        width={current.width}
                                        height={current.height}
                                        dpr={2}
                                        defaultImge={current.icon}
                                        accept={['jpg', 'jpeg', 'png']}
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
