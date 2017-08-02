/**
 * @file validator.js
 *
 * @author shijh
 * 表单验证规则
 */

import Utils from './util';
import {
    settlementInfo,
    taxpayerNumber,
    registLicenceNo,
    orgCodeInfoByCode,
    emerCont,
    settledCont,
    checkSupplierName,
    checkBankAccount,
    checkLicenseNo
} from '../service';

/**
 * 返利验证
 *
 * @param {Object} rule 验证规则
 * @param {string | number} value 表单值
 * @param {Function} callback 验证后回调
 */
export const validatorRebate = (rule, value, callback) => {
    if (value && value < 0) {
        callback('请输入正确的返利')
    }
    callback()
}


export class Validator {
    static repeat = {
        // 验证公司名是否重复
        companyName: (e, _this, _id = null) => {
            const { value } = e.target;
            if (Utils.trim(value) === '') {
                return;
            }
            checkSupplierName(
                Utils.removeInvalid({companyName: e.target.value, id: _id})
            ).catch(() => {
                _this.props.form.setFields({
                    companyName: {
                        errors: [new Error('公司名重复')],
                    },
                });
            })
        },
        // 验证供应商号是否重复
        spNo: (e, _this, _id = null) => {
            const { value } = e.target;
            if (Utils.trim(value) === '') {
                return;
            }
            settlementInfo(
                Utils.removeInvalid({spNo: e.target.value, id: _id})
            ).catch(() => {
                _this.props.form.setFields({
                    spNo: {
                        errors: [new Error('供应商编号重复')],
                    },
                });
            })
        },
        // 验证供应商注册号是否重复
        spRegNo: (e, _this, _id = null) => {
            const { value } = e.target;
            if (Utils.trim(value) === '') {
                return;
            }
            settlementInfo(
                Utils.removeInvalid({spRegNo: e.target.value, id: _id})
            ).catch(() => {
                _this.props.form.setFields({
                    spRegNo: {
                        errors: [new Error('供应商注册号重复')],
                    },
                });
            })
        },
        // 验证主账号是否重复
        mainAccountNo: (e, _this, _id = null) => {
            const { value } = e.target;
            if (Utils.trim(value) === '') {
                return;
            }
            settlementInfo(
                Utils.removeInvalid({mainAccountNo: e.target.value, id: _id})
            ).catch(() => {
                _this.props.form.setFields({
                    mainAccountNo: {
                        errors: [new Error('供应商主账号重复')],
                    },
                });
            })
        },
        // 验证请输入纳税人识别号是否重复
        taxpayerNumber: (e, _this, _id = null) => {
            const { value } = e.target;
            if (Utils.trim(value) === '') {
                return;
            }
            taxpayerNumber(
                Utils.removeInvalid({taxpayerNumber: e.target.value, id: _id})
            ).catch(() => {
                _this.props.form.setFields({
                    taxpayerNumber: {
                        errors: [new Error('纳税人识别号重复')],
                    },
                });
            })
        },
        // 验证银行账号是否重复
        bankAccount: (e, _this, _id = null) => {
            const { value } = e.target;
            if (Utils.trim(value) === '') {
                return;
            }
            checkBankAccount(
                Utils.removeInvalid({bankAccount: e.target.value, id: _id})
            ).catch(() => {
                _this.props.form.setFields({
                    bankAccount: {
                        errors: [new Error('银行账号重复')],
                    },
                });
            })
        },
        // 请输入营业执照号是否重复
        licenseNo: (e, _this, _id = null) => {
            const { value } = e.target;
            if (Utils.trim(value) === '') {
                return;
            }
            checkLicenseNo(
                Utils.removeInvalid({licenseNo: e.target.value, id: _id})
            ).catch(() => {
                _this.props.form.setFields({
                    registLicenceNumber: {
                        errors: [new Error('营业执照号重复')],
                    },
                });
            })
        },
        // 阻止编号是否重复
        orgCode: (e, _this, _id = null) => {
            const { value } = e.target;
            if (Utils.trim(value) === '') {
                return;
            }
            orgCodeInfoByCode(
                Utils.removeInvalid({orgCode: e.target.value, id: _id})
            ).catch(() => {
                _this.props.form.setFields({
                    orgCode: {
                        errors: [new Error('组织机构代码号重复')],
                    },
                });
            })
        },
        // 供应商手机号是否重复
        supplierPhone: (e, _this, _id = null) => {
            const { value } = e.target;
            if (Utils.trim(value) === '') {
                return;
            }
            emerCont(
                Utils.removeInvalid({phone: e.target.value, id: _id})
            ).catch(() => {
                _this.props.form.setFields({
                    sphone: {
                        errors: [new Error('紧急联系人手机号重复')],
                    },
                });
            })
        },
        // 供应商公司联系电话是否重复
        companyPhoneNumber: (e, _this, _id = null) => {
            const { value } = e.target;
            if (Utils.trim(value) === '') {
                return;
            }
            emerCont(
                Utils.removeInvalid({companyPhoneNumber: e.target.value, id: _id})
            ).catch(() => {
                _this.props.form.setFields({
                    companyPhoneNumber: {
                        errors: [new Error('紧急联系人公司联系号码重复')],
                    },
                });
            })
        },
        // 手机号是否重复
        phone: (e, _this, _id = null) => {
            const { value } = e.target;
            if (Utils.trim(value) === '') {
                return;
            }
            settledCont(
                Utils.removeInvalid({phone: e.target.value, id: _id})
            ).catch(() => {
                _this.props.form.setFields({
                    phone: {
                        errors: [new Error('入驻联系人电话重复')],
                    },
                });
            })
        },
        // 邮箱是否重复
        emial: (e, _this, _id = null) => {
            const { value } = e.target;
            if (Utils.trim(value) === '') {
                return;
            }
            settledCont(
                Utils.removeInvalid({email: e.target.value, id: _id})
            ).catch(() => {
                _this.props.form.setFields({
                    email: {
                        errors: [new Error('入驻联系人邮箱重复')],
                    },
                });
            })
        }
    }
    static REGEX = {
        number: /^\d+(\.\d+)?$/,
    }
    static type = {
        number: {pattern: /^\d+(\.\d+)?$/, message: '无效的数字!'},
        phone: {pattern: /^0?(13|14|15|18)[0-9]{9}$/, message: '请输入正确的手机号'},
        spNo: {pattern: /^XTXC.{4}$/, message: '请输入正确编码格式：YTXC+4位数字 例如（YTXC1001）'}
    }
}
