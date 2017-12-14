import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {Form, Row, Col, Button, message, Modal, Affix} from 'antd';
import Immutable, { fromJS } from 'immutable';
import Audit from './auditModal';
import {
    getMaterialMap,
    initPoDetail,
    createPo,
    ModifyPo,
    auditPo,
    queryPoDetail,
    updatePoBasicinfo,
    addPoLines,
    updatePoLine,
    deletePoLine,
    fetchNewPmPurchaseOrderItem,
} from '../../../actions/procurement';
import { poStatusCodes} from '../../../constant/procurement';
import { pubFetchValueList } from '../../../actions/pub';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import BasicInfo from './basicInfo';
import AddingGoods from './addingGoods';
import GoodsLists from './goodsLists';

/**
 * 界面状态
 */
const PAGE_MODE = {
    NEW: 'new',
    UPDATE: 'update',
    READONLY: 'readonly'
};
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
    createPo,
    ModifyPo,
    auditPo,
    queryPoDetail,
    updatePoBasicinfo,
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
            // new:新建 update:编辑 readonly 只读
            pageMode: '',
            // 操作权限
            actionAuth: {},
            // 审核弹出框是否可见
            auditModalVisible: false,
            editable: false,
            locDisabled: true,
            spAdrId: null,
            businessMode: null,
            spId: null,
            purchaseOrderType: '0',
            isCheck: false, // 是否进行校验
            basicInfoCheck: false, // 基本信息框校验结果
            basicInfo: {}, // 基本信息框内容
        }
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
            }).then(() => {
                const tmpPageMode = that.getPageMode();
                that.setState({ pageMode: tmpPageMode });
                that.setState({ actionAuth: that.getActionAuth() });
                // 计算采购总数量、采购总金额
                if (tmpPageMode !== PAGE_MODE.READONLY) {
                    that.setState({ editable: true });
                } else {
                    that.setState({ editable: false });
                }
            });
        } else {
            // 1.采购单id存在，查询采购单详情
            // 2.设置界面状态，操作按钮状态
            that.props.queryPoDetail({
                id: poId
            }).then(() => {
                // 获取采购单状态：编辑/只读
                const tmpPageMode = that.getPageMode();
                that.setState({ pageMode: tmpPageMode });
                that.setState({ actionAuth: that.getActionAuth() });
                if (tmpPageMode !== PAGE_MODE.READONLY) {
                    that.setState({ editable: true });
                } else {
                    that.setState({ editable: false });
                }
            });
        }
    }
    componentWillReceiveProps(nextProps) {
        const {
            adrType, settlementPeriod, payType, payCondition, estimatedDeliveryDate,
            purchaseOrderType, currencyCode, id, spAdrId, businessMode, spId
        } = nextProps.basicInfo;
        const { basicInfo = {} } = this.props;
        const newPo = fromJS(nextProps.po.poLines);
        const oldPo = fromJS(this.props.po.poLines);
        if (!Immutable.is(newPo, oldPo)) {
            this.caculate(nextProps.po.poLines);
        }
        if (basicInfo.id !== id) {
            this.setState({
                locDisabled: !(adrType === 0 || adrType === 1),
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
     * 校验内容：
     *     1.基本信息是否正确
     *     2.是否存在采购商品行
     *     3.采购商品行信息是否正确
     */
    getAllValue = (status, isGoBack) => {
        this.setState({
            isCheck: true
        }, () => {
            // 检验基本信息
            if (!this.state.isCheck) {
                message.error('校验失败，请检查！');
                return;
            }
            // 筛选出有效商品行
            const validPoLines = this.getPoData().poLines.filter((item) =>
                item.isValid !== 0
            )
            // 筛选出无效商品行
            const invalidPoLines = this.getPoData().poLines.filter((item) =>
                item.isValid === 0
            )

            // 校验商品行
            if (this.hasInvalidateMaterial()) {
                message.error('采购商品校验失败，请检查！');
                return;
            }
            // 合法采购商品
            const tmpPoLines = this.props.poLines.filter((record) =>
                (!record.deleteFlg)
            );

            // 校验是否存在采购商品，无则异常
            if (tmpPoLines.length === 0) {
                message.error('请添加采购商品！');
                return;
            }

            // 校验是否存在采购数量为空商品
            if (this.hasEmptyQtyMaterial(tmpPoLines)) {
                message.error('请输入商品采购数量！');
                return;
            }

            // 校验有效商品数量
            if (validPoLines.length === 0) {
                message.error('无有效的商品！');
                return;
            }

            // 清除无效商品弹框
            if (invalidPoLines.length !== 0) {
                const invalidGoodsList = invalidPoLines.map(item =>
                    (<p key={item.prodPurchaseId} >
                        {item.productName}
                    </p>)
                );
                Modal.confirm({
                    title: '是否默认清除以下无效商品？',
                    content: invalidGoodsList,
                    onOk: () => {
                        this.createPoRequest(validPoLines, status, isGoBack);
                    },
                    onCancel() {
                    },
                });
            } else {
                this.createPoRequest(validPoLines, status, isGoBack);
            }
        })
    }

    /**
     * 根据是否存在采购单id、采购单状态返回界面可编辑状态
     * 1.采购单基本信息或采购单id 不存在。界面状态：新建(new)
     * 2.采购单状态=制单。界面状态：可编辑(update)
     * 3.采购单状态=已提交、已审核、已拒绝、已关闭。界面状态：只读(readonly)
     */
    getPageMode = () => {
        const basicInfo = this.props.basicInfo;
        let pageMode;
        // 基本信息新不存在或采购单id不存在
        if (!basicInfo || !basicInfo.id) {
            pageMode = PAGE_MODE.NEW;
            return pageMode;
        }
        // 根据采购单状态 判断界面状态
        const poStatus = basicInfo.status;
        if (poStatus === 0) {
            pageMode = PAGE_MODE.UPDATE;
        } else if ((poStatus === 1)
            || (poStatus === 2)
            || (poStatus === 3)
            || (poStatus === 4)) {
            pageMode = PAGE_MODE.READONLY;
        }
        return pageMode;
    }

    /**
     * 根据是否存在采购单id、根据采购单状态返回操作按钮状态
     * 1.采购单基本信息或采购单id 不存在。按钮状态：保存、提交可用
     * 2.采购单状态=制单。按钮状态：保存、提交、下载PDF可用
     * 3.采购单状态=已提交。按钮状态：审核、下载PDF可用
     * 4.采购单状态=已审核、已拒绝、已关闭。按钮状态：下载PDF可用
     */
    getActionAuth = () => {
        const basicInfo = this.props.basicInfo;
        let actionAuth = {};
        // 基本信息新不存在或采购单id不存在
        if (!basicInfo || !basicInfo.id) {
            actionAuth = { save: true, submit: true };
            return actionAuth;
        }

        // 根据采购单状态 判断按钮可用状态
        const poStatus = basicInfo.status;
        if (poStatus === poStatusCodes.draft) {
            actionAuth = { save: true, submit: true, downloadPDF: true };
        } else if (poStatus === poStatusCodes.submited) {
            actionAuth = { approve: true, downloadPDF: true };
        } else if ((poStatus === poStatusCodes.approved)
            || (poStatus === poStatusCodes.rejected)
            || (poStatus === poStatusCodes.closed)) {
            actionAuth = { downloadPDF: true };
        }
        return actionAuth;
    }

    /**
     * 点击保存/提交
     * 基本信息框校验
     * 校验内容：基本信息是否正确
     * 返回校验结果和基本信息
     */
    basicInfoResult = (isCheck, basicInfo) => {
        this.setState({
            basicInfoCheck: isCheck,
            basicInfo
        })
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
     * 校验输入数据
     */
    validateForm = () => {
        // 新增时数据
        const basicInfo = this.getFormBasicInfo();
        const {
            addressId,
            spId,
            spAdrId,
        } = basicInfo;
        const { pickerDate, ispoAddressClear } = this.state;

        // 修改时数据
        const updateBasicInfo = this.props.basicInfo;
        let isOk = true;
        const { form } = this.props;
        form.validateFields((err) => {
            if (!err) {
                if (updateBasicInfo.status === 0) {
                    // 修改页
                    if (
                        !ispoAddressClear
                        && updateBasicInfo.adrTypeCode
                        && updateBasicInfo.spId
                        && updateBasicInfo.spAdrId
                        && updateBasicInfo.estimatedDeliveryDate
                    ) {
                        isOk = true;
                        return isOk;
                    }
                    isOk = false;
                    return isOk;
                }
                // 新增页
                if (addressId && spId && spAdrId && pickerDate) {
                    isOk = true;
                    return isOk;
                }
                isOk = false;
                return isOk;
            }
            isOk = false;
            return isOk;
        });
        return isOk;
    }

    /**
     * 点击保存
     */
    handleSave = () => {
        this.getAllValue(0, false);
    }

    /**
     * 点击提交
     */
    handleSubmit = () => {
        this.getAllValue(1, true);
    }

    S4() {
        return (((1 + Math.random()) * 0x10000) || 0).toString(16).substring(1);
    }

    guid() {
        return `${this.S4()}${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}${this.S4()}${this.S4()}`;
    }

    stateChange = (data) => {
        this.setState(data);
    }
    purchaseOrderTypeChange = (data) => {
        this.setState(data, () => (this.caculate(this.props.po.poLines)));
    }
    render() {
        return (
            <div className="po-detail">
                <Form layout="inline">
                    <BasicInfo
                        basicInfo={this.props.basicInfo}
                        stateChange={this.stateChange}
                        purchaseOrderTypeChange={this.purchaseOrderTypeChange}
                        deletePoLines={this.deletePoLines}
                        isCheck={this.state.isCheck}
                        checkResult={this.basicInfoResult}
                    />
                    <AddingGoods
                        spAdrId={this.state.spAdrId}
                        businessMode={this.state.businessMode}
                        spId={this.state.spId}
                        handleChoosedMaterialMap={this.handleChoosedMaterialMap}
                    />
                    <GoodsLists
                        basicInfo={this.props.basicInfo}
                        poLines={this.props.poLines}
                        purchaseOrderType={this.state.purchaseOrderType}
                        applyPriceChange={this.applyPriceChange}
                        applyQuantityChange={this.applyQuantityChange}
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
                                    {
                                        this.state.currentType !== 'detail'
                                        && (this.props.basicInfo.status === 0
                                            || this.state.currentType === 'create')
                                        && <FormItem>
                                            <Button size="default" onClick={this.handleSave}>
                                                保存
                                            </Button>
                                        </FormItem>
                                    }
                                    {
                                        this.state.currentType !== 'detail'
                                        && (this.props.basicInfo.status === 0
                                            || this.state.currentType === 'create')
                                        && <FormItem>
                                            <Button size="default" onClick={this.handleSubmit}>
                                                提交
                                            </Button>
                                        </FormItem>
                                    }
                                </Col>
                            </Row>
                        </div>
                    </Affix>
                </Form>
                <div>
                    <Audit />
                </div>
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
    updatePoLine: PropTypes.func,
    fetchNewPmPurchaseOrderItem: PropTypes.func,
    addPoLines: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(PoCreateList));
