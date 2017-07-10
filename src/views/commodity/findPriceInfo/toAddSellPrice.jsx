import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Form, InputNumber, Tree } from 'antd';

import { AddPrice, ProductAddPriceVisible, AddSellPrice, toUpdateSell, updateSell } from '../../../actions/producthome';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;


@connect(
    state => ({
        toAddPriceVisible: state.toJS().commodity.toAddPriceVisible,
        isEdit: state.toJS().commodity.isEdit,
        visibleData: state.toJS().commodity.visibleData,
        addPrice: state.toJS().commodity.addPrice,
        toUpdate: state.toJS().commodity.toUpdate,
        pricingId: state.toJS().commodity.pricingId,
        id: state.toJS().commodity.id
    }),
    dispatch => bindActionCreators({
        AddPrice,
        ProductAddPriceVisible,
        AddSellPrice,
        toUpdateSell,
        updateSell
    }, dispatch)
)
class AddPriceDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.handleAuditCancel = ::this.handleAuditCancel;
        this.handleOk = ::this.handleOk;
        this.handleSubmit = ::this.handleSubmit;
        this.onTreeCheck = ::this.onTreeCheck;
        this.handleReset = ::this.handleReset;
        this.state = {
            saveCheckedTree: '',
            saveHalfCheckedTree: '',
            saveCheckedNames: ''

        }
    }
    componentDidMount() {
        const pricingId = this.props.pricingId;
        this.props.isEdit ?
            this.props.toUpdateSell({pricingId}) :
            this.props.AddPrice();
    }

    handleAuditCancel() {
        this.props.ProductAddPriceVisible({ isVisible: false });
        this.handleReset();
    }
    handleReset() {
        this.props.form.resetFields();
    }
    handleOk(e) {
        e.preventDefault();
        const { id } = this.props.match.params;
        this.props.form.validateFields((err) => {
            if (!err) {
                const cityNames = this.state.saveCheckedNames.join();
                const cityCodes = this.state.saveCheckedTree.join();
                const provinceCodes = this.state.saveHalfCheckedTree.join();
                const result = this.props.form.getFieldsValue();
                const goodsPriceInfo = {
                    cityNames,
                    cityCodes,
                    provinceCodes,
                    ...result

                }
                this.props.isEdit ?
                    this.props.updateSell({
                        productId: id,
                        goodsPriceInfo
                    }).then(() => {
                        this.props.ProductAddPriceVisible({ isVisible: false });
                        this.props.fetchList();
                    }) :
                    this.props.AddSellPrice({
                        productId: id,
                        goodsPriceInfo
                    }).then(() => {
                        this.props.ProductAddPriceVisible({ isVisible: false });
                        this.props.fetchList();
                    })
            }
        })
    }

    onChange() {

    }
    handleSubmit() {

    }

    /**
     * 获取城市tree节点
     * @param {*} data  城市数据 
     */
    getTreeNode(data) {
        return data.map((item) => {
            if (item.childs) {
                return <TreeNode title={item.regionName} key={item.code}>{this.getTreeNode(item.childs)}</TreeNode>;
            }

            return <TreeNode title={item.regionName} key={item.code} isLeaf={item.childs.length > 0} />
        })
    }

    onTreeCheck(checkedKeys, e) {
        const names = [];
        e.checkedNodes.map(item => (
            names.push(item.props.title)
        ))
        this.setState({
            saveHalfCheckedTree: e.halfCheckedKeys,
            saveCheckedTree: checkedKeys,
            saveCheckedNames: names
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { isEdit } = this.props;
        const { provinceCityListVos = [] } = isEdit ? this.props.toUpdate : this.props.addPrice;
        const { goodsPriceInfoVos = [] } = this.props.toUpdate;
        const modifyGoodsPriceInfoVos = isEdit ? goodsPriceInfoVos : [];
        const treeNodes = this.getTreeNode(provinceCityListVos);
        return (
            <Modal
                visible={this.props.toAddPriceVisible}
                onCancel={this.handleAuditCancel}
                onOk={this.handleOk}
                title={isEdit ? '修改销售价格' : '新增销售价格'}
                width="900px"
            >
                <div className="price-model">
                    <Form>
                        <div className="price-tittle">
                            <div>添加阶梯价格</div>
                            <div><span className="price-piece">数量区间/件</span><span className="price-num">售价/元</span></div>
                        </div>
                        <div>
                            <div className="price-form">
                                <FormItem>
                                    {getFieldDecorator('startNumber1', {
                                        rules: [{
                                            required: true,
                                            message: '请输入数量'
                                        }],
                                        initialValue: modifyGoodsPriceInfoVos[0] === undefined ? '' : modifyGoodsPriceInfoVos[0].startNumber1
                                    })(
                                        <InputNumber min={0} />
                                        )}
                                </FormItem>
                                <span className="price-line">——</span>
                                <FormItem>
                                    {getFieldDecorator('endNumber1', {
                                        rules: [{
                                            required: true,
                                            message: '请输入数量'
                                        }],
                                        initialValue: modifyGoodsPriceInfoVos[0] === undefined ? '' : modifyGoodsPriceInfoVos[0].endNumber1
                                    })(
                                        <InputNumber min={0} />
                                        )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('price1', {
                                        rules: [{
                                            required: true,
                                            message: '请输入价格'
                                        }],
                                        initialValue: modifyGoodsPriceInfoVos[0] === undefined ? '' : modifyGoodsPriceInfoVos[0].price1
                                    })(
                                        <InputNumber min={0} />
                                        )}
                                </FormItem>
                            </div>
                            <div className="price-form">
                                <FormItem>
                                    {getFieldDecorator('startNumber2', {
                                        rules: [{
                                            required: true,
                                            message: '请输入数量'
                                        }],
                                        initialValue: modifyGoodsPriceInfoVos[0] === undefined ? '' : modifyGoodsPriceInfoVos[0].startNumber2
                                    })(
                                        <InputNumber min={0} />
                                        )}
                                </FormItem>
                                <span className="price-line">——</span>
                                <FormItem>
                                    {getFieldDecorator('endNumber2', {
                                        rules: [{
                                            required: true,
                                            message: '请输入数量'
                                        }],
                                        initialValue: modifyGoodsPriceInfoVos[0] === undefined ? '' : modifyGoodsPriceInfoVos[0].endNumber2
                                    })(
                                        <InputNumber min={0} />
                                        )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('price2', {
                                        rules: [{
                                            required: true,
                                            message: '请输入价格'
                                        }],
                                        initialValue: modifyGoodsPriceInfoVos[0] === undefined ? '' : modifyGoodsPriceInfoVos[0].price2
                                    })(
                                        <InputNumber min={0} />
                                        )}
                                </FormItem>
                            </div>
                            <div className="price-form">
                                <FormItem>
                                    {getFieldDecorator('startNumber3', {
                                        rules: [{
                                            required: true,
                                            message: '请输入数量'
                                        }],
                                        initialValue: modifyGoodsPriceInfoVos[0] === undefined ? '' : modifyGoodsPriceInfoVos[0].startNumber3
                                    })(
                                        <InputNumber min={0} />
                                        )}
                                </FormItem>
                                <span className="price-line">——</span>
                                <FormItem>
                                    {getFieldDecorator('endNumber3', {
                                        rules: [{
                                            required: true,
                                            message: '请输入数量'
                                        }],
                                        initialValue: modifyGoodsPriceInfoVos[0] === undefined ? '' : modifyGoodsPriceInfoVos[0].endNumber3
                                    })(
                                        <InputNumber min={0} />
                                        )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('price3', {
                                        rules: [{
                                            required: true,
                                            message: '请输入价格'
                                        }],
                                        initialValue: modifyGoodsPriceInfoVos[0] === undefined ? '' : modifyGoodsPriceInfoVos[0].price3
                                    })(
                                        <InputNumber min={0} />
                                        )}
                                </FormItem>
                            </div>
                        </div>
                        <div>选择销售区域</div>
                        <div>
                            <FormItem>
                                <Tree
                                    checkable
                                    onCheck={this.onTreeCheck}
                                >
                                    {treeNodes}
                                </Tree>
                            </FormItem>
                        </div>
                    </Form>
                </div>
            </Modal >
        );
    }
}

AddPriceDetail.propTypes = {

}

export default withRouter(Form.create()(AddPriceDetail));
