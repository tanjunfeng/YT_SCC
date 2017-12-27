/**
 * @file App.jsx
 * @author liujinyu
 *
 * 售价审核列表
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
import { priceListColumns as columns } from '../columns';
import ExamineModal from '../common/ExamineModal';
import SeeModal from '../common/SeeModal';

@connect(state => ({
    processMsgInfo: state.toJS().procurement.processMsgInfo,
}), dispatch => bindActionCreators({
    queryProcessMsgInfo
}, dispatch))

class PriceExamination extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            seeModelvisible: false
        }
        // 搜索参数
        this.param = {};
        // 传递到审核弹窗的参数
        this.taskId = '';
        this.type = '3';
    }

    componentDidMount() {
        this.handlePurchaseReset();
        this.query();
    }

    /**
     * 分页页码改变的回调
     * @param {number} pageNum 页码
     */
    onPaginate = (pageNum = 1) => {
        Object.assign(this.param, {
            pageNum,
            current: pageNum
        });
        this.query();
    }

    /**
     * 请求列表数据
     */
    query = () => {
        const searchObj = {
            map: this.param,
            processType: 'SPXS'
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
            current: 1,
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
            pageSize: PAGE_SIZE
        }
    }

    /**
    * 关闭审核弹框的回调
    */
    closeModal = () => {
        this.setState({
            visible: false
        })
    }

    /**
     * 关闭查看审核意见弹框
     */
    closeSeeModal = () => {
        this.setState({
            seeModelvisible: false
        })
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
                this.setState({
                    visible: true
                })
                this.taskId = taskId;
                break;
            case 'see':
                // 查看
                break;
            case 'results':
                // 审批意见
                this.setState({
                    seeModelvisible: true
                })
                this.taskId = taskId
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
        const { status } = record
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                <Menu.Item key="see">
                    查看
                </Menu.Item>
                {
                    status !== 0 ?
                        <Menu.Item key="results">
                            审批意见
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
                        current: this.param.current,
                        pageNum,
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
            </div>
        );
    }
}

PriceExamination.propTypes = {
    queryProcessMsgInfo: PropTypes.func,
    processMsgInfo: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
}

export default withRouter(Form.create()(PriceExamination));
