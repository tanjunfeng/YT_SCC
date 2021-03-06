// 下单打折活动状态
export const promotionStatus = {
    all: '全部',
    released: '已发布',
    unreleased: '未发布',
    closed: '已关闭',
    ended: '已结束'
};

// 下单打折 - 参与数据
export const participate = {
    // 订单状态
    orderState: {
        ALL: '全部',
        W: '待审核',
        M: '待人工审核',
        A: '已审核',
        Q: '已取消',
        C: '已完成'
    },
    // 支付状态
    paymentState: {
        ALL: '全部',
        WZF: '未支付',
        YZF: '已支付',
        TKD: '退款待审核',
        TKQ: '退款待确认',
        YTK: '已退款',
        QXFK: '取消付款',
        GSN: '公司内'
    },
    // 收货状态
    shippingState: {
        ALL: '全部',
        DCL: '待处理',
        WCS: '未传送',
        DCK: '待出库',
        DSH: '代收货',
        YQS: '已签收',
        WSD: '未送达',
        QX: '取消送货',
        CGWDH: '采购未到货'
    }
};

export const overlayOptions = [
    {
        label: '优惠劵叠加',
        value: 1
    },
    {
        label: '会员等级叠加',
        value: 2
    }
];

// 优惠种类
export const promotionRuleStatus = {
    PURCHASECONDITION: '购买条件',
    REWARDLIST: '奖励列表',
    TOTALPUCHASELIST: '整个购买列表',
    EACHCONDITIONGIVEONCE: '每满'
}

// 购买类型
export const purchageTypeStatus = {
    ALL: '全部', CATEGORY: '按品类', PRODUCT: '按商品'
}

// 条件类型
export const conditionTypeStatus = {
    QUANTITY: '累计商品数量', AMOUNT: '累计商品金额'
}

// 优惠方式
export const preferentialWayStatus = {
    PERCENTAGE: '折扣百分比',
    DISCOUNTAMOUNT: '折扣金额',
    FIXEDPRICE: '固定单价',
    GIVESAMEPRODUCT: '赠送相同商品',
}
