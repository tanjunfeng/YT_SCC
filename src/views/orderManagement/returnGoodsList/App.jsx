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
    Modal
} from 'antd';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { returnGoodsListColumns as columns } from '../columns';
import { returnGoodsOperation } from '../../../actions';


@connect(state => ({
    listData: state.toJS().salesManagement.data,
    formData: state.toJS().pageParameters.returnGoodsParams
}), dispatch => bindActionCreators({}, dispatch))


class ReturnGoodsList extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            page: props.formData.pageNum || 1,
            refresh: false
        }
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

    handleRefund = (id) => {
        console.log(id)
    }

    // table列表详情操作
    renderActions = (text, record) => {
        const { state, orderType, paymentState } = record;
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
                    // orderType === 'ZCXS' && paymentState === 'WTK' &&
                    <Menu.Item key="cancel">
                        <span onClick={() => this.handleRefund(record.id, 3)}>退款</span>
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
        columns[columns.length - 1].render = this.renderActions;
        const { listData } = this.props
        return (
            <div className="return-goods-list">
                <SearchForm
                    page={this.state.page}
                    refresh={this.state.refresh}
                />
                {
                    listData ?
                        <div>
                            <Table
                                dataSource={listData.data}
                                columns={columns}
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
    location: PropTypes.objectOf(PropTypes.any),
    listData: PropTypes.objectOf(PropTypes.any),
    formData: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(ReturnGoodsList));
