/**
 * 通过 Excel 导入数据
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Upload, Icon, message } from 'antd';
import reqwest from 'reqwest';
import { pubFetchValueList } from '../../actions/pub';

@connect(() => ({}), dispatch => bindActionCreators({
    pubFetchValueList
}, dispatch))

class Excel extends PureComponent {
    state = {
        fileList: [],
        uploading: false,
    }

    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files[]', file);
        });
        const params = this.props.value;
        Object.keys(params).forEach(key => {
            formData.append([key], params[key]);
        });
        console.log(formData);
        this.setState({
            uploading: true,
        });

        reqwest({
            url: `${window.config.apiHost}directStore/fileUpload`,
            method: 'post',
            processData: false,
            data: formData,
            success: () => {
                this.setState({
                    fileList: [],
                    uploading: false,
                });
                message.success('上传成功');
            },
            error: () => {
                this.setState({
                    uploading: false,
                });
                message.error('上传失败');
            },
        });
    }

    render() {
        const { uploading } = this.state;
        const props = {
            action: '//jsonplaceholder.typicode.com/posts/',
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                }));
                return false;
            },
            fileList: this.state.fileList,
        };
        return (
            <div>
                <Upload {...props}>
                    <Button>
                        <Icon type="upload" /> 选择文件
                    </Button>
                </Upload>
                <Button
                    className="upload-demo-start"
                    type="primary"
                    onClick={this.handleUpload}
                    disabled={this.state.fileList.length === 0}
                    loading={uploading}
                >
                    {uploading ? '正在上传' : '开始上传'}
                </Button>
            </div>
        );
    }
}

Excel.propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.objectOf(PropTypes.any)
}

export default Excel;
