/**
 * @file classifiedList.js
 * @author denglingbo
 *
 * 商品分类列表数据模型
 */

class ViewModel {
    /**
     * 键值
     * @type {null}
     */
    key = null;

    /**
     * 父级 key
     * @type {null}
     */
    parentKey = null;

    /**
     * 用于展示的标题名
     * @type {string}
     */
    name = '';

    /**
     * 排序序号
     * @type {number}
     */
    sort = 0;

    /**
     * 子列表
     * @type {null | Array}
     */
    children = null;

    /**
     * 当前状态
     * @type {number} 0: 隐藏，1: 显示
     */
    stauts = 1;

    constructor(data) {
        this.key = data.id;
        // 过滤一次后端数据
        if (data.parentCategoryId !== '' && data.parentCategoryId != null) {
            this.parentKey = data.parentCategoryId;
        }
        this.name = data.categoryName;
        this.sort = data.sortOrder;
        this.children = data.childCategories;
        this.stauts = 1; // data.displayStatus;
    }

    toJSON() {
        return {
            key: this.key,
            parentKey: this.parentKey,
            name: this.name,
            sort: this.sort,
            status: this.stauts,
            ...(this.children && this.children.length > 0) && { children : this.children },
        }
    }
}

/**
 * 遍历处理数据
 * @param data
 */
const loop = data => data.map(d => {
    const model = new ViewModel(d).toJSON();

    if (model.children) {
        model.children = loop(model.children);
    }

    return model;
});

export default (data) => loop(data);
