/**
 * @file App.jsx
 * @author wh/zhangbaihua
 *
 * 采购单打印列表页面
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
    Form,
    Row,
    Col,
    Pagination
} from 'antd';
import { PAGE_SIZE } from '../../../constant';
import { fetchPoPrintList } from '../../../actions';
import SearchForm from '../poSearchForm';
import Utils from '../../../util/util';
import Report from '../report';

import { downloadPDF, downloadBatchPDF } from '../../../service'

@connect(state => ({
    poPrintInfo: state.toJS().procurement.poPrintInfo,
}), dispatch => bindActionCreators({
    fetchPoPrintList,
}, dispatch))
class PoPrintList extends PureComponent {
    constructor(props) {
        super(props);
        this.searchParams = {};
        this.current = 1;
    }

    componentDidMount() {
        this.queryPoPrintList();
    }

    /**
     * 点击翻页
     * @param {*} pageNumber
     */
    onPaginate = (pageNumber) => {
        const pageNum = pageNumber;
        this.queryPoPrintList({
            pageSize: PAGE_SIZE,
            pageNum,
            ...this.searchParams
        });
    }

    /**
     * 查询采购单打印列表
     * @param {*} params
     */
    queryPoPrintList(params) {
        const tmp = params || {};
        const allParams = Object.assign({
            pageSize: PAGE_SIZE,
            pageNum: this.current || 1
        }, this.searchParams, tmp);
        this.props.fetchPoPrintList(allParams);
    }

    /**
     * 点击查询按钮回调
     * @param {*} res
     */
    applySearch = (res) => {
        this.searchParams = res;
        this.queryPoPrintList({
            ...this.searchParams
        });
    }

    // 点击重置按钮回调
    applyReset = () => {
        this.searchParams = {};
    }

    /**
     * 点击下载PDF按钮回调
     * @param {number} number 采购单号
     */
    applyDownPDF = (number) => {
        Utils.exportExcel(downloadPDF, { purchaseOrderNo: number });
    }

    // 批量下载PDF回调
    handleDownBatchPDF = (params) => {
        this.searchParams = params;
        Utils.exportExcel(downloadBatchPDF, { ...this.searchParams });
    }

    render() {
        // 采购单打印列表
        const { poPrintInfo = {} } = this.props;
        const { data = [], total, pageNum } = poPrintInfo;
        const that = this;
        const list = (reportsData = []) => {
            const res = [];
            reportsData.forEach((item) => {
                res.push(<Report data={item} key={item.id} onDownPDF={that.applyDownPDF} />)
            })
            return res;
        }
        return (
            <div>
                <SearchForm
                    auth={{ delete: false, new: false, downPDF: true }}
                    onSearch={this.applySearch}
                    onReset={this.applyReset}
                    onDownPDF={this.handleDownBatchPDF}
                />
                <div className="reports">
                    {list(data)}
                    <div className="actions" style={{ marginTop: 20 }}>
                        <Row type="flex" justify="end">
                            <Col>
                                <Pagination
                                    showQuickJumper
                                    current={pageNum}
                                    total={total}
                                    pageSize={PAGE_SIZE}
                                    onChange={this.onPaginate}
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}

PoPrintList.propTypes = {
    fetchPoPrintList: PropTypes.func,
    poPrintInfo: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(PoPrintList));
