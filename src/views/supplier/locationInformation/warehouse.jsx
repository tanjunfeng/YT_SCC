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
        this.warehouseIds = props.defaultValue.map((item) => {
            return item.id;
        });
        const defaultDatas = props.defaultValue.map((item) => {
            const { warehouse } = item;
            const { warehousePhysicalInfo = {} } = warehouse || {};
            return warehousePhysicalInfo;
        });
        this.state = {
            data: defaultDatas || []
        }
    }

    componentWillReceiveProps(nextProps) {
        const { data, defaultValue } = this.props;
        if (defaultValue.length !== nextProps.defaultValue.length) {
            this.warehouseIds = nextProps.defaultValue.map((item) => {
                return item.id;
            });
            const defaultDatas = nextProps.defaultValue.map((item) => {
                const { warehouse } = item;
                const { warehousePhysicalInfo = {} } = warehouse || {};
                return warehousePhysicalInfo;
            });
            this.setState({
                data: defaultDatas
            })
        }
    }

    handleChoose(item) {
        const { data } = this.state;
        const { record } = item;
        if (this.warehouseIds.indexOf(record.id) > -1) {
            message.warning('所选仓库已存在');
            return;
        }
        this.props.handleChoose({warehouseLogicId: record.id}).then((res) => {
            data.push(res.data)
            this.warehouseIds.push(res.data.id)
            this.setState({
                data
            })
        });
    }

    handleDelete(e) {
        const { data } = this.state;
        const currentData = data;
        const id = e.target.getAttribute('data-id');
        const index = this.warehouseIds.indexOf(id);
        this.warehouseIds.splice(index, 1);
        currentData.splice(index, 1);
        this.setState({
            data: currentData
        })
    }

    getValue() {
        return this.warehouseIds;
    }

    renderItem(item) {
        const { prefixCls, isShow } = this.props;
        return (
            <li
                key={item.id}
                className={`${prefixCls}-list-item`}
            >
                { isShow &&
                    <span
                        data-id={item.id}
                        className={`${prefixCls}-list-close`}
                        onClick={this.handleDelete}
                    >
                        <Icon data-id={item.id} type="close-circle-o" />
                    </span>
                }
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
        const { prefixCls, fetch, isShow } = this.props;
        const { data } = this.state;
        return (
            <div className={`${prefixCls}`}>
                {
                    isShow &&
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
                                            pageNum: param.pagination.current || 1
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
                }
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
    defaultValue: PropTypes.arrayOf(PropTypes.any),
    fetch: PropTypes.func,
    isShow: PropTypes.bool,
};

Warehouse.defaultProps = {
    prefixCls: 'ware-house',
    defaultValue: [],
    fetch: () => {},
    isShow: true
}


export default Warehouse;