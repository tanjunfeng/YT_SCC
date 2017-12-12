import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {Row, Col} from 'antd';
import SearchMind from '../../../components/searchMind';
import { pubFetchValueList } from '../../../actions/pub';

@connect(state => ({
    po: state.toJS().procurement.po || {},
    newPcOdData: state.toJS().procurement.newPcOdData || {},
    // 回显数据
    basicInfo: state.toJS().procurement.po.basicInfo || {},
    poLines: state.toJS().procurement.po.poLines || [],
    // 用户信息
    data: state.toJS().user.data || {}
}), dispatch => bindActionCreators({
    pubFetchValueList,
}, dispatch))

class AddingGoods extends PureComponent {
    render() {
        const {spAdrId, businessMode, spId } = this.props;
        const supplierInfo = spAdrId ? `${spAdrId}-1` : null;
        const distributionStatus = businessMode;
        return (
            <div className="addMaterialContainer">
                <Row >
                    <Col span={8}>
                        <div className="row middle">
                            <SearchMind
                                style={{ zIndex: 6000, marginBottom: 5 }}
                                compKey="productCode"
                                rowKey="productCode"
                                ref={ref => { this.addPo = ref }}
                                fetch={(params) =>
                                    this.props.pubFetchValueList({
                                        supplierInfo,
                                        distributionStatus,
                                        teamText: params.value,
                                        pageNum: params.pagination.current || 1,
                                        pageSize: params.pagination.pageSize
                                    }, 'queryProductForSelect')
                                }
                                disabled={spId === ''}
                                addonBefore="添加商品"
                                onChoosed={this.props.handleChoosedMaterialMap}
                                renderChoosedInputRaw={(data) => (
                                    <div>{data.productCode} - {data.saleName}</div>
                                )}
                                pageSize={6}
                                columns={[
                                    {
                                        title: '商品编码',
                                        dataIndex: 'productCode',
                                        width: 98
                                    }, {
                                        title: '商品名称',
                                        dataIndex: 'saleName',
                                        width: 140
                                    }
                                ]}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
AddingGoods.propTypes = {
    pubFetchValueList: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    spAdrId: PropTypes.string,
    businessMode: PropTypes.string,
    spId: PropTypes.string,
    handleChoosedMaterialMap: PropTypes.func
}
export default AddingGoods;
