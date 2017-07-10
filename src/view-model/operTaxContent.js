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
        this.Result.push(this.getObject(data.id, data.newId, '经营及税务信息Id'));
        this.Result.push(this.getObject(data.oldProvinceCityCounty, data.newProvinceCityCounty, '公司所在地'));
        this.Result.push(this.getObject(data.oldAddress, data.newAddress, '公司详细地址'));
        this.Result.push(this.getObject(data.oldRegistrationCertificate, data.newRegistrationCertificate, '商标注册证'));
        this.Result.push(this.getObject(data.oldTaxpayerNumber, data.newTaxpayerNumber, '纳税人识别号'));
        this.Result.push(this.getObject(data.oldTaxpayerType, data.newTaxpayerType, '纳税人类型'));
        this.Result.push(this.getObject(data.oldGeneralTaxpayerQualifiCerti, data.newGeneralTaxpayerQualifiCerti, '一般纳税人资格证电子版'));
        this.Result.push(this.getObject(data.oldQualityIdentification, data.newQualityIdentification, '食品安全认证'));
    }

    toJson() {
        return this.Result;
    }
}

export default (data) => new ViewModel(data).toJson();
