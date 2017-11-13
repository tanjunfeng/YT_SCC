/**
 * 发放优惠券弹窗
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Modal, Table, Form, message } from 'antd';
import {
    queryAliveCouponsList,
    clearCouponsList
} from '../../../actions/promotion';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { releaseCouponsColumns as columns } from '../columns';
import EditableCell from './editableCell';

@connect(state => ({
    couponsList: state.toJS().promotion.couponsList
}), dispatch => bindActionCreators({
    queryAliveCouponsList,
    clearCouponsList
}, dispatch))

class ReleaseCouponModal extends PureComponent {
    state = {
        promoIds: [],
        coupons: {}
    };

    componentWillReceiveProps(nextProps) {
        if (!nextProps.visible && this.props.visible) {
            // 隐藏时清空
            this.props.clearCouponsList();
            this.handleCouponReset();
            this.setState({ promoIds: [] });
        }
        if (nextProps.visible && !this.props.visible) {
            // 显示时按默认条件查询一次
            this.handleCouponReset();
            this.query();
        }
    }

    /**
     * 分页页码改变的回调
     */
    onPaginate = (pageNum) => {
        Object.assign(this.param, {
            pageNum,
            current: pageNum
        });
        this.query();
    }

    /**
     * table复选框
     */
    onSelectChange = (promoIds) => {
        this.setState({ promoIds });
    }

    onCellChange = id => quantity => {
        const coupons = this.state.coupons;
        Object.assign(coupons, {
            [id]: quantity
        });
    }

    /**
     * 剩余优惠券数量，优惠券总数减去已发放数量
     */
    getLeftQuantity = record => (record.totalQuantity - record.grantQty)

    param = {
        pageNum: 1,
        pageSize: PAGE_SIZE,
        current: 1
    };

    handleCouponSearch = (param) => {
        this.handleCouponReset();
        Object.assign(this.param, {
            current: 1,
            ...param
        });
        this.query();
    }

    handleCouponReset = () => {
        // 重置检索条件
        this.param = {
            pageNum: 1,
            pageSize: 5
        }
    }

    handleOk = () => {
        if (this.state.promoIds.length === 0) {
            message.error('请选择至少一张优惠券');
        } else {
            const { coupons, promoIds } = this.state;
            const dist = {};
            // 过滤掉未选中的优惠券，只回传已选中的券
            promoIds.forEach(id => {
                if (coupons[id]) {
                    Object.assign(dist, {
                        [id]: coupons[id]
                    });
                }
            });
            this.props.onReleaseCouponModalOk(dist);
        }
    }

    handleCancel = () => {
        this.props.onReleaseCouponModalCancel();
    }

    query = () => {
        // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/coupon/queryAliveCouponsList
        this.props.queryAliveCouponsList(this.param).then((res) => {
            const { pageNum, pageSize, data = [] } = res.data;
            Object.assign(this.param, { pageNum, pageSize });
            // 当查询到优惠券列表时，组装编号和数量
            const coupons = {};
            data.forEach(item => {
                Object.assign(coupons, {
                    [item.id]: 1
                });
            });
            // 初始化回传参数
            this.setState({ coupons });
        });
    }

    renderQuantity = (text, record) => (
        <EditableCell
            value={text}
            max={this.getLeftQuantity(record)}
            onChange={this.onCellChange(record.id)}
        />)

    renderColumns = () => {
        // 剩余数量计算
        columns[5].render = (text, record) => this.getLeftQuantity(record);
        columns[6].render = this.renderQuantity;
    }

    render() {
        this.renderColumns();
        const { data, total, pageNum, pageSize } = this.props.couponsList;
        const rowSelection = {
            selectedRowKeys: this.state.promoIds,
            onChange: this.onSelectChange
        };
        return (
            <Modal
                title="选择优惠券类型"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width={1200}
            >
                <SearchForm
                    visible={this.props.visible}
                    onCouponSearch={this.handleCouponSearch}
                    onCouponReset={this.handleCouponReset}
                />
                <Table
                    rowSelection={rowSelection}
                    dataSource={data}
                    columns={columns}
                    rowKey="id"
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
            </Modal>
        );
    }
}

ReleaseCouponModal.propTypes = {
    visible: PropTypes.bool,
    queryAliveCouponsList: PropTypes.func,
    clearCouponsList: PropTypes.func,
    onReleaseCouponModalOk: PropTypes.func,
    onReleaseCouponModalCancel: PropTypes.func,
    couponsList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
}

export default withRouter(Form.create()(ReleaseCouponModal));
