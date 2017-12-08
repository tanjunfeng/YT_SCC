import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Upload, Icon, message } from 'antd';
import reqwest from 'reqwest';

class UploadZip extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            fileList: [],
            uploading: false
        }
        this.url = props.url;
    }
    getFormData = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        const flowName = this.props.flowName;
        formData.append('fileName', flowName);
        fileList.forEach((file) => {
            formData.append('file', file);
        });
        return formData;
    }
    handleFailure = (err = '上传失败') => {
        this.setState({
            uploading: false
        });
        message.error(err);
    }
    handleUpload = () => {
        reqwest({
            url: this.url,
            method: 'post',
            processData: false,
            data: this.getFormData(),
            success: (res) => {
                if (res.code === 200) {
                    this.setState({
                        fileList: [],
                        uploading: false
                    });
                    message.success('上传成功');
                    this.props.onUploadSuccess();
                } else {
                    this.handleFailure();
                }
            },
            error: err => {
                this.handleFailure(err);
            }
        })
    }
    render() {
        const props = {
            action: this.url,
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                }));
                return false;
            },
            fileList: this.state.fileList
        }
        const {uploading} = this.state;
        return (
            <div className="uploadZip">
                <Upload {...props}>
                    <Button>
                        <Icon type="upload" /> Select File
                    </Button>
                </Upload>
                <Button
                    type="primary"
                    onClick={this.handleUpload}
                    disabled={this.state.fileList.length === 0}
                    loading={uploading}
                >
                    {uploading ? 'Uploading' : 'Start Upload' }
                </Button>
            </div>
        )
    }
}
UploadZip.propTypes = {
    url: PropTypes.string,
    flowName: PropTypes.string,
    onUploadSuccess: PropTypes.func
}
export default UploadZip;
