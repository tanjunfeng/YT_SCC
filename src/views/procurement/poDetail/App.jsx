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
import EditableCell from './EditableCell';
import Audit from '../../../components/audit';
import {
	Table, Form, Input, Select, Icon, Dropdown, Modal, Row,
	Col, DatePicker, InputNumber, Button, message, Menu, Affix
} from 'antd';
import {
	fetchPoMngList,
	getWarehouseAddressMap,
	getShopAddressMap,
	getSupplierMap,
	getSupplierLocMap,
	getBigClassMap,
	getMaterialMap,
	initPoDetail,
	createPo,
	auditPo,
	fetchPoDetail,
	updatePoBasicinfo,
	addPoLines,
	updatePoLine,
	deletePoLine
} from '../../../actions';
import { pubFetchValueList, fetchCategorys } from '../../../actions/pub';
import { poStatus, locType, poType, locTypeCodes, poTypeCodes, poStatusCodes, auditType, auditTypeCodes } from '../../../constant/procurement';
import Utils from '../../../util/util';
import SearchMind from '../../../components/searchMind';
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
	basicInfo: state.toJS().procurement.po.basicInfo || {},
	poLines: state.toJS().procurement.po.poLines || []
}), dispatch => bindActionCreators({
	getWarehouseAddressMap,
	getShopAddressMap,
	getSupplierMap,
	getSupplierLocMap,
	getBigClassMap,
	getMaterialMap,
	initPoDetail,
	createPo,
	auditPo,
	fetchPoDetail,
	updatePoBasicinfo,
	addPoLines,
	updatePoLine,
	deletePoLine,
	pubFetchValueList,
	fetchCategorys,
}, dispatch))
class PoDetail extends PureComponent {
	constructor(props) {
		super(props);
		this.handleGetAddressMap = ::this.handleGetAddressMap;
		this.handleGetBigClassMap = ::this.handleGetBigClassMap;
		this.handleGetSupplierMap = ::this.handleGetSupplierMap;
		this.handleGetSupplierLocMap = ::this.handleGetSupplierLocMap;
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
		this.applySupplierChange = ::this.applySupplierChange;
		this.deletePoLines = ::this.deletePoLines;
		this.getFormBasicInfo = ::this.getFormBasicInfo;
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
			localType: '0001',
		}
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
				title: '税率',
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
						editable={this.state.editable}
						step={record.poInnerAmount}
						poInnerAmount={record.poInnerAmount}
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
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				render: this.renderActions
			}
		];


	}

	componentDidMount() {
		let that = this;
		const { match } = this.props;
		//采购单id
		let poId = match.params.purchaseOrderNo;
		//采购单id不存在
		if (!poId) {
			//初始化采购单详情
			that.props.initPoDetail({
				basicInfo: {},
				poLines: []
			}).then(function (res) {
				let tmpPageMode = that.getPageMode();
				that.setState({ pageMode: tmpPageMode });
				that.setState({ actionAuth: that.getActionAuth() });
				//计算采购总数量、采购总金额
				let { totalQuantity, totalAmount } = that.caculate();
				that.setState({ totalQuantity, totalAmount });
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
				let tmpPageMode = that.getPageMode();
				that.setState({ pageMode: tmpPageMode });
				that.setState({ actionAuth: that.getActionAuth() });
				//计算采购总数量、采购总金额
				let { totalQuantity, totalAmount } = that.caculate();
				that.setState({ totalQuantity, totalAmount });
				if (tmpPageMode !== PAGE_MODE.READONLY) {
					that.setState({ editable: true });
				} else {
					that.setState({ editable: false });
				}
			});
		}
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
		console.log(poStatus)
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
		let poStatus = basicInfo.poStatus;
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
			this.props.form.setFieldsValue({ addressCd: "", address: "" });
		} else {
			//地点类型无值时，地点不可编辑
			this.setState({ locDisabled: true });
			//地点类型无值时，清空地点值
			this.props.form.setFieldsValue({ addressCd: "", address: "" });
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
				record.poQuantity = null;
				record.amount = null;
				this.props.updatePoLine(record);
			} else {
				//保存输入数据和校验状态 给submit用
				record.poQuantity = value;
				//计算采购金额（含税）
				record.amount = value * record.poPrice;
				//校验状态
				record.isValidate = isValidate;
				this.props.updatePoLine(record);

				//输入采购数量合法，更新store
				if (!isValidate) {
					message.error("采购数量必须为采购内装数的整数倍");
				}
			}
			//计算采购总数量、采购总金额
			let { totalQuantity, totalAmount } = this.caculate();
			this.setState({ totalQuantity, totalAmount });
		}
	}

	/**
	 * 计算采购总数量、采购总金额
	 * 计算对象：未删除&&采购数量不为空 
	 */
	caculate() {
		let poLines = this.props.poLines || [];
		let result = {};
		//合计采购数量
		let totalQuantity = 0;
		//合计采购金额
		let totalAmount = 0;
		poLines.forEach(function (item) {
			if (item && item.poQuantity && !item.deleteFlg) {
				totalQuantity += item.poQuantity;
			}
			if (item && item.amount) {
				totalAmount += item.amount
			}
		});
		result.totalQuantity = totalQuantity;
		result.totalAmount = totalAmount;
		return result;
	}

	/**
	 * 根据选择地点类型、子公司，查询地点值清单
	 */
	handleGetAddressMap = ({ value, pagination }) => {
		//地点类型
		let { locTypeCd } = this.props.form.getFieldsValue(["locTypeCd"])
		let companyId = null;//TODO 从session获取？
		let pageNum = pagination.current || 1;
		//根据选择的地点类型获取对应地点的值清单
		if (locTypeCd === locTypeCodes.warehouse) {
			//地点类型为仓库
			return this.props.getWarehouseAddressMap({
				value, companyId, pageNum
			});
		} else if (locTypeCd === locTypeCodes.shop) {
			//地点类型为门店
			return this.props.getShopAddressMap({
				value, companyId, pageNum
			});
		} else {
			//如果地点类型为空，返回空promise
			return new Promise(function (resolve, reject) {
				resolve({ total: 0, data: [] });
			});
		}
	}

	/**
	 * 大类值清单
	 */
	handleGetBigClassMap = ({ value, pagination }) => {
		let pageNum = pagination.current || 1;
		return this.props.getBigClassMap({
			value,
			pageNum
		});

	}

	/**
	 * 供应商值清单
	 */
	handleGetSupplierMap = ({ value, pagination }) => {
		let pageNum = pagination.current || 1;
		//子公司ID
		let companyId = null;  //TODO 从session获取子公司ID？
		return this.props.getSupplierMap({
			companyId,
			value,
			pageNum
		});

	}

	/**
	 * 
	 */
	handleGetSupplierLocMap = ({ value, pagination }) => {
		let pageNum = pagination.current || 1;
		let supplierCd;
		let selectedSupplierRawData = this.supplier.state.selectedRawData;
		if (selectedSupplierRawData) {
			supplierCd = selectedSupplierRawData.code;
		}
		//子公司ID
		let companyId = null;  //TODO 从session获取子公司ID？
		//如果供应商地点为空，返回空promise
		if (!supplierCd) {
			return new Promise(function (resolve, reject) {
				resolve({ total: 0, data: [] });
			});
		}
		//根据供应商编码、输入查询内容获取供应商地点信息
		return this.props.getSupplierLocMap({
			value,
			supplierCd,
			pageNum,
			companyId
		});

	}

	/**
	 * //TODO 请绑定值清单清空事件
	 * 供应商变更时，需做如下处理
	 *   1.清空供应商地点
	 *   2.删除采购商品行
	 *   3.清空账期、付款方式
	 * @param {*} value 
	 */
	applySupplierChange(value) {
		//供应商有值
		if (value) {
			//地点类型有值时，供应商地点可编辑
			//TODO
		} else {
			//供应商有值无值时，供应商地点不可编辑
		}
		//1.清空地点值
		this.supplierLoc.reset();
		//2.删除所有商品行
		this.deletePoLines();
		//3.清空账期、付款方式
		let basicInfo = this.props.basicInfo;
		basicInfo.accountPeriod = null;
		basicInfo.payment = null;
		this.props.updatePoBasicinfo(basicInfo);
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
			if (res.record) {
				let code = record.code;
				//1.删除所有商品行
				this.deletePoLines();
				//2.清空账期、付款方式
				let basicInfo = this.props.basicInfo;
				basicInfo.accountPeriod = null;
				basicInfo.payment = null;
				this.props.updatePoBasicinfo(basicInfo);
			}
		}
	}

	/**
	 * 删除所有商品行
	 * 1.行状态=new ,物理删除
	 * 2.行状态!=new，逻辑删除
	 */
	deletePoLines() {
		let poLines = this.props.poLines || [];
		let that = this;
		poLines.forEach(function (item) {
			if (item.recordStatus == RECORD_STATUS.NEW) {
				that.props.deletePoLine(item);
			} else {
				item.deleteFlg = true;
				that.props.updatePoLine(item);
			}
		});

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
	isMaterialExists = (materialCd) => {
		let result = { exsited: true, record: null };
		if (!materialCd) {
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
			console.log("tmp[i].materialCd", tmp[i].materialCd);
			if (tmp[i].materialCd == materialCd) {
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
		let result = this.isMaterialExists(record.materialCd)
		console.log(result);
		if (result.exsited) {
			if (result.record && result.record.deleteFlg) {
				result.record.deleteFlg = false;
				this.props.updatePoLine(result.record);
			} else {
				message.error('该商品已经存在');
			}
		} else {
			//生成采购单商品行key
			let uuid = this.guid();
			let poLine = Object.assign({}, record, { id: uuid, recordStatus: RECORD_STATUS.NEW });
			this.props.addPoLines(poLine);
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
						if (recordStatus && recordStatus == RECORD_STATUS.NEW) {
							that.props.deletePoLine(record);
						} else {
							//既存商品(已存数据库)，逻辑删除(deleteFlg="delete")
							record.deleteFlg = true
							that.props.updatePoLine(record);
						}
						message.success('删除成功');
					},
					onCancel() { },
				});
				break;
			default:
				break;
		}
	}

	renderActions(text, record, index) {
		const { status } = this.props.basicInfo;
		if (
			(status === 1)
			|| (status === 2)
			|| (status === 3)
			|| (status === 4)
		) {
			return;
		}
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
			return (!element.poQuantity);
		})
	}

	/**
	 * 校验输入数据
	 */
	validateForm() {
		let isOk = true;
		const { form } = this.props;
		form.validateFields((err, values) => {
			if (!err) {
				isOk = true;
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
		let poData = { basicInfo: basicInfo, poLines: clearedPoLines };
		console.log("poData", poData);
		return poData;
	}

	/**
	 * 返回采购单基本信息
	 */
	getFormBasicInfo() {
		let formValues = this.props.form.getFieldsValue();
		//地点---仓库/门店
		let addressCd, address;
		if (this.state.localType !== '0002') {
			let selectedAddressRawData = this.poAddress.state.selectedRawData;
			if (selectedAddressRawData) {
				addressCd = selectedAddressRawData.warehouseCode;
				address = selectedAddressRawData.warehouseName;
			}
		} else {
			let selectedAddressRawData = this.poStore.state.selectedRawData;
			if (selectedAddressRawData) {
			addressCd1 = selectedAddressRawData.id;
			address1 = selectedAddressRawData.name;
		}
		}

		//供应商
		let supplierCd, supplierName;
		let selectedSupplierRawData = this.supplier.state.selectedRawData;
		if (selectedSupplierRawData) {
			supplierCd = selectedSupplierRawData.spId;
			supplierName = selectedSupplierRawData.companyName;
		}

		//供应商地点
		let supplierLocCd, supplierLocName;
		let selectedSupplierLocRawData = this.supplierLoc.state.selectedRawData;
		if (selectedSupplierLocRawData) {
			supplierLocCd = selectedSupplierLocRawData.providerNo;
			supplierLocName = selectedSupplierLocRawData.providerName;
		}

		//大类
		let bigClassCd, bigCLassName;
		let selectedBigClassRawData = this.bigClass.state.selectedRawData;
		if (selectedBigClassRawData) {
			bigClassCd = selectedBigClassRawData.id;
			bigCLassName = selectedBigClassRawData.categoryName;
		}

		let mapValues = { addressCd, address, supplierCd, supplierName, supplierLocCd, supplierLocName, bigClassCd, bigCLassName };
		let basicInfo = Object.assign({}, formValues, mapValues);
		console.log(basicInfo)
		return basicInfo;
	}

	/**
	 * 点击保存
	 *    * 校验内容：
	 *     1.基本信息
	 *     2.采购商品行信息是否OK
	 */
	handleSave() {
		console.log(this.poAddress)
		let that = this;
		//基本信息，商品均校验通过
		if (this.validateForm() && !this.hasInvalidateMaterial()) {
			//更新store
			this.props.updatePoBasicinfo(this.getFormBasicInfo());
			let poData = this.getPoData();;
			//call api
			this.props.createPo({ poData }).then(function (res) {
				//如果创建成功，刷新界面数据
				if (res.success) {
					message.success("采购单创建成功！");
					//初始化采购单详情
					that.props.initPoDetail(res.data);
				} else {
					message.error("采购单创建失败，请检查！");
				}
			});
		} else {
			message.error("校验失败，请检查！");
		}
	}

	/**
	 * 点击提交
	 * 校验内容：
	 *     1.基本信息是否正确
	 *     2.是否存在采购商品行
	 *     3.采购商品行信息是否正确
	 */
	handleSubmit() {
		let that = this;
		//检验基本信息
		if (!this.validateForm()) {
			return
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
		if (tmpPoLines.length == 0) {
			message.error("请添加采购商品！");
			return;
		}

		//校验是否存在采购数量为空商品
		if (this.hasEmptyQtyMaterial(tmpPoLines)) {
			message.error("请输入商品采购数量！");
			return;
		}

		//基本信息，商品行均校验通过
		//更新store
		this.props.updatePoBasicinfo(this.getFormBasicInfo());
		let poData = this.getPoData();;
		//call api
		this.props.createPo({ poData }).then(function (res) {
			//如果创建成功，刷新界面数据
			if (res.success) {
				message.success("提交成功！");
				//初始化采购单详情
				that.props.initPoDetail(res.data);
			} else {
				message.error("提交失败，请检查！");
			}
		});

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
		this.setState({
			auditModalVisible: true,
		});
	}
	/**
	 * 下载pdf
	 */
	handleDownPDF() {
		//call dowload pdf
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
					return '待审核';
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
		// 只读
		if (pageMode === PAGE_MODE.READONLY) {
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
									<span>{this.props.basicInfo.estimatedDeliveryDate}</span>
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
									<span>{this.props.basicInfo.settlementPeriod}</span>
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 付款方式 */}
								<FormItem formItemLayout >
									<span className="ant-form-item-label"><label>付款方式</label> </span>
									<span>{this.props.basicInfo.payType}</span>
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
									<span>{this.props.basicInfo.createTime}</span>
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
									<span>{this.props.basicInfo.auditTime}</span>
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
								<span className="text">{this.props.basicInfo.poNo}</span>
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
									{getFieldDecorator('poTypeCd', {
										initialValue: this.props.basicInfo.poTypeCd || '',
										rules: [{ required: true, message: '请选择采购单类型!' }],
									})(
										<Select style={{ width: '153px' }} size="default">
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
										<span className="ant-form-item-label"><label>供应商</label> </span>
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
											defaultValue={this.props.basicInfo.supplierCd}
											onChoosed={this.applySupplierChange}
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
										<span className="ant-form-item-label"><label>供应商地点</label> </span>
										<SearchMind
											style={{ zIndex: 10000 }}
											compKey="providerNo"
											ref={ref => { this.supplierLoc = ref }}
											fetch={(params) =>
												this.props.pubFetchValueList({
													condition: params.value,
													pageNum: params.pagination.current || 1,
													pageSize: params.pagination.pageSize
												}, 'supplierAdrSearchBox')
											}
											onChoosed={this.applySupplierLocChoosed}
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
									{getFieldDecorator('poNo', {
										initialValue: moment('2017-07-20', dateFormat),
										rules: [{ required: true, message: '请输入预计送货日期' }],
									})(
										<DatePicker format={dateFormat} />
										)}

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
									{getFieldDecorator('locTypeCd', {
										initialValue: this.props.basicInfo.locTypeCd || '',
										rules: [{ required: true, message: '请选择地点类型' }],
									})(
										<Select style={{ width: '153px' }} size="default" onChange={this.onLocTypeChange}>
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
											this.state.localType !== '0002'
											&& <SearchMind
												style={{ zIndex: 10000 }}
												disabled={this.state.locDisabled}
												compKey="warehouseCode"
												ref={ref => { this.poAddress = ref }}
												fetch={(params) =>
													this.props.pubFetchValueList({
														param: params.value,
														pageNum: params.pagination.current || 1,
														pageSize: params.pagination.pageSize
													}, 'getWarehouseInfo1')
												}
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
											this.state.localType === '0002'
											&& <SearchMind
												style={{ zIndex: 10000 }}
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
											style={{ zIndex: 10000 }}
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
									<span>{this.props.basicInfo.accountPeriod}</span>
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 付款方式 */}
								<FormItem formItemLayout >
									<span className="ant-form-item-label"><label>付款方式</label> </span>
									<span>{this.props.basicInfo.payment}</span>
								</FormItem>
							</Col>
							<Col span={8}>
								{/* 货币类型 */}
								<FormItem label="货币类型" formItemLayout>
									{getFieldDecorator('poNo', {
										initialValue: "CNY"
									})(
										<Input
										/>
										)}
								</FormItem>
							</Col>
						</Row>

						<Row >
							<Col span={8}>
								{/* 创建者 */}
								<FormItem label="创建者">
									<span>{this.props.basicInfo.createdByName}</span>
								</FormItem>
							</Col>
							<Col span={4}>
								{/* 创建日期 */}
								<FormItem label="创建日期">
									<span>{this.props.basicInfo.createdAt}</span>
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
		const { getFieldDecorator } = this.props.form;
		const { poLines } = this.props;
		const { totalAmount, totalQuantity } = this.state;
		let baiscInfoElements = this.getBaiscInfoElements(this.state.pageMode);

		return (
			<div className="po-detail">
				<Form layout="inline">
					{baiscInfoElements}
					{this.state.editable && <div className="addMaterialContainer">
						<Row >
							<Col span={8}>
								<div className="row middle">
									{/*新增采购单  */}
									<SearchMind
										compKey="materialCd"
										ref={ref => { this.addPo = ref }}
										fetch={(params) =>
											this.props.pubFetchValueList({
												condition: params.value,
												pageNum: params.pagination.current || 1,
												pageSize: params.pagination.pageSize
											}, 'supplierAdrSearchBox')
										}
										addonBefore="添加商品"
										onChoosed={this.handleChoosedMaterialMap}
										renderChoosedInputRaw={(data) => (
											<div>{data.materialCd} - {data.materialName}</div>
										)}
										pageSize={6}
										columns={[
											{
												title: '编码',
												dataIndex: 'materialCd',
												width: 150,
											}, {
												title: '名称',
												dataIndex: 'materialName',
												width: 200,
											}
										]}
									/>
								</div>
							</Col>
						</Row>
					</div>}
					<div className="poLines">
						<Table dataSource={poLines.filter(function (record) {
							return (!record.deleteFlg);
						})} pagination={false} columns={this.columns} rowKey="id" scroll={{
							x: 1300
						}} />
					</div>
					<div>
						<Row type="flex">
							<Col span={8}>
								<div>
									<label>合计数量:</label>
									<span>{totalQuantity}</span>
								</div>

							</Col>
							<Col span={8}>
								<div>
									<label>合计金额:</label>
									<span>{totalAmount}</span>
								</div>
							</Col>
						</Row>
					</div>
					<Affix offsetBottom={0}>
						<div className="actions">
							<Row gutter={40} type="flex" justify="end" >
								<Col>
									{
										this.state.actionAuth.save
										&& <FormItem>
											<Button size="default" onClick={this.handleSave}>
												保存
											</Button>
										</FormItem>
									}
									{
										this.state.actionAuth.submit
										&& <FormItem>
											<Button size="default" onClick={this.handleSubmit}>
												提交
											</Button>
										</FormItem>
									}
									{
										this.state.actionAuth.approve
										&& <FormItem>
											<Button size="default" onClick={this.handleAudit}>
												审批
											</Button>
										</FormItem>
									}
									{
										this.state.actionAuth.downloadPDF
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
					<div>
						<Audit
							visible={this.state.auditModalVisible}
							onOk={this.applyAuditOk}
							onCancel={this.applyAuditCancel}
						/>
					</div>
				</Form>
			</div>
		)
	}
}

PoDetail.propTypes = {

}

export default withRouter(Form.create()(PoDetail));
