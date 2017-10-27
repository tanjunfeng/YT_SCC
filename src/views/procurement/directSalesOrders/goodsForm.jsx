/**
 * 直营店下单，添加商品
 *
 * 1. 点选值清单依次添加
 * 2. 下载 excel 模板批量添加
 *
 * @returns 商品列表
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Button, Upload, Icon, message } from 'antd';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AddingGoodsByStore } from '../../../container/search';
import { queryGoodsInfo } from '../../../actions/procurement';
import Utils from '../../../util/util';

const FormItem = Form.Item;

@connect(() => ({}), dispatch => bindActionCreators({
    queryGoodsInfo
}, dispatch))

class GoodsForm extends PureComponent {
    getRow = (goodsInfo) => {
        const {
            productId,
            productCode,
            internationalCodes,
            productName,
            unitExplanation,
            salePrice,
            packingSpecifications,
            available,  // 是否在本区域销售
            minNumber,  // 起订数量
            minUnit,    // 最小销售单位
            fullCaseUnit,   // 整箱单位
            salesInsideNumber,  // 销售内装数
            sellFullCase    // 是否整箱销售，１:按整箱销售，0:不按整箱销售
        } = goodsInfo;
        const record = {
            productId,
            productCode,
            internationalCode: internationalCodes[0].internationalCode,
            productName,
            productSpecifications: `${packingSpecifications || '-'} / ${unitExplanation || '-'}`,
            available,
            salePrice,
            sellFullCase,
            salesInsideNumber,
            packingSpecifications: sellFullCase === 0 ? '-' : `${salesInsideNumber}${fullCaseUnit || ''} / ${minUnit || '-'}`,
            quantity: sellFullCase === 0 ? minNumber : minNumber * salesInsideNumber,
            minNumber,
            minNumberSpecifications: sellFullCase === 0 ? `${minNumber}${fullCaseUnit || ''}` : `${minNumber}${minUnit || '-'}`, // 起订数量显示单位
            enough: true,    // 是否库存充足，默认充足
            isMultiple: true    // 是否是销售内装数的整数倍，默认是整数倍
        };
        return record;
    }

    uploadProps = {
        name: 'uploadProps',
        contentType: 'application/json;charset=UTF-8',
        action: '/directStore/fileUpload',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                // post data
                // data: {
                //     branchCompanyId: this.props.value.branchCompanyId,
                //         deliveryWarehouseCode: this.props.value.deliveryWarehouseCode,
                // },
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    handleGoodsChange = ({ record }) => {
        const { branchCompanyId, deliveryWarehouseCode } = this.props.value;
        if (record === undefined || branchCompanyId === '') {
            this.props.onChange(null);
            return;
        }
        const productId = record.productId;
        this.props.queryGoodsInfo(Utils.removeInvalid({
            productId, branchCompanyId, deliveryWarehouseCode, quantity: 0
        })).then(res => {
            this.props.onChange(this.getRow(res.data));
        });
    }

    handleSubmit = () => {
        this.props.onSubmit();
    }

    render() {
        return (
            <div className="direct-sales-orders-form goods-form">
                <Form layout="inline">
                    <div className="search-box">
                        <h1>商品信息</h1>
                        <Row gutter={40}>
                            <FormItem>
                                <AddingGoodsByStore
                                    branchCompanyId={this.props.value.branchCompanyId}
                                    onChange={this.handleGoodsChange}
                                />
                            </FormItem>
                            <FormItem className="file-upload">
                                <Upload {...this.uploadProps}>
                                    <Button type="primary" size="default">
                                        <Icon type="upload" /> Excel 导入
                                        </Button>
                                </Upload>
                            </FormItem>
                            <FormItem>
                                <a className="download" target="_blank" href="/api/sc/directStore/downloadExcelModel">
                                    下载 Excel 模板
                                </a>
                                <div className="info">
                                    数量：<span>30</span>
                                </div>
                                <div className="info">
                                    金额：<span>2000</span>
                                </div>
                            </FormItem>
                            <FormItem className="fr">
                                <Button type="primary" size="default" onClick={this.handleSubmit}>
                                    提交
                                </Button>
                            </FormItem>
                        </Row>
                    </div>
                </Form>
            </div>
        );
    }
}

GoodsForm.propTypes = {
    value: PropTypes.objectOf(PropTypes.any),
    queryGoodsInfo: PropTypes.func,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func
};

export default withRouter(Form.create()(GoodsForm));
