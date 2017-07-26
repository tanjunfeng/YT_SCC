/**
 * @file warehose.jsx
 * @author shijh
 *
 * 配送组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Input, Icon } from 'antd';

import SearchMind from '../../../components/searchMind';

class Warehouse extends Component {
    constructor(props) {
        super(props);
        this.handleTestChoose = ::this.handleTestChoose;
    }

    handleTestChoose(item) {

    }

    renderItem() {
        const { prefixCls } = this.props;
        return (
            <li className={`${prefixCls}-list-item`}>
                <span className={`${prefixCls}-list-close`}><Icon type="close-circle-o" /></span>
                <Row>
                    <Col span={8}>
                        <span>*仓储：</span>
                        <span>123123 - 你就是打发荆防颗粒</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <span>仓储服务方：</span>
                        <span>新希望集团</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <span>送货仓联系人：</span>
                        <span>李丽</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <span>送货仓联系方式：</span>
                        <span>18683591475</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <span>送货仓区域信息：</span>
                        <span>四川省成都市高新区</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <span>送货仓详细地址：</span>
                        <span>XXX街道XX号</span>
                    </Col>
                </Row>
            </li>
        )
    }
    render() {
        const { prefixCls } = this.props;
        return (
            <div className={`${prefixCls}`}>
                <Row>
                    <Col span={24} className={`${prefixCls}-add-wrap`}>
                        <span>添加送货地址：</span>
                        <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                            <SearchMind
                                style={{ marginLeft: 10 }}
                                compKey="search-mind-key2"
                                fetch={(value, pager) => this.handleTestFetch(value, pager)}
                                onChoosed={this.handleTestChoose}
                                renderChoosedInputRaw={(data) => (
                                    <div>{data.id} - {data.name}</div>
                                )}
                                pageSize={1}
                                columns={[
                                    {
                                        title: 'Name',
                                        dataIndex: 'name',
                                        width: 150,
                                    }, {
                                        title: 'Address',
                                        dataIndex: 'address',
                                        width: 200,
                                    }
                                ]}
                            />
                        </div>
                    </Col>
                </Row>
                <ul className={`${prefixCls}-list-wrap`}>
                    {
                        this.renderItem()
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