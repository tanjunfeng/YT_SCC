/**
 * 组装表格显示字段
 */
export const getRow = (goodsInfo) => {
    const {
        productId,
        productCode,
        internationalCodes,
        productName,
        salePrice,
        packingSpecifications,
        enough,
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
    // https://solution.yatang.cn/jira/browse/GA-1047
    // const quantity = sellFullCase === 0 ? minNumber : minNumber * salesInsideNumber;
    // https://solution.yatang.cn/jira/browse/GA-1017
    const minNumberSpecifications = sellFullCase === 0 ? `${minNumber}${minUnit || ''}` : `${minNumber}${fullCaseUnit || '-'}`;
    Object.assign(record, {
        packingSpecifications: sellFullCase === 0 ? '-' : `${salesInsideNumber}${minUnit || ''} / ${fullCaseUnit || '-'}`,
        productSpecifications: sellFullCase === 0 ? `${packingSpecifications}/${minUnit}` : `${packingSpecifications || '-'} / ${fullCaseUnit || '-'}`,
        internationalCode: internationalCodes[0].internationalCode,
        quantity: minNumber,
        minNumberSpecifications,
        enough: enough === true, // 是否库存充足，默认充足
        isMultiple: true // 是否是销售内装数的整数倍，默认是整数倍
    });
    return record;
}

/**
 * 整理顺序，将不合法的前置，合法的后置
 */
export const sortList = goodsList => {
    const frontList = [];
    const backList = [];
    goodsList.forEach(goods => {
        if (!goods.isMultiple || !goods.enough) {
            frontList.push(goods);
        } else {
            backList.push(goods);
        }
    });
    return frontList.concat(backList);
}
