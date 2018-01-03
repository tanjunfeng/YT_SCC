/**
 * @file orderInfo.jsx
 * @author taoqiyu
 *
 * 商品列表
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Form, Icon, Table } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EditableCell from './editableCell';
import { fetchOrderDetailInfo, clearOrderDetailInfo } from '../../../actions/order';

const noImage = require('../../../images/default/noPic.png');

@connect(
    () => ({}),
    dispatch => bindActionCreators({
        fetchOrderDetailInfo, clearOrderDetailInfo
    }, dispatch)
)

class GoodsInfo extends PureComponent {
    constructor(props) {
        super(props);
        let className;
        let message;
        this.columns = [{
            title: '商品图片',
            dataIndex: 'productImg',
            key: 'productImg',
            render: (text, record) => {
                let errorTip = null;
                let arrowTip = null;

                if (record.type === 'promotion') {
                    message = '赠';
                    const tipClassName = 'arrowTip giftColor';
                    arrowTip = <p className={tipClassName}><span>{message}</span></p>;
                } else if (record.type === 'bundle') {
                    message = '套';
                    const tipClassName = 'arrowTip packageColor';
                    arrowTip = <p className={tipClassName}><span>{message}</span></p>;
                }

                if (record.abnormalGoods) {
                    message = record.abnormalResonse || '毛利异常';
                    const tipClassName = arrowTip ? 'abnormalResonse resonse-top' : 'abnormalResonse';
                    errorTip = <div className={tipClassName}>{message}</div>;
                } else {
                    errorTip = '';
                }

                const imgUrl = text || noImage;
                return (
                    <div>
                        <img
                            src={imgUrl}
                            alt="未上传"
                            style={{ width: 50, height: 50, verticalAlign: 'middle' }}
                        />
                        {arrowTip}
                        {errorTip}
                    </div>
                )
            }
        }, {
            title: '商品编码',
            dataIndex: 'productCode',
            key: 'productCode',
            render: (text, record) => {
                if (record.abnormalGoods) {
                    className = 'abnormalResonse-color';
                } else {
                    className = '';
                }
                return (
                    <div>
                        <span className={className}>{text}</span>
                    </div>
                )
            }
        }, {
            title: '商品条码',
            dataIndex: 'internationalCodes',
            key: 'internationalCodes',
            render: (item, record) => {
                if (record.abnormalGoods) {
                    className = 'abnormalResonse-color';
                } else {
                    className = '';
                }
                if (item instanceof Array && item.length) {
                    return (
                        <div>
                            <span className={className}>{item[0].internationalCode}</span>
                        </div>
                    )
                }
            }
        }, {
            title: '商品名称',
            dataIndex: 'productName',
            key: 'productName',
            render: (text, record) => {
                if (record.abnormalGoods) {
                    className = 'abnormalResonse-color';
                } else {
                    className = '';
                }
                return <span className={className}>{text}</span>;
            }
        }, {
            title: '商品分类',
            dataIndex: 'commodifyClassify',
            key: 'commodifyClassify',
            render: (text, record) => {
                let after = '';
                if (record.thirdLevelCategoryName !== null) {
                    after = ` > ${record.thirdLevelCategoryName}`;
                }
                if (record.abnormalGoods) {
                    className = 'abnormalResonse-color';
                } else {
                    className = '';
                }
                return <span className={className}>{record.secondLevelCategoryName}{after}</span>;
            }
        }, {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record) => {
                if (record.abnormalGoods) {
                    className = 'abnormalResonse-color';
                } else {
                    className = '';
                }
                return <span className={className}>{text}</span>;
            }
        }, {
            title: '可用库存',
            dataIndex: 'availableStock',
            key: 'availableStock',
            render: (text, record) => {
                if (record.abnormalGoods) {
                    className = 'abnormalResonse-color';
                } else {
                    className = '';
                }
                return <span className={className}>{text}</span>;
            }
        }, {
            title: '单价',
            dataIndex: 'price',
            key: 'price',
            render: (text, record) => {
                if (record.abnormalGoods) {
                    className = 'abnormalResonse-color';
                } else {
                    className = '';
                }
                return <span className={className}>{`￥${Number(record.itemPrice.salePrice).toFixed(2)}`}</span>
            }
        }, {
            title: '金额',
            dataIndex: 'money',
            key: 'money',
            render: (text, record) => (
                <span className={className}>￥{Number(record.itemPrice.amount).toFixed(2)}</span>
            )
        }];
    }
    state = {
        goodsList: []
    }

    componentDidMount() {
        this.props.fetchOrderDetailInfo({
            id: this.props.match.params.id
        }).then(res => {
            const goodsList = [...res.data.items];
            goodsList.forEach(goods => {
                Object.assign(goods, {
                    sub1: goods.quantity,
                    sub2: 0,
                    quantityLeft: goods.quantity
                });
            });
            this.setState({ goodsList });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.canBeSplit && this.props.canBeSplit !== nextProps.canBeSplit) {
            this.renderColumns();
        }
        if (nextProps.canBeSplit === false && this.props.canBeSplit !== nextProps.canBeSplit) {
            this.removeColumns();
        }
    }

    onCellChange = record => value => {
        const goodsList = [...this.state.goodsList];
        const index = goodsList.findIndex(goods => goods.id === record.id);
        let v = value;
        if (index > -1) {
            if (v > goodsList[index].quantityLeft) {
                v = goodsList[index].quantityLeft;
            }
            goodsList[index][`sub${this.getLastSubNum(1)}`] = v;
            goodsList[index][`sub${this.getLastSubNum(2)}`] = goodsList[index].quantityLeft - v;
            this.setState({ goodsList }, () => {
                this.noticeParent();
            });
        }
    }

    /**
     * 获取最后 n 列的索引
     *
     * 不传值则取最后一列
     */
    getLastSubNum = (lastIndexOf = 1) => (
        +(this.columns[this.columns.length - lastIndexOf].dataIndex.substr(3))
    );

    /**
     * 获取单个子订单对象
     */
    getSubObject = (subIndex) => {
        const goodsList = this.state.goodsList;
        const dist = {};
        goodsList.forEach(goods => {
            Object.assign(dist, { [goods.id]: goods[`sub${subIndex}`] });
        });
        return dist;
    }

    /**
     * 回传子订单数据给父组件
     */
    noticeParent = () => {
        const arr = [];
        for (let i = 1; i <= this.getLastSubNum(); i++) {
            arr.push(this.getSubObject(i));
        }
        this.props.onChange(arr);
    }

    addSubOrders = () => {
        const goodsList = [...this.state.goodsList];
        const subNum = this.getLastSubNum() + 1;
        this.columns.push({ title: `子订单${subNum}`, dataIndex: `sub${subNum}` });
        goodsList.forEach(goods => {
            const quantityUsed = goods[`sub${subNum - 2}`]; // 倒数第二列的数量应该算作占用库存
            Object.assign(goods, {
                [`sub${subNum}`]: 0,
                quantityLeft: goods.quantityLeft - quantityUsed
            });
        });
        this.renderColumns();
        this.setState({ goodsList });
    }

    removeColumns = () => {
        if (this.columns[this.columns.length - 1].dataIndex === 'sub2') {
            this.columns.splice(this.columns.length - 2, 2);
        }
    }

    /**
     * 渲染显示单元格，根据数量计算价格
     */
    renderReadOnlyCell = (text, record) => {
        let value = text;
        if (value === undefined) {
            // 避免出现 NaN 值
            value = record.quantityLeft;
        }
        const res = `${value}，￥${(value * record.itemPrice.salePrice).toFixed(2)}`;
        return res;
    }

    renderColumns = () => {
        if (this.columns[this.columns.length - 1].dataIndex !== 'sub2') {
            this.columns.push(
                { title: '子订单1', dataIndex: 'sub1', render: this.renderReadOnlyCell },
                { title: '子订单2', dataIndex: 'sub2', render: this.renderEditableCell }
            );
        }
    }

    /**
     * 渲染可编辑单元格
     */
    renderEditableCell = (text = 0, record) => {
        let value = +(text);
        if (isNaN(value)) {
            value = 0;
        }
        const res = (<div>
            <EditableCell
                value={value}
                min={0}
                step={1}
                max={record.quantityLeft}
                onChange={this.onCellChange(record)}
            />
            <span className="sub-total">￥{(value * record.itemPrice.salePrice).toFixed(2)}</span>
        </div>);
        return res;
    }

    render() {
        const { value } = this.props;
        const { countOfItem, rawSubtotal } = value;
        return (
            <div className="detail-message add-sub-orders">
                <div className="detail-message-header">
                    <Icon type="picture" className="detail-message-header-icon" />
                    商品信息
                </div>
                <div className="orderDetail-message">
                    <Table
                        dataSource={this.state.goodsList}
                        columns={this.columns}
                        pagination={false}
                        rowKey="id"
                        scroll={{ x: 1440 }}
                        bordered
                    />
                </div>
                <div className="table-statistics" style={{ textAlign: 'right' }}>
                    <span className="table-statistics-item">
                        <span>共</span>
                        <span className="red">{countOfItem}</span>
                        <span>件商品</span>
                    </span>
                    <span className="table-statistics-item">
                        <span>总金额： ￥</span>
                        <span className="red">{Number(rawSubtotal).toFixed(2)}</span>
                    </span>
                </div>
            </div>
        );
    }
}

GoodsInfo.propTypes = {
    value: PropTypes.objectOf(PropTypes.any),
    canBeSplit: PropTypes.bool,
    fetchOrderDetailInfo: PropTypes.func,
    onChange: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(GoodsInfo));
