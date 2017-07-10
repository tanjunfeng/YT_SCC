/**
 * @file licenseInfo.js
 * @author shijh
 *
 * 查询组织机构代码证修改前和修改后内容
 */

class ViewModel {
    getObject(oldValue, newValue, type) {
        return {
            type, 
            old: oldValue,
            new: newValue
        }
    }
    constructor(data) {
        this.Result = [];
        this.Result.push(this.getObject(data.id, data.newId, '织机构代码Id'));
        this.Result.push(this.getObject(data.oldOrgCode, data.newOrgCode, '组织机构代码'));
        this.Result.push(this.getObject(data.oldOrgCodeCerPic, data.newOrgCodeCerPic, '组织机构代码证电子版'));
    }

    toJson() {
        return this.Result;
    }
}

export default (data) => new ViewModel(data).toJson();
