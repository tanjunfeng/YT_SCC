/**
 * @file licenseInfo.js
 * @author shijh
 *
 * 查询供应商紧急联系人修改前修改后的信息
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
        this.Result.push(this.getObject(data.id, data.newId, '紧急联系人id'));
        this.Result.push(this.getObject(data.oldName, data.newName, '联系人名字'));
        this.Result.push(this.getObject(data.oldPhone, data.newPhone, '联系人电话'));
        this.Result.push(this.getObject(data.oldCompanyPhoneNumber, data.newCompanyPhoneNumber, '公司电话'));
    }

    toJson() {
        return this.Result;
    }
}

export default (data) => new ViewModel(data).toJson();
