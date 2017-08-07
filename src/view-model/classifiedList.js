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
     * @type {number} 1: 隐藏，0: 显示
     */
    status = 1;

    constructor(data, pid) {
        this.key = data.categoryId;
        // 自己创建一发 parentKey
        this.parentKey = pid;
        this.name = data.name;
        // 如果 sort 为 0，则不进行排序，同时保持输入框值为空
        this.sort = data.sortOrder === 0 ? null : data.sortOrder;
        this.children = data.childCategories;

        const status = parseInt(data.displayStatus);
        this.status = isNaN(status) ? 1 : status;
    }

    toJSON() {
        return {
            key: this.key,
            parentKey: this.parentKey,
            name: this.name,
            sort: this.sort,
            status: this.status,
            ...(this.children && this.children.length > 0) && { children : this.children },
        }
    }
}

/**
 * 遍历处理数据
 * @param data
 * @param pid parentKey
 */
const loop = (data, pid = null) => data.map(d => {
    const model = new ViewModel(d, pid).toJSON();

    if (model.children) {
        model.children = loop(model.children, d.categoryId);
    }

    return model;
});

export default (data) => loop(data);
