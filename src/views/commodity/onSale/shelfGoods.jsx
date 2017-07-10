import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Checkbox, Form, InputNumber, Tree } from 'antd';

import { AddPrice, ProductAddPriceVisible } from '../../../actions/producthome';


@connect(
    state => ({
        toAddPriceVisible: state.toJS().commodity.toAddPriceVisible,
        visibleData: state.toJS().commodity.visibleData
    }),
    dispatch => bindActionCreators({
        AddPrice,
        ProductAddPriceVisible
    }, dispatch)
)
class AreaDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.componentDidMount = ::this.componentDidMount
        this.handleAuditCancel = ::this.handleAuditCancel;
        this.handleOk = ::this.handleOk;
    }

    componentDidMount() {
        const { visibleData } = this.props;
        this.props.AddPrice();
    }

    handleAuditCancel() {
        this.props.ProductAddPriceVisible({ isVisible: false });
    }

    handleOk() {

    }

    onChange() {

    }
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    }
    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { visibleData, toAddPriceVisible } = this.props;
        const { provinceCityListVos = [] } = this.props.addPrice;
        return (
            <Modal
                visible={this.props.toAddPriceVisible}
                onCancel={this.handleAuditCancel}
                onOk={this.handleOk}
                title='新增销售价格'
                width="900px"
            >
                <Form>
                    <FormItem>
                        <div>添加阶梯价格</div>
                        <div><span>数量区间/件</span><span>售价/元</span></div>
                        <div><InputNumber />——<InputNumber /><InputNumber /></div>
                        <div><InputNumber />——<InputNumber /><InputNumber /></div>
                        <div><InputNumber />——<InputNumber /><InputNumber /></div>
                    </FormItem>
                    <FormItem>
                        <div>选择销售区域</div>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

AreaDetail.propTypes = {
    visibleData: PropTypes.objectOf(PropTypes.any),
    form: PropTypes.objectOf(PropTypes.any),
    addPrice: PropTypes.objectOf(PropTypes.any),
    toAddPriceVisible: PropTypes.bool,
    ProductAddPriceVisible: PropTypes.func
}

export default withRouter(Form.create()(AreaDetail));
