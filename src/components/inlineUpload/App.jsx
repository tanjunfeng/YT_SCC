import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import {
    Upload, Button, Icon, Tooltip,
    DatePicker, Popconfirm, message
} from 'antd';
import classnames from 'classnames';
import moment from 'moment';

class InlineUpload extends Component {
    constructor(props) {
        super(props);

        this.handleChange = ::this.handleChange;
        this.handleDelete = ::this.handleDelete;
        this.getValue = ::this.getValue;
        this.handleTimeChange = ::this.handleTimeChange;
        this.time = props.defaultTime;
    }

    state = {
        fileList: [],
        result: this.props.datas.filter((item) => {
            return !!item
        })
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.datas
            && nextProps.datas.length > 0
            && nextProps.datas.length !== this.props.datas.length
        ) {
            const newResut = nextProps.datas.filter((item) => {
                return !!item
            })
            this.time = nextProps.defaultTime;
            this.setState({
                fileList: newResut,
                result: newResut
            }, () => {
                this.props.onChange(this.state.result);
            })
        }
    }

    handleTimeChange(date) {
        this.time = date._d * 1;
    }

    handleChange(info) {
        const status = info.file.status;
        if (status === 'done') {
            const { response } = info.file;
            const { result } = this.state;
            const { imageDomain, suffixUrl } = response.data;
            response.data.fileOnServerUrl = `${imageDomain}/${suffixUrl}`
            result.push(response.data.fileOnServerUrl);
            this.setState({
                result
            }, () => {
                this.props.onChange({ files: result, time: this.time });
            })
        }
        let fileList = info.fileList;
        this.setState({ fileList });
    }

    handleDelete(e) {
        const { result } = this.state;
        const index = e.target.getAttribute('data-index');
        result.splice(index, 1);
        this.setState({
            fileList: [],
            result
        }, () => {
            this.props.onChange(result);
        })
    }

    getValue() {
        return {
            files: this.state.result,
            time: this.time
        };
    }

    render() {
        const { fileList, result } = this.state;
        const { limit = 1, id } = this.props;
        const { apiHost } = config;
        const props = {
            action: `${apiHost}commonUploadFile/uploadFile`,
            onChange: this.handleChange,
            showUploadList: false
        };
        return (
            <div key={id} className={classnames('inline-upload', {'inline-upload-limit': result.length >= limit})}>
                {
                    <Upload {...props} fileList={this.state.fileList}>
                        <Tooltip placement="top" title={this.props.title}>
                            <Button>
                                上传
                            </Button>
                        </Tooltip>
                        
                    </Upload>
                }
                <div className="inline-upload-file">
                    {
                        result.map((item, index) => {
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
                                    <Popconfirm
                                        title="确定删除该文件?"
                                        data-index={index}
                                        onConfirm={this.handleDelete}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        <span
                                            title="点击删除"
                                            className="inline-upload-file-delete"
                                            data-index={index}
                                        >
                                            删除
                                        </span>
                                    </Popconfirm>
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
    defaultTime: PropTypes.objectOf([PropTypes.objectOf(PropTypes.any), PropTypes.number]),
    title: PropTypes.string,
    id: PropTypes.string,
};

InlineUpload.defaultProps = {
    handleChange: () => {},
    onChange: () => {},
    showEndTime: false,
    defaultTime: null,
    title: '图片仅支持JPG、GIF、PNG格式的图片，大小不超过1M。',
    id: ''
}

export default InlineUpload;