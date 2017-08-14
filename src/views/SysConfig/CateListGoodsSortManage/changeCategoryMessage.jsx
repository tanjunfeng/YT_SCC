/**
 * @file changeCategoryMessage.jsx
 * @author Tan junfeng
 *
 * 分类列表页商品排序管理模态框
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Modal, Form, Input, message } from 'antd';

import Utils from '../../../util/util';
import {
    modifyCategoryVisible,
    modifyToAddCategory,
    modifyQuerygoodsname,
    modifyUpDateCategory
} from '../../../actions';
import { PAGE_SIZE } from '../../../constant';
import fetchCategoryList from '../../../actions/fetch/fetchCategory';
import ClassifiedSelect from '../../../components/threeStageClassification';

const FormItem = Form.Item;

@connect(
    state => ({
        toAddPriceVisible: state.toJS().categoryGoodsOrderNum.toAddPriceVisible,
        data: state.toJS().categoryGoodsOrderNum.data,
        categoryOrderList: state.toJS().categoryGoodsOrderNum.categoryOrderList,
        visibleData: state.toJS().categoryGoodsOrderNum.visibleData,
        querygoodsname: state.toJS().categoryGoodsOrderNum.querygoodsname,
    }),
    dispatch => bindActionCreators({
        modifyCategoryVisible,
        fetchCategoryList,
        modifyToAddCategory,
        modifyQuerygoodsname,
        modifyUpDateCategory
    }, dispatch)
)
class ChangeMessage extends PureComponent {
    constructor(props) {
        super(props);
        this.handleInformationOk = this.handleInformationOk.bind(this);
        this.handleInformationCancel = this.handleInformationCancel.bind(this);
        this.handleBackShow = this.handleBackShow.bind(this);
        this.handleInformationOk = this.handleInformationOk.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);

        this.state = {
            isDisabled: true,
            showName: ''
        }

        this.classify = {
            firstCategoryId: -1,
            secondCategoryId: -1,
            thirdCategoryId: -1,
            fourthCategoryId: -1,
            firstCategoryName: '',
            secondCategoryName: '',
            thirdCategoryName: '',
            fourthCategoryName: '',
        }
    }

    /**
     * 根据商品编号查询商品名称
     * @return {Object} 返回根据商品编号查询商品名称
     */
    handleBackShow() {
        const {
            productNo
        } = this.props.form.getFieldsValue();
        const {
            firstCategoryId,
            secondCategoryId,
            thirdCategoryId,
            fourthCategoryId,
        } = this.classify;
        this.props.modifyQuerygoodsname({
            firstCategoryId,
            secondCategoryId,
            thirdCategoryId,
            fourthCategoryId,
            productNo,
        })
    }

    /**
     * 三级下拉菜单
     * @param {Object} data 三级联动下拉菜单数据
     * @param {Object} that 三级联动对象
     * @return {Object} 返回根据商品编号查询商品名称
     */
    handleSelectChange(data, that) {
        const { first, second, third, fourth } = data;
        if (fourth.id !== -1) {
            this.setState({
                isDisabled: false
            })
        } else if (
            this.classify.fourthCategoryId !== fourth.id
            && fourth.id === -1
        ) {
            this.props.form.resetFields(['id']);
            this.setState({
                isDisabled: true
            })
        }
        this.classify = {
            firstCategoryId: first.id,
            secondCategoryId: second.id,
            thirdCategoryId: third.id,
            fourthCategoryId: fourth.id,
            firstCategoryName: first.categoryName,
            secondCategoryName: second.categoryName,
            thirdCategoryName: third.categoryName,
            fourthCategoryName: fourth.categoryName,
        }
        this.classifyRef = that;
    }

    /**
     * 模态框信息
     * @return {boll} 控制模态框的状态boll值
     */
    handleInformationCancel() {
        this.props.modifyCategoryVisible({isVisible: false});
    }

    /**
     * 模态框确定事件
     * @param {Object} data1 新增方法参数对象
     * @param {Object} data2 删除方法参数对象
     * @return {Object} 返回根据商品编号查询商品名称
     */
    handleInformationOk() {
        const { querygoodsname = '' } = this.props;
        const name1 = querygoodsname === null ? '' : querygoodsname;
        const {
            name,
            productNo,
            newOrderNum
        } = this.props.form.getFieldsValue();
        const orderNum = parseInt(newOrderNum, 10)
        const id = productNo
        const { visibleData = {} } = this.props;
        const { isEdit } = visibleData;
        const { pkId } = visibleData;
        const {
            firstCategoryId,
            secondCategoryId,
            thirdCategoryId,
            fourthCategoryId,
        } = this.classify;
        const data1 = {
            id,
            name: name1,
            orderNum,
            firstCategoryId,
            secondCategoryId,
            thirdCategoryId,
            fourthCategoryId,
        }
        const data2 = {
            id,
            orderNum,
            pkId,
            newOrderNum,
            firstCategoryId,
            secondCategoryId,
            thirdCategoryId,
            fourthCategoryId,
        }
        if (isEdit) {
            this.props.form.validateFields((err) => {
                if (!err) {
                    this.props.modifyUpDateCategory({
                        ...Utils.removeInvalid(data2)
                    }).then(() => {
                        message.success('修改成功！');
                        if ((name !== '')
                            && (newOrderNum !== '')
                            && (firstCategoryId !== '')
                            && (secondCategoryId !== '')
                            && (thirdCategoryId !== '')
                            && (fourthCategoryId !== '')
                        ) {
                            this.props.fetchCategoryList({
                                pageSize: PAGE_SIZE,
                                pageNum: 1
                            });
                            this.props.modifyCategoryVisible({
                                isVisible: false
                            });
                        }
                    }).catch((error2) => {
                        message.error(error2.message);
                    });
                }
            })
        } else {
            this.props.form.validateFields((err) => {
                if (!err) {
                    this.props.modifyToAddCategory({
                        ...Utils.removeInvalid(data1)
                    }).then(() => {
                        message.success('新增成功！');
                        if ((name !== '')
                            && (orderNum !== '')
                            && (firstCategoryId !== '')
                            && (secondCategoryId !== '')
                            && (thirdCategoryId !== '')
                            && (fourthCategoryId !== '')
                        ) {
                            this.props.fetchCategoryList({
                                pageSize: PAGE_SIZE,
                                pageNum: 1
                            });
                            this.props.modifyCategoryVisible({isVisible: false});
                        }
                    }).catch((error) => {
                        message.error(error.message);
                    });
                }
            })
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {
            id,
            orderNum,
            name,
            firstCategoryName,
            secondCategoryName,
            thirdCategoryName,
            fourthCategoryName,
            toAddCategoryTitle,
            isEdit
        } = this.props.visibleData;
        const productNo = id;
        const { querygoodsname = '', prefixCls } = this.props;
        const name1 = querygoodsname === null ? '' : querygoodsname;
        const { isDisabled } = this.state;
        return (
            <div>
                {
                    this.props.toAddPriceVisible &&
                    <Modal
                        title={toAddCategoryTitle}
                        visible={this.props.toAddPriceVisible}
                        onOk={this.handleInformationOk}
                        onCancel={this.handleInformationCancel}
                        maskClosable={false}
                        width="500px"
                    >
                        <Form className="jtgl-change-form">
                            <FormItem className="manage-form-item">
                                <div className={`${prefixCls}-flex`}>
                                    <div className={`${prefixCls}-spfl classify-select-label`}>
                                        商品分类
                                    </div>
                                    <ClassifiedSelect
                                        wrapClass="classify-select"
                                        onChange={this.handleSelectChange}
                                        defaultValue={isEdit ? [
                                            firstCategoryName,
                                            secondCategoryName,
                                            thirdCategoryName,
                                            fourthCategoryName
                                        ] : null}
                                    />
                                </div>
                            </FormItem>
                            <FormItem className="manage-form-item">
                                <div>
                                    <span className={`${prefixCls}-label`}>商品编号</span>
                                    {getFieldDecorator('productNo', {
                                        rules: [{
                                            required: true,
                                            message: '未找到商品编号'
                                        }],
                                        initialValue: !isDisabled
                                            ? productNo : id
                                    })(
                                        <Input
                                            disabled={isDisabled}
                                            className={`${prefixCls}-input ant-input-lg`}
                                            placeholder="请输入商品编号"
                                            onBlur={this.handleBackShow}
                                        />
                                    )}
                                </div>
                            </FormItem>
                            <FormItem className="manage-form-item">
                                <span className={`${prefixCls}-label`}>商品名称</span>
                                {getFieldDecorator('name1', {
                                    rules: [{
                                        required: true,
                                        message: '未找到关联商品名称'
                                    }],
                                    initialValue: !isEdit
                                        ? name1 : name
                                })(
                                    <Input
                                        readOnly
                                        disabled={isDisabled}
                                        className={`${prefixCls}-input ant-input-lg`}
                                    />
                                    )}
                            </FormItem>
                            <FormItem className="manage-form-item">
                                <span className={`${prefixCls}-label`}>商品排序</span>
                                {getFieldDecorator('newOrderNum', {
                                    rules: [{
                                        required: true,
                                        message: '请输入商品序号'
                                    }],
                                    initialValue: !isDisabled
                                    ? orderNum : orderNum
                                })(
                                    <Input
                                        disabled={isDisabled}
                                        placeholder="请输入商品序号"
                                        className={`${prefixCls}-input ant-input-lg`}
                                    />
                                )}
                            </FormItem>
                        </Form>
                    </Modal>
                }
            </div>
        )
    }
}

ChangeMessage.propTypes = {
    querygoodsname: PropTypes.func,
    modifyCategoryVisible: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    visibleData: PropTypes.objectOf(PropTypes.any),
    toAddCategoryTitle: PropTypes.objectOf(PropTypes.any),
    modifyToAddCategory: PropTypes.func,
    fetchCategoryList: PropTypes.func,
    modifyQuerygoodsname: PropTypes.func,
    toAddPriceVisible: PropTypes.bool,
    prefixCls: PropTypes.string,
    modifyUpDateCategory: PropTypes.func,
}

ChangeMessage.defaultProps = {
    prefixCls: 'changeMessage-line',
};

export default withRouter(Form.create()(ChangeMessage));
