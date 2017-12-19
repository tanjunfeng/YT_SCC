/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 促销管理 - 促销管理列表
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Row, Col, Button, Input, message } from 'antd';
import { clearPromotionDetail, getPromotionDetail, updateStoreId } from '../../../actions/promotion';
import { basicDetailBefore, basicDetailAfter } from '../columns';
import {
    getRowFromFields, getNoConditions, getPurchaseCondition,
    getRewardList, getTotalPurchaseList
} from './domHelper';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect((state) => ({
    promotion: state.toJS().promotion.promotionDetail
}), dispatch => bindActionCreators({
    clearPromotionDetail,
    getPromotionDetail,
    updateStoreId
}, dispatch))

class PromotionDetail extends PureComponent {
    state = {
        branch: '', // 四类页面现实分支
        area: '', // 使用区域显示：全部区域；所选区域；指定门店
        storesVisible: false, // 门店编辑框是否可见
        submitVisible: false, // 保存按钮是否可见
        submitDisabled: false // 保存按钮是否禁用
    }

    componentWillMount() {
        this.props.clearPromotionDetail();
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.getPromotionDetail({ promotionId: id });
    }

    componentWillReceiveProps(nextProps) {
        const { promotion } = nextProps;
        const { stores, promotionRule, status } = promotion;

        // 存在门店编号的时候，门店编辑框可见
        if (stores && stores.storeId) {
            this.setState({ storesVisible: true }, () => {
                // 未发布和已发布状态才可修改门店编号列表
                if (status === 'unreleased' || status === 'released') {
                    this.setState({ submitVisible: true });
                }
            });
        }
        this.setState({ area: this.getArea(promotion) });

        // 区分四种页面分支
        if (promotionRule) {
            // 不指定条件
            if (!promotionRule.useConditionRule) {
                this.setState({ branch: 'NOCONDITIONS' });
            } else {
                // 指定条件
                this.setState({ branch: promotionRule.ruleName });
            }
        }
    }

    componentWillUnmount() {
        this.props.clearPromotionDetail();
    }

    /**
     * 根据回传数据判断用户所选区域
     */
    getArea = (record) => {
        const { stores = null, companiesPoList = [] } = record;
        if (stores === null && companiesPoList.length === 0) {
            return '全部区域';
        }
        if (companiesPoList.length > 0) {
            return '指定区域';
        }
        if (stores && stores.storeId) {
            return '指定门店';
        }
        return null;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { form, promotion } = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.setState({ submitDisabled: true })
            const { storeId } = values;
            this.props.updateStoreId({
                stores: {
                    promoId: promotion.id,
                    storeId
                }
            }).then(res => {
                if (res.code === 200) {
                    message.success('保存门店信息成功！');
                }
            }).catch(() => {
                this.setState({ submitDisabled: false })
            });
        });
    }

    render() {
        const { form, promotion } = this.props;
        const { getFieldDecorator } = form;
        const { submitVisible, area, storesVisible, submitDisabled, branch } = this.state;
        const { promotionRule, stores } = promotion;
        return (
            <Form layout="inline" onSubmit={this.handleSubmit} className="promotion-form">
                {getRowFromFields(promotion, basicDetailBefore)}
                {branch === 'NOCONDITIONS' ?
                    getNoConditions(promotionRule) : null
                }
                {branch === 'PURCHASECONDITION' ?
                    getPurchaseCondition(promotionRule) : null
                }
                {branch === 'REWARDLIST' ?
                    getRewardList(promotionRule) : null
                }
                {branch === 'TOTALPUCHASELIST' ?
                    getTotalPurchaseList(promotionRule) : null
                }
                <Row key="area" type="flex" justify="start">
                    <Col span={16}>
                        <FormItem label="使用区域">{area}</FormItem>
                    </Col>
                </Row>
                {storesVisible ?
                    <Row type="flex" justify="start">
                        <Col span={16}>
                            <FormItem className="store">
                                {getFieldDecorator('storeId', {
                                    initialValue: stores.storeId,
                                    rules: [{ required: true, message: '请输入指定门店' }]
                                })(<TextArea
                                    disabled={!submitVisible}
                                    placeholder="请输入指定门店"
                                    autosize={{ minRows: 4, maxRows: 6 }}
                                />)}
                            </FormItem>
                        </Col>
                    </Row> : null
                }
                {getRowFromFields(promotion, basicDetailAfter)}
                {submitVisible ?
                    <Row className="center" >
                        <Button
                            type="primary"
                            size="default"
                            htmlType="submit"
                            disabled={submitDisabled}
                        >保存</Button>
                    </Row> : null}
            </Form>
        );
    }
}

PromotionDetail.propTypes = {
    clearPromotionDetail: PropTypes.func,
    getPromotionDetail: PropTypes.func,
    updateStoreId: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any),
    form: PropTypes.objectOf(PropTypes.any),
    promotion: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(PromotionDetail));
