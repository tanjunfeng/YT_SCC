/**
 * @file itemDetail.jsx
 * @author tanjf
 *
 * 库存管理详情页
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Col, Table } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { stockListDetail } from '../../../actions';

// const FormItem = Form.Item;
const columns = [
    {
        title: '商品编号',
        dataIndex: 'productCode',
        key: 'productCode'
    },
    {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName'
    },
    {
        title: '平均成本',
        dataIndex: 'avCost',
        key: 'avCost'
    },
    {
        title: '现有库存',
        dataIndex: 'stockOnHand',
        key: 'stockOnHand'
    },
    {
        title: '调整数量',
        dataIndex: 'quantity',
        key: 'quantity'
    },
    {
        title: '调整成本额',
        dataIndex: 'adjustmentCost',
        key: 'adjustmentCost'
    }
]

@connect(
    state => ({
        ListDetail: state.toJS().stockListDetail.data,
        total: state.toJS().stockListDetail.sum,
    }),
    dispatch => bindActionCreators({
        stockListDetail,
    }, dispatch)
)

class ItemDetail extends PureComponent {
    componentDidMount() {
        // const match = this.props.match.params;
        this.props.stockListDetail({
            // id: match.id
            id: 1000001
        });
    }

    render() {
        const { data = {} } = this.props.ListDetail;
        const { prefixCls, total = '' } = this.props;
        const {
            adjustmentNo,
            status,
            description,
            externalBillNo,
            type,
            warehouseCode,
            adjustmentTime } = data;
        const { imAdjustmentItemVos = [] } = data;
        return (
            <div>
                <div className="itemDetail-manage-form manage-form">
                    <Row>
                        <Col span={6}>
                            <div className="detail-item">
                                <span className="justify-text">单据编号:</span>
                                <strong>{adjustmentNo}</strong>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="detail-item">
                                <span className="justify-text">调整日期:</span>
                                <strong>{adjustmentTime}</strong>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="detail-item">
                                <span className="justify-text">状态:</span>
                                <strong>{status}</strong>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="detail-item">
                                <span className="justify-text">调整类型:</span>
                                <strong>{type}</strong>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <div className="detail-item">
                                <span className="justify-text">调整仓库:</span>
                                <strong>{warehouseCode}</strong>
                            </div>
                        </Col>
                        <Col span={6} className="detail-item">
                            <span className="justify-text">备注:</span>
                            <strong>{description}</strong>
                        </Col>
                        <Col span={6} className="detail-item">
                            <span className="justify-text">外部单据号:</span>
                            <strong>{externalBillNo}</strong>
                        </Col>
                    </Row>
                </div>
                <div className="manage-form">
                    <div className={
                            `${prefixCls}-form`
                        }
                    >
                        <Table
                            columns={columns}
                            dataSource={imAdjustmentItemVos}
                            rowKey={(record) => (Object.values(record).join('_'))}
                            footer={() => (
                                <div className="total-wrap">
                                    <span
                                        className="totalTxt"
                                        style={{textAlign: 'center', marginLeft: -10}}
                                    >总计:</span>
                                    <span
                                        className="totalNumber"
                                        style={{textAlign: 'center', marginLeft: -10}}
                                    >{total}</span>
                                </div>
                                )
                            }
                        />
                        <div className={`${prefixCls}-back`} style={{textAlign: 'center'}}>
                            <Link
                                className={
                                    `${prefixCls}-btn ${prefixCls}-supplierType-img ant-btn`
                                }
                                to="/storeAdjList"
                            >返回</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ItemDetail.propTypes = {
    ListDetail: PropTypes.objectOf(PropTypes.any),
    stockListDetail: PropTypes.func,
    prefixCls: PropTypes.string,
    total: PropTypes.string,
    match: PropTypes.objectOf(PropTypes.any)
};

ItemDetail.defaultProps = {
    prefixCls: 'item-detail',
};

export default withRouter(ItemDetail);
