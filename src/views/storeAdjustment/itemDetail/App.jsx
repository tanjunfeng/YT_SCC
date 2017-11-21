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
import moment from 'moment';
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
        key: 'productName',
        render: (text, record) => (
            record.isTotal ? <span style={{color: 'red'}}>{text}</span> : text
          )
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
        const { pathname } = this.props.location;
        const id = pathname.split('/');
        this.props.stockListDetail({
            id: id[3]
            // id: 1000001
        });
    }

    render() {
        const { data = {} } = this.props.ListDetail;
        const { prefixCls, total = {} } = this.props;
        const {
            id,
            status,
            description,
            externalBillNo,
            type,
            warehouseCode,
            adjustmentTime } = data;
        const { imAdjustmentItemVos = [] } = data;
        imAdjustmentItemVos.push({
            productName: '总计:',
            quantity: total.sumSl,
            adjustmentCost: total.sumCbe,
            isTotal: true
        })
        const adjustmentType = (type1) => {
            switch (type1) {
                case 0: return '物流丢失';
                case 1: return '仓库报溢';
                case 2: return '仓库报损';
                case 3: return '业务调增';
                case 4: return '业务调减';
                case 5: return '仓库同步调增';
                case 6: return '仓库同步调减';
                default: return null;
            }
        }
        const adjustmentStatus = (status1) => {
            switch (status1) {
                case 0: return '制单';
                case 1: return '已生效';
                default: return null;
            }
        }
        return (
            <div>
                <div className="itemDetail-manage-form manage-form">
                    <Row>
                        <Col span={6}>
                            <div className="detail-item">
                                <span className="justify-text">单据编号:</span>
                                <strong>{id}</strong>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="detail-item">
                                <span className="justify-text">调整日期:</span>
                                <strong>{adjustmentTime ? moment(adjustmentTime).format('YYYY-MM-DD') : ''}</strong>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="detail-item">
                                <span className="justify-text">状态:</span>
                                <strong>{adjustmentStatus(status)}</strong>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="detail-item">
                                <span className="justify-text">调整类型:</span>
                                <strong>{adjustmentType(type)}</strong>
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
                            <strong
                                style={{wordBreak: 'break-all', whiteSpace: 'normal'}}
                            >{description}</strong>
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
                            className="stockList-table"
                            columns={columns}
                            dataSource={imAdjustmentItemVos}
                            pagination={false}
                            rowKey={(record) => (Object.values(record).join('_'))}
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
    location: PropTypes.objectOf(PropTypes.any),
};

ItemDetail.defaultProps = {
    prefixCls: 'item-detail',
};

export default withRouter(ItemDetail);
