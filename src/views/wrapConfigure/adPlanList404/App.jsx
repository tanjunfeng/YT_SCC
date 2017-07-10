/**
 * @file App.jsx
 *
 * @author caoyanxuan
 *
 * 404页面广告配置
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Form, Button, Dropdown, Menu, Icon, Modal, message } from 'antd';
import moment from 'moment';
import ChangeModalMessage from './common/changeModalMessage';
import { fetchAllAdPlanList, modifyModalVisible, removeAdPlanById, modifyAdPlanState } from '../../../actions/wap';

const confirm = Modal.confirm;

const columns = [
    {
        title: '方案名称',
        dataIndex: 'planName',
        key: 'planName',
    },
    {
        title: '添加时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text) => (
            <span>
                {moment(parseInt(text, 10)).format('YYYY-MM-DD HH:mm:ss')}
            </span>
        )
    },
    {
        title: '启用状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
            switch (text) {
                case 0:
                    return '未启用'
                case 1:
                    return '已启用'
                default:
                    return null;
            }
        }
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
    }
];

@connect(
    state => ({
        ikData: state.toJS().wap.ikData,
        aaplData: state.toJS().wap.aaplData,
        modalVisible: state.toJS().wap.modalVisible,
    }),
    dispatch => bindActionCreators({
        fetchAllAdPlanList,
        modifyModalVisible,
        removeAdPlanById,
        modifyAdPlanState,
    }, dispatch)
)
class AdPlanList404 extends Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
        this.showAddModal = this.showAddModal.bind(this);
        this.renderOperation = this.renderOperation.bind(this);
        this.state = {
            inputValue: '',
            setModalVisible: false,
        }
    }

    componentDidMount() {
        this.props.fetchAllAdPlanList();
    }

    // “添加”模态框
    showAddModal() {
        this.props.modifyModalVisible({isVisible: true, mTitle: '新增广告方案'});
    }
    // 选择操作项
    handleSelect(record, items) {
        const { id } = record;
        const { key } = items;
        switch (key) {
            case 'changeMessage':
                this.props.modifyModalVisible({isVisible: true, mTitle: '修改广告方案', record });
                break;
            case 'tableDelete':
                confirm({
                    title: '你确认要删除此方案吗？',
                    onOk: () => {
                        this.props.removeAdPlanById({ id
                        }, () => {
                            this.props.fetchAllAdPlanList();
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
                        this.props.modifyAdPlanState({
                            id,
                            status: 1
                        }, () => {
                            this.props.fetchAllAdPlanList();
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
                        this.props.modifyAdPlanState({
                            id,
                            status: 0
                        }, () => {
                            this.props.fetchAllAdPlanList();
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
                {
                    status === 0 &&
                    <Menu.Item key="tableDelete">
                        <a target="_blank" rel="noopener noreferrer">删除</a>
                    </Menu.Item>
                }
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
        const { aaplData } = this.props;// table查询数据
        columns[columns.length - 1].render = this.renderOperation;
        return (
            <div className="advertising-configuration404 wap-management">
                <Button type="primary" className="add-ad-menu" onClick={this.showAddModal}>新增广告方案</Button>
                <div className="area-list">
                    <Table
                        dataSource={aaplData}
                        columns={columns}
                        rowKey="id"
                        footer={null}
                        pagination={false}
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

AdPlanList404.propTypes = {
    aaplData: PropTypes.objectOf(PropTypes.any),
    modifyModalVisible: PropTypes.func,
    fetchAllAdPlanList: PropTypes.func,
    removeAdPlanById: PropTypes.func,
    modifyAdPlanState: PropTypes.func,
    modalVisible: PropTypes.bool
};

export default Form.create()(AdPlanList404);
