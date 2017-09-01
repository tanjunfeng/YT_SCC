/**
 * 供应商信息类别索引表
 *
 * @author taoqiyu
 */
const INFO_TYPE_TABLE = {
    supplierBasicInfo: {
        companyName: '供应商名称',
        spNo: '供应商编号',
        grade: {
            text: '供应商等级',
            type: 'map',
            map: {
                1: '战略供应商', 2: '核心供应商', 3: '可替代供应商'
            }
        },
        settledTime: { text: '供应商入驻日期', type: 'date' },
        status: {
            text: '供应商状态',
            type: 'map',
            map: {
                0: '待审核', 1: '审核失败'
            }
        },
        modifyId: '修改信息编号'
    },
    supplierOperTaxInfo: {
        spId: '供应商主表ID',
        companyName: '供应商名称',
        companyLocProvince: '省份名',
        companyLocCity: '城市名',
        companyLocCounty: '地区名',
        companyDetailAddress: '公司详细地址',
        registrationCertificate: '商标注册证/受理通知书',
        regCerExpiringDate: { text: '商标注册证/受理通知书到期日', type: 'date' },
        qualityIdentification: '食品安全认证',
        quaIdeExpiringDate: { text: '食品安全认证到期日', type: 'date' },
        foodBusinessLicense: '食品经营许可证',
        businessLicenseExpiringDate: { text: '食品经营许可证到期日期', type: 'date' },
        generalTaxpayerQualifiCerti: '一般纳税人资格证电子版',
        taxpayerCertExpiringDate: { text: '一般纳税人资格证到期日', type: 'date' },
        status: {
            text: '公司经营及税务信息状态',
            type: 'map',
            map: {
                0: '待审核', 1: '审核失败'
            }
        }
    },
    supplierBankInfo: {
        accountName: '开户名',
        openBank: '开户行',
        bankAccount: '银行账户',
        bankAccountLicense: '银行开户许可证电子版url',
        bankLocProvince: '省份名',
        bankLocCity: '城市名',
        bankLocCounty: '地区名',
        invoiceHead: '供应商发票抬头',
        status: {
            text: '银行信息状态',
            type: 'map',
            map: {
                0: '待审核', 1: '审核失败'
            }
        }
    },
    supplierlicenseInfo: {
        companyName: '公司名称',
        registLicenceNumber: '注册号(营业执照号)',
        legalRepresentative: '法定代表人',
        legalRepreCardNum: '法人身份证号',
        legalRepreCardPic1: '法人身份证电子版1 ',
        legalRepreCardPic2: '法人身份证电子版2',
        bankLocClicenseLocProvinceounty: '省份名',
        licenseLocCity: '城市名',
        licenseLocCounty: '地区名',
        licenseAddress: '营业执照详细地址',
        establishDate: { text: '创建日期', type: 'date' },
        startDate: { text: '营业开始日期', type: 'date' },
        endDate: { text: '营业结束日期', type: 'date' },
        registeredCapital: '注册资本(单位万元)',
        businessScope: '经营范围',
        registLicencePic: '营业执照副本电子版url',
        guaranteeMoney: '供应商质保金收取金额（保证金）',
        perpetualManagement: {
            text: '永续经营',
            type: 'map',
            map: {
                0: '否',
                1: '是'
            }
        },
        status: {
            text: '公司营业执照信息(副本)状态',
            type: 'map',
            map: {
                0: '待审核', 1: '审核失败'
            }
        }
    },
    saleRegionInfo: {
        bigArea: '大区',
        province: '省份',
        city: '城市'
    },
    supplierAdrInfoDto: {
        basicId: '基本信息ID',
        contId: '联系信息ID',
        spAdrBasic: '地点基础信息表',
        status: {
            text: '供应商地点信息',
            type: 'map',
            map: {
                0: '草稿', 1: '待审核', 2: '已审核', 3: '已拒绝', 4: '修改中'
            }
        },
        commitType: {
            text: '供应商地点信息提交类型',
            type: 'map',
            map: {
                0: '保存草稿', 1: '提交'
            }
        }
    },
    spAdrBasic: {
        providerNo: '供应商地点编码',
        providerName: '供应商地点名称',
        goodsArrivalCycle: '到货周期',
        orgId: '分公司',
        grade: {
            text: '供应地点级别',
            type: 'map',
            map: {
                1: '生产厂家', 2: '批发商', 3: '经销商', 4: '代销商', 5: '其他'
            }
        },
        operaStatus: {
            text: '供应商地点经营状态',
            type: 'map',
            map: {
                0: '禁用', 1: '启用'
            }
        },
        settlementPeriod: '账期',
        belongArea: '所属区域',
        payType: {
            text: '供应商付款方式',
            type: 'map',
            map: {
                0: '网银', 1: '银行转账', 2: '现金', 3: '支票'
            }
        },
        payCondition: {
            text: '付款条件',
            type: 'map',
            map: {
                1: '票到七天', 2: '票到十五天', 3: '票到三十天'
            }
        },
        auditPerson: '审核人姓名',
        auditDate: { text: '审核日期', type: 'date' },
        modifyId: '修改信息编号',
        status: {
            text: '供应商地点基础信息状态',
            type: 'map',
            map: {
                0: '待审核', 1: '审核失败'
            }
        },
        subsidiaryName: '子公司名称'
    },
    spAdrContact: {
        providerName: '供应商姓名',
        providerPhone: '供应商手机',
        providerEmail: '供应商邮箱',
        purchaseName: '采购员姓名',
        purchasePhone: '采购员电话',
        purchaseEmail: '采购员邮箱',
        modifyId: '修改信息编号',
        status: {
            text: '联系信息状态',
            type: 'map',
            map: {
                0: '待审核', 1: '审核失败'
            }
        }
    }
}

export { INFO_TYPE_TABLE };
