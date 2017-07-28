import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Upload, Button, Icon, Tooltip, DatePicker } from 'antd';
import classnames from 'classnames';
import moment from 'moment';

class InlineUpload extends Component {
    constructor(props) {
        super(props);

        this.handleChange = ::this.handleChange;
        this.handleDelete = ::this.handleDelete;
        this.getValue = ::this.getValue;
        this.handleTimeChange = ::this.handleTimeChange;
        this.result = [];
        this.time = props.defaultTime;
    }

    state = {
        fileList: [],
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.datas &&
            nextProps.datas.length > 0
            && nextProps.datas != this.props.datas
        ) {
            this.result = nextProps.datas;
            this.time = nextProps.defaultTime;
            this.props.onChange(this.result);
        }
    }

    handleTimeChange(date) {
        this.time = date._d * 1;
    }

    handleChange(info) {
        const status = info.file.status;
        if (status === 'done') {
            const { response } = info.file;
            this.result.push(response.data.fileOnServerUrl);
            this.props.onChange({ files: this.result, time: this.time });
        }
        let fileList = info.fileList;
        this.setState({ fileList });
    }

    handleDelete(e) {
        const index = e.target.getAttribute('data-index');
        this.result.splice(index, 1);
        this.props.onChange(this.result);
        this.setState({
            fileList: []
        })
    }

    getValue() {
        return {
            files: this.result,
            time: this.time
        };
    }

    render() {
        const { fileList } = this.state;
        const { limit = 1 } = this.props;
        const { apiHost } = config;
        const props = {
            action: `${apiHost}commonUploadFile/uploadFile`,
            onChange: this.handleChange,
            showUploadList: false
        };
        return (
            <div className={classnames('inline-upload', {'inline-upload-limit': this.result.length >= limit})}>
                {
                    <Upload {...props} fileList={this.state.fileList}>
                        <Tooltip placement="top" title="图片仅支持JPG、GIF、PNG格式的图片，大小不超过1M。">
                            <Button>
                                上传
                            </Button>
                        </Tooltip>
                        
                    </Upload>
                }
                <div className="inline-upload-file">
                    {
                        this.result.map((item, index) => {
                            return (
                                <div
                                    key={item}
                                    style={{display: 'inline-block', marginRight: '6px'}}
                                >
                                    <a
                                        href={item}
                                        target="_blank"
                                        title="点击查看"
                                        className="inline-upload-file-link">
                                        <Icon type="picture" className="inline-upload-file-icon" />
                                    </a>
                                    <a
                                        href={item}
                                        target="_blank"
                                        title="点击查看"
                                        className="inline-upload-file-link"
                                    >
                                        查看
                                    </a>
                                    <span
                                        title="点击删除"
                                        className="inline-upload-file-delete"
                                        data-index={index}
                                        onClick={this.handleDelete}
                                    >
                                        删除
                                    </span>
                                </div>
                            )
                        })
                    }
                    {
                        this.props.showEndTime &&
                        <div className="effective-time-document">
                            <span>证件有效时间：</span>
                            <DatePicker
                                defaultValue={this.time ? moment(this.time) : null}
                                onChange={this.handleTimeChange}
                                format="YYYY-MM-DD"
                            />
                        </div>
                    }
                </div>
            </div>
        );
    }
}

InlineUpload.propTypes = {
    limit: PropTypes.number,
    handleChange: PropTypes.func,
    datas: PropTypes.arrayOf(PropTypes.any),
    onChange: PropTypes.func,
    showEndTime: PropTypes.bool,
    defaultTime: PropTypes.objectOf(PropTypes.any),
};

InlineUpload.defaultProps = {
    handleChange: () => {},
    onChange: () => {},
    showEndTime: false,
    defaultTime: null
}

export default InlineUpload;