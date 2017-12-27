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
import { Table, Form, Modal, message } from 'antd';
import { getPriceImportList, getIsSellVaild, getCreateSell } from '../../../actions';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { priceListColumns as columns } from './columns';
import Utils from '../../../util/util';
// 导出
import { sellPriceChangeExport, sellPriceChangeExcelTemplate } from '../../../service'

const pageSize = PAGE_SIZE

@connect(state => ({
    priceImportlist: state.toJS().priceImport.priceImportlist,
}), dispatch => bindActionCreators({
    getPriceImportList,
    getIsSellVaild,
    getCreateSell
}, dispatch))

class PriceImport extends PureComponent {
    constructor(props) {
        super(props);
        this.param = {};
        this.pageNum = 1;
        this.state = {
            exportBtnDisabled: true
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.priceImportlist.data) {
            return;
        }
        if (nextProps.priceImportlist.data.length === 0) {
            this.setState({
                exportBtnDisabled: true
            })
        } else {
            this.setState({
                exportBtnDisabled: false
            })
        }
    }

    /**
     * 分页页码改变的回调
     * @param {number} pageNum 页码
     */
    onPaginate = (pageNum = 1) => {
        this.pageNum = pageNum
        this.query();
    }

    /**
    * 创建变价单
    */
    getCreateChange = () => {
        this.props.getCreateSell()
            .then(res => {
                if (res.success) {
                    message.success('变价成功');
                    this.query();
                } else {
                    message.error(res.message);
                }
            })
    }

    /**
     * 请求列表数据
     */
    query = () => {
        const pageNum = this.pageNum;
        this.props.getPriceImportList(Object.assign({}, this.param, { pageNum, pageSize }))
    }

    /**
     * 点击搜索的回调
     * @param {object} param 请求参数
     */
    handlePurchaseSearch = (param) => {
        this.handlePurchaseReset();
        this.param = param;
        this.pageNum = 1;
        this.query();
    }

    /**
     * 点击重置的回调
     */
    handlePurchaseReset = () => {
        this.pageNum = 1
    }

    /**
     * 下载导入结果的回调
    */
    exportList = () => {
        Utils.exportExcel(sellPriceChangeExport, Utils.removeInvalid(this.param));
    }

    /**
     * 下载导入模板的回调
    */
    exportTemplate = () => {
        Utils.exportExcel(sellPriceChangeExcelTemplate);
    }

    /**
     * 创建变价单按钮不可用时的提示
    */
    showCreateChangeError = () => {
        Modal.error({
            title: '错误',
            content: '变价单存在错误，请检查',
            okText: '确定'
        });
    }

    /**
     * 创建变价单按钮是否可用
    */
    createChange = () => {
        this.props.getIsSellVaild()
            .then(res => {
                if (res.data) {
                    this.getCreateChange()
                } else {
                    this.showCreateChangeError()
                }
            })
    }

    render() {
        const { data, total, pageNum } = this.props.priceImportlist;
        columns[columns.length - 1].render = this.renderOperations;
        return (
            <div>
                <SearchForm
                    handlePurchaseSearch={this.handlePurchaseSearch}
                    handlePurchaseReset={this.handlePurchaseReset}
                    exportList={this.exportList}
                    exportTemplate={this.exportTemplate}
                    exportBtnDisabled={this.state.exportBtnDisabled}
                    createChange={this.createChange}
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
                        current: pageNum,
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
    getIsSellVaild: PropTypes.func,
    getCreateSell: PropTypes.func,
    priceImportlist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
}

export default withRouter(Form.create()(PriceImport));
