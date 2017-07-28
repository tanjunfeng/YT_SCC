/**
 * @file warehose.jsx
 * @author shijh
 *
 * 配送组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Input, Icon, message } from 'antd';

import SearchMind from '../../../components/searchMind';

class Warehouse extends Component {
    constructor(props) {
        super(props);
        this.handleChoose = ::this.handleChoose;
        this.renderItem = ::this.renderItem;
        this.handleDelete = ::this.handleDelete;
        this.getValue = ::this.getValue;
        this.warehouseIds = [];
    }

    handleChoose(item) {
        const { record } = item;
        if (this.warehouseIds.indexOf(record.id) > -1) {
            message.warning('所选仓库已存在');
            return;
        }
        this.props.handleChoose({warehouseId: record.id})
            .then((res) => {
                this.warehouseIds.push(res.data.id);
            });
    }

    handleDelete(e) {
        const id = e.target.getAttribute('data-id');
        const index = this.warehouseIds.indexOf(id);
        this.warehouseIds.splice(index, 1);
        this.props.handleDelete({id})
    }

    getValue() {
        return this.warehouseIds;
    }

    renderItem(item) {
        const { prefixCls } = this.props;
        return (
            <li className={`${prefixCls}-list-item`}>
                <span
                    data-id={item.id}
                    className={`${prefixCls}-list-close`}
                    onClick={this.handleDelete}
                >
                    <Icon data-id={item.id} type="close-circle-o" />
                </span>
                <Row>
                    <Col span={8}>
                        <span>仓库编号和名字：</span>
                        <span>{`${item.warehouseCode} - ${item.warehouseName}`}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <span>仓库服务方：</span>
                        <span>{item.warehouseService}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <span>送货仓联系人：</span>
                        <span>{item.contactPerson}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <span>送货仓联系方式：</span>
                        <span>{item.contactMode}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <span>送货仓区域信息：</span>
                        <span>{item.region}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <span>送货仓详细地址：</span>
                        <span>{item.address}</span>
                    </Col>
                </Row>
            </li>
        )
    }
    render() {
        const { prefixCls, fetch, data } = this.props;
        return (
            <div className={`${prefixCls}`}>
                <Row>
                    <Col span={24} className={`${prefixCls}-add-wrap`}>
                        <span>添加送货地址：</span>
                        <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                            <SearchMind
                                style={{ marginLeft: 10 }}
                                compKey="search-mind-key2"
                                fetch={(param) =>
                                    fetch({
                                        param: param.value,
                                        pageSize: param.pagination.pageSize,
                                        pageNum: param.pagination.current
                                    })
                                }
                                onChoosed={this.handleChoose}
                                placeholder={'请输入仓库编号或名称'}
                                renderChoosedInputRaw={(data) => (
                                    <div>{data.warehouseCode} - {data.warehouseName}</div>
                                )}
                                pageSize={8}
                                columns={[
                                    {
                                        title: '仓库编码',
                                        dataIndex: 'warehouseCode',
                                        width: 150,
                                    }, {
                                        title: '仓库名称',
                                        dataIndex: 'warehouseName',
                                        width: 200,
                                    }
                                ]}
                            />
                        </div>
                    </Col>
                </Row>
                <ul className={`${prefixCls}-list-wrap`}>
                    {
                        data.map((item) => {
                            return this.renderItem(item)
                        })
                    }
                </ul>
            </div>
        );
    }
}

Warehouse.propTypes = {
    prefixCls: PropTypes.string,
};

Warehouse.defaultProps = {
    prefixCls: 'ware-house',
}


export default Warehouse;