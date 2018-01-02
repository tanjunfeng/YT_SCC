/**
 * @file App.jsx
 * @author liujinyu
 *
 * 进价审核列表
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Form, Icon, Menu, Dropdown } from 'antd';
import { queryProcessMsgInfo } from '../../../actions/process';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { purchaseListColumns as columns } from '../columns';
import ExamineModal from '../common/ExamineModal';
import SeeModal from '../common/SeeModal';
import ProdModal from './changePurchaseModal';
import getProdPurchaseById from '../../../actions/fetch/fetchGetProdPurchaseById';
import {
    fetchGetProductById
} from '../../../actions';

@connect(state => ({
    processMsgInfo: state.toJS().procurement.processMsgInfo,
    getProductByIds: state.toJS().commodity.getProductById
}), dispatch => bindActionCreators({
    queryProcessMsgInfo,
    getProdPurchaseById,
    fetchGetProductById
}, dispatch))

class PurchaseExamination extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            seeModelvisible: false,
            // 默认未完成
            isComplete: '0',
            showModal: false,
            initData: {},
            getProdPurchaseByIds: {}
        }
        // 搜索参数
        this.param = {};
        // 传递到审核弹窗的参数
        this.taskId = '';
        this.type = '2';
    }

    componentDidMount() {
        this.handlePurchaseReset();
        Object.assign(this.param, { status: '0' })
        this.query();
    }

    /**
     * 分页页码改变的回调
     * @param {number} pageNum 页码
     */
    onPaginate = (pageNum = 1) => {
        Object.assign(this.param, {
            pageNum
        });
        this.query();
    }

    /**
     * 请求列表数据
     */
    query = () => {
        this.setState({
            isComplete: this.param.status
        })
        const searchObj = {
            map: this.param,
            processType: 'SPCG'
        }
        this.props.queryProcessMsgInfo(searchObj).then(data => {
            const { pageNum, pageSize } = data.data;
            Object.assign(this.param, { pageNum, pageSize });
        });
    }

    /**
     * 点击搜索的回调
     * @param {object} param 请求参数
     */
    handlePurchaseSearch = (param) => {
        this.handlePurchaseReset();
        Object.assign(this.param, {
            pageNum: 1,
            ...param
        });
        this.query();
    }

    /**
     * 点击重置的回调
     */
    handlePurchaseReset = () => {
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
        }
    }

    /**
     * 关闭审核弹框的回调
     */
    closeModal = () => {
        this.setState({
            visible: false
        })
        this.query()
    }

    /**
     * 关闭查看审核意见弹框
     */
    closeSeeModal = () => {
        this.setState({
            seeModelvisible: false
        })
    }

    handleCloseModal = () => {
        this.setState({
            showModal: false
        });
    }

    /**
     * 促销活动表单操作
    *
    * @param {Object} record 传值所有数据对象
    * @param {number} index 下标
    * @param {Object} items 方法属性
    */
    handleSelect(record, index, items) {
        const { key } = items;
        const { taskId } = record
        switch (key) {
            case 'Examine':
                // 审核
                this.taskId = taskId;
                this.setState({
                    visible: true
                })
                break;
            case 'see':
                // 查看
                this.props.getProdPurchaseById({ id: record.id })
                    .then(res => {
                        this.setState({
                            getProdPurchaseByIds: res,
                            initData: record,
                            showModal: true
                        })
                    })
                // this.props.fetchGetProductById({ productId: '60000117016' })
                //     .then(res => {
                //         this.setState({
                //             initData: record,
                //             showModal: true
                //         })
                //     })
                break;
            case 'results':
                // 审批意见
                this.taskId = taskId
                this.setState({
                    seeModelvisible: true
                })
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
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                <Menu.Item key="see">
                    查看
                </Menu.Item>
                {
                    this.state.isComplete !== '0' ?
                        <Menu.Item key="results">
                            查看审核意见
                        </Menu.Item>
                        : <Menu.Item key="Examine">
                            审核
                        </Menu.Item>
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
        const { data, total, pageNum, pageSize } = this.props.processMsgInfo;
        columns[columns.length - 1].render = this.renderOperations;
        return (
            <div>
                <SearchForm
                    handlePurchaseSearch={this.handlePurchaseSearch}
                    handlePurchaseReset={this.handlePurchaseReset}
                />
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="taskId"
                    scroll={{
                        x: 1400
                    }}
                    bordered
                    pagination={{
                        current: pageNum,
                        pageSize,
                        total,
                        showQuickJumper: true,
                        onChange: this.onPaginate
                    }}
                />
                <ExamineModal
                    visible={this.state.visible}
                    closeModal={this.closeModal}
                    taskId={this.taskId}
                    type={this.type}
                />
                <SeeModal
                    seeModelvisible={this.state.seeModelvisible}
                    closeSeeModal={this.closeSeeModal}
                    taskId={this.taskId}
                />
                {
                    this.state.showModal &&
                    <ProdModal
                        handleClose={this.handleCloseModal}
                        getProdPurchaseByIds={this.state.getProdPurchaseByIds}
                    />
                }
            </div>
        );
    }
}

PurchaseExamination.propTypes = {
    queryProcessMsgInfo: PropTypes.func,
    getProdPurchaseById: PropTypes.func,
    processMsgInfo: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
}

export default withRouter(Form.create()(PurchaseExamination));
