/**
 * @file util.js
 * @author denglingbo
 *
 */

/**
 * 查询遍历所有的 key，用于全部展开
 * @param data
 * @param existKeys
 * @return {{all: Array, top: Array}}
 */
export const findKeys = (data, existKeys = []) => {
    const all = existKeys;
    const top = [];

    data.forEach(item => {
        if (item.children && item.children.length > 0 && item.key) {
            all.push(item.key);
            top.push(item.key);

            all.concat(findKeys(item.children, all));
        }
    });

    return {
        // 所有 key
        all,
        // 顶层第一级节点
        top,
    };
}
