import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {Form, Row, Col, Button, message, Affix} from 'antd';
import Immutable, { fromJS } from 'immutable';
import {
    getMaterialMap,
    initPoDetail,
    ModifyPo,
    createPo,
    auditPo,
    queryPoDetail,
    addPoLines,
    updatePoLine,
    deletePoLine,
    fetchNewPmPurchaseOrderItem,
} from '../../../actions/procurement';
import { pubFetchValueList } from '../../../actions/pub';
import Utils from '../../../util/util';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import BasicInfo from './basicInfo';
import AddingGoods from './addingGoods';
import GoodsLists from './goodsLists';

const FormItem = Form.Item;

@connect(state => ({
    po: state.toJS().procurement.po || {},
    newPcOdData: state.toJS().procurement.newPcOdData || {},
    // 回显数据
    basicInfo: state.toJS().procurement.po.basicInfo || {},
    poLines: state.toJS().procurement.po.poLines || [],
    // 用户信息
    data: state.toJS().user.data || {}
}), dispatch => bindActionCreators({
    getMaterialMap,
    initPoDetail,
    auditPo,
    createPo,
    ModifyPo,
    queryPoDetail,
    addPoLines,
    updatePoLine,
    deletePoLine,
    pubFetchValueList,
    fetchNewPmPurchaseOrderItem,
    modifyCauseModalVisible
}, dispatch))

class PoCreateList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            totalQuantitys: 0,
            totalAmounts: 0,
            spAdrId: null,
            businessMode: null,
            spId: null,
            purchaseOrderType: '0',
            isInfoCheck: false, // 是否对基本信息框进行校验
            isGoodsCheck: false, // 是否对商品列表进行校验
            basicInfoCheck: false, // 基本信息框校验结果
            operatType: 0 // 0保存，1提交 默认保存
        }
        this.checkedInfo = null;
    }
    componentDidMount() {
        const that = this;
        const { match } = this.props;
        const { type } = match.params;
        this.setState({
            currentType: type,
        })
        // 采购单id
        const poId = match.params.purchaseOrderNo;
        // 采购单id不存在
        if (type === 'create') {
            // 初始化采购单详情
            that.props.initPoDetail({
                basicInfo: {},
                poLines: []
            });
        } else {
            // 1.采购单id存在，查询采购单详情
            // 2.设置界面状态，操作按钮状态
            that.props.queryPoDetail({
                id: poId
            });
        }
    }
    componentWillReceiveProps(nextProps) {
        const {
            purchaseOrderType, id, spAdrId, businessMode, spId
        } = nextProps.basicInfo;
        const { basicInfo = {} } = this.props;
        const newPo = fromJS(nextProps.po.poLines);
        const oldPo = fromJS(this.props.po.poLines);
        if (!Immutable.is(newPo, oldPo)) {
            this.caculate(nextProps.po.poLines);
        }
        if (basicInfo.id !== id) {
            this.setState({
                spAdrId,
                businessMode: businessMode === 0 || businessMode === 1 ? `${businessMode}` : '',
                spId,
                purchaseOrderType: typeof purchaseOrderType === 'number' ? `${purchaseOrderType}` : ''
            })
        }
    }

    componentWillUnmount() {
        this.props.initPoDetail({
            basicInfo: {},
            poLines: []
        })
    }

    /**
     * 点击保存/提交
     * 基本信息框校验
     * 校验内容：基本信息是否正确
     * 返回校验结果和基本信息
     * 如果基本信息框校验成功则校验商品列表
     */
    basicInfoResult = (isInfoCheck, basicInfo) => {
        this.checkedInfo = basicInfo;
        if (isInfoCheck) {
            this.setState({
                isGoodsCheck: true
            })
        } else {
            this.setState({
                isInfoCheck: false
            })
            // 检验基本信息
            message.error('校验失败，请检查！');
        }
    }

    /**
     * 新增/修改的请求
     */
    /**
     * 新增/修改的请求
     */
    createPoRequest = (validPoLines) => {
        // 基本信息，商品行均校验通过,获取有效值
        const basicInfo = this.checkedInfo;
        const CId = basicInfo.id;
        const poData = {
            basicInfo,
            poLines: validPoLines
        }
        // 基本信息
        const {
            spAdrId,
            payType,
            settlementPeriod,
            adrType,
            currencyCode,
            purchaseOrderType,
            addressCd,
            businessMode
        } = poData.basicInfo;
        // 采购商品信息
        const pmPurchaseOrderItems = poData.poLines.map((item) => {
            const {
                id,
                prodPurchaseId,
                productId,
                productCode,
                purchaseNumber,
                purchasePrice,
            } = item;
            return {
                ...Utils.removeInvalid({
                    id,
                    prodPurchaseId,
                    productId,
                    productCode,
                    purchaseNumber,
                    purchasePrice
                })
            }
        })

        // 预计送货日期
        const estimatedDeliveryDate = basicInfo.estimatedDeliveryDate
            ? basicInfo.estimatedDeliveryDate.valueOf().toString()
            : null;

        // 付款条件
        const payCondition = settlementPeriod;
        if (CId) {
            // 修改页
            this.props.ModifyPo({
                pmPurchaseOrder: {
                    id: CId,
                    spAdrId: `${spAdrId || this.props.basicInfo.spAdrId}`,
                    estimatedDeliveryDate,
                    payType,
                    payCondition,
                    adrType: parseInt(adrType, 10),
                    adrTypeCode: addressCd || this.props.basicInfo.adrTypeCode,
                    currencyCode,
                    purchaseOrderType: parseInt(purchaseOrderType, 10),
                    status: this.state.operatType,
                    businessMode: parseInt(businessMode, 10)
                },
                pmPurchaseOrderItems
            }).then((res) => {
                // 如果创建成功，刷新界面数据
                if (res.success) {
                    message.success('提交成功！');
                    this.props.history.goBack();
                } else {
                    message.error('提交失败，请检查！');
                }
            });
        } else {
            // 新增页
            this.props.createPo({
                pmPurchaseOrder: {
                    spAdrId: `${spAdrId || this.props.basicInfo.spAdrId}`,
                    estimatedDeliveryDate,
                    payType,
                    payCondition,
                    adrType: parseInt(adrType, 10),
                    adrTypeCode: addressCd || this.props.basicInfo.adrTypeCode,
                    currencyCode,
                    purchaseOrderType: parseInt(purchaseOrderType, 10),
                    status: this.state.operatType,
                    businessMode: parseInt(businessMode, 10)
                },
                pmPurchaseOrderItems
            }).then((res) => {
                // 如果创建成功，刷新界面数据
                if (res.success) {
                    message.success('提交成功！');
                    this.props.history.goBack();
                } else {
                    message.error('提交失败，请检查！');
                }
            });
        }
    }

    /**
     * 计算采购总数量、采购总金额
     * 计算对象：未删除&&采购数量不为空
     */
    caculate = (list = []) => {
        const poLines = list;
        // 合计采购数量
        let totalQuantitys = 0;
        // 合计采购金额
        let totalAmounts = 0;
        poLines.forEach((item) => {
            if (item && item.purchaseNumber && !item.deleteFlg) {
                totalQuantitys += item.purchaseNumber;
            }
            if (item && item.totalAmount) {
                totalAmounts += item.totalAmount
            }
        });
        totalAmounts = Math.round(totalAmounts * 100) / 100;
        if (this.state.purchaseOrderType === '1') {
            this.setState({
                totalQuantitys,
                totalAmounts: 0
            });
        } else {
            this.setState({
                totalQuantitys,
                totalAmounts: Math.round(totalAmounts * 100) / 100
            });
        }
    }

    /**
     * 子组件更新父组件state
     */
    stateChange = (state) => {
        this.setState(state)
    }

    /**
     * 检查添加商品是否已经存在于采购单商品列表
     */
    isMaterialExists = (productCode) => {
        let result = { exsited: true, record: null };
        if (!productCode) {
            result = { exsited: true, record: null };
            return result;
        }

        const tmp = this.props.poLines;
        // 商品行列表为空，则不存在改商品
        if (!tmp) {
            result = { exsited: false, record: null };
            return result;
        }

        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].productCode === productCode) {
                result = { exsited: true, record: tmp[i] };
                return result;
            }
        }
        return ({ exsited: false, record: null });
    }

    /**
     * 添加采购商品
     *  .检查商品列表中是否存在该商品
     *    a.已存在：显示已存在
     *    b   在：添加该商品(recordStatus:new 新添加)
     */
    handleChoosedMaterialMap = ({ record }) => {
        // 检查商品列表是否已经存在该商品
        const result = this.isMaterialExists(record.productCode);
        if (result.exsited) {
            if (result.record && result.record.deleteFlg) {
                result.record.deleteFlg = false;
                this.props.updatePoLine(result.record);
            } else {
                message.error('该商品已经存在');
            }
        } else {
            this.props.fetchNewPmPurchaseOrderItem({
                // 商品id, 供应商地点id
                productId: record.productId,
                spAdrId: this.state.spAdrId
            }).then(() => {
                const { newPcOdData } = this.props;
                const uuid = this.guid();
                const poLine = Object.assign(
                    {},
                    newPcOdData,
                    { id: uuid, recordStatus: 'new' }
                );
                this.props.addPoLines(poLine);
            })
        }
    }

    /**
     * 删除所有商品行
     * 1.行状态=new ,物理删除
     * 2.行状态!=new，逻辑删除
     */
    deletePoLines = () => {
        this.props.initPoDetail({
            poLines: []
        })
    }

    /**
     * 点击保存
     */
    handleSave = () => {
        this.setState({
            operatType: 0,
            isInfoCheck: true
        })
    }

    /**
     * 点击提交
     */
    handleSubmit = () => {
        this.setState({
            operatType: 1,
            isInfoCheck: true
        })
    }

    S4 = () => (
        (((1 + Math.random()) * 0x10000) || 0).toString(16).substring(1)
    )

    guid = () => (
        `${this.S4()}${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}${this.S4()}${this.S4()}`
    )

    purchaseOrderTypeChange = (data) => {
        this.setState(data, () => (this.caculate(this.props.po.poLines)));
    }
    render() {
        const {basicInfo} = this.props;
        return (
            <div className="po-detail">
                <Form layout="inline">
                    <BasicInfo
                        basicInfo={basicInfo}
                        purchaseOrderTypeChange={this.purchaseOrderTypeChange}
                        deletePoLines={this.deletePoLines}
                        isCheck={this.state.isInfoCheck}
                        checkResult={this.basicInfoResult}
                        stateChange={this.stateChange}
                    />
                    <AddingGoods
                        spAdrId={this.state.spAdrId}
                        businessMode={this.state.businessMode}
                        spId={this.state.spId}
                        handleChoosedMaterialMap={this.handleChoosedMaterialMap}
                    />
                    <GoodsLists
                        basicInfo={basicInfo}
                        poLines={this.props.poLines}
                        purchaseOrderType={this.state.purchaseOrderType}
                        applyPriceChange={this.applyPriceChange}
                        applyQuantityChange={this.applyQuantityChange}
                        isCheck={this.state.isGoodsCheck}
                        createPoRequest={this.createPoRequest}
                    />
                    <div>
                        <Row type="flex">
                            <Col span={8}>
                                <div>
                                    <span>合计数量:</span>
                                    <span style={{ color: '#F00' }}>{this.state.totalQuantitys}</span>
                                </div>

                            </Col>
                            <Col span={8}>
                                <div>
                                    <span>合计金额:</span>
                                    <span style={{ color: '#F00' }}>{this.state.totalAmounts}</span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Affix offsetBottom={0}>
                        <div className="actions">
                            <Row gutter={40} type="flex" justify="end" >
                                <Col>
                                    <FormItem>
                                        <Button size="default" onClick={this.handleSave}>
                                            保存
                                        </Button>
                                    </FormItem>
                                    <FormItem>
                                        <Button size="default" onClick={this.handleSubmit}>
                                            提交
                                        </Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    </Affix>
                </Form>
            </div>
        )
    }
}
PoCreateList.propTypes = {
    newPcOdData: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any),
    basicInfo: PropTypes.objectOf(PropTypes.any),
    poLines: PropTypes.objectOf(PropTypes.any),
    po: PropTypes.objectOf(PropTypes.any),
    initPoDetail: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    ModifyPo: PropTypes.func,
    createPo: PropTypes.func,
    updatePoLine: PropTypes.func,
    fetchNewPmPurchaseOrderItem: PropTypes.func,
    addPoLines: PropTypes.func,
}

export default withRouter(Form.create()(PoCreateList));
