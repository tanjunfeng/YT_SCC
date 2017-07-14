/**
 * @file App.jsx
 *
 * @author caoyanxuan
 *
 * 分类图标管理--子组件--模态框
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Modal, Button, message } from 'antd';
import { uploadImageBase64Data } from '../../../service';
import { modifyCategoryIcon, fetchCategoryId } from '../../../actions/wap';
import FileCut from '../fileCut';


@connect(
    state => ({
        ciData: state.toJS().wap.ciData,
    }),
    dispatch => bindActionCreators({
        modifyCategoryIcon,
        fetchCategoryId
    }, dispatch)
)
class CategoryIconTable extends PureComponent {
    constructor(props) {
        super(props);

        this.columns = [
            {
                title: '三级分类名称',
                dataIndex: 'categoryName',
                key: 'categoryName',
            },
            {
                title: 'ICON',
                dataIndex: 'iconUrl',
                key: 'iconUrl',
                render: (text) => (
                    <img
                        alt="未上传"
                        src={text}
                        style={{
                            display: 'inline-block',
                            width: '50px',
                            height: '50px'
                        }}
                    />)
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                onCellClick: (record) => {
                    this.uploadIconModal(record)
                },
                render: () => (
                    <a>上传</a>
                ),
            }
        ];

        this.uploadIconModal = this.uploadIconModal.bind(this);
        this.handleUploadIconOk = this.handleUploadIconOk.bind(this);
        this.handleUploadIconCancel = this.handleUploadIconCancel.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.saveBase64 = this.saveBase64.bind(this);
        this.saveItems = this.saveItems.bind(this);
        this.state = {
            visible: false,
            iconRecord: {},
            img: null
        }
    }

    saveBase64(data) {
        return uploadImageBase64Data(data);
    }

    handleUploadIconOk() {
        const { id } = this.state.iconRecord;
        const { isBase64, image } = this.imageUploader.getValue();
        if (isBase64 && !image) {
            message.error('请选择需要上传的图片！');
            return null;
        } else if (isBase64) {
            uploadImageBase64Data({
                base64Content: image
            }).then((res) => {
                const { fileOnServerUrl } = res.data;
                this.saveItems(id, fileOnServerUrl);
            })
        } else if (!isBase64) {
            return null;
        }
        return null;
    }
    saveItems(id, imgUrl) {
        const { categoryInfos} = this.props;
        const { lv2Id } = categoryInfos;
        this.props.modifyCategoryIcon({
            id,
            iconUrl: imgUrl
        }, () => {
            this.props.fetchCategoryId({ categoryId: lv2Id })
            this.setState({
                visible: false,
                iconRecord: {},
                img: null
            })
        })
    }

    handleUploadIconCancel() {
        this.setState({
            visible: false,
            iconRecord: {},
            img: null
        });
    }
    uploadIconModal(record) {
        this.setState({
            visible: true,
            iconRecord: record
        })
    }

    handleSave() {
        this.setState({
            img: this.imageUploader.getImageByBase64(),
        })
    }
    render() {
        const { ciData, categoryInfos} = this.props;
        const { lv1Name, lv2Name } = categoryInfos;
        const { categoryName: lv3Name, iconUrl} = this.state.iconRecord;
        return (
            <div>
                <Table
                    dataSource={ciData}
                    columns={this.columns}
                    rowKey="categoryName"
                    pagination={false}
                    footer={null}
                />
                {
                    this.state.visible &&
                    <Modal
                        title="三级分类ICON设置"
                        visible={this.state.visible}
                        onOk={this.handleUploadIconOk}
                        onCancel={this.handleUploadIconCancel}
                    >
                        <h4>{lv1Name}&gt;{lv2Name}&gt;{lv3Name}</h4>
                        <p>分类icon：（说明：PNG，建议大小200X200pix）</p>
                        <FileCut
                            ref={ref => { this.imageUploader = ref }}
                            width={200}
                            height={200}
                            dpr={2}
                            defaultImge={iconUrl}
                            accept={['png']}
                        />
                    </Modal>
                }
            </div>
        );
    }
}

CategoryIconTable.propTypes = {
    ciData: PropTypes.objectOf(PropTypes.any),
    categoryInfos: PropTypes.objectOf(PropTypes.any),
    modifyCategoryIcon: PropTypes.func,
    fetchCategoryId: PropTypes.func,

};

export default CategoryIconTable;
