import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Menu, Dropdown, Icon } from 'antd';

import { fetchQuickNavigationList, showEditModal } from '../../../actions/wap';

const columns = [
    {
        title: '位置',
        dataIndex: 'navigationPosition',
        key: 'navigationPosition',
    },
    {
        title: '类型',
        dataIndex: 'navigationType',
        key: 'navigationType',
    },
    {
        title: '名称',
        dataIndex: 'navigationName',
        key: 'navigationName'
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
        render: (text) => (<img src={text} title="" alt="" width="30px" height="30px" />)
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
    }
];

@connect(
    state => ({
        naData: state.toJS().wap.naData,
        modalVisible: state.toJS().wap.modalVisible,
    }),
    dispatch => bindActionCreators({
        fetchQuickNavigationList,
        showEditModal
    }, dispatch)
)
class QuickNavigation extends Component {
    constructor(props) {
        super(props);
        this.renderHandle = ::this.renderHandle;
        columns[columns.length - 1].render = this.renderHandle;
    }

    componentDidMount() {
        this.props.fetchQuickNavigationList()
    }

    handleSelect(record, index, item) {
        const { key } = item;
        switch (key) {
            case 'modify':
                this.props.showEditModal({modalShow: true, record})
                break;
            default :

                break;
        }
    }

    renderHandle(text, record, index) {
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                <Menu.Item key="modify">
                    <span>修改</span>
                </Menu.Item>
            </Menu>
        )
        return (
            <Dropdown overlay={menu} placement="bottomCenter" record>
                <a className="ant-dropdown-link">
                    表单操作 <Icon type="down" />
                </a>
            </Dropdown>
        )
    }

    render() {
        const { naData } = this.props;
        return (
            <div className="carousel-management wap-management">
                <div className="carousel-management-tip wap-management-tip">
                    说明：移动端快捷导航功能管理模块管理移动端轮播广告以及横幅广告一下快捷方式入口。10个快捷位置必须要有相应快捷内容，内容可以替换。
                </div>
                <div className="area-list">
                    <Table
                        dataSource={naData}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        footer={null}
                    />
                </div>
            </div>
        );
    }
}

QuickNavigation.propTypes = {
    naData: PropTypes.objectOf(PropTypes.any),
    fetchQuickNavigationList: PropTypes.func,
    showEditModal: PropTypes.func,
};

export default QuickNavigation;

