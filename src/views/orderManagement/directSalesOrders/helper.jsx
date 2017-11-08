/**
 * 组装表格显示字段
 */
export const getRow = (goodsInfo) => {
    const {
        productId,
        productCode,
        internationalCodes,
        productName,
        unitExplanation,
        salePrice,
        packingSpecifications,
        available, // 是否在本区域销售
        minNumber, // 起订数量
        minUnit, // 最小销售单位
        fullCaseUnit, // 整箱单位
        salesInsideNumber, // 销售内装数
        sellFullCase // 是否整箱销售，１:按整箱销售，0:不按整箱销售
    } = goodsInfo;
    const record = {
        productId,
        productCode,
        productName,
        available,
        salePrice,
        sellFullCase,
        salesInsideNumber,
        minNumber
    };
    const quantity = sellFullCase === 0 ? minNumber : minNumber * salesInsideNumber;
    // 起订数量显示单位
    const minNumberSpecifications = sellFullCase === 0 ? `${minNumber}${fullCaseUnit || ''}` : `${minNumber}${minUnit || '-'}`;
    Object.assign(record, {
        productSpecifications: `${packingSpecifications || '-'} / ${unitExplanation || '-'}`,
        packingSpecifications: sellFullCase === 0 ? '-' : `${salesInsideNumber}${fullCaseUnit || ''} / ${minUnit || '-'}`,
        internationalCode: internationalCodes[0].internationalCode,
        quantity,
        minNumberSpecifications,
        enough: true, // 是否库存充足，默认充足
        isMultiple: true // 是否是销售内装数的整数倍，默认是整数倍
    });
    return record;
}
