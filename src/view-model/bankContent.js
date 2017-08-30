/**
 * @file licenseInfo.js
 * @author shijh
 *
 * 查询公司经营及税务信息修改前和修改后内容
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
        this.Result.push(this.getObject(data.id, data.newId, '银行Id'));
        this.Result.push(this.getObject(data.oldOpenBank, data.newOpenBank, '开户行'));
        this.Result.push(this.getObject(data.oldBankAccount, data.newBankAccount, '银行账号'));
        this.Result.push(this.getObject(data.oldProvinceCityCounty, data.newProvinceCityCounty, '开户行所在地'));
        this.Result.push(this.getObject(data.oldBankAccountLicense, data.newBankAccountLicense, '银行开户许可证电子版url'));
    }

    toJson() {
        return this.Result;
    }
}

export default (data) => new ViewModel(data).toJson();
