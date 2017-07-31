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
    MODIFY_CHECK_REASON_VISIBLE: 'MODIFY_CHECK_REASON_VISIBLE',
    RECEIVE_PARAMETER_LIST: 'RECEIVE_PARAMETER_LIST',
    MODIFY_AREA_VISIBLE: 'MODIFY_AREA_VISIBLE',
    RECEIVE_GOODS_LIST: 'RECEIVE_GOODS_LIST',
    RECEIVE_SHOW_DATA: 'RECEIVE_SHOW_DATA',

    // 商品分类列表
    RECEIVE_CLASSIFIED_LIST: 'RECEIVE_CLASSIFIED_LIST',
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
    RECEIVE_All_CATEGORYS: 'RECEIVE_All_CATEGORYS',
    PRODUCT_ADD_PURCHASEMENT_PRICE: 'PRODUCT_ADD_PURCHASEMENT_PRICE',
    // 删除采购价格
    PRODUCT_DELETE_PURCHASE_PRICE_BY_ID: 'PRODUCT_DELETE_PURCHASE_PRICE_BY_ID',
    // 数据字典相关配置
    RECEIVE_DICTIONARY_LIST: 'RECEIVE_DICTIONARY_LIST',
    RECEIVE_DICTIONARY_CONTENTLIST: 'RECEIVE_DICTIONARY_CONTENTLIST',
    // 新增数据字典
    REQUEST_INSERT_DICTIONARY: 'REQUEST_INSERT_DICTIONARY',
    // 新增修改字典弹窗
    MODIFY_DICTIONARY_VISIBLE: ' MODIFY_DICTIONARY_VISIBLE',
    // 系统配置
    // 分类列表页商品排序管理
    RECEIVE_GET_CATEGORYS: 'RECEIVE_GET_CATEGORYS',
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

    /* ********************procurement************************* */
    RECEIVE_PO_MNG_LIST: 'RECEIVE_PO_MNG_LIST',
    CHANGE_PO_MNG_SELECTED_ROWS: 'CHANGE_PO_MNG_SELECTED_ROWS',
    RECEIVE_PO_MATERIAL_BY_CD: 'RECEIVE_PO_MATERIAL_BY_CD',
    DELETE_PO_BY_IDS: 'DELETE_PO_BY_IDS',
    RECEIVE_PO_PRINT_LIST: 'RECEIVE_PO_PRINT_LIST',

    // IBM 修改
    CHECK_MAIN_SUPPLIER: 'CHECK_MAIN_SUPPLIER',
    GET_PRODPURCHASE_BYID: 'GET_PRODPURCHASE_BYID',
    QUERY_PRODPURCHASE_BYID: 'QUERY_PRODPURCHASE_BYID',
    CHANGE_SUPPLIER_TYPE: 'CHANGE_SUPPLIER_TYPE',
    RECEIVE_SUPPLIER_MANAGE_LIST: 'RECEIVE_SUPPLIER_MANAGE_LIST',
    RECEIVE_LARGER_REGIN: 'RECEIVE_LARGER_REGIN',
    RECEIVE_SUPPLIER_NO: 'RECEIVE_SUPPLIER_NO',
    QUERY_PRODBY_CONDITION: 'QUERY_PRODBY_CONDITION',
    QUERY_SETTLED_LIST: 'QUERY_SETTLED_LIST',

    // 库存调整
    STOCK_ADJUST_LIST: 'STOCK_ADJUST_LIST',
    STOCK_ADJUST_LIST_DETAIL: 'STOCK_ADJUST_LIST_DETAIL',
    QUERY_MANAGE_LIST: 'QUERY_MANAGE_LIST',
    EDIT_BEFORE_AFTER: 'EDIT_BEFORE_AFTER',
    GET_PRODUCT_BYID: 'GET_PRODUCT_BYID',

    // 订单管理
    MODIFY_AUDIT_MODAL_VISIBLE: 'MODIFY_AUDIT_MODAL_VISIBLE',

    // 商品管理列表
    // 根据条件分页查询商品清单，并排序
    QUERY_COMMODITY_DETAILED_LIST: 'QUERY_COMMODITY_DETAILED_LIST',
    ADD_PROD_PURCHASE: 'ADD_PROD_PURCHASE',
    QUERY_PRODPUR_CHASE_EXT: 'QUERY_PRODPUR_CHASE_EXT',
    UPDATE_PROD_PURCHASE: 'UPDATE_PROD_PURCHASE'
}
