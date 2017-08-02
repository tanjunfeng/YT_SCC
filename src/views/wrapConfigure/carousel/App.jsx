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
import {
    fetchCarouselAdList,
    modifyModalVisible,
    fetchCarouselInterval,
    removeCarouselAd,
    modifyCarouselAd,
    modifyCarouselAdStatus,
    modifyCarouselInterval
} from '../../../actions/wap';

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
        render: (text) =>
        (<img
            alt="轮播图片"
            src={text}
            style={{width: 216, height: 102 }}
        />)
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
        this.handleIntervalChange = this.handleIntervalChange.bind(this);
        this.state = {
            inputValue: '',
            setModalVisible: false,
            parameterModalVisible: false,
            interval: this.props.intervalData,
        }
    }

    componentDidMount() {
        this.props.fetchCarouselAdList();
        this.props.fetchCarouselInterval();
    }

    componentWillReceiveProps(nextProps) {
        const { intervalData } = nextProps;
        if (intervalData !== this.props.intervalData) {
            this.setState({
                interval: intervalData,
            })
        }
    }

    /**
     * 轮播时间切换
     * @param {number} value 选中的option的时间值
     */
    handleIntervalChange(value) {
        modifyCarouselInterval({
            carouselInterval: value
        }).then(() => {
            this.setState({
                interval: value,
            })
            message.success('修改成功！');
        })
    }

    /**
     * “添加”模态框
     */
    showAddModal() {
        this.props.modifyModalVisible({
            isVisible: true,
            mTitle: '新增轮播广告设置'
        });
    }

    /**
     * 表单操作项
     * @param {Object} record 当前行的数据
     * @param {*} items 当前按钮
     */
    handleSelect(record, items) {
        const { id } = record;
        const { key } = items;
        switch (key) {
            case 'changeMessage':
                this.props.modifyModalVisible({
                    isVisible: true,
                    mTitle: '修改轮播广告设置',
                    record
                });
                break;
            case 'tableDelete':
                confirm({
                    title: '你确认要删除此方案吗？',
                    onOk: () => {
                        removeCarouselAd({ carouselAdId: id
                        }).then(() => {
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
                        modifyCarouselAdStatus({
                            id,
                            status: 1
                        }).then(() => {
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
                        modifyCarouselAdStatus({
                            id,
                            status: 0
                        }).then(() => {
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

    /**
     * 表单操作
     * @param {string} text 当前值
     * @param {*} record 当前数据
     */
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
                <div className="carousel-management-tip wap-management-tip">
                    说明：APP端轮播广告管理，可以设定轮播时间、顺序、内容。
                </div>
                <span>
                    <span className="modal-carousel-interval">
                        <span style={{color: '#f00' }}>*</span>
                            轮播间隔
                    </span>
                    <Select
                        className="carousel-management-select"
                        style={{ width: 70 }}
                        value={`${this.state.interval}`}
                        onChange={this.handleIntervalChange}
                    >
                        {lists}
                    </Select>
                </span>
                <Button type="primary" onClick={this.showAddModal}>
                    新增轮播广告
                </Button>
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
            </div>
        );
    }
}

CarouselManagement.propTypes = {
    adData: PropTypes.objectOf(PropTypes.any),
    intervalData: PropTypes.objectOf(PropTypes.any),
    fetchCarouselAdList: PropTypes.func,
    fetchCarouselInterval: PropTypes.func,
    modifyModalVisible: PropTypes.func,
    modalVisible: PropTypes.bool,
};

export default CarouselManagement;

