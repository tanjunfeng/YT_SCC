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
            productId: '',
            isEdit: false,
            initData: {},
            showModal: false
        }
    }

    /**
     * 加载刷新列表
     */
    componentDidMount() {
        const { match } = this.props;
        this.props.fetchGetProductById({
            productId: match.params.id
        });
        this.getCardData();
    }


    onChange = (page) => {
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
        const { match, getProductByIds } = this.props;
        this.setState({
            initData: getProductByIds,
            showModal: true,
            isEdit: false
        })
        // this.props.productAddPriceVisible({isVisible: true});
        // this.props.fetchCheckMainSupplier({
        //     supplierType: 1,
        //     productId: match.params.id
        // })
    }

    /**
     * 修改关系
     */
    handleChange(record) {
        this.setState({
            initData: record,
            showModal: true,
            isEdit: true
        })
        // this.props.UpdateProdPurchase({isVisible: true, record});
    }

    handleCloseModal = () => {
        this.setState({
            showModal: false
        })
    } 

    /**
     * 搜索
     *
     * @param {Object} data 搜索条件
     */
    handleFormSearch = (data) => {
        this.searchForm = data;
        this.getCardData();
    }

    handleFormReset = () => {
        this.searchForm = {};
    }

    render() {
        const { prefixCls, getProductByIds, match } = this.props;
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
                    getData={this.getData}
                />
                <div>
                    <Cardline
                        goto={this.getCardData}
                        initData={this.props.purchaseCardData}
                        proId={match.params.id}
                        onCliked={this.handleChange}
                    />
                </div>
                {
                    this.state.showModal &&
                    <ProdModal
                        data={getProductByIds}
                        initValue={this.state.initData}
                        isEdit={this.state.isEdit}
                        goto={this.getCardData}
                        handleClose={this.handleCloseModal}
                    />
                }
            </div>
        );
    }
}

ProcurementMaintenance.propTypes = {
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
