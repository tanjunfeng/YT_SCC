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
import { Table, Modal, message } from 'antd';
import { uploadImageBase64Data } from '../../../service';
import { modifyCategoryIcon } from '../../../actions/wap';
import { fetchCategorysById } from '../../../actions/pub';
import FileCut from '../fileCut';


@connect(
    state => ({
        categorys: state.toJS().pub.categorys,
    }),
    dispatch => bindActionCreators({
        fetchCategorysById
    }, dispatch)
)
class CategoryIconTable extends PureComponent {
    constructor(props) {
        super(props);

        this.columns = [
            {
                title: '四级分类名称',
                dataIndex: 'categoryName',
                key: 'categoryName',
            },
            {
                title: 'ICON',
                dataIndex: 'iconImg',
                key: 'iconImg',
                width: 80,
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
                width: 80,
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
        this.saveItems = this.saveItems.bind(this);
        this.state = {
            visible: false,
            iconRecord: {},
            img: null
        }
    }

    /**
     * 模态框确认-将base64图片上传服务器
     */
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
                const { imageDomain, suffixUrl } = res.data;
                this.saveItems(id, `${imageDomain}/${suffixUrl}`);
            })
        } else if (!isBase64) {
            this.setState({
                visible: false,
                iconRecord: {},
                img: null
            }, () => {
                message.warning('您未做修改！');
            })
            return null;
        }
        return null;
    }

    /**
     * 上传或修改图标，并刷新第四级以回显
     * @param {string} id 对应的第四级图标的id
     * @param {string} imgUrl 对应的图标
     */
    saveItems(id, imgUrl) {
        const { lv3Id } = this.props.categoryInfos;
        modifyCategoryIcon({
            id,
            iconImg: imgUrl
        }).then(() => {
            this.props.fetchCategorysById({parentId: lv3Id});
            this.setState({
                visible: false,
                iconRecord: {},
                img: null
            }, () => {
                message.success('上传/修改成功！');
            })
        })
    }

    /**
     * 关闭模态框
     */
    handleUploadIconCancel() {
        this.setState({
            visible: false,
            iconRecord: {},
            img: null
        });
    }

    /**
     * 上传按钮
     * @param {Object} record 上传按钮该行的数据
     */
    uploadIconModal(record) {
        this.setState({
            visible: true,
            iconRecord: record
        })
    }

    render() {
        const { lv1Name, lv2Name, lv3Name, fourthArr } = this.props.categoryInfos;
        const { categoryName, iconImg} = this.state.iconRecord;
        return (
            <div>
                <Table
                    dataSource={fourthArr}
                    columns={this.columns}
                    rowKey="id"
                    pagination={false}
                    footer={null}
                    scroll={{ y: 435 }}
                />
                {
                    this.state.visible &&
                    <Modal
                        title="三级分类ICON设置"
                        visible={this.state.visible}
                        maskClosable={false}
                        onOk={this.handleUploadIconOk}
                        onCancel={this.handleUploadIconCancel}
                    >
                        <h4>{lv1Name}&gt;{lv2Name}&gt;{lv3Name}&gt;{categoryName}</h4>
                        <p>分类icon：（说明：PNG，建议大小200X200pix）</p>
                        <div className="category-icon-modal-file-cut">
                            <FileCut
                                ref={ref => { this.imageUploader = ref }}
                                width={200}
                                height={200}
                                dpr={2}
                                defaultImge={iconImg}
                                accept={['png']}
                            />
                        </div>
                    </Modal>
                }
            </div>
        );
    }
}

CategoryIconTable.propTypes = {
    categoryInfos: PropTypes.objectOf(PropTypes.any),
    fetchCategorysById: PropTypes.func,
};

export default CategoryIconTable;
