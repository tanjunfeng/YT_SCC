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

    getFormData = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        const params = this.props.value;
        fileList.forEach((file) => {
            formData.append('file', file);
        });
        Object.keys(params).forEach(key => {
            formData.append([key], params[key]);
        });
        return formData;
    }

    url = `${window.config.apiHost}directStore/fileUpload`;

    handleUpload = () => {
        this.setState({
            uploading: true,
        });
        reqwest({
            url: this.url,
            method: 'post',
            processData: false,
            data: this.getFormData(),
            success: (res) => {
                this.props.onChange(res.data);
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
        const length = this.state.fileList.length;
        const branchCompanyId = this.props.value.branchCompanyId || '';
        const canUpdate = !uploading && length === 0 && branchCompanyId !== '';
        const props = {
            action: this.url,
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
            fileList: this.state.fileList
        };
        return (
            <div className="excel">
                <Upload {...props} className="choos-file">
                    <Button disabled={!canUpdate}>
                        <Icon type="upload" /> 选择文件
                    </Button>
                </Upload>
                <Button
                    className="upload-start"
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
    value: PropTypes.objectOf(PropTypes.any),
    onChange: PropTypes.func
}

export default Excel;
