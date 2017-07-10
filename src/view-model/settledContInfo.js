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
        this.Result.push(this.getObject(data.id, data.newId, '入驻联系人表Id'));
        this.Result.push(this.getObject(data.oldName, data.newName, '联系人名字'));
        this.Result.push(this.getObject(data.oldPhone, data.newPhone, '联系人电话'));
        this.Result.push(this.getObject(data.oldEmail, data.newEmail, '邮箱地址'));
    }

    toJson() {
        return this.Result;
    }
}

export default (data) => new ViewModel(data).toJson();
