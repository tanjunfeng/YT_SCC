/**
 * @file App.jsx
 * @author Tan junfeng
 *
 * ckeditor编辑器
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button, message, Upload, Icon, Input } from 'antd'
import CopyToClipboard from 'react-copy-to-clipboard';
import CKEditor from 'react-ckeditor-component';

import {
    fectheEditorContent,
} from '../../../actions';
import fectheEditorList from '../../../actions/fetch/fetchEditorList';

const FormItem = Form.Item;

@connect(
    state => ({
        findstaticpagelist: state.toJS().mediaManage.findstaticpagelist,
        editorList: state.toJS().mediaManage.editorList,
    }),
    dispatch => bindActionCreators({
        fectheEditorList,
        fectheEditorContent,
    }, dispatch)
)
class EditorPages extends Component {
    constructor(props) {
        super(props);

        this.updateContent = this.updateContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onCopy = this.onCopy.bind(this);

        this.state = {
            content: '',
            fileList: [],
            defaultFileList: []
        }
    }

    componentDidMount() {
        const { match } = this.props;
        const { params } = match;
        const { ckEditor } = params;
        const id = ckEditor;
        this.props.fectheEditorList({
            id,
            shelfStatus: 0
        })
        .then((res) => (
            this.setState({
                content: res.description,
                defaultFileList: []
            })
        )).catch(() => {

        });
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    /**
     * 复制图片链接（已经上传一张时）
     */
    onCopy() {
        message.success('已经将图片链接复制到粘贴板!如果粘贴失败，请在显示框里手动粘贴!')
    }

    /**
     * 复制图片链接（为空时）
     */
    // onCopyErr() {
    //     message.error('未检测到上传图片，请先上传！')
    // }

    handleSubmit() {
        const data = this.props.editorList;
        const { id } = data;
        const pageContent = this.state.content;
        this.props.form.validateFields(() => {
            this.props.fectheEditorContent({
                id,
                pageContent
            }).then(() => {
                message.success('修改成功！')
                this.timer = setTimeout(() => {
                    this.props.history.goBack();
                }, 1000)
            }).catch((error2) => {
                message.error(error2.message);
            });
        })
    }

    updateContent(newContent) {
        this.setState({
            content: newContent
        })
    }

    handleChange = (info) => {
        let fileList = info.fileList;
        // 2. 读取远程路径并显示链接。
        fileList = fileList.map((file) => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });
        // if (fileList.length > 0) {
        //     console.log(fileList[fileList.length - 1])
        //     this.setState({ fileList: fileList[fileList.length - 1] });
        // } else {
        //     this.setState({ fileList });
        // }
        this.setState({
            fileList: fileList ? fileList.splice(-1) : []
        });
    }

    render() {
        const { match = {}, prefixCls } = this.props;
        const { fileList = [] } = this.state;
        const { params } = match;
        const { id } = params;
        const names = {
            action: '/api/sc/commonUploadFile/uploadFile',
            onChange: this.handleChange,
            multiple: false,
        };
        const responseData = fileList[0]
            ? fileList[0].response
            : null;
        const imgData = responseData
            ? `${responseData.data.imageDomain}/${responseData.data.suffixUrl}`
            : '';
        return (
            <div className={`${prefixCls} editorPages`}>
                <div className={`${prefixCls} editorPages-form`}>
                    <FormItem
                        label="提示:"
                        className={`${prefixCls} ${prefixCls}-css-ts editorPages-form`}
                    />
                    <div
                        className={`${prefixCls}-lines`}
                        style={{display: 'flex',
                            lineHeight: '28px'}}
                    >
                        <Upload
                            {...names}
                            fileList={this.state.fileList}
                        >
                            <Button type="primary">
                                <Icon type="upload" />上传图片
                            </Button>
                        </Upload>
                        <Input
                            value={imgData || ''}
                            style={{ width: 500, height: 28, marginLeft: 10 }}
                        />
                        <Button
                            type="primary"
                            className={`${prefixCls}-btn`}
                        >
                            <CopyToClipboard
                                /* onCopy={fileList.length > 0 ? this.onCopy : this.onCopyErr} */
                                text={imgData}
                                onCopy={this.onCopy}
                            >
                                <span>点击复制上传图片链接</span>
                            </CopyToClipboard>
                        </Button>
                    </div>
                    <CKEditor
                        activeClass="p10"
                        content={this.state.content}
                        onChange={this.updateContent}
                    />
                    <div className="classify-select-btn-warp editorPages-css-footer">
                        <FormItem>
                            <div>
                                提示:
                                如果进行多次编辑并发布，
                                静态页的url地址可能会改变~请检查确认清楚再发布哟！</div>
                        </FormItem>
                        <Button
                            className="prefixCls-css-submit"
                            type="primary"
                            size="default"
                            onClick={this.handleSubmit}
                        >发布
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

EditorPages.propTypes = {
    fectheEditorList: PropTypes.func,
    prefixCls: PropTypes.string,
    validateFields: PropTypes.func,
    fectheEditorContent: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    editorList: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
}

EditorPages.defaultProps = {
    prefixCls: 'EditorPages'
};

export default withRouter(Form.create()(EditorPages));
