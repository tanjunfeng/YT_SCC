import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal, Input, Form, Button } from 'antd';
import classnames from 'classnames';
import Common from './common';
import { format } from './utils';

const FormItem = Form.Item;

const colums = [
    {
        width: 540,
        height: 280,
        prefex: 1,
        imgWidth: 270,
        imgHeight: 140
    },
    {
        width: 270,
        height: 280,
        prefex: 2,
        imgWidth: 133,
        imgHeight: 140
    },
    {
        width: 270,
        height: 280,
        prefex: 3,
        imgWidth: 133,
        imgHeight: 140
    },
    {
        width: 540,
        height: 280,
        prefex: 4,
        imgWidth: 270,
        imgHeight: 140
    },
    {
        width: 240,
        height: 280,
        prefex: 5,
        imgWidth: 133,
        imgHeight: 140
    },
    {
        width: 270,
        height: 280,
        prefex: 6,
        imgWidth: 133,
        imgHeight: 140
    }
]

@Common
class FloorItem extends Component {
    constructor(props) {
        super(props);
        this.handleTitleClick = ::this.handleTitleClick;
        this.handleTitleOk = ::this.handleTitleOk;
        this.handleTitleCancel = ::this.handleTitleCancel;
        this.handleUpload = ::this.handleUpload;

        this.state = {
            titleVisible: false,
            uploadVisible: false,
            current: {},
        }

        this.selectData = {};
    }

    handleTitleClick(data) {
        this.selectData = data;
        this.setState({
            titleVisible: true
        })
    }

    handleTitleOk() {
        const { handleSaveItem } = this.props;
        const { validateFields, getFieldsValue, getFieldError } = this.props.form;
        validateFields((err) => {
            if (!err) {
                const { areaId, id, adType, name  } = this.selectData;
                const { title, url } = getFieldsValue();
                handleSaveItem({
                    id,
                    areaId,
                    name,
                    title,
                    url,
                    adType
                }).then(() => {
                    this.setState({
                        titleVisible: false
                    })
                })
            }
        })
    }

    handleTitleCancel() {
        this.setState({
            titleVisible: false
        })
    }

    handleUpload(item, i) {
        this.props.handleUpload(item, i);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props;
        this.formatData = format(data);
        const formatData = this.formatData;
        return (
            <div className="home-style-floor">
                <div className="home-style-floor-title" onClick={(e) => this.handleTitleClick(formatData[`${data.id}-title`], e)}>
                    <div className="home-style-floor-text">{formatData[`${data.id}-title`].title}<Icon type="edit" /></div>
                    <div className="home-style-floor-more" title={formatData[`${data.id}-title`].url}>更多<Icon type="right" /></div>
                </div>
                <div>
                    <div className="home-style-floor-imgs">
                        {
                            colums.map((i, index) => {
                                const id = `${data.id}-${i.prefex}`;
                                const item = formatData[id] ? formatData[id] : {
                                    id,
                                    areaId: data.id,
                                    name: `${id}号位`,
                                    title: null,
                                    subTitle: null,
                                    url: null,
                                    icon: null,
                                    adType: "FLOOR"
                                };
                                return (<div
                                    className={classnames("home-style-floor-item", {
                                        "home-style-floor-item1": index % 3 === 0,
                                        "home-style-floor-item2": index === 1 || index === 2 || index === 4 || index === 5,
                                    })}
                                    key={i.prefex}
                                    onClick={(e) => this.handleUpload(item, i, e)}
                                >
                                    <img src={item.icon ? item.icon : require(`../../../../images/default/${i.width}x${i.height}.png`)} width={i.imgWidth} height={i.imgHeight} />
                                </div>)
                            })
                        }
                    </div>
                </div>
                {
                    this.state.titleVisible &&
                    <Modal
                        title="楼层栏目设置"
                        visible={this.state.titleVisible}
                        onOk={this.handleTitleOk}
                        onCancel={this.handleTitleCancel}
                    >
                        <Form>
                            <div>
                                <span>栏目标题(10个字节以内)：</span>
                                <FormItem className="home-style-modal-input-item">
                                    {getFieldDecorator('title', {
                                        rules: [
                                            {required: true, message: '请输入标题'},
                                            {max: 10, message: '最大长度10个字节'}
                                        ],
                                        initialValue: formatData[`${data.id}-title`].title
                                    })(
                                        <Input type="text" placeholder="请输入标题" />
                                    )}
                                </FormItem>
                            </div>
                            <div>
                                <span>超链接：</span>
                                <FormItem className="home-style-modal-input-item">
                                    {getFieldDecorator('url', {
                                        rules: [
                                            {required: true, message: '请输入超链接'},
                                            {pattern: /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/, message: '请输入正确的url地址'}
                                        ],
                                        initialValue: formatData[`${data.id}-title`].url
                                    })(
                                        <Input type="textarea" rows={2} placeholder="请输入超链接" />
                                    )}
                                </FormItem>
                            </div>
                        </Form>
                    </Modal>
                }
            </div>
        );
    }
}

FloorItem.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    data: PropTypes.objectOf(PropTypes.any),
    handleSaveItem: PropTypes.func,
    saveBase64: PropTypes.func,
    handleUpload: PropTypes.func,
};

FloorItem.defaultProps = {
    handleSaveItem: () => {},
    handleUpload: () => {}
}

export default Form.create()(FloorItem);