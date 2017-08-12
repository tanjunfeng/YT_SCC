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
import { Form, Button, message, Input } from 'antd'
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

        this.state = {
            content: '',
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
                content: res.description
            })
        )).catch(() => {

        });
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    updateContent(newContent) {
        this.setState({
            content: newContent
        })
    }

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

    render() {
        if (this.state.content.length === 0) {
            return null
        }
        return (
            <div className="editorPages">
                <div className="editorPages-form">
                    <FormItem label="提示:" className="tjf-css-ts" />
                    <div style={{paddingTop: 10, paddingBottom: 10, display: 'flex'}}>
                        <Button type="primary">获取图片链接</Button>
                        <Input placeholder="图片链接" style={{width: 800, marginLeft: 10}} />
                    </div>
                    <CKEditor
                        activeClass="p10"
                        content={this.state.content}
                        onChange={this.updateContent}
                        config={{
                            filebrowserImageUploadUrl:
                            `${config.apiHost}commonUploadFile/uploadFile`
                        }}
                    />
                    <div className="classify-select-btn-warp tjf-css-footer">
                        <FormItem>
                            <div>
                                提示:
                                如果进行多次编辑并发布，
                                静态页的url地址可能会改变~请检查确认清楚再发布哟！</div>
                        </FormItem>
                        <Button
                            className="tjf-css-submit"
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
    validateFields: PropTypes.func,
    fectheEditorContent: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    editorList: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(EditorPages));
