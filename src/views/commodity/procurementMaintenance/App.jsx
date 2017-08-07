/**
 * @file app.jsx
 * @author Tan junfeng
 *
 * 商品采购关系维护
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
    Form,
} from 'antd';
import {
    fetchGetProductById,
    fetchAddProdPurchase,
    fetchQueryProdByCondition,
    modifyAuditVisible,
    fetchCheckMainSupplier
} from '../../../actions';
import SearchForm from '../searchFormProcure';
import ShowForm from '../showFormProcure';
import Cardline from '../card';
import { PAGE_SIZE } from '../../../constant';
import ProdPurchaseModal from '../prodPurchaseModal';
import ProdModal from '../changePurchaseModal';
import {
    productAddPriceVisible,
    QueryProdPurchaseExtByCondition,
    UpdateProdPurchase
} from '../../../actions/producthome';


@connect(
    state => ({
        prodPurchase: state.toJS().commodity.prodPurchase,
        getProductByIds: state.toJS().commodity.getProductById,
        toAddPriceVisible: state.toJS().commodity.toAddPriceVisible,
        purchaseCardData: state.toJS().commodity.purchaseCardData,
        updateProdPurchase: state.toJS().commodity.updateProdPurchase,
    }),
    dispatch => bindActionCreators({
        QueryProdPurchaseExtByCondition,
        fetchGetProductById,
        fetchAddProdPurchase,
        fetchQueryProdByCondition,
        productAddPriceVisible,
        modifyAuditVisible,
        UpdateProdPurchase,
        fetchCheckMainSupplier
    }, dispatch)
)
class ProcurementMaintenance extends PureComponent {
    constructor(props) {
        super(props);

        this.handleFormReset = this.handleFormReset.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.onChange = ::this.onChange;
        this.handleAdd = ::this.handleAdd;
        this.handleChange = ::this.handleChange;

        this.searchForm = {};
        this.current = 1;
        this.state = {
            // 控制当前操作card下标
            index: 0,
            // 默认值
            value: [],
            // 控制主供应商选项唯一
            disabled: false,
            current: 1,
            productId: ''
        }
    }

    /**
     * 加载刷新列表
     */
    componentDidMount() {
        const { match } = this.props;
        // console.log(match)
        this.props.fetchGetProductById({
            productId: match.params.id
        });
        this.getCardData();
    }


    onChange = (page) => {
        // console.log(page);
        this.setState({
            current: page,
        });
    }

    /**
     * 采购价格分页
     */
    getCardData = (go) => {
        const { match } = this.props;
        this.current = go ? go : this.current;
        this.props.QueryProdPurchaseExtByCondition({
            productId: match.params.id,
            pageNum: this.current,
            pageSize: PAGE_SIZE,
            ...this.searchForm
        });
    }

    /**
     *列表分页
     *
     * @param {string} goto 数据列表分页
     */
    handlePaginationChange(goto) {
        this.current = goto;
        this.props.fetchQueryProdByCondition({
            pageNum: goto,
            pageSize: PAGE_SIZE,
            ...this.searchForm
        });
    }

    /**
     * 重置
     *
     * @param {Object} data 重置的表单
     */
    handleFormReset(data) {
        this.searchForm = data;
        this.brandSearchMind.handleClear();
    }

    /**
     * 新增
     *
     * @param {Object} record 模态框数据
     */
    handleAdd() {
        const { match } = this.props;
        this.props.productAddPriceVisible({isVisible: true});
        this.props.fetchCheckMainSupplier({
            supplierType: 1,
            productId: match.params.id
        })
    }

    /**
     * 修改关系
     */
    handleChange(record) {
        // console.log(record)
        this.props.UpdateProdPurchase({isVisible: true, record});
    }

    handleFormSearch = (data) => {
        this.searchForm = data;
        this.getCardData();
    }

    handleFormReset = () => {
        this.searchForm = {};
    }

    render() {
        const { prefixCls, getProductByIds, match } = this.props;
        // console.log(purchaseCardData.data)
        const innitalvalue = getProductByIds;
        return (
            <div className={`${prefixCls}-min-width application`}>
                <ShowForm innitalvalue={innitalvalue} />
                <SearchForm
                    goto={this.getCardData}
                    id={match.params.id}
                    innitalvalue={innitalvalue}
                    onSearch={this.handleFormSearch}
                    onReset={this.handleFormReset}
                    handleAdd={this.handleAdd}
                />
                <div>
                    <Cardline
                        goto={this.getCardData}
                        initData={this.props.purchaseCardData}
                        proId={match.params.id}
                        onCliked={this.handleChange}
                    />
                </div>
                <ProdPurchaseModal
                    goto={this.getCardData}
                />
                {
                    this.props.updateProdPurchase &&
                    <ProdModal
                        goto={this.getCardData}
                    />
                }
            </div>
        );
    }
}

ProcurementMaintenance.propTypes = {
    fetchQueryProdByCondition: PropTypes.func,
    fetchGetProductById: PropTypes.objectOf(PropTypes.any),
    QueryProdPurchaseExtByCondition: PropTypes.func,
    fetchCheckMainSupplier: PropTypes.func,
    productAddPriceVisible: PropTypes.func,
    UpdateProdPurchase: PropTypes.bool,
    updateProdPurchase: PropTypes.bool,
    prefixCls: PropTypes.string,
    getProductByIds: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any),
    purchaseCardData: PropTypes.objectOf(PropTypes.any),
}

ProcurementMaintenance.defaultProps = {
    prefixCls: 'card-line',
};

export default withRouter(Form.create()(ProcurementMaintenance));
