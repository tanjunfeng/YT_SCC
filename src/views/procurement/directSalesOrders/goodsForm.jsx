/**
 * 直营店下单，添加商品
 *
 * 1. 点选值清单依次添加
 * 2. 下载 excel 模板批量添加
 *
 * @returns 商品列表
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Button } from 'antd';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AddingGoodsByStore } from '../../../container/search';
import {
    queryGoodsInfo
} from '../../../actions/procurement';

const FormItem = Form.Item;

@connect(() => ({}), dispatch => bindActionCreators({
    queryGoodsInfo
}, dispatch))

class GoodsForm extends PureComponent {
    handleGoodsChange = ({ record }) => {
        if (record === undefined) {
            this.props.onChange(false);
            return;
        }
        const productId = record.productId;
        const { branchCompanyId, deliveryWarehouseCode } = this.props.value;
        this.props.queryGoodsInfo({
            productId, branchCompanyId, deliveryWarehouseCode
        }).then(res => {
            this.props.onChange(res.data);
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="direct-sales-orders goods-form">
                <Form layout="inline">
                    <div className="search-box">
                        <h1>商品信息</h1>
                        <Row gutter={40}>
                            <FormItem>
                                {getFieldDecorator('goods', {
                                    initialValue: {
                                        branchCompanyId: this.props.value.branchCompanyId,
                                        productCode: '',
                                        productName: ''
                                    }
                                })(<AddingGoodsByStore
                                    onChange={this.handleGoodsChange}
                                />)}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" size="default">
                                    Excel 导入
                                </Button>
                                <a className="download">
                                    下载 Excel 模板
                                </a>
                                <div className="info">
                                    数量：<span>30</span>
                                </div>
                                <div className="info">
                                    金额：<span>2000</span>
                                </div>
                            </FormItem>
                            <FormItem className="fr">
                                <Button type="primary" size="default">
                                    提交
                                </Button>
                            </FormItem>
                        </Row>
                    </div>
                </Form>
            </div>
        );
    }
}

GoodsForm.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    value: PropTypes.objectOf(PropTypes.any),
    queryGoodsInfo: PropTypes.func,
    onChange: PropTypes.func
};

export default withRouter(Form.create()(GoodsForm));
