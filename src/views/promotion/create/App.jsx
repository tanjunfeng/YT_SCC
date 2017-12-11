/**
 * @author taoqiyu
 *
 * 促销管理 - 新增下单打折
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
    Form, Row, Input, Radio,
    Button, DatePicker, Checkbox,
    InputNumber, Select, message
} from 'antd';

import Util from '../../../util/util';
import { AreaSelector } from '../../../container/tree';
import { createPromotion } from '../../../actions/promotion';
import { DATE_FORMAT, MINUTE_FORMAT } from '../../../constant';
import { overlayOptions } from '../constants';
import { getChooseButton, getRules, getPromotion, getRewardList } from './domHelper';
import { getFormData } from './dataHelper';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

@connect(() => ({
}), dispatch => bindActionCreators({
    createPromotion
}, dispatch))

class PromotionCreate extends PureComponent {
    state = {
        areaSelectorVisible: false,
        storeSelectorVisible: false,
        companies: [], // 所选区域子公司
        categoryPC: null, // 购买条件品类, PC = PURCHASECONDITION
        categoryRL: null, // 奖励列表品类，RL = REWARDLIST
    }

    handleSelectorOk = (companies) => {
        this.setState({
            areaSelectorVisible: false,
            companies
        });
        this.props.form.setFieldsValue({
            companies: companies.map(c => c.companyName)
        });
    }

    handleSelectorCancel = () => {
        this.setState({
            areaSelectorVisible: false
        });
    }

    /**
     * 所选区域选项
     * @param {*object} e
     */
    handleAreaChange = (e) => {
        const nextArea = e.target.value;
        switch (nextArea) {
            case 0:
                this.setState({
                    areaSelectorVisible: false,
                    storeSelectorVisible: false,
                    companies: []
                });
                break;
            case 1:
                this.setState({
                    areaSelectorVisible: true,
                    storeSelectorVisible: false
                });
                break;
            case 2:
                this.setState({
                    areaSelectorVisible: false,
                    storeSelectorVisible: true,
                    companies: []
                });
                break;
            default: break;
        }
    }

    /**
     * 购买条件品类选择器
     *
     * PC = PURCHASECONDITION
     */
    handlePCCategorySelect = (categoryPC) => {
        this.setState({ categoryPC });
    }

    /**
     * 购买条件品类选择器
     *
     * RL = REWARDLIST
     */
    handleRLCategorySelect = (categoryRL) => {
        this.setState({ categoryRL });
    }

    /**
     * 重新选择子公司列表
     */
    handleSubCompaniesRechoose = () => {
        this.setState({
            areaSelectorVisible: true
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        getFormData({ state: this.state, form: this.props.form }, data => {
            this.props.createPromotion(data).then(res => {
                if (res.code === 200) {
                    message.success(res.message);
                }
            });
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const {
            companies, areaSelectorVisible, storeSelectorVisible
        } = this.state;
        return (
            <Form className="promotion-create" layout="inline" onSubmit={this.handleSubmit}>
                <Row>
                    <FormItem label="活动名称" >
                        {getFieldDecorator('promotionName', {
                            rules: [
                                { required: true, message: '请输入促销活动名称!' },
                                { max: 30, message: '活动名称最长30位' }
                            ]
                        })(<Input size="default" />)}
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="活动时间" className="promotion-date-range">
                        {getFieldDecorator('dateRange', {
                            initialValue: '',
                            rules: [{ required: true, message: '请选择活动日期' }]
                        })(<RangePicker
                            className="manage-form-enterTime"
                            showTime={{ format: MINUTE_FORMAT }}
                            format={`${DATE_FORMAT} ${MINUTE_FORMAT}`}
                            placeholder={['开始时间', '结束时间']}
                        />)}
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="使用条件">
                        {getFieldDecorator('condition', {
                            initialValue: 1,
                            rules: [{ required: true, message: '请选择使用条件' }]
                        })(<RadioGroup>
                            <Radio className="default" value={0}>不限制</Radio>
                            <Radio value={1}>指定条件</Radio>
                        </RadioGroup>)}
                    </FormItem>
                </Row>
                {/* 优惠方式 */}
                <Row>
                    {/* 不限制使用条件 */}
                    {getFieldValue('condition') === 0 ?
                        getRules(this.props.form, 'noCondition')
                        :
                        // condition === 1
                        <FormItem label="优惠种类">
                            {getFieldDecorator('category', {
                                initialValue: 'REWARDLIST'
                            })(<Select size="default" className="wd-110">
                                <Option key={'PURCHASECONDITION'} value="PURCHASECONDITION">购买条件</Option>
                                <Option key={'REWARDLIST'} value="REWARDLIST">奖励列表</Option>
                                <Option key={'TOTALPUCHASELIST'} value="TOTALPUCHASELIST">整个购买列表</Option>
                            </Select>)}
                        </FormItem>
                    }
                </Row>
                {/* 指定条件——购买条件 */}
                {getFieldValue('condition') === 1 && getFieldValue('category') === 'PURCHASECONDITION' ?
                    getPromotion(
                        this.props.form,
                        'purchaseCondition',
                        this.handlePCCategorySelect)
                    : null
                }
                {/* 指定条件——奖励列表 */}
                {getFieldValue('condition') === 1 && getFieldValue('category') === 'REWARDLIST' ?
                    getRewardList(
                        this.props.form,
                        'rewardList',
                        this.handleRLCategorySelect)
                    : null
                }
                <Row>
                    <FormItem label="使用区域">
                        {getFieldDecorator('area', {
                            initialValue: 0
                        })(<RadioGroup onChange={this.handleAreaChange}>
                            <Radio className="default" value={0}>全部区域</Radio>
                            <Radio value={1}>指定区域</Radio>
                            <Radio value={2}>指定门店</Radio>
                        </RadioGroup>)}
                    </FormItem>
                </Row>
                <Row>
                    {getFieldValue('area') === 1 ?
                        <FormItem label="指定区域">
                            {getFieldDecorator('companies', {
                                initialValue: companies.map(company => company.companyName),
                                rules: [{ required: true, message: '请选择子公司' }]
                            })(<Input disabled />)}
                            {getChooseButton(companies, this.handleSubCompaniesRechoose)}
                            <AreaSelector
                                reset={getFieldValue('area') === 1}
                                isSelectorVisible={areaSelectorVisible}
                                onSelectorOk={this.handleSelectorOk}
                                onSelectorCancel={this.handleSelectorCancel}
                            />
                        </FormItem> : null
                    }
                </Row>
                <Row>
                    {storeSelectorVisible ?
                        <FormItem className="store">
                            {getFieldDecorator('storeId', {
                                initialValue: '',
                                rules: [{ required: true, message: '请输入指定门店' }]
                            })(<TextArea
                                placeholder="请输入指定门店"
                                autosize={{ minRows: 4, maxRows: 6 }}
                            />)}
                        </FormItem>
                        : null
                    }
                </Row>
                <Row>
                    {storeSelectorVisible ?
                        <span className="store">请按照数据模板的格式准备导入数据如：A000999, A000900, A000991</span>
                        : null
                    }
                </Row>
                <Row>
                    <FormItem label="活动优先级">
                        {getFieldDecorator('priority', {
                            initialValue: 1,
                            rules: [
                                { validator: Util.validatePositiveInteger },
                                { required: true, message: '请输入活动优先级' }
                            ]
                        })(<InputNumber min={1} step={1} max={9999} className="wd-90" />)}
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="活动叠加">
                        {getFieldDecorator('overlay', {
                            initialValue: []
                        })(<CheckboxGroup
                            options={overlayOptions}
                        />)}
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="简易描述">
                        {getFieldDecorator('simpleDescription', {
                            initialValue: '',
                            rules: [{ max: 20, message: '限填20字' }]
                        })(<TextArea placeholder="可填写简易描述，限填20字" autosize={{ minRows: 2, maxRows: 4 }} />)}
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="详细描述">
                        {getFieldDecorator('detailDescription', {
                            initialValue: '',
                            rules: [{ max: 200, message: '限填200字' }]
                        })(<TextArea placeholder="可填写详细描述，限填200字" autosize={{ minRows: 4, maxRows: 6 }} />)}
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="备注">
                        {getFieldDecorator('note', {
                            initialValue: '',
                            rules: [{ max: 200, message: '限填200字' }]
                        })(<TextArea placeholder="可填写备注，限填200字" autosize={{ minRows: 4, maxRows: 6 }} />)}
                    </FormItem>
                </Row>
                <Row className="center" >
                    <Button type="primary" size="default" htmlType="submit">保存</Button>
                </Row>
            </Form>
        );
    }
}

PromotionCreate.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    createPromotion: PropTypes.func
}

export default withRouter(Form.create()(PromotionCreate));
