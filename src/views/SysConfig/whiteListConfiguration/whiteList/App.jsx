/*
 * @Author: tanjf
 * @Description: 促销管理 - 优惠券列表
 * @CreateDate: 2017-09-20 14:09:43
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-12-05 11:45:38
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
import {
    queryWhitelist,
    onlineWhitelist,
    offlineWhitelist
} from '../../../../actions/whiteListConfiguration';
import { whiteListBatchExport, whiteListBatchDownload } from '../../../../service';
import ModalOnline from '../modalOnline';
import ModalOffline from '../modalOffline';

@connect(state => ({
    data: state.toJS().queryWhiteList.data
}), dispatch => bindActionCreators({
    queryWhitelist,
    updatePromotionStatus,
    onlineWhitelist,
    offlineWhitelist
}, dispatch))

class WhiteListConfig extends PureComponent {
    constructor(props) {
        super(props);
        this.param = {};
        this.state = {
            chooseGoodsList: [],
            selectedListData: {},
            current: 1,
            ModalOnlineVisible: false,
            ModalOfflineVisible: false,
            storeId: '',
            onlineObj: {}
        };
        this.handlePromotionSearch = this.handlePromotionSearch.bind(this);
        this.handlePromotionReset = this.handlePromotionReset.bind(this);
        this.renderOperations = this.renderOperations.bind(this);
        this.query = this.query.bind(this);
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
    onPaginate = (pageNo) => {
        Object.assign(this.param, {
            pageNo,
        });
        this.setState({ current: pageNo }, () => {
            this.query();
        });
    }

    onModalOnline() {
        this.setState({ ModalOnlineVisible: true })
    }

    onModalOffline() {
        this.setState({ ModalOfflineVisible: true })
    }

    onModalOnlineOk({ warehouseCode, warehouseName }) {
        this.handlePromotionReset();
        const { chooseGoodsList, onlineObj } = this.state;
        if ((onlineObj.provinceName === null ||
            onlineObj.cityName === null ||
            onlineObj.districtName === null ||
            onlineObj.address === null ||
            onlineObj.contact === null ||
            onlineObj.mobilePhone === null) && chooseGoodsList.length === 1) {
            message.error('商家信息不完整，请去主数据完善后上线')
        } else {
            this.props.onlineWhitelist(Utils.removeInvalid({
                warehouseCode,
                warehouseName,
                storeIds: chooseGoodsList
            })).then((res) => {
                if (res.code === 200) {
                    message.success(res.data)
                    this.setState({ ModalOnlineVisible: false })
                    this.query();
                }
            }).catch((res) => {
                message.error(res.data)
            })
        }
    }

    onModalOnlineCancel() {
        this.setState({ ModalOnlineVisible: false })
    }

    onModalOfflineOk() {
        this.handlePromotionReset();
        const { chooseGoodsList } = this.state;
        if (chooseGoodsList <= 1) {
            this.props.offlineWhitelist(Utils.removeInvalid({
                storeIds: chooseGoodsList
            })).then((res) => {
                if (res.code === 200) {
                    message.success(res.data)
                    this.setState({ ModalOfflineVisible: false })
                    this.query();
                }
            }).catch((res) => {
                message.error(res.data)
            })
        } else {
            this.props.offlineWhitelist(Utils.removeInvalid({
                storeIds: chooseGoodsList
            })).then((res) => {
                if (res.code === 200) {
                    message.success(res.data)
                    this.setState({ ModalOfflineVisible: false })
                    this.query();
                }
            }).catch((res) => {
                message.error(res.data)
            })
        }
    }

    onModalOfflineCancel() {
        this.setState({ ModalOfflineVisible: false })
    }

    query() {
        this.props.queryWhitelist(this.param).then((data) => {
            const { pageNo, pageSize } = data.data;
            Object.assign(this.param, { pageNo, pageSize });
        });
    }

    handlePromotionSearch(param) {
        this.handlePromotionReset();
        this.param = {
            pageNo: 1,
            pageSize: PAGE_SIZE,
            ...param
        };
        this.setState({ current: 1 }, () => {
            this.query();
        });
    }

    /**
     * 白名单导出
     * @param {object} param 查询参数
     */
    exportList = (param) => {
        Utils.exportExcel(whiteListBatchExport, Utils.removeInvalid(param));
    }

    /**
     * 白名单导入下载模板
     * @param {object} param 查询参数
     */
    downExportList = (param) => {
        Utils.exportExcel(whiteListBatchDownload, Utils.removeInvalid(param));
    }

    handlePromotionReset() {
        this.param = {
            pageNo: 1,
            pageSize: PAGE_SIZE
        };
        this.setState({ chooseGoodsList: [] })
    }

    handleSelect(record, index, item) {
        switch (item.key) {
            case 'Offline':
                this.setState({
                    ModalOfflineVisible: true,
                    chooseGoodsList: [record.storeId],
                });
                break;
            case 'Online':
                this.setState({
                    ModalOnlineVisible: true,
                    chooseGoodsList: [record.storeId],
                    onlineObj: record
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
        const { ModalOnlineVisible, ModalOfflineVisible, current } = this.state;
        const selectListlength = this.state.chooseGoodsList.length === 0;
        const rowSelection = {
            selectedRowKeys: this.state.chooseGoodsList,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    chooseGoodsList: selectedRowKeys,
                    selectedListData: selectedRows
                })
            },
        };
        columns[columns.length - 1].render = this.renderOperations;
        return (
            <div>
                <SearchForm
                    onPromotionSearch={this.handlePromotionSearch}
                    onPromotionReset={this.handlePromotionReset}
                    onExportList={this.exportList}
                    onDownloadList={this.downExportList}
                    value={{ selectListlength }}
                    onModalClick={this.onModalOnline}
                    onModalOfflineClick={this.onModalOffline}
                />
                <Table
                    rowSelection={rowSelection}
                    dataSource={data}
                    columns={columns}
                    rowKey="storeId"
                    scroll={{
                        x: 1600
                    }}
                    bordered
                    pagination={{
                        current,
                        pageNum,
                        pageSize,
                        total,
                        showQuickJumper: true,
                        onChange: this.onPaginate
                    }}
                />
                {
                    this.state.ModalOnlineVisible &&
                    <ModalOnline
                        visible={ModalOnlineVisible}
                        onOk={this.onModalOnlineOk}
                        onCancel={this.onModalOnlineCancel}
                    />
                }
                {
                    this.state.ModalOfflineVisible &&
                    <ModalOffline
                        visible={ModalOfflineVisible}
                        onOk={this.onModalOfflineOk}
                        onCancel={this.onModalOfflineCancel}
                    />
                }
            </div>
        );
    }
}

WhiteListConfig.propTypes = {
    queryWhitelist: PropTypes.func,
    onlineWhitelist: PropTypes.func,
    offlineWhitelist: PropTypes.func,
    data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
};

export default withRouter(Form.create()(WhiteListConfig));
