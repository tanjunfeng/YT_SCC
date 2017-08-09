/**
 * @file procurementDt.js
 * @author caoyx
 *
 * 采购单新增/修改/详情数据结构
 */
class ViewModel {
    /**
     * 采购单基本信息
     * @type {null}
     */
    basicInfo = {};

    /**
     * 采购单详情商品明细列表
     * @type {null}
     */
    poLines = [];

    constructor(data) {
        Object.assign(this.basicInfo, data);
        this.poLines = data.pmPurchaseOrderItems;
        // 自己创建一发 parentKey
    }

    toJson() {
        return {
            basicInfo: this.basicInfo,
            poLines: this.poLines,
        }
    }
}

export default (data) => new ViewModel(data).toJson();
