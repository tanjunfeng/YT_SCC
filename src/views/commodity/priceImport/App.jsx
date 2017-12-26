/**
 * @file App.jsx
 * @author liujinyu
 *
 * 售价审核列表
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Form, Icon, Menu, Dropdown } from 'antd';
import { getPriceImportList } from '../../../actions';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { priceListColumns as columns } from './columns';
import Utils from '../../../util/util';
// 导出
import { sellPriceChangeExport } from '../../../service'

@connect(state => ({
    priceImportlist: state.toJS().priceImport.priceImportlist,
}), dispatch => bindActionCreators({
    getPriceImportList
}, dispatch))

class PriceImport extends PureComponent {
    constructor(props) {
        super(props);
        this.param = {};
    }

    componentDidMount() {
        this.handlePurchaseReset();
        this.query();
    }

    /**
     * 分页页码改变的回调
     * @param {number} pageNum 页码
     */
    onPaginate = (pageNum = 1) => {
        Object.assign(this.param, {
            pageNum,
            current: pageNum
        });
        this.query();
    }

    /**
     * 请求列表数据
     */
    query = () => {
        this.props.getPriceImportList(this.param).then(data => {
            const { pageNum, pageSize } = data.data;
            Object.assign(this.param, { pageNum, pageSize });
        });
    }

    /**
     * 点击搜索的回调
     * @param {object} param 请求参数
     */
    handlePurchaseSearch = (param) => {
        this.handlePurchaseReset();
        Object.assign(this.param, {
            current: 1,
            ...param
        });
        this.query();
    }

    /**
     * 点击重置的回调
     */
    handlePurchaseReset = () => {
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        }
    }

    /**
     * 下载导入结果的回调
     * @param {object} param 查询参数
    */
    exportList = (param) => {
        this.handlePurchaseReset();
        Object.assign(this.param, {
            current: 1,
            ...param
        });
        Utils.exportExcel(sellPriceChangeExport, Utils.removeInvalid(param));
    }

    render() {
        const { data, total, pageNum, pageSize } = this.props.priceImportlist;
        columns[columns.length - 1].render = this.renderOperations;
        return (
            <div>
                <SearchForm
                    handlePurchaseSearch={this.handlePurchaseSearch}
                    handlePurchaseReset={this.handlePurchaseReset}
                    exportList={this.exportList}
                />
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="importsId"
                    scroll={{
                        x: 1400
                    }}
                    bordered
                    pagination={{
                        current: this.param.current,
                        pageNum,
                        pageSize,
                        total,
                        showQuickJumper: true,
                        onChange: this.onPaginate
                    }}
                />
            </div>
        );
    }
}

PriceImport.propTypes = {
    getPriceImportList: PropTypes.func,
    // clearPromotionList: PropTypes.func,
    // updatePromotionStatus: PropTypes.func,
    priceImportlist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    // location: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(PriceImport));
