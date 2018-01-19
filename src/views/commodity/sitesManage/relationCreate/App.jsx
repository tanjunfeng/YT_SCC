import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Form,
    Table
} from 'antd';
import {
    queryProductsByCondition,
    createProductSiteRelations,
    receiveAddRelationParams,
    exportRepeatData
} from '../../../../actions/commodity';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../../constant';
import { productListColumns } from './columns';
import CreateModal from './createModal';
import RepeatModal from './repeatDataModal';

const defaultImg = require('../../../../images/default/100x100.png');

@connect(state => ({
    productsData: state.toJS().commodity.productsData,
    addRelationParams: state.toJS().commodity.addRelationParams
}), dispatch => bindActionCreators({
    queryProductsByCondition,
    createProductSiteRelations,
    receiveAddRelationParams,
    exportRepeatData
}, dispatch))
class RelationCreate extends PureComponent {
    state = {
        selectedRows: [],
        repeatRes: {},
        createModalVisible: false,
        repeatModalVisible: false
    }
    componentDidMount() {
        // rowSelection object indicates the need for row selection
        /**
         * 选中的行
         */
        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRows
                });
            }
        };
    }

    /**
     * 分页查询
     */
    handlePaginationChange = pageIndex => {
        this.queryParams.pageIndex = pageIndex;
        this.queryProducts(this.queryParams);
    }

    /**
     * 查询商品信息
     */
    queryProducts = queryParams => {
        this.queryParams = queryParams;
        this.props.queryProductsByCondition(queryParams);
    }

    /**
    * 关闭创建弹窗
    */
    closeCreateModal = () => {
        this.setState({
            createModalVisible: false
        });
    }

    /**
    * 关闭重复数据弹窗
    */
    closeRepeatModal = () => {
        this.setState({
            repeatModalVisible: false
        });
    }

    /**
    * 打开创建弹窗
    */
    openCreateModal = () => {
        this.setState({
            createModalVisible: true
        });
    }

     /**
    * 打开重复数据弹窗
    */
    openRepeatModal = () => {
        this.setState({
            repeatModalVisible: true
        });
    }

    /**
     * 有重复数据打开弹窗
    */

    handleRepeat = repeatRes => {
        this.repeatRes = repeatRes;
        this.setState({
            repeatRes
        });
        
        this.openRepeatModal();
    }

    /**
     * 商品信息,编号,以及图片
     *
     */
    renderGoodsOpations = (text, record) => {
        const {
            productCode,
            saleName,
            thumbnailImage,
        } = record;

        return (
            <div className="table-commodity">
                <div className="table-commodity-number">
                    <span>商品编号：</span>
                    <span>{productCode}</span>
                </div>
                <div className="table-commodity-description">
                    <img alt="未上传"
                        className="table-commodity-description-img"
                        src={`${thumbnailImage || defaultImg}`}
                    />
                    <span className="table-commodity-description-name">{saleName}</span>
                </div>
            </div>
        )
    }
    render() {
        const { data, total, pageNum } = this.props.productsData;
        const { createModalVisible, repeatModalVisible, repeatRes } = this.state;
        const selectedIds = this.state.selectedRows.map(item => item.productId);
        productListColumns[0].render = this.renderGoodsOpations;
        return (
            <div>
                <SearchForm
                    queryProducts={this.queryProducts}
                    openModal={this.openCreateModal}
                    isCreateRelation={selectedIds.length > 0}
                />
                <Table
                    rowKey={record => record.productId}
                    rowSelection={this.rowSelection}
                    dataSource={data}
                    columns={productListColumns}
                    pagination={{
                        current: pageNum,
                        total,
                        pageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.handlePaginationChange
                    }}
                />
                <CreateModal
                    createRelations={this.props.createProductSiteRelations}
                    visible={createModalVisible}
                    closeModal={this.closeCreateModal}
                    selectedIds={selectedIds}
                    openRepeatModel={this.handleRepeat}
                    saveParams={this.props.receiveAddRelationParams}
                />
                <RepeatModal
                    closeModal={this.closeRepeatModal}
                    exportExcel={this.props.exportRepeatData}
                    visible={repeatModalVisible}
                    repeatRes={repeatRes}
                    reqParams={this.props.addRelationParams}
                />
            </div>
        );
    }
}

RelationCreate.propTypes = {
    queryProductsByCondition: PropTypes.func,
    createProductSiteRelations: PropTypes.func,
    productsData: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(RelationCreate));
