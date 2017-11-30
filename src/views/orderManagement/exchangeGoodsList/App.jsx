/*
 * @Author: tanjf
 * @Description: 销售换货列表
 * @CreateDate: 2017-11-10 11:22:13
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-11-23 10:15:42
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
import { exchangeGoodsListColumns as columns } from '../columns';
import { returnGoodsOperation, getExchangeGoodsListAction } from '../../../actions';

@connect(state => ({
    exchangeList: state.toJS().salesManagement.exchangeList,
}), dispatch => bindActionCreators({
    getExchangeGoodsListAction
}, dispatch))

class ExchangeGoodsList extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            refresh: false,
            current: 1
        }
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

    handlePromotionSearch = (param) => {
        this.handlePromotionReset();
        Object.assign(this.param, {
            ...param
        });
        this.setState({ current: 1 });
        this.query();
    }

    param = {};

    query = () => {
        this.props.getExchangeGoodsListAction(this.param).then((res) => {
            const { pageNum, pageSize } = res.data;
            Object.assign(this.param, { pageNum, pageSize });
        });
    }

    handlePromotionReset = () => {
        // 重置检索条件
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        }
    }

    // 退货单确定或取消
    operation = (id, type) => (
        returnGoodsOperation({
            returnId: id,
            operateType: type
        })
            .then(res => {
                if (res.success) {
                    this.setState({
                        refresh: !this.state.refresh
                    })
                    this.handlePromotionReset();
                    this.query();
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

    // table列表详情操作
    renderActions = (text, record) => {
        const { state } = record;
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
        const { total, pageNum, pageSize, data = [] } = this.props.exchangeList;
        return (
            <div className="return-goods-list">
                <SearchForm
                    onPromotionSearch={this.handlePromotionSearch}
                    onPromotionReset={this.handlePromotionReset}
                />
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                        current: this.state.current,
                        total,
                        pageNum,
                        pageSize,
                        showQuickJumper: true,
                        onChange: this.onPaginate
                    }}
                />
            </div>
        )
    }
}

ExchangeGoodsList.propTypes = {
    location: PropTypes.objectOf(PropTypes.any),
    getExchangeGoodsListAction: PropTypes.func,
    exchangeList: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(ExchangeGoodsList));
