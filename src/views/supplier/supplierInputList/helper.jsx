import { INFO_TYPE_TABLE as rawText } from './infoType';

/**
 * 取出审核对象
 *
 * @param {*审核对象} rawTextItem
 */
const getAuditItem = (rawTextItem) => {
    if (rawTextItem instanceof Object) {
        return {
            name: rawTextItem.text,
            type: rawTextItem.type,
            data: rawTextItem.data
        };
    }
    return { name: rawTextItem, type: 'string' };
};

/**
 * 是否找到有效修改项
 *
 * @param {*} changeArr
 */
const isExists = (changeArr) => {
    if (changeArr.length < 2) return false;
    return Object.keys(rawText[changeArr[0]]).indexOf(changeArr[1]) !== -1;
};

const get

/**
 * 获取供应商修改项目列表
 *
 * @param {*后端返回数据列表} list
 */
const getListOfChanges = (list) => {
    if (list.length === 0) return [];
    const res = [];
    list.forEach((change) => {
        const changeArr = change.categoryIndex.split('.');
        if (isExists(changeArr)) {
            const rawTextItem = rawText[changeArr[0]][changeArr[1]];
            const auditItem = getAuditItem(rawTextItem);
            const d = {
                key: change.categoryIndex,
                name: auditItem.name,
                before: change.before,
                after: change.after
            };
            res.push(d);
        }
    });
    return res;
};

/**
 * 根据回传数据取出审核对象参数
 *
 * @param {*回传数据列表} list
 */
const getAuditObject = (list) => {
    const audit = {};
    list.forEach((change) => {
        const changeArr = change.categoryIndex.split('.');
        if (changeArr[0] === 'supplierBasicInfo' && changeArr[1] === 'id') {
            audit.basicId = change.before;
        }
        if (changeArr[0] === 'supplierBankInfo' && changeArr[1] === 'id') {
            audit.bankId = change.before;
        }
        if (changeArr[0] === 'supplierOperTaxInfo' && changeArr[1] === 'id') {
            audit.operatTaxatId = change.before;
        }
        if (changeArr[0] === 'supplierlicenseInfo' && changeArr[1] === 'id') {
            audit.licenseId = change.before;
        }
    });
    return audit;
}

export { getListOfChanges, getAuditObject };
