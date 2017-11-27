/**
 * @file App.jsx
 * @author caoyanxuan,liujinyu
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
    modifyCarouselInterval,
    fetchCarouselArea,
    fetchSwitchOptWayOfCarousel,
    clearAdList
} from '../../../actions/wap';
import SearchItem from '../common/searchItem';

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
        render: (text) => {
            switch (text) {
                case 1:
                    return '商品链接';
                case 2:
                    return '页面链接';
                default:
                    return '';
            }
        }
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
                style={{ width: 216, height: 102 }}
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
        modalVisible: state.toJS().wap.modalVisible
    }),
    dispatch => bindActionCreators({
        fetchCarouselAdList,
        fetchCarouselInterval,
        modifyModalVisible,
        modifyCarouselAd,
        fetchCarouselArea,
        fetchSwitchOptWayOfCarousel,
        clearAdList
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
            intervalData: this.props.intervalData,
            companyId: '',
            isChecked: false,
            // 用户能否修改当前的页面
            isHeadquarters: true
        }
    }

    componentWillReceiveProps(nextProps) {
        const { intervalData } = nextProps;
        if (intervalData.carouselInterval !== this.props.intervalData.carouselInterval) {
            this.setState({
                intervalData: {
                    id: intervalData.id,
                    carouselInterval: intervalData.carouselInterval
                }
            })
        }
    }

    componentWillUnmount() {
        // 页面卸载时清空表格
        this.props.clearAdList()
    }

    /**
    * 点击搜索后的回调
    * @param {object} submitObj 上传参数
    * @param {bool} isHeadquarters 用户是否可以修改当前页面
    */
    searchChange = (submitObj, isHeadquarters) => {
        const { branchCompany, homePageType } = submitObj
        const companyId = branchCompany.id
        const obj = {
            companyId,
            homePageType
        }
        this.setState({
            companyId,
            isHeadquarters
        })
        this.props.fetchCarouselArea(obj)
            .then(res => {
                this.setState({
                    isChecked: res.isUsingNation
                })
                this.props.fetchCarouselAdList({ areaId: res.id })
                this.props.fetchCarouselInterval({ areaId: res.id })
            });
    }

    /**
     * 点击切换运营方式后的回调
     * @param {bloon} isUsingNation 是否为总部运营
     */
    switchChange = (isUsingNation) => {
        const obj = {
            isUsingNation,
            companyId: this.state.companyId
        }
        this.props.fetchSwitchOptWayOfCarousel(obj).then(res => {
            if (res.success) {
                message.success('切换成功')
                this.setState({
                    isChecked: isUsingNation
                })
            } else {
                message.error(res.message)
            }
        })
    }

    /**
     * 轮播时间切换
     * @param {number} value 选中的option的时间值
     */
    handleIntervalChange(value) {
        modifyCarouselInterval({
            id: this.state.intervalData.id,
            carouselInterval: value
        }).then(() => {
            this.setState({
                intervalData: {
                    carouselInterval: value
                }
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
        // 当前用户是否可修改总部运营方式
        if (!this.state.isHeadquarters) {
            Modal.error({
                title: '错误',
                content: '您没有权限修改总部运营方式',
            });
            return;
        }
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
                        removeCarouselAd({
                            carouselAdId: id
                        }).then(() => {
                            this.props.fetchCarouselAdList();
                            this.props.modifyModalVisible({ isVisible: false });
                            message.success('删除成功！');
                        })
                    },
                    onCancel() { },
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
                            this.props.modifyModalVisible({ isVisible: false });
                            message.success('启用成功！');
                        })
                    },
                    onCancel() { },
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
                            this.props.modifyModalVisible({ isVisible: false });
                            message.success('停用成功！');
                        })
                    },
                    onCancel() { },
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
                <SearchItem
                    searchChange={this.searchChange}
                    switchChange={this.switchChange}
                    isChecked={this.state.isChecked}
                />
                {
                    adData.length > 0
                        ? <div>
                            <span>
                                <span className="modal-carousel-interval">
                                    <span style={{ color: '#f00' }}>*</span>
                                    轮播间隔
                                </span>
                                <Select
                                    className="carousel-management-select"
                                    style={{ width: 70 }}
                                    value={`${this.state.intervalData.carouselInterval}`}
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
                        </div>
                        : null
                }
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
    fetchCarouselArea: PropTypes.func,
    fetchSwitchOptWayOfCarousel: PropTypes.func,
    clearAdList: PropTypes.func,
    modalVisible: PropTypes.bool,
};

export default CarouselManagement;

