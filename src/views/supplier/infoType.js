/**
 * 供应商信息类别索引表
 *
 * @author taoqiyu@yatang.cn
 */
const INFO_TYPE_TABLE = {
    supplierBasicInfo: {
        // id: '主键ID',
        companyName: '供应商名称',
        spNo: '供应商编号',
        grade: '供应商等级',
        settledTime: { text: '供应商入驻日期', type: 'time' },
    },
    supplierOperTaxInfo: {
        spId: '供应商主表ID',
        // id: '主键ID2',
        companyName: '供应商名称',
        companyLocProvince: '省份名',
        companyLocCity: '城市名',
        companyLocCounty: '地区名',
        companyLocProvinceCode: '省份code',
        companyLocCityCode: '城市code',
        companyLocCountyCode: '地区code',
        companyDetailAddress: '公司详细地址',
        registrationCertificate: '商标注册证/受理通知书',
        regCerExpiringDate: { text: '商标注册证/受理通知书到期日', type: 'time' },
        qualityIdentification: '食品安全认证',
        quaIdeExpiringDate: { text: '食品安全认证到期日', type: 'time' },
        foodBusinessLicense: '食品经营许可证',
        businessLicenseExpiringDate: { text: '食品经营许可证到期日期', type: 'time' },
        generalTaxpayerQualifiCerti: '一般纳税人资格证电子版',
        taxpayerCertExpiringDate: { text: '一般纳税人资格证到期日', type: 'time' }
    },
    supplierBankInfo: {
        // spId: '供应商主表ID',
        // id: '主键ID',
        accountName: '开户名',
        openBank: '开户行',
        bankAccount: '银行账户',
        bankAccountLicense: '银行开户许可证电子版url',
        bankLocProvince: '省份名',
        bankLocCity: '城市名',
        bankLocCounty: '地区名',
        bankLocProvinceCode: '省份code',
        bankLocCityCode: '城市code',
        bankLocCountyCode: '地区code',
        invoiceHead: '供应商发票抬头'
    },
    supplierlicenseInfo: {
        // id: '主键ID',
        companyName: '公司名称',
        registLicenceNumber: '注册号(营业执照号)',
        legalRepresentative: '法定代表人',
        legalRepreCardNum: '法人身份证号',
        legalRepreCardPic1: '法人身份证电子版1 ',
        legalRepreCardPic2: '法人身份证电子版2',
        bankLocClicenseLocProvinceounty: '省份名',
        licenseLocCity: '城市名',
        licenseLocCounty: '地区名',
        bankLocProvinceCode: '省份code',
        bankLocCityCode: '城市code',
        bankLocCountyCode: '地区code',
        licenseAddress: '营业执照详细地址',
        establishDate: { text: '创建时间', type: 'time' },
        startDate: { text: '营业开始日期', type: 'time' },
        endDate: { text: '营业结束日期', type: 'time' },
        registeredCapital: '注册资本(单位万元)',
        businessScope: '经营范围',
        registLicencePic: '营业执照副本电子版url',
        guaranteeMoney: '供应商质保金收取金额（保证金）'
    },
    saleRegionInfo: {
        // id: '主键ID',
        bigArea: '大区',
        province: '省份',
        city: '城市'
    },
    supplierAdrInfoDto: {
        // id: '供应商地点主表ID',
        // parentId: '供应商主表ID',
        basicId: '基本信息ID',
        contId: '联系信息ID',
        spAdrBasic: '地点基础信息表'
    },
    spAdrBasic: {
        // id: '主键ID',
        providerNo: '供应商地点编码',
        providerName: '供应商地点名称',
        goodsArrivalCycle: '到货周期',
        orgId: '分公司',
        // ogradergId: '供应地点级别',
        ogradergId: { text: '供应地点级别', type: 'string' },
        settlementPeriod: { text: '账期', type: 'string' },
        // operaStatus: '供应商地点经营状态',
        operaStatus: { text: '供应商地点经营状态', type: 'array', data: ['', ''] },
        // payType: '供应商付款方式',
        payType: { text: '供应商付款方式', type: 'arrray' },
        // payCondition: '付款条件',
        payCondition: { text: '付款条件', type: 'string' },
        belongArea: '所属区域',
        grade: '供应地点级别',
        // auditDate: '审核时间',
        // auditPerson: '审核人',
    },
    spAdrContact: {
        // id: '供应商主表ID',
        providerName: '供应商姓名',
        providerPhone: '供应商手机',
        providerEmail: '供应商邮箱',
        purchaseName: '采购员姓名',
        purchasePhone: '采购员电话',
        purchaseEmail: '采购员邮箱',
    }
}

export default { INFO_TYPE_TABLE };
