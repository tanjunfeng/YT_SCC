/**
 * @file itemDetail.jsx
 * @author zhangbaihua
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
        dataIndex: 'commodityNum',
        key: 'commodityNum'
    },
    {
        title: '商品名称',
        dataIndex: 'commodityName',
        key: 'commodityName'
    },
    {
        title: '平均成本',
        dataIndex: 'averageCost',
        key: 'averageCost'
    },
    {
        title: '现有库存',
        dataIndex: 'existingStock',
        key: 'existingStock'
    },
    {
        title: '调整数量',
        dataIndex: 'adjustmentNum',
        key: 'adjustmentNum'
    },
    {
        title: '调整成本额',
        dataIndex: 'adjustmentCost',
        key: 'adjustmentCost'
    }
]

@connect(
    state => ({
        ListDetail: state.toJS().stockListDetail.data
    }),
    dispatch => bindActionCreators({
        stockListDetail,
    }, dispatch)
)

class ItemDetail extends PureComponent {
    componentWillMount() {
        const match = this.props.match.params;
        this.props.stockListDetail({
            id: match.id
        });
    }
    render() {
        const { supplier = {} } = this.props.ListDetail;
        const { prefixCls } = this.props;
        const {
            supplierNumber,
            stockStatus,
            remarks,
            outSupplierNum,
            creator,
            createDate,
            approver,
            adjustType,
            adjustLib,
            adjustDate } = supplier;
        const { adjustmentList = [], adjustmentNumTotal = '', total } = this.props.ListDetail;
        return (
            <div>
                <div className="manage-form">
                    <Row>
                        <Col span={6}>
                            <div className="detail-item">
                                <span className="justify-text">单据编号</span>
                                <strong>{supplierNumber}</strong>
                            </div>
                            <div className="detail-item">
                                <span className="justify-text">调整日期</span>
                                <strong>{adjustDate}</strong>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="detail-item">
                                <span className="justify-text">状态</span>
                                <strong>{stockStatus}</strong>
                            </div>
                            <div className="detail-item">
                                <span className="justify-text">创建人</span>
                                <strong>{creator}</strong>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="detail-item">
                                <span className="justify-text">创建日期</span>
                                <strong>{createDate}</strong>
                            </div>
                            <div className="detail-item">
                                <span className="justify-text">批准人</span>
                                <strong>{approver}</strong>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="detail-item">
                                <span className="justify-text">调整类型</span>
                                <strong>{adjustType}</strong>
                            </div>
                            <div className="detail-item">
                                <span className="justify-text">调整仓库</span>
                                <strong>{adjustLib}</strong>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className="detail-item">
                            <span className="justify-text">备注</span>
                            <strong>{remarks}</strong>
                        </Col>
                        <Col span={12} className="detail-item">
                            <span className="justify-text">外部单据号</span>
                            <strong>{outSupplierNum}</strong>
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
                            dataSource={adjustmentList}
                            total={total}
                            rowKey={(record) => (Object.values(record).join('_'))}
                            footer={() => (
                                <div className="total-wrap">
                                    <span className="totalTxt">总计</span>
                                    <span className="totalNumber">{adjustmentNumTotal}</span>
                                </div>
                                )
                            }
                        />
                        <div className="back-storeAdjust-page">
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
    match: PropTypes.objectOf(PropTypes.any)
};

ItemDetail.defaultProps = {
    prefixCls: 'item-detail',
};

export default withRouter(ItemDetail);
