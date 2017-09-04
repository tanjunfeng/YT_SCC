import moment from 'moment';
import { INFO_TYPE_TABLE as rawText } from './infoType';
import { DATE_FORMAT, TIME_FORMAT } from '../../../constant';

/**
 * 通过类别获取页面显示值
 *
 * @param {*数据类型，key值} params
 * @return {value}
 */
const getValue = ({ rawTextItem, code }) => {
    switch (rawTextItem.type) {
        case 'date':
            return code ? moment(new Date(code)).format(DATE_FORMAT) : '-';
        case 'time':
            return code ? moment(new Date(code)).format(TIME_FORMAT) : '-';
        case 'map':
            return rawTextItem.map[code] || '未知修改项';
        default:
            return '未知修改项';
    }
};

/**
 * 取出修改审核对象
 *
 * @param {*修改对象类别树} changeArr
 */
const getAuditItem = (changeArr, change) => {
    const rawTextItem = rawText[changeArr[0]][changeArr[1]];
    if (rawTextItem instanceof Object) {
        return {
            key: change.categoryIndex,
            name: rawTextItem.text,
            before: getValue({
                rawTextItem,
                code: change.before
            }),
            after: getValue({
                rawTextItem,
                code: change.after
            })
        }
    }
    return {
        key: change.categoryIndex,
        name: rawTextItem || '未知修改项',
        before: change.before || '-',
        after: change.after || '-'
    };
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
            res.push(getAuditItem(changeArr, change));
        }
    });
    return res;
};

/**
 * 根据回传数据取出审核对象参数
 *
 * @param {*回传数据列表} list
 */
const getSupplierAudit = (list) => {
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
};

/**
 * 根据回传数据取出审核地点对象参数
 *
 * @param {*回传数据列表} list
 */
const getSupplierAdressAudit = (list) => {
    const audit = {};
    list.forEach((change) => {
        const changeArr = change.categoryIndex.split('.');
        if (changeArr[0] === 'spAdrBasic' && changeArr[1] === 'id') {
            audit.adrBasicId = change.before;
        }
        if (changeArr[0] === 'spAdrContact' && changeArr[1] === 'id') {
            audit.contId = change.before;
        }
    });
    return audit;
};

export { getListOfChanges, getSupplierAudit, getSupplierAdressAudit };
