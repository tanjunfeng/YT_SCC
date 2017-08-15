/**
 * @file App.jsx
 * @author twh
 *
 * 采购单编辑页面
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import Immutable, { fromJS, is } from 'immutable';
import EditableCell from './EditableCell';
import Audit from './auditModal';
import Utils from '../../../util/util';
import {
	Table, Form, Input, Select, Icon, Dropdown, Modal, Row,
	Col, DatePicker, InputNumber, Button, message, Menu, Affix
} from 'antd';
import {
	fetchPoMngList,
	getMaterialMap,
	initPoDetail,
	createPo,
	ModifyPo,
	auditPo,
	fetchPoDetail,
	updatePoBasicinfo,
	addPoLines,
	updatePoLine,
	deletePoLine,
	fetchNewPmPurchaseOrderItem,
} from '../../../actions/procurement';
import { pubFetchValueList } from '../../../actions/pub';
import { poStatus, locType, poType, poNo, locTypeCodes, poTypeCodes, poStatusCodes, auditType, auditTypeCodes } from '../../../constant/procurement';
import SearchMind from '../../../components/searchMind';
import { exportProcurementPdf } from '../../../service';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
/**
 * 界面状态
 */
const PAGE_MODE = {
	NEW: "new",
	UPDATE: "update",
	READONLY: "readonly"
};
/**
 * 商品行状态
 */
const RECORD_STATUS = {
	NEW: "new",
};

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
	fetchPoDetail,
	updatePoBasicinfo,
	addPoLines,
	updatePoLine,
	deletePoLine,
	pubFetchValueList,
	fetchNewPmPurchaseOrderItem,
	modifyCauseModalVisible
}, dispatch))
class PoDetail extends PureComponent {
	constructor(props) {
		super(props);
		this.onLocTypeChange =::this.onLocTypeChange;
		this.S4 = ::this.S4;
		this.guid = ::this.guid;
		this.isMaterialExists = ::this.isMaterialExists;
		this.renderActions = ::this.renderActions;
		this.onActionMenuSelect = ::this.onActionMenuSelect;
		this.caculate = ::this.caculate;
		this.handleSave = ::this.handleSave;
		this.handleSubmit = ::this.handleSubmit;
		this.handleAudit = ::this.handleAudit;
		this.handleDownPDF = ::this.handleDownPDF;
		this.hasInvalidateMaterial = ::this.hasInvalidateMaterial;
		this.hasEmptyQtyMaterial = ::this.hasEmptyQtyMaterial;
		this.applyAuditOk = ::this.applyAuditOk;
		this.applyAuditCancel = ::this.applyAuditCancel;
		this.validateForm = ::this.validateForm;
		this.getPageMode = ::this.getPageMode;
		this.getActionAuth = ::this.getActionAuth;
		this.getPoData = ::this.getPoData;
		this.getBaiscInfoElements = ::this.getBaiscInfoElements;
		this.applySupplierLocChoosed = ::this.applySupplierLocChoosed;
		this.applySupplierLocClear = ::this.applySupplierLocClear;
		this.applySupplierChange = ::this.applySupplierChange;
		this.deletePoLines = ::this.deletePoLines;
		this.getFormBasicInfo = ::this.getFormBasicInfo;
		this.renderPeriod = ::this.renderPeriod;
		this.renderPayType = ::this.renderPayType;
		this.getAllValue = ::this.getAllValue;
		this.applySupplierClear = ::this.applySupplierClear;
		this.createPoRequest = ::this.createPoRequest;
		let that = this;
		// 采购单商品行信息
		this.columns = [
			{
				title: '行号',
				dataIndex: 'rowNo',
				key: 'rowNo',
				render: (text, record, index) => index + 1
			},
			{
				title: '商品编码',
				dataIndex: 'productCode',
				key: 'productCode',

			},
			{
				title: '商品名称',
				dataIndex: 'productName',
				key: 'productName',
			},
			{
				title: '商品条码',
				dataIndex: 'internationalCode',
				key: 'internationalCode',
			},
			{
				title: '规格',
				dataIndex: 'packingSpecifications',
				key: 'packingSpecifications',
			},
			{
				title: '产地',
				dataIndex: 'producePlace',
				key: 'producePlace',
			}, {
				title: '采购内装数',
				dataIndex: 'purchaseInsideNumber',
				key: 'purchaseInsideNumber',
			},
			{
				title: '单位',
				dataIndex: 'unitExplanation',
				key: 'unitExplanation'
			},
			{
				title: '税率(%)',
				dataIndex: 'inputTaxRate',
				key: 'inputTaxRate'
			},
			{
				title: '采购价格（含税）',
				dataIndex: 'purchasePrice',
				key: 'purchasePrice'
			},
			{
				title: '采购数量',
				dataIndex: 'purchaseNumber',
				key: 'purchaseNumber',
				render: (text, record, index) =>
					<EditableCell
						value={text}
						editable={this.state.currentType !== 'detail'}
						step={record.purchaseInsideNumber}
						purchaseInsideNumber={record.purchaseInsideNumber}
						onChange={value => this.applyQuantityChange(record, index, value)}
					/>
			},
			{
				title: '采购金额（含税）',
				dataIndex: 'totalAmount',
				key: 'totalAmount'
			}
			,
			{
				title: '已收货数量',
				dataIndex: 'receivedNumber',
				key: 'receivedNumber'
			},
			{
				title: '是否有效',
				dataIndex: 'isValid',
				key: 'isValid',
				render: (text) =>{
					switch (text) {
						case 0:
							return '无效';
						default:
							return '有效';
					}
				}
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				render: this.renderActions
			}
		];
		this.state = {
			totalQuantity: 0,
			totalAmount: 0,
			// new:新建 update:编辑 readonly 只读
			pageMode: "",
			// 操作权限
			actionAuth: {},
			// 审核弹出框是否可见
			auditModalVisible: false,
			editable: false,
			locDisabled: true,
			localType: '',
			pickerDate: null,
			// 账期
			settlementPeriod: null,
			// 付款方式
			payType: null,
			// 子公司id
			branchCompanyId: null,
			// 详细收货地点
			adrName: null,
			// 供应商地点附带信息
			applySupplierRecord: {},
			// 采购单类型
			purchaseOrderType: '0',
			// 货币类型
			currencyCode: 'CNY',
			// 供应商地点禁用
			isSupplyAdrDisabled: true,
			// 仓库禁用
			isWarehouseDisabled: true,
			// 供应商id
			spId: null,
			// 供应商地点id
			spAdrId: null,
			// 当前状态
			currentType: '',
			// nextProps里的polings
			nextPoLines: []
		}
	}

	componentDidMount() {
		let that = this;
		const { match } = this.props;
		const { type } = match.params;
		this.setState({
			currentType: type
		})
		//采购单id
		let poId = match.params.purchaseOrderNo;
		//采购单id不存在
		if (type === 'create') {
			//初始化采购单详情
			that.props.initPoDetail({
				basicInfo: {},
				poLines: []
			}).then(function (res) {
				let tmpPageMode = that.getPageMode();
				that.setState({ pageMode: tmpPageMode });
				that.setState({ actionAuth: that.getActionAuth() });
				// //计算采购总数量、采购总金额
				// let { totalQuantity, totalAmount } = that.caculate();
				// that.setState({ totalQuantity, totalAmount });
				if (tmpPageMode !== PAGE_MODE.READONLY) {
					that.setState({ editable: true });
				} else {
					that.setState({ editable: false });
				}
			});
		} else {
			//1.采购单id存在，查询采购单详情
			//2.设置界面状态，操作按钮状态
			that.props.fetchPoDetail({
				id: poId
			}).then(function (res) {
				// 获取采购单状态：编辑/只读
				let tmpPageMode = that.getPageMode();
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
		const { adrType, settlementPeriod, payType, estimatedDeliveryDate, purchaseOrderType, currencyCode, id, spId, spAdrId } = nextProps.basicInfo;

		const { basicInfo = {}} = this.props;
		const newPo = fromJS(nextProps.po.poLines);
		const oldPo = fromJS(this.props.po.poLines);
		if (!Immutable.is(newPo, oldPo)) {
			this.caculate(nextProps.po.poLines);
		}
		if (basicInfo.id !== id) {
			this.setState({
				locDisabled: adrType === 0 || adrType === 1 ? false : true,
				isSupplyAdrDisabled: false,
				isWarehouseDisabled: false,
				settlementPeriod,
				payType,
				spId,
				spAdrId,
				pickerDate: estimatedDeliveryDate ? moment(parseInt(estimatedDeliveryDate, 10)) : null,
				purchaseOrderType: purchaseOrderType === 0 ? `${purchaseOrderType}` : '',
				localType: adrType === 0 || adrType === 1 ? `${adrType}` : '',
				currencyCode: currencyCode === 'CNY' ? `${currencyCode}` : 'CNY',
			})
		}
	}

	componentWillUnmount(){
		this.props.initPoDetail({
			basicInfo: {},
			poLines: []
		})
	}
	/**
	 * 根据是否存在采购单id、采购单状态返回界面可编辑状态
	 * 1.采购单基本信息或采购单id 不存在。界面状态：新建(new)
	 * 2.采购单状态=制单。界面状态：可编辑(update)
	 * 3.采购单状态=已提交、已审核、已拒绝、已关闭。界面状态：只读(readonly)
	 */
	getPageMode() {
		let basicInfo = this.props.basicInfo;
		let pageMode;
		//基本信息新不存在或采购单id不存在
		if (!basicInfo || !basicInfo.id) {
			pageMode = PAGE_MODE.NEW;
			return pageMode;
		}
		//根据采购单状态 判断界面状态
		let poStatus = basicInfo.status;
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
	getActionAuth() {
		let basicInfo = this.props.basicInfo;
		let actionAuth = {};
		//基本信息新不存在或采购单id不存在
		if (!basicInfo || !basicInfo.id) {
			actionAuth = { save: true, submit: true };
			return actionAuth;
		}

		//根据采购单状态 判断按钮可用状态
		let poStatus = basicInfo.status;
		if (poStatus == poStatusCodes.draft) {
			actionAuth = { save: true, submit: true, downloadPDF: true };
		} else if (poStatus == poStatusCodes.submited) {
			actionAuth = { approve: true, downloadPDF: true };
		} else if ((poStatus == poStatusCodes.approved)
			|| (poStatus == poStatusCodes.rejected)
			|| (poStatus == poStatusCodes.closed)) {
			actionAuth = { downloadPDF: true };
		}
		return actionAuth;

	}

	/**
	 * 地点类型改变时，做如下处理
	 * 1.控制地点值清单是否可编辑
	 * 2.清空地点值
	 * @param {*} value
	 */
	onLocTypeChange(value) {
		//地点类型有值
		if (value) {
			//地点类型有值时，地点可编辑
			this.setState({
				locDisabled: false,
				localType: value,
			});
			//清空地点值
			// this.props.form.setFieldsValue({ addressCd: "", address: "" });
		} else {
			//地点类型无值时，地点不可编辑
			this.setState({ locDisabled: true });
			//地点类型无值时，清空地点值
			// this.props.form.setFieldsValue({ addressCd: "", address: "" });
		}
	}

	/**
	 * 商品行采购数量变化回调，做如下处理
	 *  1.更新store中该行信息（校验结果，采购数量，采购金额）
	 *  2.计算采购总数量、采购总金额并更新store
	 * result:{value:输入值,isValidate:检验结果 true/false}
	 */
	applyQuantityChange = (record, index, result) => {
		let { value, isValidate } = result;
		//更新store中采购单商品
		if (record) {
			//未输入采购数量，则清空store中采购数量，采购金额
			if (!value) {
				record.purchaseNumber = null;
				record.totalAmount = null;
				this.props.updatePoLine(record);
			} else {
				//保存输入数据和校验状态 给submit用
				record.purchaseNumber = value;
				//计算采购金额（含税）
				record.totalAmount = Math.round(value * record.purchasePrice*100)/100;
				//校验状态
				record.isValidate = isValidate;
				this.props.updatePoLine(record);

				//输入采购数量合法，更新store
				if (!isValidate) {
					message.error("采购数量必须为采购内装数的整数倍");
				}
			}
		}
	}

	/**
	 * 计算采购总数量、采购总金额
	 * 计算对象：未删除&&采购数量不为空
	 */
	caculate(list = []) {

		let poLines = list;
		let result = {};
		//合计采购数量
		let totalQuantitys = 0;
		//合计采购金额
		let totalAmounts = 0;
		poLines.forEach(function (item) {
			if (item && item.purchaseNumber && !item.deleteFlg) {
				totalQuantitys += item.purchaseNumber;
			}
			if (item && item.totalAmount) {
				totalAmounts += item.totalAmount
			}
		});
		totalAmounts = Math.round(totalAmounts*100)/100;
		this.setState({
			totalQuantitys,
			totalAmounts:Math.round(totalAmounts*100)/100
		}),() => {
		};
	}

	/**
	 * //TODO 请绑定值清单清空事件
	 * 供应商变更时，需做如下处理onchoose事件
	 *   1.清空供应商地点
	 *   2.删除采购商品行
	 *   3.清空账期、付款方式
	 * @param {*} value
	 */
	applySupplierChange(value) {
		//供应商有值
		if (value) {
			//地点类型有值时，供应商地点可编辑
			this.setState({
				spId: value.record.spId,
				isSupplyAdrDisabled: false,
			})
		} else {
			//供应商有值无值时，供应商地点不可编辑
			this.setState({
				isSupplyAdrDisabled: true,
				isWarehouseDisabled: true,
			})
		}
		//1.清空供应商地点，仓库值清单
		this.supplierLoc.reset();
		if (this.state.localType === '0') {
			this.poAddress.reset();
		}
		//2.删除所有商品行
		this.deletePoLines();
		//3.清空账期、付款方式
		let basicInfo = this.props.basicInfo;
		basicInfo.settlementPeriod = null;
		basicInfo.payType = null;
		this.props.updatePoBasicinfo(basicInfo);
	}

	/**
	 * 供应商清空
	 */
	applySupplierClear() {
		this.setState({
			isSupplyAdrDisabled: true,
			isWarehouseDisabled: true,
		}, () => {
			// 清空供应商地点和仓库值清单
			this.supplierLoc.reset();
			if (this.state.localType === '0') {
				this.poAddress.reset();
			}
		})
	}
	/**
	 * 供应商地点变更时，做如下处理
	 *  1.删除采购商品行
	 *  2.清空账期、付款方式
	 * @param {*} res
	 */
	applySupplierLocChoosed(res) {
		if (res) {
			let record = res.record;
			if (this.state.localType === '0') {
				this.poAddress.reset();
			}
			if (res.record) {
				let code = record.code;
				//1.删除所有商品行
				this.deletePoLines();
				//2.清空账期、付款方式
				let basicInfo = this.props.basicInfo;
				basicInfo.settlementPeriod = null;
				basicInfo.payType = null;
				this.props.updatePoBasicinfo(basicInfo);
				// 设置预计收货日期为：now + 提前期
				this.setState({
					pickerDate: moment().add(record.goodsArrivalCycle, 'days'),
					// 账期
					settlementPeriod: record.settlementPeriod,
					// 付款方式
					payType: record.payType,
					// 子公司id
					branchCompanyId: record.branchCompanyId,
					applySupplierRecord:record,
					isWarehouseDisabled: false,
					spAdrId:record.spAdrid
				})
			}
		}
	}

	/**
	 * 清空供应商地点事件
	 */
	applySupplierLocClear() {
		if (this.state.localType === '0') {
			this.poAddress.reset();
		}
		this.setState({
			// 账期
			settlementPeriod: null,
			// 付款方式
			payType: null,
			// 子公司id
			branchCompanyId: null,
			isWarehouseDisabled: true,
		})
	}

	/**
	 * 删除所有商品行
	 * 1.行状态=new ,物理删除
	 * 2.行状态!=new，逻辑删除
	 */
	deletePoLines() {
		this.props.initPoDetail({
			poLines: []
		})
	}

	/**
	 * 根据输入查询数据、页号、供应商地点 查询商品列表
	 * 前提条件：供应商地点必输
	 */
	handleGetMaterialMap = ({ value, pagination }) => {
		//供应商地点
		let supplierLocCd;
		let selectedSupplierLocRawData = this.supplierLoc.state.selectedRawData;
		if (selectedSupplierLocRawData) {
			supplierLocCd = selectedSupplierLocRawData.code;
		}
		if (!supplierLocCd) {
			message.error("请选择供应商地点");
			return;
		}

		let pageNum = pagination.current || 1;
		//根据输入查询数据、页号、供应商地点查询
		return this.props.getMaterialMap({
			value, supplierLocCd, pageNum
		});
	}

	S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}

	guid() {
		return (this.S4() + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4());
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

		let tmp = this.props.poLines;
		//商品行列表为空，则不存在改商品
		if (!tmp) {
			result = { exsited: false, record: null };
			return result;
		}

		for (let i = 0; i < tmp.length; i++) {
			if (tmp[i].productCode == productCode) {
				result = { exsited: true, record: tmp[i] };
				return result;
			}
		}
		return ({ exsited: false, record: null });
	}

	/**
	 * 添加采购商品
	 *  .检查商品列表中是否存在改商品
	 *    a.已存在：显示已存在
	 *    b   在：添加该商品(recordStatus:new 新添加)
	 */
	handleChoosedMaterialMap = ({ record, compKey, index, event }) => {
		//检查商品列表是否已经存在该商品
		let result = this.isMaterialExists(record.productCode)
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
				const { newPcOdData } =this.props;
				let uuid = this.guid();
				let poLine = Object.assign({}, newPcOdData, { id: uuid, recordStatus: RECORD_STATUS.NEW });
				this.props.addPoLines(poLine);
			})
			//生成采购单商品行key
		}

	}

	onActionMenuSelect(record, index, items) {
		const { id } = record;
		const { key } = items;
		let that = this;
		switch (key) {
			case "delete":
				Modal.confirm({
					title: '你确认要删除该商品？',
					onOk: () => {
						//根据商品行状态(recordStatus)，从store中物理或逻辑删除
						let recordStatus = record.recordStatus;
						//新添加商品(未存数据库),物理删除
						that.props.deletePoLine(record);
						that.props.updatePoLine(record);
						message.success('删除成功');
					},
					onCancel() {
					},
				});
				break;
			default:
				break;
		}
	}

	renderActions(text, record, index) {
		const menu = (
			<Menu onClick={(item) => this.onActionMenuSelect(record, index, item)}>
				<Menu.Item key="delete">
					<a target="_blank" rel="noopener noreferrer">删除</a>
				</Menu.Item>
			</Menu>
		)
		return (
			<Dropdown overlay={menu} placement="bottomCenter">
				<a className="ant-dropdown-link">
					表单操作
		  <Icon type="down" />
				</a>
			</Dropdown>
		)
	}

	/**
	   *返回商品行中是否存在检验失败记录
	   * true/false
	   **/
	hasInvalidateMaterial() {
		return this.props.poLines.some((element, index, array) => {
			if (typeof element.isValidate == undefined || element.isValidate == null) {
				return false;
			}
			return (!element.isValidate);
		})
	}

	/**
	 * 商品行是否有未输入采购数量商品
	 */
	hasEmptyQtyMaterial(poLines = []) {
		if (poLines.length == 0) {
			return false;
		}
		return poLines.some((element, index, array) => {
			return (!element.purchaseNumber);
		})
	}

	/**
	 * 校验输入数据
	 */
	validateForm() {
		// 新增时数据
		const basicInfo= this.getFormBasicInfo();
		const {
			addressId,
			spId,
			spAdrId,
		} = basicInfo;
		const {pickerDate} = this.state;

		// 修改时数据
		const updateBasicInfo= this.props.basicInfo;
		let isOk = true;
		const { form } = this.props;
		form.validateFields((err, values) => {
			if (!err) {
				if (updateBasicInfo.status === 0) {
					// 修改页
					const {
						adrTypeCode,
						spId,
						spAdrId,
					} = updateBasicInfo;
					if (
						updateBasicInfo.adrTypeCode
						&& updateBasicInfo.spId
						&& updateBasicInfo.spAdrId
						&& updateBasicInfo.estimatedDeliveryDate
					) {
						isOk = true;
						return isOk;
					} else {
						isOk = false;
						return isOk;
					}
				} else {
					// 新增页
					if (addressId && spId && spAdrId && pickerDate) {
						isOk = true;
						return isOk;
					} else {
						isOk = false;
						return isOk;
					}
				}
			} else {
				isOk = false;
			}
		});
		return isOk;
	}

	/**
	 * 返回采购单数据
	 * 格式如下
	 *  {
	 *    basicInfo:{基本信息},
	 *    poLines:[采购商品信息]
	 *   }
	 *   采购商品信息说明：
	 *       行状态(recordStatus):.new(新添加)  其他情况：既存
	 *       行删除标志(deleteFlg):true(已删除) 其他情况:未删除
	 */
	getPoData() {
		let basicInfo = this.props.basicInfo;
		//整理poLines数据,删除无用属性
		let poLinesTmp = this.props.poLines || [];
		var clearedPoLines = poLinesTmp.map(function (item) {
			//新建商品删除id属性
			if (item.recordStatus == RECORD_STATUS.NEW) {
				if ('id' in item) {
					delete item.id
				}
			}
			//删除校验状态属性
			if ('isValidate' in item) {
				delete item.isValidate
			}
			return item;
		});
		let poData = { basicInfo, poLines: clearedPoLines };
		return poData;	
	}

	/**
	 * 返回采购单基本信息
	 */
	getFormBasicInfo() {
		let formValues = this.props.form.getFieldsValue();
		//地点---仓库/门店
		let addressId, addressCd, address;
		if (this.state.localType === '0') {
			let selectedAddressRawData = this.poAddress.state.selectedRawData;
			if (selectedAddressRawData) {
				addressId = selectedAddressRawData.id;
				addressCd = selectedAddressRawData.warehouseCode;
				address = selectedAddressRawData.warehouseName;
			}
		} else if (this.state.localType === '1'){
			let selectedAddressRawData = this.poStore.state.selectedRawData;
			if (selectedAddressRawData) {
				addressId = selectedAddressRawData.id;
				addressCd = selectedAddressRawData.id;
				address = selectedAddressRawData.name;
			}
		}

		//供应商
		let spId, spNo, spName;
		let selectedSupplierRawData = this.supplier.state.selectedRawData;
		if (selectedSupplierRawData) {
			spId = selectedSupplierRawData.spId;
			spNo = selectedSupplierRawData.spNo;
			spName = selectedSupplierRawData.companyName;
		}

		//供应商地点
		let spAdrId, spAdrNo, spAdrName;
		let selectedSupplierLocRawData = this.supplierLoc.state.selectedRawData;
		if (selectedSupplierLocRawData) {
			spAdrId = selectedSupplierLocRawData.spAdrid;
			spAdrNo = selectedSupplierLocRawData.providerNo;
			spAdrName = selectedSupplierLocRawData.providerName;
		}

		//大类
		let bigClassCd, bigCLassName;
		let selectedBigClassRawData = this.bigClass.state.selectedRawData;
		if (selectedBigClassRawData) {
			bigClassCd = selectedBigClassRawData.id;
			bigCLassName = selectedBigClassRawData.categoryName;
		}

		let mapValues = {
			addressId,
			addressCd,
			address,
			spId,
			spNo,
			spName,
			spAdrId,
			spAdrNo,
			spAdrName,
		};
		const {applySupplierRecord} = this.state;
		let basicInfo = Object.assign({}, formValues, mapValues,applySupplierRecord);
		return basicInfo;
	}

	/**
	 * 新增/修改的请求
	 */
	createPoRequest(validPoLines,status,isGoBack) {
		const { id } = this.props.basicInfo;
		let that = this;
		//基本信息，商品行均校验通过,获取有效值
		const basicInfo = Object.assign({}, this.getPoData().basicInfo, this.getFormBasicInfo());
		let poData = {
			basicInfo,
			poLines: validPoLines
		}
		// 基本信息
		const {
			spAdrId,
			settlementPeriod,
			payType,
			adrType,
			currencyCode,
			purchaseOrderType,
			addressCd,
		} = poData.basicInfo;

		// 采购商品信息
		const pmPurchaseOrderItems = poData.poLines.map((item) => {
			const {
				id,
				prodPurchaseId,
				productId,
				productCode,
				purchaseNumber
			} = item;
			return {...Utils.removeInvalid({
				id,
				prodPurchaseId,
				productId,
				productCode,
				purchaseNumber
			})}
		})

		// 预计送货日期
		const estimatedDeliveryDate = this.state.pickerDate
		? this.state.pickerDate.valueOf().toString()
		: null;

		if (id) {
			// 修改页
			this.props.ModifyPo({
				pmPurchaseOrder: {
					id,
					spAdrId: `${spAdrId || this.props.basicInfo.spAdrId}`,
					estimatedDeliveryDate,
					payType,
					adrType: parseInt(adrType),
					adrTypeCode: addressCd || this.props.basicInfo.adrTypeCode,
					currencyCode,
					purchaseOrderType: parseInt(purchaseOrderType),
					status,
				},
				pmPurchaseOrderItems
			}).then(function (res) {
				//如果创建成功，刷新界面数据
				if (res.success) {
					message.success("提交成功！");
					that.props.history.goBack();
					//初始化采购单详情
					// that.props.initPoDetail(res.data);
				} else {
					message.error("提交失败，请检查！");
				}
			});
		} else {
			// 新增页
			this.props.createPo({
				pmPurchaseOrder: {
					spAdrId: `${spAdrId || this.props.basicInfo.spAdrId}`,
					estimatedDeliveryDate,
					payType,
					adrType: parseInt(adrType),
					adrTypeCode: addressCd || this.props.basicInfo.adrTypeCode,
					currencyCode,
					purchaseOrderType: parseInt(purchaseOrderType),
					status,
				},
				pmPurchaseOrderItems
			}).then(function (res) {
				//如果创建成功，刷新界面数据
				if (res.success) {
					message.success("提交成功！");
					that.props.history.goBack();
					//初始化采购单详情
					// that.props.initPoDetail(res.data);
				} else {
					message.error("提交失败，请检查！");
				}
			});
		}		
	}

	/**
	 * 点击保存/提交
	 * 校验内容：
	 *     1.基本信息是否正确
	 *     2.是否存在采购商品行
	 *     3.采购商品行信息是否正确
	 */
	getAllValue(status,isGoBack) {
		let that = this;
		// 筛选出有效商品行
		const validPoLines =  this.getPoData().poLines.filter((item) => {
			return item.isValid !== 0 
		})
		// 筛选出无效商品行
		const invalidPoLines =  this.getPoData().poLines.filter((item) => {
			return item.isValid === 0 
		})
		//检验基本信息
		if (!this.validateForm()) {
			message.error("校验失败，请检查！");
			return;
		}
		//校验商品行
		if (this.hasInvalidateMaterial()) {
			message.error("采购商品校验失败，请检查！");
			return;
		}

		//合法采购商品
		let tmpPoLines = this.props.poLines.filter(function (record) {
			return (!record.deleteFlg);
		});

		//校验是否存在采购商品，无则异常
		if (tmpPoLines.length === 0) {
			message.error("请添加采购商品！");
			return;
		}

		//校验是否存在采购数量为空商品
		if (this.hasEmptyQtyMaterial(tmpPoLines)) {
			message.error("请输入商品采购数量！");
			return;
		}

		// 校验有效商品数量
		if (validPoLines.length === 0) {
			message.error("无有效的商品！");
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
				content:invalidGoodsList,
				onOk: () => {
					this.createPoRequest(validPoLines,status,isGoBack);
				},
				onCancel() {
				},
			});
		} else {
			this.createPoRequest(validPoLines,status,isGoBack);
			
		}
	}

	/**
	 * 点击保存
	 */
	handleSave() {
		this.getAllValue(0,false);
	}

	/**
	 * 点击提交
	 */
	handleSubmit() {
		this.getAllValue(1,true);
	}

	/**
	 * 审核弹出框点击"确定" 回调函数
	 * @param {*} values
	 */
	applyAuditOk(values) {
		let that = this;
		//调用审批api
		this.props.auditPo(values).then(function (res) {
			if (res.success) {
				message.success("审批成功！");
				that.setState({ auditModalVisible: false });
				//跳转到采购单管理列表界面
				history.back();
			} else {
				message.error("审批失败，请检查！");
			}
		});
	}

	/**
	 * 审核弹出框点击"取消" 回调函数
	 * @param {*} res
	 */
	applyAuditCancel(res) {
		this.setState({ auditModalVisible: false });
	}
	/**
	 * 点击审批
	 */
	handleAudit() {
		this.props.modifyCauseModalVisible({ isShow: true, id: this.props.basicInfo.id });
	}
	/**
	 * 下载pdf
	 */
	handleDownPDF() {
		Utils.exportExcel(exportProcurementPdf, {purchaseOrderNo: this.props.basicInfo.purchaseOrderNo});
	}
	/**
	 * 渲染账期
	 * @param {*} key
	 */
	renderPeriod(key) {
		switch (key) {
			case 0:
				return '周结';
			case 1:
				return '半月结';
			case 2:
				return '月结';
			case 3:
				return '票到付款';
			default:
				break;
		}
	}
	/**
	 * 渲染付款方式
	 * @param {*} key
	 */
	renderPayType(key) {
		switch (key) {
			case 0:
				return '网银';
			case 1:
				return '银行转账';
			case 2:
				return '现金';
			case 3:
				return '支票';
			default:
				break;
		}
	}

	getBaiscInfoElements(pageMode) {
		const { getFieldDecorator } = this.props.form;
		const purchaseOrderType = () => {
			switch (this.props.basicInfo.purchaseOrderType) {
				case 0:
					return '普通采购单';
				default:
					break;
			}
		}
		const purchaseOrderState = () => {
			switch (this.props.basicInfo.status) {
				case 0:
					return '制单';
				case 1:
					return '已提交';
				case 2:
					return '已审核';
				case 3:
					return '已拒绝';
				case 4:
					return '已关闭';
				default:
					break;
			}
		}
		const purchaseOrderAdrType = () => {
			switch (this.props.basicInfo.adrType) {
				case 0:
					return '仓库';
				case 1:
					return '门店';
				default:
					break;
			}
		}
		const { basicInfo } = this.props;
		const { currentType } = this.state;
		//创建者
		const createdByName = basicInfo.createdByName
		? this.basicInfo.createdByName
		: this.props.data.user.employeeName

		// 创建日期
		const createdAt = basicInfo.createdAt
		? basicInfo.createdAt
		: moment().format('YYYY-MM-DD')

		//供应商值清单回显数据
		const supplierDefaultValue = basicInfo.spId
		? `${basicInfo.spNo}-${basicInfo.spName}`
		: ''

		//供应商地点值清单回显数据
		const spAdrDefaultValue = basicInfo.spAdrId
		? `${basicInfo.spAdrId}-${basicInfo.spAdrName}`
		: ''

		//地点值清单回显数据
		const adresssDefaultValue = basicInfo.adrTypeCode
		? `${basicInfo.adrTypeCode}-${basicInfo.adrTypeName}`
		: ''

		// 回显预期送货日期
		const estimatedDeliveryDate = basicInfo.estimatedDeliveryDate ? moment(basicInfo.estimatedDeliveryDate).format('YYYY-MM-DD') : null

		// 回显创建日期
		const createTime = basicInfo.createTime ? moment(basicInfo.createTime).format('YYYY-MM-DD') : null

		// 回显审核日期
		const auditTime = basicInfo.auditTime ? moment(basicInfo.auditTime).format('YYYY-MM-DD') : null
		// 只读
		if (currentType === 'detail') {
			return (
				<div className="basic-box">
					<div className="header">
						<Icon type="solution" className="header-icon" />基础信息
					</div>
					<div className="body">
						<Row >
							<Col span={8}>
								{/* 采购单号 */}
								<span className="ant-form-item-label"><label>采购单号</label> </span>
								<span className="text">{this.props.basicInfo.purchaseOrderNo}</span>
							</Col>
							<Col span={8}>
								{/* 采购单类型 */}
								<FormItem label="采购单类型">
									<span>{purchaseOrderType()}</span>
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 状态 */}
								<FormItem label="状态">
									<span>{purchaseOrderState()}</span>
								</FormItem>
							</Col>
						</Row>
						<Row >
							<Col span={8}>
								{/* 供应商 */}
								<FormItem label="供应商">
									<span>{this.props.basicInfo.spNo}-{this.props.basicInfo.spName}</span>
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 供应商地点 */}
								<FormItem label="供应商地点">
									<span>{this.props.basicInfo.spAdrNo}-{this.props.basicInfo.spAdrName}</span>
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 预计送货日期 */}
								<FormItem label="预计送货日期">
									<span>{estimatedDeliveryDate}</span>

								</FormItem>
							</Col>
						</Row>
						<Row >
							<Col span={8}>
								{/* 地点类型 */}
								<FormItem label="地点类型">
									<span>{purchaseOrderAdrType()}</span>
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 地点 */}
								<FormItem label="地点">
									<span>{this.props.basicInfo.adrTypeCode}-{this.props.basicInfo.adrTypeName}</span>
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 大类 */}
								<FormItem label="大类">
									<span>{this.props.basicInfo.secondCategoryName}</span>
								</FormItem>
							</Col>
						</Row>
						<Row >
							<Col span={8}>
								{/* 账期 */}
								<FormItem formItemLayout >
									<span className="ant-form-item-label"><label>账期</label> </span>
									<span>{this.renderPeriod(this.props.basicInfo.settlementPeriod)}</span>
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 付款方式 */}
								<FormItem formItemLayout >
									<span className="ant-form-item-label"><label>付款方式</label> </span>
									<span>{this.renderPayType(this.props.basicInfo.payType)}</span>
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 货币类型 */}
								<FormItem label="货币类型">
									<span>{this.props.basicInfo.currencyCode}</span>
								</FormItem>
							</Col>
						</Row>

						<Row >
							<Col span={8}>
								{/* 创建者 */}
								<FormItem label="创建者">
									<span>{this.props.basicInfo.createUserName}</span>
								</FormItem>
							</Col>
							<Col span={4}>
								{/* 创建日期 */}
								<FormItem label="创建日期">
									<span>{createTime}</span>
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 审核人 */}
								<FormItem label="审核人">
									<span>{this.props.basicInfo.auditUserName}</span>
								</FormItem>
							</Col>
							<Col span={4}>
								{/* 审核日期 */}
								<FormItem label="审核日期">
									<span>{auditTime}</span>
								</FormItem>
							</Col>
						</Row>
						<Row >
						</Row>
					</div>
				</div>
			)
		} else {
			// 新增/编辑
			return (
				<div className="basic-box">
					<div className="header">
						<Icon type="solution" className="header-icon" />基础信息
					</div>
					<div className="body">
						<Row >
							<Col span={8}>
								{/* 采购单号 */}
								<span className="ant-form-item-label"><label>采购单号</label> </span>
								<span className="text">{this.props.basicInfo.purchaseOrderNo}</span>
							</Col>
							<Col span={8}>
								{/* 采购单类型 */}
								<FormItem>
									<span className="ant-form-item-label">
										<label>
											<span style={{ color: '#F00' }}>*</span>
											采购单类型
										</label>
									</span>
									{getFieldDecorator('purchaseOrderType', {
										rules: [{ required: true, message: '请输入采购单类型' }],
										initialValue: this.state.purchaseOrderType
									})(
										<Select size="default">
											{
												poType.data.map((item) => {
													return <Option key={item.key} value={item.key}>{item.value}</Option>
												})
											}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 状态 */}
								<FormItem formItemLayout >
									<span className="ant-form-item-label"><label>状态</label> </span>
									<span className="text">{this.props.basicInfo.poStatusName ? this.props.basicInfo.poStatusName : "制单"}</span>
								</FormItem>
							</Col>
						</Row>
						<Row >
							<Col span={8}>
								{/* 供应商 */}
								<FormItem formItemLayout >
									<div className="row middle">
										<span className="ant-form-item-label">
											<label>
												<span style={{ color: '#F00' }}>*</span>
												供应商
											</label>
										</span>
										<SearchMind
											style={{ zIndex: 10000 }}
											compKey="spId"
											ref={ref => { this.supplier = ref }}
											fetch={(params) =>
												this.props.pubFetchValueList({
													condition: params.value,
													pageNum: params.pagination.current || 1,
													pageSize: params.pagination.pageSize
												}, 'querySuppliersList')
											}
											defaultValue={supplierDefaultValue}
											onChoosed={this.applySupplierChange}
											onClear={this.applySupplierClear}
											renderChoosedInputRaw={(data) => (
												<div>{data.spId} - {data.companyName}</div>
											)}
											pageSize={6}
											columns={[
												{
													title: '供应商ID',
													dataIndex: 'spId',
													width: 150,
												}, {
													title: '供应商名称',
													dataIndex: 'companyName',
													width: 200,
												}
											]}
										/>
									</div>
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 供应商地点 */}
								<FormItem formItemLayout >
									<div className="row middle">
										<span className="ant-form-item-label">
											<label>
												<span style={{ color: '#F00' }}>*</span>
												供应商地点
											</label>
										</span>
										<SearchMind
											style={{ zIndex: 9000 }}
											compKey="providerNo"
											ref={ref => { this.supplierLoc = ref }}
											fetch={(params) =>
												this.props.pubFetchValueList({
													orgId: this.props.data.user.employeeCompanyId,
													pId: this.state.spId,
													condition: params.value,
													pageNum: params.pagination.current || 1,
													pageSize: params.pagination.pageSize
												}, 'supplierAdrSearchBox')
											}
											disabled={this.state.isSupplyAdrDisabled}
											defaultValue={spAdrDefaultValue}
											onChoosed={this.applySupplierLocChoosed}
											onClear={this.applySupplierLocClear}
											renderChoosedInputRaw={(data) => (
												<div>{data.providerNo} - {data.providerName}</div>
											)}
											pageSize={6}
											columns={[
												{
													title: '供应商编码',
													dataIndex: 'providerNo',
													width: 150,
												}, {
													title: '供应商名称',
													dataIndex: 'providerName',
													width: 200,
												}
											]}
										/>
									</div>
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 预计送货日期 */}
								<FormItem formItemLayout>
									<span className="ant-form-item-label">
										<label>
											<span style={{ color: '#F00' }}>*</span>
											预计送货日期
											</label>
									</span>
									<DatePicker
										style={{width: 241}}
										format={dateFormat}
										value={this.state.pickerDate}
										onChange={(e) => {
											this.setState({
												pickerDate: e
											})
										}}
									/>
								</FormItem>
							</Col>
						</Row>
						<Row >
							<Col span={8}>
								{/* 地点类型 */}
								<FormItem>
									<span className="ant-form-item-label">
										<label>
											<span style={{ color: '#F00' }}>*</span>
											地点类型
											</label>
									</span>
									{getFieldDecorator('adrType', {
										rules: [{ required: true, message: '请输入地点类型' }],
										initialValue: this.state.localType,
									})(
										<Select size="default" onChange={this.onLocTypeChange}>
											{
												locType.data.map((item) => {
													return <Option key={item.key} value={item.key}>{item.value}</Option>
												})
											}
										</Select>
										)}
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 地点 */}
								<FormItem formItemLayout >
									<div className="row middle">
										<span className="ant-form-item-label">
											<label>
												<span style={{ color: '#F00' }}>*</span>
												地点
											</label>
										</span>
										{
											// 仓库
											this.state.localType === '0'
											&& <SearchMind
												style={{ zIndex: 8000 }}
												compKey="warehouseCode"
												ref={ref => { this.poAddress = ref }}
												fetch={(params) =>
													this.props.pubFetchValueList({
														supplierAddressId: this.state.spAdrId,
														param: params.value,
														pageNum: params.pagination.current || 1,
														pageSize: params.pagination.pageSize
													}, 'getWarehouseInfo1')
												}
												disabled={this.state.isWarehouseDisabled || this.state.localType !== '0'}
												defaultValue={adresssDefaultValue}
												renderChoosedInputRaw={(data) => (
													<div>{data.warehouseCode} - {data.warehouseName}</div>
												)}
												pageSize={6}
												columns={[
													{
														title: '仓库编码',
														dataIndex: 'warehouseCode',
														width: 150,
													}, {
														title: '仓库名称',
														dataIndex: 'warehouseName',
														width: 200,
													}
												]}
											/>
										}
										{
											// 门店
											this.state.localType !== '0'
											&& <SearchMind
												style={{ zIndex: 8000 }}
												disabled={this.state.locDisabled}
												compKey="id"
												ref={ref => { this.poStore = ref }}
												fetch={(params) =>
													this.props.pubFetchValueList({
														param: params.value,
														pageNum: params.pagination.current || 1,
														pageSize: params.pagination.pageSize
													}, 'getStoreInfo')
												}
												defaultValue={adresssDefaultValue}
												renderChoosedInputRaw={(data) => (
													<div>{data.id} - {data.name}</div>
												)}
												pageSize={6}
												columns={[
													{
														title: '门店id',
														dataIndex: 'id',
														width: 150,
													}, {
														title: '门店名称',
														dataIndex: 'name',
														width: 200,
													}
												]}
											/>
										}
									</div>
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 大类 */}
								<FormItem formItemLayout >
									<div className="row small">
										<span className="ant-form-item-label"><label>大类</label> </span>
										<SearchMind
											disabled
											style={{ zIndex: 7000 }}
											compKey="id"
											ref={ref => { this.bigClass = ref }}
											fetch={(params) =>
												this.props.pubFetchValueList({
													param: params.value,
													level: '2'
												}, 'queryCategorysByLevel')
											}
											renderChoosedInputRaw={(data) => (
												<div>{data.id} - {data.categoryName}</div>
											)}
											pageSize={6}
											columns={[
												{
													title: '大类id',
													dataIndex: 'id',
													width: 150,
												}, {
													title: '大类名称',
													dataIndex: 'categoryName',
													width: 200,
												}
											]}
										/>
									</div>
								</FormItem>
							</Col>
						</Row>
						<Row >
							<Col span={8}>
								{/* 账期 */}
								<FormItem formItemLayout >
									<span className="ant-form-item-label"><label>账期</label> </span>
									<span>{this.renderPeriod(this.state.settlementPeriod)}</span>
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 付款方式 */}
								<FormItem formItemLayout >
									<span className="ant-form-item-label"><label>付款方式</label> </span>
									<span>{this.renderPayType(this.state.payType)}</span>
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 货币类型 */}
								<FormItem label="货币类型" formItemLayout>
									{getFieldDecorator('currencyCode', {
										initialValue: this.state.currencyCode
									})(
										<Select size="default">
											{
												poNo.data.map((item) => {
													return <Option key={item.key} value={item.key}>{item.value}</Option>
												})
											}
										</Select>
									)}
								</FormItem>
							</Col>
						</Row>
						<Row >
							<Col span={8}>
								{/* 创建者 */}
								<FormItem label="创建者">
									<span>{createdByName}</span>
								</FormItem>
							</Col>
							<Col span={4}>
								{/* 创建日期 */}
								<FormItem label="创建日期">
									<span>{createdAt}</span>
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 审核人 */}
								<FormItem label="审核人">
									<span>{this.props.basicInfo.approvedByName}</span>
								</FormItem>
							</Col>
							<Col span={4}>
								{/* 审核日期 */}
								<FormItem label="审核日期">
									<span>{this.props.basicInfo.approvedAt}</span>
								</FormItem>
							</Col>
						</Row>
						<Row >
						</Row>
					</div>
				</div>
			)
		}
	}
	render() {
		const { totalAmounts, totalQuantitys, applySupplierRecord, spAdrId } = this.state;
		const supplierInfo = spAdrId ? (spAdrId + '-1') : null;
		const { getFieldDecorator } = this.props.form;
		const { poLines, basicInfo } = this.props;
		let baiscInfoElements = this.getBaiscInfoElements(this.state.pageMode);
		if(
			this.state.currentType === 'detail'
			&& this.columns[this.columns.length -1].key === 'operation'
		) {
			this.columns.pop();
		}
		return (
			<div className="po-detail">
				<Form layout="inline">
					{baiscInfoElements}
					{this.state.currentType !== 'detail' && <div className="addMaterialContainer">
						<Row >
							<Col span={8}>
								<div className="row middle">
									{/*新增采购单  */}
									<SearchMind
										style={{ zIndex: 6000, marginBottom: 5 }}
										compKey="productCode"
										ref={ref => { this.addPo = ref }}
										fetch={(params) =>
											this.props.pubFetchValueList({
												supplierInfo,
												teamText: params.value,
												pageNum: params.pagination.current || 1,
												pageSize: params.pagination.pageSize
											}, 'queryProductForSelect')
										}
										disabled={this.state.isWarehouseDisabled}
										addonBefore="添加商品"
										onChoosed={this.handleChoosedMaterialMap}
										renderChoosedInputRaw={(data) => (
											<div>{data.productCode} - {data.saleName}</div>
										)}
										pageSize={6}
										columns={[
											{
												title: '商品编码',
												dataIndex: 'productCode',
												width: 150,
											}, {
												title: '商品名称',
												dataIndex: 'saleName',
												width: 200,
											}
										]}
									/>
								</div>
							</Col>
						</Row>
					</div>}
					<div className="poLines area-list">
						<Table
							dataSource={poLines.filter(function (record) {
								return (!record.deleteFlg);
							})}
							pagination={false}
							columns={this.columns}
							rowKey="productCode"
							scroll={{
								x: 1300
							}}
						/>
					</div>
					<div>
						<Row type="flex">
							<Col span={8}>
								<div>
									<label>合计数量:</label>
									<span style={{color:'#F00'}}>{totalQuantitys}</span>
								</div>

							</Col>
							<Col span={8}>
								<div>
									<label>合计金额:</label>
									<span style={{color:'#F00'}}>{totalAmounts}</span>
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
										&&　(basicInfo.status === 0
										|| this.state.currentType === 'create')
										&& <FormItem>
											<Button size="default" onClick={this.handleSave}>
												保存
											</Button>
										</FormItem>
									}
									{
										this.state.currentType !== 'detail'
										&&　(basicInfo.status === 0
										|| this.state.currentType === 'create')
										&& <FormItem>
											<Button size="default" onClick={this.handleSubmit}>
												提交
											</Button>
										</FormItem>
									}
									{
										this.state.currentType === 'detail'
										&&　basicInfo.status === 1
										&& <FormItem>
											<Button size="default" onClick={this.handleAudit}>
												审批
											</Button>
										</FormItem>
									}
									{
										this.state.currentType === 'detail'
										&& <FormItem>
											<Button size="default" onClick={this.handleDownPDF}>
												下载PDF
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

PoDetail.propTypes = {
	history: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(PoDetail));
