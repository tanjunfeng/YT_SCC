/**
 * @file App.jsx
 * @author liujinyu
 *
 * 销售管理 - 退货单列表
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import {
    Table,
    Form,
    Icon,
    Menu,
    Dropdown,
    Modal,
    message,
    Popconfirm
} from 'antd';
import moment from 'moment';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { returnGoodsOperation, insertRefund } from '../../../actions';


@connect(state => ({
    listData: state.toJS().salesManagement.data,
    formData: state.toJS().pageParameters.returnGoodsParams
}), dispatch => bindActionCreators({
    insertRefund
}, dispatch))


class ReturnGoodsList extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            page: props.formData.pageNum || 1,
            refresh: false,
            upDate: false
        }

        // 退货单列表
        this.returnGoodsListColumns = [{
            title: '序号',
            dataIndex: 'idx',
            key: 'idx',
            render: (text, record, index) => index + 1
        },
        {
            title: '退换货类型',
            dataIndex: 'returnRequestType',
            key: 'returnRequestType'
        },
        {
            title: '退货单号',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: '申请日期',
            dataIndex: 'creationTime',
            key: 'creationTime',
            render: (text) => (
                <span>
                    {moment(parseInt(text, 10)).format('YYYY-MM-DD')}
                </span>
            )
        },
        {
            title: '原订单号',
            dataIndex: 'orderId',
            key: 'orderId',
            render: (text, record) => (<a onClick={() => {
                this.props.history.push(`/orderList/orderDetails/${record.orderId}`);
            }}
            >{text}</a>
            )
        },
        {
            title: '子公司',
            dataIndex: 'branchCompanyName',
            key: 'branchCompanyName',
        }, {
            title: '雅堂小超',
            dataIndex: 'franchiseeName',
            key: 'franchiseeName',
        },
        {
            title: '总金额',
            dataIndex: 'amount',
            key: 'amount',
            render: (text) => {
                if (text === null) {
                    return null
                }
                return (
                    <span>￥{text}</span>
                )
            }
        },
        {
            title: '退货单状态',
            dataIndex: 'stateDetail',
            key: 'stateDetail'
        },
        {
            title: '收货状态',
            dataIndex: 'shippingStateDetail',
            key: 'shippingStateDetail'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation'
        }
        ]
    }


    /**
     * 点击翻页
     * @param {pageNumber}    pageNumber
     */
    onPageChange = (pageNumber) => {
        this.setState({
            page: pageNumber
        })
    }
    // 退货单确定或取消
    operation = (id, type) => (
        returnGoodsOperation({
            returnId: id,
            operateType: type
        }).then(res => {
            if (res.success) {
                this.setState({
                    refresh: !this.state.refresh
                })
            }
        })
    )

    // 模态框弹出
    showConfirm = (id, type) => {
        const _this = this
        const title = type === 1 ? '确认退货' : '取消退货'
        const content = type === 1 ? '是否确认退货，此操作不可取消' : '是否取消退货，此操作不可取消'
        const confirm = Modal.confirm;
        confirm({
            title,
            content,
            onOk() {
                _this.operation(id, type)
            },
            onCancel() { },
        });
    }

    handleConfirm =(record) => {
        this.props.insertRefund({returnId: record.record.id}).then((res) => {
            message.success(res.message);
            this.setState({
                upDate: !this.state.upDate
            })
        })
    }

    handleCancel = () => {
        message.error('已取消发送');
    }

    // table列表详情操作
    renderActions = (text, record) => {
        const { state, orderType } = record;
        const { pathname } = this.props.location;
        const menu = (
            <Menu>
                <Menu.Item key="detail">
                    <Link to={`${pathname}/detail/1/${record.id}`}>查看</Link>
                </Menu.Item>
                {state === 1 &&
                    <Menu.Item key="edit">
                        <Link to={`${pathname}/detail/2/${record.id}`}>编辑</Link>
                    </Menu.Item>
                }
                {state === 1 &&
                    <Menu.Item key="cancel">
                        <span onClick={() => this.showConfirm(record.id, 2)}>取消</span>
                    </Menu.Item>
                }
                {state === 1 &&
                    <Menu.Item key="confirm">
                        <span onClick={() => this.showConfirm(record.id, 1)}>确认</span>
                    </Menu.Item>
                }
                {
                    orderType === 'ZCXS' && state === 3 &&
                    <Menu.Item key="refund">
                        <Popconfirm
                            title="确认发起退款?"
                            onConfirm={() => this.handleConfirm({record})}
                            onCancel={this.handleCancel}
                            okText="确认"
                            cancelText="取消"
                            visible={!this.setState.upDate}
                        >
                            <a>退款</a>
                        </Popconfirm>
                    </Menu.Item>
                }
            </Menu>
        );

        return (
            <Dropdown overlay={menu} placement="bottomCenter" >
                <a className="ant-dropdown-link">
                    表单操作
                    <Icon type="down" />
                </a>
            </Dropdown>
        )
    }

    render() {
        this.returnGoodsListColumns[this.returnGoodsListColumns.length - 1].render = this.renderActions;
        const { listData } = this.props
        return (
            <div className="return-goods-list">
                <SearchForm
                    page={this.state.page}
                    refresh={this.state.refresh}
                    upDate={this.state.upDate}
                />
                {
                    listData ?
                        <div>
                            <Table
                                dataSource={listData.data}
                                columns={this.returnGoodsListColumns}
                                rowKey="id"
                                pagination={{
                                    current: listData.pageNum,
                                    total: listData.total,
                                    pageNum: this.current,
                                    pageSize: PAGE_SIZE,
                                    showQuickJumper: true,
                                    onChange: this.onPageChange
                                }}
                            />
                        </div> : ''
                }
            </div>
        )
    }
}

ReturnGoodsList.propTypes = {
    insertRefund: PropTypes.func,
    location: PropTypes.objectOf(PropTypes.any),
    listData: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    formData: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(ReturnGoodsList));
