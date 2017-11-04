/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 采购管理 - 直营店下单 - 商品列表渲染
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form, message, Popconfirm, Table } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Utils from '../../../util/util';
import { directSalesgoodsColumns as columns } from '../columns';
import EditableCell from './editableCell';
import {
    updateGoodsInfo
} from '../../../actions/procurement';

@connect(() => ({}), dispatch => bindActionCreators({
    updateGoodsInfo
}, dispatch))

class GoodsTable extends PureComponent {
    componentWillReceiveProps(nextProps) {
        const { goodsAddOn, importList } = nextProps;
        // 当传入商品有变化时，添加到商品列表
        if (goodsAddOn !== null && this.props.goodsAddOn !== goodsAddOn) {
            this.appendToList(goodsAddOn);
        }
        // 当导入商品有变化时,批量校验库存并添加到商品列表,通知父组件清空导入列表
        if (this.props.importList.length === 0 && importList.length > 0) {
            this.importToList(importList);
        }
    }

    onCellChange = (productCode) => value => {
        const goodsList = [...this.props.goodsList];
        const goods = goodsList.find(item => item.productCode === productCode);
        if (goods) {
            Object.assign(goods, {
                quantity: value
            });
            this.appendToList(goods);
        }
    }

    onDelete = (productCode) => {
        const goodsList = [...this.props.goodsList];
        this.props.onChange(goodsList.filter(item => item.productCode !== productCode));
    }

    /**
     * 将不在销售区域的剔除,重复的商品剔除,添加到商品列表中
     */
    importToList = (importList) => {
        const list = [];
        const deletedIds = [];
        importList.forEach(item => {
            if (item.available) {
                list.push(item);
            } else {
                deletedIds.push(item.productId);
            }
        });
        const goodsList = Utils.merge(this.props.goodsList, list, 'productId');
        this.props.onChange(goodsList, deletedIds);
    }

    /**
     * 检查单个商品库存是否充足
     *
     * @param {*object} goods 商品信息
     */
    checkStore = (goods) => (
        new Promise((resolve, reject) => {
            const { branchCompanyId, deliveryWarehouseCode } = this.props;
            // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/directStore/updateItem
            this.props.updateGoodsInfo({
                productId: goods.productId,
                quantity: goods.quantity,
                branchCompanyId,
                deliveryWarehouseCode
            }).then(res => {
                // 库存不足
                if (!res.data.enough) {
                    Object.assign(goods, {
                        enough: false
                    });
                }
                resolve(goods);
            }).catch(err => {
                reject(err);
            });
        })
    );

    checkGoodsStatus = (goods, errors) => {
        let isValid = true;
        if (!goods.enough) {
            errors.push('库存不足');
            isValid = false;
        }
        if (!goods.available) {
            errors.push('不在销售区域');
            isValid = false;
        }
        if (!goods.isMultiple) {
            errors.push('非起订量整数倍');
            isValid = false;
        }
        return isValid;
    }

    /**
     * 添加单个商品并校验状态，并判断商品是否应该移动到第一行
     */
    appendToList = (record) => {
        this.checkMultiple(record);
        this.checkStore(record).then(goods => {
            const goodsList = [...this.props.goodsList];
            const index = goodsList.findIndex(
                item => item.productCode === goods.productCode);
            // 该商品不在列表中，则新增
            if (index === -1) {
                goodsList.unshift(goods);
            } else if (index > 0) {
                goodsList.splice(index, 1);
                goodsList.unshift(goods);
                message.info('该商品已被移动到顶部');
            }
            this.props.onChange(goodsList);
        });
    }

    /**
     * 检查是否整箱销售，若是，则判断当前数量是否是内装数量的整数倍
     *
     * @returns {*object}
     */
    checkMultiple = (goods) => {
        const { quantity, salesInsideNumber, sellFullCase } = goods;
        let isMultiple = true;
        // 不按整箱销售时，判断当前所填数量是否是内装数量的整数倍
        if (sellFullCase === 0 && quantity % salesInsideNumber > 0) {
            isMultiple = false;
        }
        Object.assign(goods, { isMultiple });
    }

    renderNumber = (text, record) => {
        const { minNumber } = record;
        // 填入的数量是否是内装数量的整数倍
        const step = minNumber;
        const errors = [];
        this.checkGoodsStatus(record, errors);
        return (
            <EditableCell
                value={text}
                min={minNumber}
                step={step}
                error={errors.join(', ')}
                onChange={this.onCellChange(record.productCode)}
            />);
    }

    /**
     * 计算金额小计
     */
    renderSubTotal = (text, record) => {
        if (record.salePrice === null) {
            return '-';
        }
        return record.salePrice * record.quantity;
    }

    renderOperations = (text, record) => (
        <Popconfirm title="确定删除商品？" onConfirm={() => this.onDelete(record.productCode)}>
            <a href="#">删除</a>
        </Popconfirm>)

    renderColumns = () => {
        columns[columns.length - 4].render = this.renderNumber;
        columns[columns.length - 2].render = this.renderSubTotal;
        columns[columns.length - 1].render = this.renderOperations;
    }

    render() {
        this.renderColumns();
        return (
            <Table
                rowKey="productCode"
                dataSource={this.props.goodsList}
                columns={columns}
                scroll={{
                    x: 1400,
                    y: 500
                }}
                bordered
            />
        );
    }
}

GoodsTable.propTypes = {
    updateGoodsInfo: PropTypes.func,
    onChange: PropTypes.func,
    branchCompanyId: PropTypes.string,
    deliveryWarehouseCode: PropTypes.string,
    goodsList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    importList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    goodsAddOn: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(GoodsTable));
