/**
 * @file service.js
 * @author denglingbo
 *
 * 业务模块 service 封装
 */

import Http from 'freed-spa/lib/util/http';
import { message } from 'antd';
import LoginLayout from './views/login/LoginLayout';
import ERRORTEXT from './constant/errorText';

const http = new Http();

/**
 * http response 拦截器
 */
http.response(
    res => {
        if (res.data.code === 401) {
            LoginLayout();
            return Promise.reject(res.data);
        } else if (res.data.code !== 200) {
            const { code } = res.data;
            const mess = res.data.message;
            const errText = ERRORTEXT[code];
            if (typeof mess === 'string' || errText) {
                const err = errText || (mess || '未知错误')
                message.error(err);
            }
            return Promise.reject(res.data);
        }
        return Promise.resolve(res);
    },
    err => {
        if (err.response) {
            const status = err.response.status;
            if (status === 401) {
                LoginLayout();
            }
        }
        return Promise.reject(err);
    }
);

/**
 * 下载相关api
 */
// 下载供应商excel URL
// export const exportSupplierList = 'provider/exportSupplierList';

// 下载供应商入驻列表
// export const exportSupplierEnterList = 'provider/exportSupplierEnterList';

// 下载供应商入驻列表
export const exportSupplierEnterList = '/supplier/exportSettledList';

// 下载供应商管理列表
export const exportManageList = '/supplier/exportManageList';

// 下载供应商修改列表
export const exportEditApplySupplier = 'provider/exportEditApplySupplier';

// 下载订单管理列表
export const exportOrderList = 'sorder/exportOrderList';

// 下载供应商结算数据
export const exportSimpleList = '/settlement/exportSupplierSettlementList';

// 下载加盟商结算数据
export const exportFranchiseeList = '/settlement/downloadFranchiseeSettlement';

// 下载加盟商支付数据
export const exportPaymentList = '/settlement/downloadFranchiseePayment';

// 下载采购订单PDF
export const exportProcurementPdf = 'pmPurchaseOrder/exportPdf';

// 下载库存调整列表
export const exportStoreAdList = 'imAdjustment/exportListImAdjustment';

// 实时库存查询 导出
export const exportQueryStoreRealTime = 'inventory/excelInventoryBIRecords';

// 促销活动 - 下单打折 - 参与数据导出
export const exportParticipateData = 'promotion/toExcel';

// 促销活动 - 优惠券 - 已使用参与数据导出
export const exportParticipateData1 = '/coupon/queryCouponRecordListExcel';

// 促销活动 - 优惠券 - 未使用参与数据导出
export const exportParticipateData2 = '/coupon/queryCouponActivityActiveListExcel';

/**
 * 登录 Api
 */
export const login = () => http.post('/login');

/**
 * 获取用户权限
 * @param code
 */
export const fetchRights = (code) => http.get('/system/queryButtons', { menuId: code });

/**
 * 获取用户信息及顶部memu数据
 */

export const user = (params) => http.get('/system/user', params);

/**
 * 获取侧边栏menus
 */
export const queryLeftMenus = (params) => http.get('/system/queryLeftMenus', params);

/**
 * 退出登录
 */
export const logout = (params) => http.get('/system/logout', params);

/**
 * 获取用户信息
 */
export const fetchUser = () => http.get('/user');

/**
 * Others
 */
export const fetchBookList = () => http.get('/book');

export const fetchBookDetail = (params) => http.get('/bookDetail', params);

export const fetchTopic = () => http.get('/topic');

export const createTopic = (params) => http.post('/topic/create', params);


// 查询供应商列表
export const fetchSupplierList = (params) => http.get('/provider/queryApprovedSupplier', params);

// 修改供应商合作信息
export const modifySupplierCooperationInfo = (params) => http.post('/provider/updateSupplierCooperationInfo', params);

// 修改供应商状态(新)
export const editSupplierStatus = (params) => http.post('/provider/editSupplierStatus', params);

// 修改供应商状态
export const updateSupplierStatus = (params) => http.post('/provider/updateSupplierStatus', params);

// 查询供应商修改资料申请列表
export const fetchSupplierEditApply = (params) => http.get('/provider/supplierEditApplyList', params);

// 供应商申请入驻管理
export const fetchProviderEnter = (params) => http.get('/region/queryAllLargerRegionProvince', params);

// 供应商管理列表(改)
export const fetchQueryManageList = (params) => http.get('/supplier/queryManageList', params);

// 供应商入驻列表(改)
export const querySettledList = (params) => http.get('/supplier/querySettledList', params);

// 查询供应商修改前修改后的信息(改)
export const fetchEditBeforeAfter = (params) => http.get('/supplier/editBeforeAfter', params);

// 供应商综合审核录入
export const insertSupplierAuditInfo = (params) => http.post('/provider/insertSupplierAuditInfo', params);

// 查询供应区域信息
export const fetchSaleRegion = (params) => http.get('/provider/supplierSaleRegionList', params);

// 查询供应区域信息
export const checkSupplierBasicInfo = (params) => http.get('/provider/checkSupplierBasicInfo', params);

// 检查供应商基本信息是否重复
export const settlementInfo = (params) => http.post('/provider/checkSupplierBasicInfo', params);

// 供应商基本信息录入
export const insertSupplierSettlementInfo = (params) => http.post('/provider/insertSupplierSettlementInfo', params);

// 查询纳税人是否已存在
export const taxpayerNumber = (params) => http.get('/provider/checkSupplierOperTaxBytaxpayerNumber', params);

// 公司名是否重复
export const checkSupplierName = (params) => http.get('/supplier/checkSupplierName', params);

// 银行信息是否重复
export const checkBankAccount = (params) => http.get('/supplier/checkBankAccount', params);

// 校验营业执照号是否重复
export const checkLicenseNo = (params) => http.get('/supplier/checkLicenseNo', params);

// 检查银行账号是否存在重复
export const bankAccount = (params) => http.get('/provider/checkSupplierBankInfoByBankAccount', params);

// 检查营业执照号是否重复
export const registLicenceNo = (params) => http.get('/provider/checkSupplierLicenseInfoByRegistLicenceNo', params);

// 检查组织机构代码是否重复
export const orgCodeInfoByCode = (params) => http.get('/provider/checkSupplierOrgCodeInfoByCode', params);

// 检查供应商紧急联系人的重复情况
export const emerCont = (params) => http.get('/provider/checkSupplierEmerCont', params);

// 检查供应商入驻联系人的重复情况
export const settledCont = (params) => http.get('/provider/checkSupplierSettledCont', params);

// 查看失败原因
export const findAuditFailedReason = (params) => http.get('/provider/findAuditFailedReason', params);

// 修改供应商营业执照信息 (未联调)
export const updateSupplierLicenseInfo = (params) => http.post('/provider/updateSupplierLicenseInfo', params);

// 查看修改供应商营业执照信息 (未联调)
export const showOldAndNewLicenseInfo = (params) => http.get('/provider/showOldAndNewLicenseInfo', params);

// 审核公司营业执照 (未联调)
export const approveSupplierLicense = (params) => http.post('/provider/approveSupplierLicense', params);

// 修改公司组织机构代码证信息 (未联调)
export const updateSupplierOrgCodeInfo = (params) => http.post('/provider/updateSupplierOrgCodeInfo', params);

// 查询组织机构代码证修改前和修改后内容 (未联调)
export const showOldAndNewOrgCodeInfo = (params) => http.get('/provider/showOldAndNewOrgCodeInfo', params);

// 审核组织机构代码证修改内容 (未联调)
export const approveSupplierOrgCode = (params) => http.post('/provider/approveSupplierOrgCode', params);

// 修改公司经营及税务信息 (未联调)
export const updateSupplierOperTaxInfo = (params) => http.post('/provider/updateSupplierOperTaxInfo', params);

// 查询公司经营及税务信息修改前和修改后内容 (未联调)
export const showOldAndNewOperTaxContent = (params) => http.get('/provider/showOldAndNewOperTaxContent', params);

// 审核供应商公司经营及税务信息修改内容 (未联调)
export const approveSupplierOperTax = (params) => http.post('/provider/approveSupplierOperTax', params);

// 修改银行信息 (未联调)
export const updateSupplierBankInfo = (params) => http.post('/provider/updateSupplierBankInfo', params);

// 查询商家银行修改前和修改后的内容 (未联调)
export const showOldAndNewBankContent = (params) => http.get('/provider/showOldAndNewBankContent', params);

// 审核供应商银行修改信息 (未联调)
export const approveSupplierBank = (params) => http.post('/provider/approveSupplierBank', params);

// 修改供应商紧急联系人 (未联调)
export const editSupplierEmerContApproval = (params) => http.post('/provider/editSupplierEmerContApproval', params);

// 查询供应商紧急联系人修改前修改后的信息 (未联调)
export const showOldAndNewEmerContInfo = (params) => http.get('/provider/showOldAndNewEmerContInfo', params);

// 审核紧急联系人修改后的内容 (未联调)
export const approveSupplierEmerCont = (params) => http.post('/provider/approveSupplierEmerCont', params);

// 修改招商入驻联系人 (未联调)
export const editSupplierSettledContApproval = (params) => http.post('/provider/editSupplierSettledContApproval', params);

// 查询招商入驻联系人修改前和修改后内容 (未联调)
export const showOldAndNewSettledContInfo = (params) => http.get('/provider/showOldAndNewSettledContInfo', params);

// 审核招商入驻联系人修改后内容 (未联调)
export const approveSupplierSettledCont = (params) => http.post('/provider/approveSupplierSettledCont', params);

// 修改合作信息 (未联调)
export const editSupplierCooperationApproval = (params) => http.post('provider/updateSupplierCooperationInfo', params);

export const fetchSaleRegionsDtail = (params) => http.get('/provider/supplierSaleRegions', params);

export const fetchApplicationList = (params) => http.get('/suppliersApplicationList', params);

export const fetchParameterList = (params) => http.get('/parameterList', params);

// 查询所有的省和直辖市
export const queryAllProvince = (params) => http.get('/region/queryAllProvince', params);

// 根据code查询子区域
export const queryRegionByCode = (params) => http.get('/region/queryRegionByCode', params);

// 商品分类第一级查询
export const fetchFirstLevelCategorys = () => http.get('/category/queryFirstLevelCategorys');

// 子集商品分类查询
export const fetchCategorysById = (params) => http.get('-web-manage/queryCategorysById/xcate1', params);

// 查询在售商品列表
export const fetchShelfProductsByLike = (params) => http.get('/product/queryShelfProductsByLike', params);

export const fetchClassifiedList = () => http.get('/category/queryFirstLevelCategorys');

// 查询销售价格详情
export const findPriceinfo = (params) => http.get('/price/findPriceInfo', params);

// 查询销售价格详情
export const toaddsellprice = (params) => http.get('/price/toAddSellPrice', params);

// 跳转到修改销售价格页面
export const toUpdateSellPrice = (params) => http.get('/price/toUpdateSellPrice', params);

// 修改销售价格
export const updateSellPrice = (params) => http.post('/price/updateSellPrice', params);

// 删除采购价格
export const deletePurchasePriceById = (params) => http.get('/price/deletePurchasePriceById', params);

// 查看商品详情
export const commodityDetail = (params) => http.get('/product/queryProductById', params);

// 查询采购价格list
export const purchasePriceDetail = (params) => http.get('/price/getPurchasePriceDetail', params);

// 新增采购价格
export const addPurchasement = (params) => http.post('/price/addPurchasementPrice', params);

// 在售商品列表下架功能
export const updateOffShelfProducts = (params) => http.post('/product/updateOffShelfProducts', params);

// 新增销售价格
export const addSellPrice = (params) => http.post('/price/addSellPrice', params);

// 修改采购价格
export const updatePurchasePrice = (params) => http.post('/price/updatePurchasePrice', params);

// 系统配置
// 分类列表页商品排序管理
export const fetchCategoryList = (params) => http.get('/categoryGoodsOrder/queryCategoryGoodsOrders', params);

// 修改分类商品排序号
export const fetchOrderNum = (params) => http.post('/categoryGoodsOrder/updateCategoryGoodsOrderNum', params);

// 新增分类商品排序号
export const fetchInsertCategoryGoodsOrder = (params) => http.post('/categoryGoodsOrder/insertCategoryGoodsOrder', params);

// 通过商品编号获取商品名称
export const fetchQuerygoodsname = (params) => http.get('/categoryGoodsOrder/queryGoodsName', params);

// 根据分类排序商品id删除记录
export const fetchDeleteOrderNum = (params) => http.get('/categoryGoodsOrder/deleteCategoryGoodsOrderNum', params);

// 多媒体管理
// 静态页面列表查询
export const fetchFindStaticPageList = (params) => http.get('/staticPage/findStaticPageList', params);

// 查询字典分页列表
export const dictionaryList = (params) => http.get('/dictionary/dictionaryList', params);

// 新增静态页
export const insertstaticpage = (params) => http.post('/staticPage/insertStaticPage', params);

// 修改静态页面基本信息
export const updatestaticpagebase = (params) => http.post('/staticPage/updateStaticPageBase', params);

// 查询显示字典维护内容列表
export const dictionaryContentList = (params) => http.get('/dictionary/dictionaryContentList', params);

// 页面编辑数据列表
export const fectheEditorList = (params) => http.get('/staticPage/toUpdateStaticPage', params);

// 修改静态页面编辑内容并上传到图片服务器
export const fectheEditorContent = (params) => http.post('/staticPage/updateStaticPageUpload', params);

// 修改快捷导航状态
export const batchUpdateQuickNavigation = (params) => http.post('/homeAd/batchUpdateQuickNavigation', params);

/**
 * wrap 端配置相关接口
 */
// 查询所有轮播
export const queryCarouselAdList = (params) => http.get('/homeAd/queryCarouselAdList', params);

// 轮播广告管理-修改
export const updateCarouselAd = (params) => http.post('/homeAd/updateCarouselAd', params);

// 轮播广告-启停（cyx）
export const updateCarouselAdStatus = (params) => http.post('/homeAd/updateCarouselAdStatus', params);

// 删除某个轮播
export const deleteCarouselAd = (params) => http.post('/homeAd/deleteCarouselAd', params);

// 新增轮播
export const insertCarouselAd = (params) => http.post('/homeAd/insertCarouselAd', params);

// 判断序号是否重复
export const queryCarouselAdBySorting = (params) => http.get('/homeAd/queryCarouselAdBySorting', params);

// 查询单个轮播广告
export const queryCarouselAdListById = (params) => http.get('/homeAd/queryCarouselAdListById', params);

// 查询轮播间隔时间
export const queryCarouselInterval = (params) => http.get('/homeAd/queryFirstCarouselInterval', params);

// 修改轮播间隔时间
export const updateCarouselInterval = (params) => http.post('/homeAd/updateCarouselIntervalById', params);

// 查询快捷导航列表
export const queryQuickNavigationList = (params) => http.get('/homeAd/queryQuickNavigationList', params);

// 查询单个快捷导航
export const queryQuickNavigation = (params) => http.get('sc/homeAd/queryQuickNavigation', params);

// 修改快捷导航
export const updateQuickNavigation = (params) => http.post('/homeAd/updateQuickNavigation', params);

// 首页配置区域列表
export const areaList = (params) => http.get('/homeAd/areaList', params);

// 设置首页广告区域停用或者启用
export const setAreaEnable = (params) => http.post('/homeAd/setAreaEnable', params);

// 设置首页广告区域上移或者下移
export const moveArea = (params) => http.post('/homeAd/moveArea', params);

// 添加广告项
export const saveItemAd = (params) => http.post('/homeAd/saveItemAd', params);

// 上传base64图片
export const uploadImageBase64Data = (params) => http.post('/commonUploadFile/uploadImageBase64Data', params);

// 查询分类信息
export const queryCategorys = (params) => http.get('/category/queryAllShowCategories', params);

// 查询单级分类信息
export const queryAllCategoriesWithIconByParentId = (params) => http.get('/category/queryAllCategoriesWithIconByParentId', params);
// 查询所有分类
export const queryAllCategories = () => http.get('/category/queryAllCategories');

/**
 * 修改排序
 * @param id
 * @param sortOrder
 * @param newSortOrder
 */
export const updateSortNum = ({ id, newSortOrder }) => (
    http.post('/category/updateSortNum', { id, newSortOrder }, true)
);

/**
 * 修改展示状态
 * @param id
 * @param displayStatus
 */
export const updateShowStatus = ({ id, displayStatus }) => (
    http.post('/category/updateShowStatus', { id, displayStatus }, true)
);

// 搜索推荐配置(cyx)---1.保存或者修改输入框的搜索关键字
export const saveInput = (params) => http.post('/rk/saveInput', params);

// 搜索推荐配置(cyx)---2.添加热门推荐的关键字
export const saveHot = (params) => http.post('/rk/saveHot', params);

// 搜索推荐配置(cyx)---3.修改热门推荐关键字之回显
export const findById = (params) => http.get('/rk/findById', params);

// 搜索推荐配置(cyx)---4.修改热门推荐关键字
export const updateHot = (params) => http.post('/rk/updateHot', params);

// 搜索推荐配置(cyx)---5.根据id删除对应的热门推荐关键字
export const deleteById = (params) => http.get('/rk/deleteById', params);

// 搜索推荐配置(cyx)---6.查出所有的搜索框下方推荐关键字并分页
export const queryAllHot = (params) => http.get('/rk/queryAllHot', params);

// 搜索推荐配置(cyx)---7.查询搜索框中的关键字查询
export const selectInputKeyword = (params) => http.get('/rk/selectInputKeyword', params);

// 搜索推荐配置(cyx)---7.查询搜索框中的关键字查询
export const queryCategoriesLv4IconList = (params) => http.get('/categoryIcon/queryCategoriesLv3IconList', params);

// 分类图标管理(cyx)---上传ICON
export const addOrUpdateCategoryIcon = (params) => http.post('/category/addOrUpdateCategoryIcon', params);

// 404页面广告配置(cyx)---查询table
export const queryAllAdPlanList = (params) => http.get('/adPlan/queryAllAdPlanList', params);

// 404页面广告配置(cyx)---删除方案
export const deleteAdPlanById = (params) => http.get('/adPlan/deleteAdPlanById', params);

// 404页面广告配置(cyx)---方案的启停
export const changeAdPlanState = (params) => http.get('/adPlan/changeAdPlanState', params);

// 404页面广告配置(cyx)---新增方案
export const addAdPlan = (params) => http.post('/adPlan/addAdPlan', params);

// 404页面广告配置(cyx)---新增方案
export const updateAdPlan = (params) => http.post('/adPlan/updateAdPlan', params);

// 查询阶梯价格信息
export const getPurchasePrice = (params) => http.get('/price/getPurchasePriceExtByPriceId', params);

// 查询供应商
export const queryAllSupplier = (params) => http.get('/price/queryAllSupplier', params);

// 新增数据字典
export const insertDictionary = (params) => http.post('/dictionary/insertDictionary', params);

// 根据条件分页查询白名单列表
export const queryWhitelist = (params) => http.get('/sp/queryWhiteList', params);

// 白名单上线
export const onlineWhitelist = (params) => http.post('/sp/whiteListOnline', params);

// 白名单下线
export const offlineWhitelist = (params) => http.post('/sp/whiteListOffline', params);

// 修改数据字典
export const updateDictionary = (params) => http.post('/dictionary/updateDictionary', params);

// 删除数据字典
export const deleteDictionary = (params) => http.get('/dictionary/deleteDictionary', params);

// 修改字典内容或设置状态
export const updateContent = (params) => http.post('/dictionary/updateContent', params);

// 新增数据字典内容
export const insertDictionaryContent = (params) => http.post('/dictionary/insertDictionaryContent', params);

// IBM 修改
// 查看是否存在主供应商
export const checkMainSupplier = (params) => http.get('/prodPurchase/checkMainSupplier', params);

// 查询商品价格信息
export const getProdPurchaseById = (params) => http.get('/prodPurchase/getProdPurchaseById', params);

// 销售价格信息
export const findPriceInfo = (params) => http.get('/prodSell/findPriceInfo', params);

// 新增商品采购关系
export const addProdPurchase = (params) => http.post('/prodPurchase/addProdPurchase', params);

// 更新商品采购关系
export const updateProdPurchase = (params) => http.post('/prodPurchase/updateProdPurchase', params);

// 删除商品价格信息
export const fetchDeleteProdPurchaseById = (params) => http.get('/prodPurchase/deleteProdPurchaseById', params);

// 更改供应商类型
export const fetchChangeSupType = (params) => http.get('/prodPurchase/changeSupplierType', params);

// 更改商品采购价格启禁用状态
export const changeProPurchaseStatus = (params) => http.get('/prodPurchase/changeProPurchaseStatus', params);

// 商品的暂停购进和恢复采购
export const batchChangeProPurchaseStatus = (params) => http.post('/prodPurchase/batchChangeProPurchaseStatus', params);

// 根据条件查询商品价格信息
export const queryProdPurchaseExtByCondition = (params) => http.get('/prodPurchase/queryProdPurchaseExtByCondition', params);

// 查询商品信息
export const getProductById = (params) => http.get('/prodPurchase/getProductById', params);

// 根据品牌名称分页查询品牌列表
export const queryBrandsByPages = (params) => http.get('/product/queryBrandsByPages', params);

/* **************procurement*********** */

// 查询采购单详情
export const queryPoDetail = (params) => http.get('/pmPurchaseOrder/getPurchaseOrderInfoById', params);
// 创建采购单详情
export const createPo = (params) => http.post('/pmPurchaseOrder/addPmPurchaseOrder', params);
// 修改采购单详情
export const updatePmPurchaseOrder = (params) => http.post('/pmPurchaseOrder/updatePmPurchaseOrder', params);
// 查询采购单列表
export const fetchPoMngList = (params) => http.get('/provider/queryPoMngList', params);
// 删除采购单 参数 1或n个采购单id  [ids]
export const deletePoByIds = (params) => http.get('/provider/deletePoByIds', params);
// 查询采购单列表
export const repushPurchaseReceipt = (params) => http.get('/pmPurchaseReceipt/rePushPurchaseReceiptToMQ', params);
// 查询采购退货列表
export const fetchReturnMngList = (params) => http.get('/pmPurchaseRefund/queryRefundDetailById', params);
// 查询采购退货列表详情
export const fetchReturnPoRcvInit = (params) => http.get('/pmPurchaseRefund/queryPurchaseRefundList', params);

// 审批
export const auditPo = (params) => http.post('/provider/auditPo', params);

/**
 * 采购相关
 */
// 查询采购单列表
export const fetchPurchaseOrder = (params) => http.get('/pmPurchaseOrder/queryPurchaseOrderList', params);

// 门店地点值清单
export const getStoreInfo = (params) => http.get('/store/getStoreInfo', params);

// 大类值清单
export const querycategories = (params) => http.get('/category/queryCategories', params);

// 商品值清单
export const queryMaterialMap = (params) => http.get('/provider/queryMaterialMap', params);
// 删除处于草稿状态的订单
export const deletePurchaseList = (params) => http.get('/pmPurchaseOrder/batchDeletePmPurchaseOrderByIds', params);
// 查询采购单打印列表
export const queryPoPrintList = (params) => http.get('/pmPurchaseOrder/queryPurchaseOrderListInfo', params);
// 根据采购订单id下载PDF文件
export const downloadPDF = 'pmPurchaseOrder/exportPdf';
// 采购单列表批量下载PDF ZIP压缩文件
export const downloadBatchPDF = 'pmPurchaseOrder/exportPdfs';

// 采购收货相关
// 采购收货单管理列表
export const queryPoRcvMngList = (params) => http.get('/pmPurchaseReceipt/queryReceiptList', params);

// 采购单收货列表   采购单筛选条件：已审核、未收货
export const queryPoRcvList = (params) => http.get('/provider/queryPoRcvList', params);

// 查询收货详情 查询参数： 收货单id（poRcvId）或采购单id（poId）
// export const queryPoRcvDetail = (params) => http.get('/provider/queryPoRcvDetail', params);
// 购收货单详情（id，收货单id）
export const queryPoRcvDetail = (params) => http.get('/pmPurchaseReceipt/queryReceiptDetailById', params);

// 创建采购收货单
export const createPoRcv = (params) => http.post('/provider/createPoRcv', params);

// 查询库存调整列表{mock}
export const queryAdjustLibList = (params) => http.post('/provider/queryAdjustLibList', params);

// 查询库存调整单详情
export const queryAdjustDetail = (params) => http.get('/imAdjustment/getImAdjustment', params);

// 库存调整-库存调整列表
export const queryStoreAdList = (params) => http.get('/imAdjustment/queryListImAdjustment', params);

// 实时库存查询
export const queryStoreRealTime = (params) => http.get('/inventory/queryInventoryBIByPageQueryParam', params);

/**
 * 供应商相关
 */
// 供应商详情
export const queryProviderDetail = (params) => http.get('/supplier/queryProviderDetail', params);

// 查询所有大区
export const queryAllLargerRegionProvince = (params) => http.get('/region/queryAllLargerRegionProvince', params);

// 获取供应商或者供应商地点信息
export const getSupplierNo = (params) => http.get('/supplier/getSupplierNo', params);

// 新增或修改供应商信息
export const insertOrUpdateSupplierInfo = (params) => http.post('/supplier/insertOrUpdateSupplierInfo', params);

// 供应商入驻审核
export const suppplierSettledAudit = (params) => http.post('/supplier/supplierSettledAudit', params);

// 供应商地点入驻审核
export const supplierAdrSettledAudit = (params) => http.post('/supplier/supplierAdrSettledAudit', params);

// 供应商修改审核
export const auditSupplierEditInfo = (params) => http.post('/supplier/auditSupplierEditInfo', params);


/**
 * 校验分公司id是否重复
 * orgId 供应商地点分公司id
 * id 供应商地点基本信息表id (修改时校验需要传)
 * parentId 供应商地点对应供应商主表id
 */
export const checkSupplierAddOrgId = (params) => http.get('/supplier/checkSupplierAddOrgId', params);

/**
 * 商品模块
 */

 // 根据条件分页查询商品清单，并排序
export const queryproductsbypages = (params) => http.get('/product/queryProductsByPages', params);

 // 根据商品id同步商品
export const syncProductByManualAction = (params) => http.get('/product/syncProductByManual', params);

// 获取已审批通过供应商地点下拉框数据
export const querySuppliersList = (params) => http.get('/supplier/supplierSearchBox', params);

// 商品的暂停购进和恢复采购
export const goodsChangeStatus = (params) => http.post('prodPurchase/batchChangeProPurchaseStatus', params);
// 商品的区域性批量上架
export const prodBatchPutAway = (params) => http.post('prodSell/prodBatchPutaway', params);
// 商品的区域性批量下架
export const prodBatchUpdate = (params) => http.post('prodSell/prodBatchUpdate', params);
// 批量全国上下架
export const availablProducts = (params) => http.post('product/availablProducts', params);

// 新增供应商信息
export const insertSupplierInfo = (params) => http.post('/supplier/insertSupplierInfo', params);

// 修改供应商信息
export const updateSupplierInfo = (params) => http.post('/supplier/updateSupplierInfo', params);

// 新增供应商地点信息
export const insertSupplierAddressInfo = (params) => http.post('/supplier/insertSupplierAddressInfo', params);

// 修改供应商地点信息
export const updateSupplierAddressInfo = (params) => http.post('/supplier/updateSupplierAddressInfo', params);

// 查询供应商地点详情
export const queryProviderPlaceInfo = (params) => http.get('/supplier/queryProviderPlaceInfo', params);

// 此接口用于根据条件查询仓库信息列表,条件查询范围为仓库编码和仓库名称(应该用get)
export const getWarehouseInfo1 = (params) => http.get('/warehouse/getWarehouseLogicInfo', params);

// 此接口用于根据仓库ID查询仓库的详细信息
export const getWarehouseInfo = (params) => http.get('/warehouse/getWarehousePhysicalInfo', params);

// 查询供应商地点所属区域列表
export const querySupplierPlaceRegion = (params) => http.get('/supplier/querySupplierPlaceRegion', params);

// 此接口用于通过code和name（后端id就等于code）查询子公司信息
export const findCompanyBaseInfo = (params) => http.get('/prodSell/findCompanyBaseInfo', params);
// 此接口用于通过code和name（后端id就等于code）查询子公司信息(通过商品id过滤可用的)
export const queryBranchCompanyInfo = (params) => http.get('/prodSell/queryBranchCompanyInfo', params);
// 此接口用于通过code和name（后端id就等于code）查询子公司信息
export const getFranchiseeInfo = (params) => http.get('/sorder/getFranchiseeInfo', params);
// 查询可用子公司信息
export const findCanUseCompanyInfo = (params) => http.get('/supplier/findCompanyBaseInfo', params);

// 此接口用于查询各级分类（值清单）
export const queryCategorysByLevel = (params) => http.get('/category/queryCategories', params);

// 根据供应商信息新增商品（值清单）
export const queryProductForSelect = (params) => http.get('/product/queryProductForSelect', params);

// 订单管理-查询订单列表
export const queryOrder = (params) => http.get('/sorder/queryOrder', params);

// 订单管理-批量审核
export const batchApproval = (params) => http.post('/sorder/batchApproval', params);

// 订单管理-批量审核
export const batchCancel = (params) => http.post('/sorder/batchCancel', params);

// 订单管理-重新传送
export const resendOrder = (params) => http.post('/sorder/resendOrder', params);

// 订单管理-单个取消
export const cancelOrder = (params) => http.post('/sorder/cancelOrder', params);

// 订单管理-单个审核
export const approvalOrder = (params) => http.post('/sorder/approvalOrder', params);

// 订单管理-查询订单信息
export const queryOrderDetailInfo = (params) => http.get('/sorder/orderDetail', params);

// 订单管理-查询支付信息
export const queryPaymentDetailInfo = (params) => http.get('/sorder/paymentInfo', params);

// 订单管理-查询配送信息
export const queryShippingDetailInfo = (params) => http.get('/sorder/shippingGroupInfo', params);

// 订单管理-保存订单详情备注信息
export const orderDescription = (params) => http.post('/sorder/orderDescription', params);

// 订单管理-审核退款
export const auditRefund = (params) => http.post('/sorder/auditRefund', params);

// 订单管理-确认退款
export const confirmRefund = (params) => http.post('/sorder/confirmRefund', params);

// 订单管理-新增支付
export const addPaymentInfo = (params) => http.post('/sorder/addPaymentInfo', params);

// 订单管理-确认支付
export const confirmPayment = (params) => http.post('/sorder/confirmPayment', params);

// 根据库存实时拆单
export const splitorderByInventoryService = (params) => http.post('/sorder/splitOrderByInventory', params);

// 手动分组拆单
export const interfaceInventoryService = (params) => http.post('/sorder/manualSplitOrder', params);

// 供应商选择组件
export const supplierSearchBox = (params) => http.get('/supplier/supplierSearchBox', params);

// 供应商地点选择组件
export const supplierAdrSearchBox = (params) => http.get('/supplier/supplierAdrSearchBox', params);

// 根据条件查询销售价格区间列表
export const findStepPriceInfo = (params) => http.get('/prodSell/findPriceInfo', params);

// 删除价格区间
export const deleteSellPriceById = (params) => http.get('/prodSell/deleteSellPriceById', params);

// 新增销售价格区间
export const addStepSellPrice = (params) => http.post('/prodSell/addSellPrice', params);

// 根据id修改销售价格区间
export const updateStepSellPrice = (params) => http.post('/prodSell/updateSellPrice', params);

// 修改供应商
export const updateSellPriceStatus = (params) => http.get('/prodSell/updateSellPriceStatus', params);

// 采购订单-查询新增商品信息
export const getNewPmPurchaseOrderItem = (params) => http.get('/pmPurchaseOrder/getNewPmPurchaseOrderItem', params);

// 采购订单-审批
export const auditPurchaseOrderInfo = (params) => http.post('/pmPurchaseOrder/auditPurchaseOrderInfo', params);

// 促销活动 - 下单打折
export const fetchPromotionList = (params) => http.get('/promotion/queryPromotionList', params);
export const fetchPromotionParticipateData = (params) => http.get('/promotion/queryParticipateData', params);
export const createPromotion = (params) => http.post('/promotion/insertPromotion', params);
export const fetchPromotionDetail = (params) => http.get('/promotion/queryPromotionDetail', params);
export const updatePromotionStatus = (params) => http.post('/promotion/updatePromoStatus', params);

// 优惠券
export const fetchUsedCouponParticipate = (params) => http.get('/coupon/queryCouponRecordList', params);
export const fetchUnUsedCouponParticipate = (params) => http.get('/coupon/queryCouponActivityActiveList', params);
export const createCoupons = (params) => http.post('/coupon/insertCoupons', params);
export const queryCouponsList = (params) => http.get('/coupon/queryCouponsList', params);
export const queryAliveCouponsList = (params) => http.get('/coupon/queryAliveCouponsList', params);
export const getCouponsDetail = (params) => http.get('/coupon/queryCouponsById', params);
export const queryFranchiseeList = (params) => http.get('/franchisee/grantFranchisee', params);
export const grantCoupon = (params) => http.post('/coupon/grantCoupon', params);

// 查询品类
export const queryCategoriesByParentId = (params) => http.get('/category/queryDisplayCategoriesWithIconByParentId', params);

/**
 * 直营店下单模块
 */
// 查询直营店
export const queryDirectStores = (params) => http.get('/directStore/getAllStores', params);
// 根据门店信息新增商品（值清单）
export const queryProductByStore = (params) => http.get('/directStore/getItemsInfo', params);
// 根据门店id查询直营店下单数据
export const queryDirectInfo = (params) => http.get('/directStore/getDirectInfo', params);
// 获取单个商品详情
export const queryGoodsInfo = params => http.get('/directStore/getItemInfo', params);
// 修改单个商品的信息
export const updateGoodsInfo = params => http.post('/directStore/updateItem', params);
// 直营店下单提交商品
export const insertDirectOrder = params => http.post('/directStore/directCommitOrder', params);
