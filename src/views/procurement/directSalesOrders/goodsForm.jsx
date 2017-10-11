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
import { Form, Row } from 'antd';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AddingGoodsByStore } from '../../../container/search';
import {
    queryDirectInfo
} from '../../../actions/procurement';

const FormItem = Form.Item;

@connect(state => ({
    directInfo: state.toJS().procurement.directInfo
}), dispatch => bindActionCreators({
    queryDirectInfo
}, dispatch))

class GoodsForm extends PureComponent {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange({ record }) {

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="direct-sales-orders">
                <Form layout="inline">
                    <div className="search-box">
                        <h1>商品信息</h1>
                        <Row gutter={40}>
                            <FormItem>
                                {getFieldDecorator('goods', {
                                    initialValue: this.props.value
                                })(<AddingGoodsByStore
                                    onChange={this.handleChange}
                                />)}
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
    directInfo: PropTypes.objectOf(PropTypes.any),
    queryDirectInfo: PropTypes.func,
    value: PropTypes.string,
    onChange: PropTypes.func
};

export default withRouter(Form.create()(GoodsForm));
