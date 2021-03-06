/**
 * @file ActionType.js
 * @author denglingbo
 *
 * RECEIVE_* 代表 get 请求
 * REQUEST_* 代表 post 请求
 * PUB_* 代表非 Ajax 的页面可共用
 */

export default {
    // 用户信息
    RECEIVE_USER: 'RECEIVE_USER',
    // 用户权限
    RECEIVE_RIGHTS: 'RECEIVE_RIGHTS',

    // 导航状态
    PUB_COLLAPSED: 'PUB_COLLAPSED',

    // 获取省市县
    PUB_GET_REGION: 'PUB_GET_REGION',

    /**
     * Others Type
     */
    RECEIVE_BOOK_LIST: 'RECEIVE_BOOK_LIST',
    RECEIVE_BOOK_DETAIL: 'RECEIVE_BOOK_DETAIL',
    SET_BOOK_DETAIL_SHOW: 'SET_BOOK_DETAIL_SHOW',
    SET_BOOK_DETAIL_HIDE: 'SET_BOOK_DETAIL_HIDE',
    RECEIVE_TOPIC: 'RECEIVE_TOPIC',
    REQUEST_TOPIC_CREATE: 'REQUEST_TOPIC_CREATE',
    RECEIVE_SUPPLIER_LIST: 'RECEIVE_SUPPLIER_LIST',
    MODIFY_INFORMATION_VISIBLE: 'MODIFY_INFORMATION_VISIBLE',
    RECEIVE_AREA_LIST: 'RECEIVE_AREA_LIST',
    RECEIVE_APPLICATION_LIST: 'RECEIVE_APPLICATION_LIST',
    MODIFY_SUPPLIER_FROZEN: 'MODIFY_SUPPLIER_FROZEN',
    MODIFY_AUDIT_VISIBLE: 'MODIFY_AUDIT_VISIBLE',
    MODIFY_ADR_AUDIT_VISIBLE: 'MODIFY_ADR_AUDIT_VISIBLE',
    MODIFY_CHECK_REASON_VISIBLE: 'MODIFY_CHECK_REASON_VISIBLE',
    RECEIVE_PARAMETER_LIST: 'RECEIVE_PARAMETER_LIST',
    MODIFY_AREA_VISIBLE: 'MODIFY_AREA_VISIBLE',
    RECEIVE_GOODS_LIST: 'RECEIVE_GOODS_LIST',
    RECEIVE_SHOW_DATA: 'RECEIVE_SHOW_DATA',

    // 商品分类列表
    RECEIVE_CLASSIFIED_LIST: 'RECEIVE_CLASSIFIED_LIST',
    RECEIVE_GET_SELL_PRICE: 'RECEIVE_GET_SELL_PRICE',
    // 商品分类修改状态
    MODIFY_CLASSIFIED_STATUS: 'MODIFY_CLASSIFIED_STATUS',

    RECEIVE_SELF_PRODUCT_LIST: 'RECEIVE_SELF_PRODUCT_LIST',
    MODIFY_SUPPLIER_COLLABORATION: 'MODIFY_SUPPLIER_COLLABORATION',
    RECEIVE_CHANGE_COOPERATION_INFO: 'RECEIVE_CHANGE_COOPERATION_INFO',
    RECEIVE_EDIT_APPLY_LIST: 'RECEIVE_EDIT_APPLY_LIST',
    RECEIVE_SALE_REGIONS_DETAIL: 'RECEIVE_SALE_REGIONS_DETAIL',
    // 销售价格信息
    RECEIVE_FIND_PRICE_INFO: 'RECEIVE_FIND_PRICE_INFO',
    // 新增销售价格
    REQUEST_ADD_SELL_PRICE: 'REQUEST_ADD_SELL_PRICE',
    RECEIVE_UPDATE_SELL_PRICE: 'RECEIVE_UPDATE_SELL_PRICE',
    PRODUCT_TO_ADD_SELL_PRICE: 'PRODUCT_TO_ADD_SELL_PRICE',
    RECEIVE_TO_ADD_SELL_PRICE: 'RECEIVE_TO_ADD_SELL_PRICE',
    RECEIVE_COMMODITY_DETAIL: 'RECEIVE_COMMODITY_DETAIL',
    RECEIVE_UPDATE_OFFSHELF_PRODUCTS: 'RECEIVE_UPDATE_OFFSHELF_PRODUCTS',
    PRODUCT_UPDATE_OFFSHELF: 'PRODUCT_UPDATE_OFFSHELF',
    // 查询成本价
    GET_COST_PRICE: 'GET_COST_PRICE',
    CLEAR_COST_PRICE: 'CLEAR_COST_PRICE',
    // 获取区域组列表
    RECEIVE_AREA_GROUP: 'RECEIVE_AREA_GROUP',
    CLEAR_AREA_GROUP: 'CLEAR_AREA_GROUP',
    // 新增区域组
    CREATE_AREA_GROUP: 'CREATE_AREA_GROUP',
    // 区域组是否已存在
    IS_AREA_GROUP_EXISTS: 'IS_AREA_GROUP_EXISTS',
    // 删除区域组
    DELETE_AREA_GROUP: 'DELETE_AREA_GROUP',
    // 获取已分组门店列表
    GET_GROUPED_STORES: 'GET_GROUPED_STORES',
    // 清除已分组门店列表
    CLEAR_GROUPED_STORES: 'CLEAR_GROUPED_STORES',
    // 获取未分组门店列表
    GET_FREE_STORES: 'GET_FREE_STORES',
    // 添加未分组门店到指定区域组
    INSERT_STORE_TO_GROUP: 'INSERT_STORE_TO_GROUP',
    // 添加所有未分组门店到指定区域组
    INSERT_ALL_STORE_TO_GROUP: 'INSERT_ALL_STORE_TO_GROUP',
    // 添加所有未分组门店到指定区域组
    DELETE_ALL_STORE_FROM_GROUP: 'DELETE_ALL_STORE_FROM_GROUP',
    // 从指定区域组删除未分组门店
    DELETE_STORE_FROM_AREA: 'DELETE_STORE_FROM_AREA',
    // 清除未分组门店列表
    CLEAR_FREE_STORES: 'CLEAR_FREE_STORES',
    // 跳转到修改销售价格页面
    RECEIVE_TO_UPDATE_SELL_PRICE: 'RECEIVE_TO_UPDATE_SELL_PRICE',
    // 修改销售价格
    REQUEST_UPDATE_SELL_PRICE: ' REQUEST_UPDATE_SELL_PRICEE',
    // 修改采购价格
    REQUEST_UPDATE_PURCHASE_PRICE: 'REQUEST_UPDATE_PURCHASE_PRICE',
    // 查询阶梯价格信息
    RECEIVE_GET_PURCHASE_PRICE_EXT_BY_PRICE_ID: 'RECEIVE_GET_PURCHASE_PRICE_EXT_BY_PRICE_ID',
    RECEIVE_INSERT_SETTLEMENT_INFO: 'RECEIVE_INSERT_SETTLEMENT_INFO',
    // 删除采购价格deletePurchasePriceById
    REQUEST_DELETE_PURCHASE_PRICE_BY_ID: 'REQUEST_DELETE_PURCHASE_PRICE_BY_ID',
    // 查询供应商
    RECEIVE_QUERY_ALL_SUPPLIER: 'RECEIVE_QUERY_ALL_SUPPLIER',
    ADD_SUPPLIER_MESSAGE: 'ADD_SUPPLIER_MESSAGE',
    ADD_SUPPLIER_BASIC_MESSAGE: 'ADD_SUPPLIER_BASIC_MESSAGE',
    FIND_AUTH_FAILED_REASON: 'FIND_AUTH_FAILED_REASON',

    // 采购价格管理
    RECEIVE_GET_PURCHASE_PRICE_DETAIL: 'RECEIVE_GET_PURCHASE_PRICE_DETAIL',
    REQUEST_ADD_PURCHASEMENT_PRICE: 'REQUEST_ADD_PURCHASEMENT_PRICE',
    RECEIVE_SUPPLIER_DETAIL: 'RECEIVE_SUPPLIER_DETAIL',
    RECEIVE_SUPPLIER_PLACE_DETAIL: 'RECEIVE_SUPPLIER_PLACE_DETAIL',
    RECEIVE_All_CATEGORYS: 'RECEIVE_All_CATEGORYS',
    RECEIVE_NEXT_CATEGORYS: 'RECEIVE_NEXT_CATEGORYS',
    RECEIVE_CATEGORYS_BY_ID: 'RECEIVE_CATEGORYS_BY_ID',
    PRODUCT_ADD_PURCHASEMENT_PRICE: 'PRODUCT_ADD_PURCHASEMENT_PRICE',
    RECEIVE_AVAILAB_PRODUCTS: 'RECEIVE_AVAILAB_PRODUCTS',

    // 修改密码
    MODIFY_PASSWORD: 'MODIFY_PASSWORD',

    // 删除采购价格
    PRODUCT_DELETE_PURCHASE_PRICE_BY_ID: 'PRODUCT_DELETE_PURCHASE_PRICE_BY_ID',
    // 数据字典相关配置
    RECEIVE_DICTIONARY_LIST: 'RECEIVE_DICTIONARY_LIST',
    RECEIVE_DICTIONARY_CONTENTLIST: 'RECEIVE_DICTIONARY_CONTENTLIST',
    // 新增数据字典
    REQUEST_INSERT_DICTIONARY: 'REQUEST_INSERT_DICTIONARY',
    // 新增修改字典弹窗
    MODIFY_DICTIONARY_VISIBLE: ' MODIFY_DICTIONARY_VISIBLE',
    // 维护字典内容弹窗
    MAINTENANCE_DICTIONARY_VISIBLE: 'MAINTENANCE_DICTIONARY_VISIBLE',
    // 修改字典内容或设置状态
    REQUEST_UPDATE_CONTENT: 'REQUEST_UPDATE_CONTENT',
    // 系统配置
    // 分类列表页商品排序管理
    RECEIVE_GET_CATEGORYS: 'RECEIVE_GET_CATEGORYS',
    // 根据条件分页查询白名单列表
    QUERY_WHITE_LIST: 'QUERY_WHITE_LIST',
    // 白名单上线
    ONLINE_WHITE_LIST: 'ONLINE_WHITE_LIST',
    // 白名单下线
    OFFLINE_WHITE_LIST: 'OFFLINE_WHITE_LIST',
    // 修改分类商品排序号
    UPDATE_CATEGORY: 'UPDATE_CATEGORY',
    // 新增分类商品排序
    PRODUCT_TO_ADD_CATEGORY: 'PRODUCT_TO_ADD_CATEGORY',
    // 通过商品编号获取商品名称
    QUERY_GOODS_NAME: 'QUERY_GOODS_NAME',
    // 弹框显示
    MODIFY_CATEGORY_VISIBLE: 'MODIFY_CATEGORY_VISIBLE',
    // 删除
    MODIFY_DELETE_ORDER_NUM: 'MODIFY_DELETE_ORDER_NUM',

    // 静态页管理
    // 静态页面列表查询
    RECEIVE_GET_MEDIA_MANAGEMENT: 'RECEIVE_GET_MEDIA_MANAGEMENT',
    // 新增静态页
    PRODUCT_TO_ADD_MANAGEMENT: 'PRODUCT_TO_ADD_MANAGEMENT',
    // 弹框显示
    MODIFY_MEDIAADD_VISIBLE: 'MODIFY_MEDIAADD_VISIBLE',
    // 修改静态页面基本信息
    UPDATE_STATIC_PAGESBASE: 'UPDATE_STATIC_PAGESBASE',
    // 页面编辑
    RECEIVE_GET_MEDIA_EDITOR: 'RECEIVE_GET_MEDIA_EDITOR',
    // 修改静态页面编辑内容并上传到图片服务器
    UPDATE_EDITOR_CONTENT: 'UPDATE_EDITOR_CONTENT',

    // wap 端配置相关type
    FETCH_CAROUSEL_AD_LIST: 'FETCH_CAROUSEL_AD_LIST',
    FETCH_NAVIGATION_LIST: 'FETCH_NAVIGATION_LIST',
    FETCH_AREA_LIST: 'FETCH_AREA_LIST',
    SHOW_QUICK_MODAL: 'SHOW_QUICK_MODAL',
    FETCH_ALL_HOT: 'FETCH_ALL_HOT', // cyx
    FETCH_SAVE_INPUT: 'FETCH_SAVE_INPUT', // cyx
    FETCH_INPUT_KEYWORD: 'FETCH_INPUT_KEYWORD', // cyx
    MODIFY_MODAL_VISIBLE: 'MODIFY_MODAL_VISIBLE', // cyx
    DELETE_BY_ID: 'DELETE_BY_ID', // cyx
    FETCH_SAVE_MESSAGE: 'FETCH_SAVE_MESSAGE', // cyx
    ADD_SAVE_HOT: 'ADD_SAVE_HOT', // cyx
    UPDATE_HOT: 'UPDATE_HOT', // cyx
    FETCH_CATEGORY_ID: 'FETCH_CATEGORY_ID', // cyx
    FETCH_ALL_AD_PLAN_LIST: 'FETCH_ALL_AD_PLAN_LIST', // cyx
    FETCH_CAROUSEL_INTERVAL: 'FETCH_CAROUSEL_INTERVAL', // cyx
    SWITCH_OPTION_WAY_HOME: 'SWITCH_OPTION_WAY_HOME',
    BRANCH_COMPANY_INFO: 'BRANCH_COMPANY_INFO',
    FETCH_CAROUSEL_AREA: 'FETCH_CAROUSEL_AREA',
    FETCH_SWITCH_OPT_WAYOF_CAROUSEL: 'FETCH_SWITCH_OPT_WAYOF_CAROUSEL',
    CLEAR_AD_LIST: 'CLEAR_AD_LIST',
    CLEAR_HOME_PAGE: 'CLEAR_HOME_PAGE',

    /* ********************procurement************************* */
    // 查询采购单管理列表
    RECEIVE_PO_MNG_INFO: 'RECEIVE_PO_MNG_INFO',
    // 更新采购单选中行
    CHANGE_PO_MNG_SELECTED_ROWS: 'CHANGE_PO_MNG_SELECTED_ROWS',
    // 查询采购单详情
    RECEIVE_PO_DETAIL: 'RECEIVE_PO_DETAIL',
    // 初始采购单详情
    INIT_PO_DETAIL: 'INIT_PO_DETAIL',
    // 删除采购单
    DELETE_PO_BY_IDS: 'DELETE_PO_BY_IDS',
    // 查询采购单打印列表
    RECEIVE_PO_PRINT_LIST: 'RECEIVE_PO_PRINT_LIST',
    // 更新采购单基本信息
    UPDATE_PO_BASICINFO: 'UPDATE_PO_BASICINFO',
    // 添加采购单商品
    ADD_PO_LINES: 'ADD_PO_LINES',
    // 删除采购单商品
    DELETE_PO_LINE: 'DELETE_PO_LINE',
    // 更新采购单商品
    UPDATE_PO_LINE: 'UPDATE_PO_LINE',
    // 查询直营店信息
    FETCH_DIRECT_INFO: 'FETCH_DIRECT_INFO',
    // 清空直营店信息
    CLEAR_DIRECT_INFO: 'CLEAR_DIRECT_INFO',
    // 查询单个商品详情
    FETCH_GOODS_INFO: 'FETCH_GOODS_INFO',
    // 修改单个商品的信息
    UPDATE_GOODS_INFO: 'UPDATE_GOODS_INFO',
    // 待办事项下审批列表
    QUERY_PROCESS_MSG_LIST: 'QUERY_PROCESS_MSG_LIST',
    // 待办事项下价格变更记录列表
    QUERY_PRICE_CHANGE_LIST: 'QUERY_PRICE_CHANGE_LIST',
    // 提交直营店下单
    INSERT_DIRECT_ORDER: 'INSERT_DIRECT_ORDER',
    // 批量校验库存
    VALIDATE_DIRECT_ORDER: 'VALIDATE_DIRECT_ORDER',
    // 批量导入商品
    BATCH_IMPORT_GOODS: 'BATCH_IMPORT_GOODS',

    /** 值清单获取action，请根据实际情况拆分到单独action文件 Begin */
    // 仓库值清单
    GET_WAREHOUSE_ADDRESS_MAP: 'GET_WAREHOUSE_ADDRESS_MAP',
    // 门店值清单
    GET_SHOP_ADDRESS_MAP: 'GET_SHOP_ADDRESS_MAP',
    // 供应商值清单
    GET_SUPPLIER_MAP: 'GET_SUPPLIER_MAP',
    // 供应商地点值清单
    GET_SUPPLIER_LOC_MAP: 'GET_SUPPLIER_LOC_MAP',
    // 品牌值清单
    QUERY_PUR_ORDER_BRANDS: 'QUERY_PUR_ORDER_BRANDS',
    // 大类值清单
    GET_BIG_CLASS_MAP: 'GET_BIG_CLASS_MAP',
    /** 值清单获取action，请根据实际情况拆分到单独action文件 end */

    // 以下和采购收货相关
    // 查询采购收货单管理列表
    RECEIVE_PO_RCV_MNG_LIST: 'RECEIVE_PO_RCV_MNG_LIST',
    // 查询采购单收货列表
    RECEIVE_PO_RCV_LIST: 'RECEIVE_PO_RCV_LIST',
    // 查询收获单详情
    RECEIVE_PO_RCV_DETAIL: 'RECEIVE_PO_RCV_DETAIL',
    // 采购单初始信息
    RECEIVE_PO_RCV_INIT: 'RECEIVE_PO_RCV_INIT',
    // 采购退货单详情
    RETURN_PO_RCV_INIT: 'RETURN_PO_RCV_INIT',
    // 更新采购收货单基本信息
    UPDATE_PO_RCV_BASICINFO: 'UPDATE_PO_RCV_BASICINFO',
    // 更新采购收货单商品
    UPDATE_PO_RCV_LINE: 'UPDATE_PO_RCV_LINE',
    // 清空详情数据
    REMOVE_DETAIL_DATA: 'REMOVE_DETAIL_DATA',

    // IBM 修改
    GET_PRODUCT_BY_ID: 'GET_PRODUCT_BY_ID',
    CHECK_MAIN_SUPPLIER: 'CHECK_MAIN_SUPPLIER',
    GET_PRODPURCHASE_BYID: 'GET_PRODPURCHASE_BYID',
    QUERY_PRODPURCHASE_BYID: 'QUERY_PRODPURCHASE_BYID',
    CHANGE_SUPPLIER_TYPE: 'CHANGE_SUPPLIER_TYPE',
    RECEIVE_SUPPLIER_MANAGE_LIST: 'RECEIVE_SUPPLIER_MANAGE_LIST',
    RECEIVE_LARGER_REGIN: 'RECEIVE_LARGER_REGIN',
    RECEIVE_SUPPLIER_NO: 'RECEIVE_SUPPLIER_NO',
    QUERY_PRODBY_CONDITION: 'QUERY_PRODBY_CONDITION',
    QUERY_SETTLED_LIST: 'QUERY_SETTLED_LIST',
    DELETE_PROD_PRUCHASE_BYID: 'DELETE_PROD_PRUCHASE_BYID',
    SETTLED_AUDIT: 'SETTLED_AUDIT',
    MODIFY_CHECK_REASON_ADR_VISIBLE: 'MODIFY_CHECK_REASON_ADR_VISIBLE',
    UPDATE_PROD_PURCHASE_BYID: 'UPDATE_PROD_PURCHASE_BYID',
    UPDATE_PROD_PURCHASE_BY_ID: 'UPDATE_PROD_PURCHASE_BY_ID',
    CHANGE_PROPURCHASE_STATUS: 'CHANGE_PROPURCHASE_STATUS',
    GET_WARE_HOUSE_LOGIC_INFO: 'GET_WARE_HOUSE_LOGIC_INFO',

    // 库存调整
    STOCK_ADJUST_LIST: 'STOCK_ADJUST_LIST',
    STOCK_ADJUST_LIST_CB_DETAIL: 'STOCK_ADJUST_LIST_CB_DETAIL',
    QUERY_MANAGE_LIST: 'QUERY_MANAGE_LIST',
    EDIT_BEFORE_AFTER: 'EDIT_BEFORE_AFTER',
    GET_PRODUCT_BYID: 'GET_PRODUCT_BYID',

    // 实时库存查询
    RECEIVE_STOREREALTIME_LIST: 'RECEIVE_STOREREALTIME_LIST',
    CLEAR_STOREREALTIME_LIST: 'CLEAR_STOREREALTIME_LIST',

    // 商品管理列表
    // 根据条件分页查询商品清单，并排序
    QUERY_COMMODITY_DETAILED_LIST: 'QUERY_COMMODITY_DETAILED_LIST',
    SYNC_PRODUCT_BY_MANUAL: 'SYNC_PRODUCT_BY_MANUAL',
    RECEIVE_WARE_HOUSE: 'RECEIVE_WARE_HOUSE',
    RECEIVE_WARE_HOUSE_INFO: 'RECEIVE_WARE_HOUSE_INFO',
    RECEIVE_INSERT_SUPPLIER_INFO: 'RECEIVE_INSERT_SUPPLIER_INFO',
    RECEIVE_DELETE_WARE_HOUSE_INFO: 'RECEIVE_DELETE_WARE_HOUSE_INFO',
    RECEIVE_INSERT_SUPPLIER_ADDRESS: 'RECEIVE_INSERT_SUPPLIER_ADDRESS',
    RECEIVE_PLACE_REGION: 'RECEIVE_PLACE_REGION',
    RECEIVE_PRICE_INFO: 'RECEIVE_PRICE_INFO',
    RECEIVE_ADD_PRICE: 'RECEIVE_ADD_PRICE',
    RECEIVE_UPDATE_PRICE: 'RECEIVE_UPDATE_PRICE',
    // 商品管理-售价导入列表
    RECEIVE_PRICE_IMPORT_LIST: 'RECEIVE_PRICE_IMPORT_LIST',
    // 创建变价单
    RECEIVE_PRICE_IMPORT_CREATE_SELL: 'RECEIVE_PRICE_IMPORT_CREATE_SELL',
    // 采购进价-查询采购进价列表
    QUERY_PURCHASE_PRICE_INFO: 'QUERY_PURCHASE_PRICE_INFO',
    // 采购进价-创建变更单
    CREATE_PURCHASE: 'CREATE_PURCHASE',
    // 采购进价-验证创建变更单按钮是否可用
    IS_PURCHASE_VAILD: 'IS_PURCHASE_VAILD',
    // 订单管理
    ADD_PROD_PURCHASE: 'ADD_PROD_PURCHASE',
    RECEIVE_VALUES_LIST: 'RECEIVE_VALUES_LIST',
    QUERY_PRODPUR_CHASE_EXT: 'QUERY_PRODPUR_CHASE_EXT',
    UPDATE_PROD_PURCHASE: 'UPDATE_PROD_PURCHASE',
    CHANGE_PROPUR_CHASE_STATUS: 'CHANGE_PROPUR_CHASE_STATUS',
    SPLIT_ORDER_BY_INVENTORY: 'SPLIT_ORDER_BY_INVENTORY',
    INTER_FACE_INVENTORY: 'INTER_FACE_INVENTORY',

    // 订单管理
    MODIFY_DISTRIBUTION_COLUMNS: 'MODIFY_DISTRIBUTION_COLUMNS',
    MODIFY_CAUSE_MODAL_VISIBLE: 'MODIFY_CAUSE_MODAL_VISIBLE',
    MODIFY_PAY_MODAL_VISIBLE: 'MODIFY_PAY_MODAL_VISIBLE',
    FETCH_ORDER_LIST: 'FETCH_ORDER_LIST',
    FETCH_ORDER_DETAIL: 'FETCH_ORDER_DETAIL',
    BACKSTAGE_ORDER_BACK: 'BACKSTAGE_ORDER_BACK',
    CLEAR_ORDER_DETAIL: 'CLEAR_ORDER_DETAIL',
    FETCH_PAYMENT_DETAIL: 'FETCH_PAYMENT_DETAIL',
    FETCH_SHIPPING_DETAIL: 'FETCH_SHIPPING_DETAIL',
    CONFIRMATION_ACTION: 'CONFIRMATION_ACTION',
    CLEAR_RETURN_LISTS: 'CLEAR_RETURN_LISTS',

    // 数据字典
    REQUEST_INSERT_DICTIONARY_CONTENT: 'REQUEST_INSERT_DICTIONARY_CONTENT',
    // 采购订单
    RECEIVE_NEW_PURCHASE_ORDER: 'RECEIVE_NEW_PURCHASE_ORDER',
    // 重新推送采购收货单
    REPUSH_PURCHASE_RECEIPT: 'REPUSH_PURCHASE_RECEIPT',
    // 退货列表
    RECEIVE_RETURN_MNG_LIST: 'RECEIVE_RETURN_MNG_LIST',
    // 查询待办事项下退货审批列表
    QUERY_AUDIT_PURCHASE_LIST: 'QUERY_AUDIT_PURCHASE_LIST',
    // 查看退货单审批意见
    QUERY_APPROVAL_INFO: 'QUERY_APPROVAL_INFO',
    // 查询退货单审批流程
    QUERY_PRO_DEFINITIONS: 'QUERY_PRO_DEFINITIONS',
    // 退货单审批
    APPROVE_REFUND: 'APPROVE_REFUND',
    // 取消退货单审
    CANCEL_REFUND: 'CANCEL_REFUND',
    // 查询退货流水号
    GET_REFUND_NO_ACTION: 'GET_REFUND_NO_ACTION',
    // 清除退货流水号
    CLEAR_REFUND_NO_INFO: 'CLEAR_REFUND_NO_INFO',
    // 清除新建编辑采购退货单数据
    CLEAR_RETURN_INFO: 'CLEAR_RETURN_INFO',
    // 批量删除处于草稿状态的退货单
    DELETE_BATCH_REFOND_ORDER: 'DELETE_BATCH_REFOND_ORDER',

    // 库存调整列表
    RECEIVE_STORE_ADJUST_LIST: 'RECEIVE_STORE_ADJUST_LIST',

    // 促销活动
    FETCH_PROMOTION_LIST: 'FETCH_PROMOTION_LIST',
    CLEAR_PROMOTION_LIST: 'CLEAR_PROMOTION_LIST',
    FETCH_COUPONS_LIST: 'FETCH_COUPONS_LIST',
    FETCHA_ALIVE_COUPONS_LIST: 'FETCHA_ALIVE_COUPONS_LIST',
    CLEAR_COUPONS_LIST: 'CLEAR_COUPONS_LIST',
    FETCH_PROMOTION_PATICIPATE_LIST: 'FETCH_PROMOTION_PATICIPATE_LIST',
    CLEAR_PROMOTION_PATICIPATE_LIST: 'CLEAR_PROMOTION_PATICIPATE_LIST',
    FETCH_USED_COUPON_PATICIPATE_LIST: 'FETCH_USED_COUPON_PATICIPATE_LIST',
    CLEAR_USED_COUPON_PATICIPATE_LIST: 'CLEAR_USED_COUPON_PATICIPATE_LIST',
    FETCH_UN_USED_COUPON_PATICIPATE_LIST: 'FETCH_UN_USED_COUPON_PATICIPATE_LIST',
    CLEAR_UN_USED_COUPON_PATICIPATE_LIST: 'CLEAR_UN_USED_COUPON_PATICIPATE_LIST',
    FETCH_GARBAGE_COUPON_PATICIPATE_LIST: 'FETCH_GARBAGE_COUPON_PATICIPATE_LIST',
    CLEAR_GARBAGE_COUPON_PATICIPATE_LIST: 'CLEAR_GARBAGE_COUPON_PATICIPATE_LIST',
    CREATE_PROMOTION: 'CREATE_PROMOTION',
    CREATE_COUPONS: 'CREATE_COUPONS',
    FETCH_PROMOTION_DETAIL: 'FETCH_PROMOTION_DETAIL',
    FETCH_COUPONS_DETAIL: 'FETCH_COUPONS_DETAIL',
    CLEAR_COUPONS_DETAIL: 'CLEAR_COUPONS_DETAIL',
    CLEAR_PROMOTION_DETAIL: 'CLEAR_PROMOTION_DETAIL',
    UPDATE_PROMOTION_STATUS: 'UPDATE_PROMOTION_STATUS',
    UPDATE_COUPROMOTION_STATUS: 'UPDATE_COUPROMOTION_STATUS',
    CANCEL_COUPONS: 'CANCEL_COUPONS',
    FETCH_GRANT_FRANCHISEE: 'FETCH_GRANT_FRANCHISEE',
    FETCH_FRANCHISEE_LIST: 'FETCH_FRANCHISEE_LIST',
    CLEAR_FRANCHISEE_LIST: 'CLEAR_FRANCHISEE_LIST',
    GRANT_COUPON: 'GRANT_COUPON',
    UPDATE_STORE_ID: 'UPDATE_STORE_ID',

    // 获取所有子公司列表
    FIND_ALL_COMPANIES: 'FIND_ALL_COMPANIES',
    CLEAR_ALL_COMPANIES: 'CLEAR_ALL_COMPANIES',
    // 商品值清单
    QUERY_PUR_ORDER_PRO_ACTION: 'QUERY_PUR_ORDER_PRO_ACTION',

    // 根据 parentId 查询品类
    FETCH_CATEGORY_BY_PARENT: 'FETCH_CATEGORY_BY_PARENT',
    CLEAR_CATEGORIES: 'CLEAR_CATEGORIES',
    // 预定专区
    QUERY_RESERVE_LIST: 'QUERY_RESERVE_LIST',
    CLEAR_RESERVE_LIST: 'CLEAR_RESERVE_LIST',
    COMLETE_OR_CLOSE_WISH: 'COMLETE_OR_CLOSE_WISH',
    QUERY_RESERVE_DETAIL: 'QUERY_RESERVE_DETAIL',
    CLEAR_RESERVE_DETAIL: 'CLEAR_RESERVE_DETAIL',
    // 获取流程数据
    FETCH_PROCESS_DATA: 'FETCH_PROCESS_DATA',
    CLEAR_PROCESS_DATA: 'CLEAR_PROCESS_DATA',
    DELECT_PROCESS_DATA: 'DELECT_PROCESS_DATA',
    // 获取流程图数据
    FETCH_CHART_DATA: 'FETCH_CHART_DATA',
    CLEAR_CHART_DATA: 'CLEAR_CHART_DATA',
    // 获取高亮流程图数据
    FETCH_HIGH_CHART_DATA: 'FETCH_HIGH_CHART_DATA',
    CLEAR_HIGH_CHART_DATA: 'CLEAR_HIGH_CHART_DATA',
    // 业务中获取高亮流程图数据
    PROCESS_IMAGE_BY_BUSI: 'PROCESS_IMAGE_BY_BUSI',
    CLEAR_PROCESS_IMAGE_BUSI: 'CLEAR_PROCESS_IMAGE_BUSI',
    // 业务中获取审批详情
    QUERY_COMMENT_HIS_BUSI: 'QUERY_COMMENT_HIS_BUSI',
    // 销售管理
    RECEIVE_RETURN_GOODS_LIST: 'RECEIVE_RETURN_GOODS_LIST',
    RETURN_GOODS_DETAIL: 'RETURN_GOODS_DETAIL',
    RETURN_GOODS_DETAIL_CLEAR_DATA: 'RETURN_GOODS_DETAIL_CLEAR_DATA',
    RETURN_GOODS_LIST_FORM_DATA: 'RETURN_GOODS_LIST_FORM_DATA',
    GET_RETURN_GOODS_OPERATION: 'GET_RETURN_GOODS_OPERATION',
    RETURN_GOODS_DETAIL_SAVE: 'RETURN_GOODS_DETAIL_SAVE',
    RETURN_DESCRIPTION_SAVE: 'RETURN_DESCRIPTION_SAVE',
    // 根据采购单号、逻辑仓编号、商品code、品牌id添加退货商品
    ADD_REFUND_PRODUCTS: 'ADD_REFUND_PRODUCTS',
    RECEIVE_EXCHANGE_GOODS_LIST: 'RECEIVE_EXCHANGE_GOODS_LIST',
    // 待办事项 商品审批意见列表
    QUERY_COMMENT_HIS: 'QUERY_COMMENT_HIS',
    // 待办事项 审批代办任务
    RETURN_AUDIT_INFO: 'RETURN_AUDIT_INFO',
    // 商品地点管理模块
    // 商品地点关系列表
    RECEIVE_SITES_MANAGE_LIST: 'RECEIVE_SITES_MANAGE_LIST',
    DELETE_SITEMANAGES: 'DELETE_SITEMANAGES',
    DELETE_SITEMANAGES_BY_IDS: 'DELETE_SITEMANAGES_BY_IDS',
    EDIT_SITE_MANAGE_BY_ID: 'EDIT_SITE_MANAGE_BY_ID',
    QUERY_PRODUCTS_BY_CONDITION: 'QUERY_PRODUCTS_BY_CONDITION',
    CREATE_PRODUCT_SITE_RELATIONS: 'CREATE_PRODUCT_SITE_RELATIONS',
    QUERY_PRODUCT_SITE_RELATION_BY_ID: 'QUERY_PRODUCT_SITE_RELATION_BY_ID',
    RECEIVE_ADD_RELATION_PARAMS: 'RECEIVE_ADD_RELATION_PARAMS',
    EXPORT_REPEATED_PROD_ADD: 'EXPORT_REPEATED_PROD_ADD',
    PAGE_REPEAT_SITE_RELATIONS: 'PAGE_REPEAT_SITE_RELATIONS'
}
