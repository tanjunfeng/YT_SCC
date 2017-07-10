/**
 * @file App.jsx
 *
 * @author caoyanxuan
 *
 * 轮播广告管理
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Menu, Icon, Dropdown, Modal, Button, Select, message } from 'antd';
import { CATEGORY_INTERVAL_LIST } from '../../../constant';
import ChangeModalMessage from './common/changeModalMessage';
import { fetchCarouselAdList, modifyModalVisible, fetchCarouselInterval, removeCarouselAd, modifyCarouselAd, modifyCarouselInterval } from '../../../actions/wap';

const confirm = Modal.confirm;
const Option = Select.Option;

const columns = [
    {
        title: '排序',
        dataIndex: 'sorting',
        key: 'sorting',
    },
    {
        title: '链接类型',
        dataIndex: 'linkType',
        key: 'linkType',
    },
    {
        title: '商品编号',
        dataIndex: 'goodsId',
        key: 'goodsId',
        render: (text = '无编号') => text
    },
    {
        title: '链接地址',
        dataIndex: 'linkAddress',
        key: 'linkAddress',
    },
    {
        title: '图片',
        dataIndex: 'picAddress',
        key: 'picAddress',
        render: (text) => (<img alt="轮播图片" src={text} />)
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => (text === 0 ? '未启用' : '已启用')
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
    }
];

@connect(
    state => ({
        adData: state.toJS().wap.adData,
        intervalData: state.toJS().wap.intervalData,
        modalVisible: state.toJS().wap.modalVisible,

    }),
    dispatch => bindActionCreators({
        fetchCarouselAdList,
        modifyCarouselInterval,
        removeCarouselAd,
        fetchCarouselInterval,
        modifyModalVisible,
        modifyCarouselAd,
    }, dispatch)
)
class CarouselManagement extends Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
        this.showAddModal = this.showAddModal.bind(this);
        this.renderOperation = this.renderOperation.bind(this);
        this.showParameterModal = this.showParameterModal.bind(this);
        this.handleParameterCancel = this.handleParameterCancel.bind(this);
        this.handleIntervalChange = this.handleIntervalChange.bind(this);
        this.state = {
            inputValue: '',
            setModalVisible: false,
            parameterModalVisible: false,
        }
    }

    componentDidMount() {
        this.props.fetchCarouselAdList();
        // this.props.fetchCarouselInterval();
    }

    showParameterModal() {
        this.setState({
            parameterModalVisible: true,
        });
    }

    handleParameterCancel() {
        this.setState({
            parameterModalVisible: false,
        });
    }
    handleIntervalChange(value) {
        console.log(value)
        this.props.modifyCarouselInterval({ carouselInterval: value.key
        }, () => {
            // this.props.fetchCarouselAdList();
            // this.props.modifyModalVisible({isVisible: false });
            // message.success('删除成功！');
        })
        // this.setState({
        //     parameterModalVisible: false,
        // });
    }
// “添加”模态框
    showAddModal() {
        this.props.modifyModalVisible({isVisible: true, mTitle: '新增轮播广告设置'});
    }
    // 选择操作项
    handleSelect(record, items) {
        const { id } = record;
        console.log(typeof (id))
        const { key } = items;
        switch (key) {
            case 'changeMessage':
                this.props.modifyModalVisible({isVisible: true, mTitle: '修改轮播广告设置', record });
                break;
            case 'tableDelete':
                confirm({
                    title: '你确认要删除此方案吗？',
                    onOk: () => {
                        this.props.removeCarouselAd({ carouselAdId: id
                        }, () => {
                            this.props.fetchCarouselAdList();
                            this.props.modifyModalVisible({isVisible: false });
                            message.success('删除成功！');
                        })
                    },
                    onCancel() {},
                });
                break;
            case 'enable':
                confirm({
                    title: '你确认要启用此方案吗？',
                    onOk: () => {
                        this.props.modifyCarouselAd({
                            id,
                            status: 1
                        }, () => {
                            this.props.fetchCarouselAdList();
                            this.props.modifyModalVisible({isVisible: false });
                            message.success('启用成功！');
                        })
                    },
                    onCancel() {},
                });
                break;
            case 'disable':
                confirm({
                    title: '你确认要停用此方案吗？',
                    onOk: () => {
                        this.props.modifyCarouselAd({
                            id,
                            status: 0
                        }, () => {
                            this.props.fetchCarouselAdList();
                            this.props.modifyModalVisible({isVisible: false });
                            message.success('停用成功！');
                        })
                    },
                    onCancel() {},
                });
                break;
            default:

                break;
        }
    }


    // table操作
    renderOperation(text, record) {
        const { status } = record;
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, item)}>
                <Menu.Item key="changeMessage">
                    <a target="_blank" rel="noopener noreferrer">修改</a>
                </Menu.Item>
                <Menu.Item key="tableDelete">
                    <a target="_blank" rel="noopener noreferrer">删除</a>
                </Menu.Item>
                {
                    status === 0 &&
                    <Menu.Item key="enable">
                        <a target="_blank" rel="noopener noreferrer">启用</a>
                    </Menu.Item>
                }
                {
                    status === 1 &&
                    <Menu.Item key="disable">
                        <a target="_blank" rel="noopener noreferrer">停用</a>
                    </Menu.Item>
                }
            </Menu>
        );
        return (
            <Dropdown overlay={menu} placement="bottomCenter">
                <a className="ant-dropdown-link">
                    表单操作 <Icon type="down" />
                </a>
            </Dropdown>
        )
    }

    render() {
        const { adData } = this.props;
        const { data } = this.props.intervalData;
        console.log(data)
        columns[columns.length - 1].render = this.renderOperation;
        const lists = CATEGORY_INTERVAL_LIST.map(item =>
            (<Option
                key={item}
            >
                {item}秒
            </Option>)
        );
        return (
            <div className="carousel-management wap-management">
                <div className="carousel-management-tip wap-management-tip">说明：APP端轮播广告管理，可以设定轮播时间、顺序、内容。</div>
                <Button type="primary" onClick={this.showParameterModal}>参数设置</Button>
                <Button type="primary" onClick={this.showAddModal}>新增轮播广告</Button>
                <div className="area-list">
                    <Table
                        dataSource={adData}
                        columns={columns}
                        pagination={false}
                        rowKey="id"
                        footer={null}
                    />
                </div>
                {
                    this.props.modalVisible &&
                    <ChangeModalMessage />
                }
                <Modal
                    title="轮播参数设置"
                    visible={this.state.parameterModalVisible}
                    onCancel={this.handleParameterCancel}
                    footer={null}
                    maskClosable={false}
                    width={300}
                >
                    <span className="modal-carousel-interval">
                        <span style={{color: '#f00' }}>*</span>
                        轮播间隔
                    </span>
                    <Select
                        labelInValue
                        defaultValue={{ key: '3'}}
                        style={{ width: 80 }}
                        onChange={this.handleIntervalChange}
                    >
                        {lists}
                    </Select>
                </Modal>
            </div>
        );
    }
}

CarouselManagement.propTypes = {
    adData: PropTypes.objectOf(PropTypes.any),
    intervalData: PropTypes.objectOf(PropTypes.any),
    fetchCarouselAdList: PropTypes.func,
    modifyCarouselInterval: PropTypes.func,
    removeCarouselAd: PropTypes.func,
    modifyCarouselAd: PropTypes.func,
    fetchCarouselInterval: PropTypes.func,
    modifyModalVisible: PropTypes.func,
    modalVisible: PropTypes.bool,
};

export default CarouselManagement;

