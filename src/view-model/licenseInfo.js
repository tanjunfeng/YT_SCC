/**
 * @file licenseInfo.js
 * @author shijh
 *
 * 查询公司营业执照（副本）修改前和修改后内容
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
        this.Result.push(this.getObject(data.id, data.newId, '营业执照表ID'));
        this.Result.push(this.getObject(data.oldCompanyName, data.newCompanyName, '公司名称'));
        this.Result.push(this.getObject(data.oldRegistLicenceNumber, data.newRegistLicenceNumber, '注册号'));
        this.Result.push(this.getObject(data.oldLegalRepresentative, data.newLegalRepresentative, '法定代表人'));
        this.Result.push(this.getObject(data.oldLegalRepreCardNum, data.newLegalRepreCardNum, '法人身份证号'));
        this.Result.push(this.getObject(data.oldLegalRepreCardPic1, data.newLegalRepreCardPic1, '法人身份证电子版1'));
        this.Result.push(this.getObject(data.oldLegalRepreCardPic2, data.newLegalRepreCardPic2, '法人身份证电子版2'));
        this.Result.push(this.getObject(data.oldProvinceCityCounty, data.newProvinceCityCounty, '营业执照地址'));
        this.Result.push(this.getObject(data.oldLicenseAddress, data.newLicenseAddress, '营业执照详细地址'));
        this.Result.push(this.getObject(data.oldEstablishDate, data.newEstablishDate, '成立日期'));
        this.Result.push(this.getObject(data.oldStartDate, data.newStartDate, '营业开始日期'));
        this.Result.push(this.getObject(data.oldEndDate, data.newEndDate, '营业结束日期'));
        this.Result.push(this.getObject(data.oldPerpetualManagement, data.newPerpetualManagement, '永续经营'));
        this.Result.push(this.getObject(data.oldRegisteredCapital, data.newRegisteredCapital, '注册资本'));
        this.Result.push(this.getObject(data.oldBusinessScope, data.newBusinessScope, '经营范围'));
        this.Result.push(this.getObject(data.oldRegistLicencePic, data.newRegistLicencePic, '营业执照副本电子版'));
    }

    toJson() {
        return this.Result;
    }
}

export default (data) => new ViewModel(data).toJson();
