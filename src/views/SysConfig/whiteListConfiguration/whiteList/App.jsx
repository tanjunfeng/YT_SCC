/*
 * @Author: tanjf
 * @Description: 促销管理 - 优惠券列表
 * @CreateDate: 2017-09-20 14:09:43
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-10-16 20:47:42
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Form, Icon, Menu, Dropdown, message } from 'antd';
import {
    updatePromotionStatus
} from '../../../../actions/promotion';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../../constant';
import { couponList as columns } from '.././columns';
import Utils from '../../../../util/util';
import { queryWhitelist, onlineOffline } from '../../../../actions/whiteListConfiguration';
import ModalOnline from '../modalOnline';
import ModalOffline from '../modalOffline';

@connect(state => ({
    data: state.toJS().queryWhiteList.data
}), dispatch => bindActionCreators({
    queryWhitelist,
    updatePromotionStatus,
    onlineOffline
}, dispatch))

class WhiteListConfiguration extends PureComponent {
    constructor(props) {
        super(props);
        this.param = {};
        this.state = {
            storeIds: [],
            current: 1,
            ModalOnlineVisible: false,
            ModalOfflineVisible: false,
            storeId: '',
            scPurchaseFlag : ''
        };
        this.handlePromotionSearch = this.handlePromotionSearch.bind(this);
        this.handlePromotionReset = this.handlePromotionReset.bind(this);
        this.renderOperations = this.renderOperations.bind(this);
        this.query = this.query.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.onModalOnline = this.onModalOnline.bind(this);
        this.onModalOnlineOk = this.onModalOnlineOk.bind(this);
        this.onModalOnlineCancel = this.onModalOnlineCancel.bind(this);
        this.onModalOffline = this.onModalOffline.bind(this);
        this.onModalOfflineOk = this.onModalOfflineOk.bind(this);
        this.onModalOfflineCancel = this.onModalOfflineCancel.bind(this);
    }

    componentDidMount() {
        this.handlePromotionReset();
        this.query();
    }

    /**
     * 分页页码改变的回调
     */
    onPaginate = (pageNum) => {
        Object.assign(this.param, {
            pageNum
        });
        this.setState({ current: pageNum });
        this.query();
    }

    /**
     * table复选框
     */
    onSelectChange(storeIds) {
        this.setState({ storeIds });
    }

    onModalOnline() {
        this.setState({ModalOnlineVisible: true})
        this.handlePromotionReset();
    }

    onModalOffline() {
        this.setState({ModalOfflineVisible: true})
        this.handlePromotionReset();
    }

    onModalOnlineOk() {
        const { storeIds } = this.state;
        this.handlePromotionReset();
        if (storeIds.length === 0) {
            this.setState({storeId: storeIds[0]});
            this.props.onlineOffline(Utils.removeInvalid({
                storeIds: this.state.storeIds,
                scPurchaseFlag: this.state.scPurchaseFlag
            })).then((res) => {
                if (res.data) {
                    this.setState({ModalOnlineVisible: false, scPurchaseFlag: ''})
                }
                this.setState({scPurchaseFlag: ''})
                this.query();
            }).catch(() => {
                message.error('失败')
            })
        } else {
            this.props.onlineOffline(Utils.removeInvalid({
                storeIds: this.state.storeIds,
                scPurchaseFlag: this.state.scPurchaseFlag
            })).then((res) => {
                if (res.data) {
                    this.setState({ModalOnlineVisible: false})
                }
                this.setState({scPurchaseFlag: ''})
                this.query();
            }).catch(() => {
                message.error('失败')
            })
        }
    }

    onModalOnlineCancel() {
        this.setState({ModalOnlineVisible: false})
    }

    onModalOfflineOk() {
        const { storeIds } = this.state;
        this.handlePromotionReset();
        if (storeIds.length === 0) {
            this.setState({storeId: storeIds[0]});
            this.props.onlineOffline(Utils.removeInvalid({
                storeId: this.state.storeId,
                scPurchaseFlag: this.state.scPurchaseFlag
            })).then((res) => {
                if (res.data) {
                    this.setState({ModalOfflineVisible: false})
                }
                this.query();
            }).catch(() => {
                message.error('失败')
            })
        } else {
            this.props.onlineOffline(Utils.removeInvalid({
                storeIds: this.state.storeIds,
                scPurchaseFlag: this.state.scPurchaseFlag
            })).then((res) => {
                if (res.data) {
                    this.setState({ModalOfflineVisible: false})
                }
                this.query();
            }).catch(() => {
                message.error('失败')
            })
        }
    }

    onModalOfflineCancel() {
        this.setState({ModalOfflineVisible: false})
    }

    query() {
        this.props.queryWhitelist(this.param).then((data) => {
            const { pageNum, pageSize } = data.data;
            Object.assign(this.param, { pageNum, pageSize });
        });
    }

    handlePromotionSearch(param) {
        this.handlePromotionReset();
        this.param = {
            current: 1,
            ...param
        };
        this.query();
    }

    handlePromotionReset() {
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        };
    }

    handleSelect(record, index, item) {
        switch (item.key) {
            case 'Offline':
                this.setState({
                    ModalOfflineVisible: true,
                    scPurchaseFlag: record.scPurchaseFlag,
                    storeId: record.storeId
                });
                break;
            case 'Online':
                this.setState({
                    ModalOnlineVisible: true,
                    scPurchaseFlag: record.scPurchaseFlag,
                    storeId: record.storeId
                });
                break;
            default:
                break;
        }
    }

    /**
     * 列表页操作下拉菜单
     *
     * @param {string} text 文本内容
     * @param {Object} record 模态框状态
     * @param {string} index 下标
     *
     * return 列表页操作下拉菜单
     */
    renderOperations = (text, record, index) => {
        const { scPurchaseFlag } = record;
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                {
                    // 上线
                    (scPurchaseFlag === 1) ?
                        <Menu.Item key="Offline">
                            <a target="_blank" rel="noopener noreferrer">
                                下线
                        </a>
                        </Menu.Item>
                        : null
                }
                {
                    // 下线
                    (scPurchaseFlag !== 1) ?
                        <Menu.Item key="Online">
                            <a target="_blank" rel="noopener noreferrer">
                                上线
                        </a>
                        </Menu.Item>
                        : null
                }
            </Menu>
        );

        return (
            <Dropdown
                overlay={menu}
                placement="bottomCenter"
            >
                <a className="ant-dropdown-link">
                    表单操作 <Icon type="down" />
                </a>
            </Dropdown>
        )
    }

    render() {
        const { data, total, pageNum, pageSize } = this.props.data;
        const { ModalOnlineVisible, ModalOfflineVisible } = this.state;
        const rowSelection = {
            selectedRowKeys: this.state.storeIds,
            onChange: this.onSelectChange
        };
        columns[columns.length - 1].render = this.renderOperations;
        return (
            <div>
                <SearchForm
                    onPromotionSearch={this.handlePromotionSearch}
                    onPromotionReset={this.handlePromotionReset}
                    value={{
                        length: this.state.storeIds.length
                    }}
                    onModalClick={this.onModalOnline}
                    onModalOfflineClick={this.onModalOffline}
                />
                <Table
                    rowSelection={rowSelection}
                    dataSource={data}
                    columns={columns}
                    rowKey="franchiseeId"
                    scroll={{
                        x: 1600
                    }}
                    bordered
                    pagination={{
                        current: this.param.current,
                        pageNum,
                        pageSize,
                        total,
                        showQuickJumper: true,
                        onChange: this.onPaginate
                    }}
                />
                <ModalOnline
                    visible={ModalOnlineVisible}
                    onOk={this.onModalOnlineOk}
                    onCancel={this.onModalOnlineCancel}
                />
                <ModalOffline
                    visible={ModalOfflineVisible}
                    onOk={this.onModalOfflineOk}
                    onCancel={this.onModalOfflineCancel}
                />
            </div>
        );
    }
}

WhiteListConfiguration.propTypes = {
    queryWhitelist: PropTypes.func,
    onlineOffline: PropTypes.func,
    data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
};

export default withRouter(Form.create()(WhiteListConfiguration));
