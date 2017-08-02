/**
 * @file App.jsx
 * @author twh
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
  Button,
  Pagination
} from 'antd';
import { PAGE_SIZE } from '../../../constant';
import { fetchPoPrintList } from '../../../actions';
import SearchForm from '../../../components/poSearchForm';
import { poStatusCodes } from '../../../constant/procurement';
import { poMngListColumns } from '../columns';
import Utils from '../../../util/util';
import Report from '../report';

@connect(state => ({
  poPrintList: state.toJS().procurement.poPrintList
}), dispatch => bindActionCreators({
  fetchPoPrintList
}, dispatch))
class PoPrintList extends PureComponent {
  constructor(props) {
    super(props);
    this.applySearch = ::this.applySearch;
    this.applyReset = ::this.applyReset;
    this.queryPoPrintList =::this.queryPoPrintList;
    this.onPaginate =::this.onPaginate;
    this.applyDownPDF =::this.applyDownPDF;
    //初始采购单查询参数
    this.searchParams = {};
    //初始页号
    this.current = 1;
  }

  componentDidMount() {
    this.queryPoPrintList();
  }

  /**
   * 查询采购单打印列表
   * @param {*} params 
   */
  queryPoPrintList(params) {
    let tmp = params || {};
    let searchParams = Object.assign({
      pageSize: PAGE_SIZE,
      pageNum: this.current,
    }, searchParams, tmp);
    this.props.fetchPoPrintList(searchParams);
  }

  /**
   * 点击查询按钮回调
   * @param {*} res 
   */
  applySearch(res) {
    //设置查询条件
    this.searchParams = res;
    //查询采购单打印列表
    this.queryPoPrintList();
  }

  /**
   * 点击重置按钮回调
   * @param {*} res 
   */
  applyReset(res) {
    //清空查询条件
    this.searchParams = {};
  }

  /**
 * 点击下载PDF按钮回调
 * @param {*} res 
 */
  applyDownPDF(res) {
    //TODO
    //call download pdf api
    console.log("down load pdf");
  }

  /**
   * 点击翻页
   * @param {*} pageNumber 
   * @param {*} pageSize 
   */
  onPaginate(pageNumber, pageSize) {
    this.current = pageNumber
    this.queryPoPrintList();
  }

  render() {
    //采购单打印列表
    let poPrintListTmp = this.props.poPrintList.data || [];
    const { total, pageNum, pageSize } = this.props.poPrintList;
    let that = this;
    let list = (reportsData) => {
      let res = [];
      reportsData = reportsData || [];
      for (var i = 0; i < reportsData.length; i++) {
        let item = reportsData[i];
        res.push(<Report data={item} key={item.id} onDownPDF={that.applyDownPDF} />)
      }
      return res
    }
    return (
      <div >
        <SearchForm auth={{ delete: false, new: false, downPDF: true }}
          onSearch={this.applySearch}
          onReset={this.applyReset}
          onDownPDF={this.applyDownPDF} />
        <div className="reports">
          {
            list(poPrintListTmp)
          }
          <div className="actions" style={{ marginTop: 20 }}>
            <Row type="flex" justify="end">
              <Col >
                <Pagination showQuickJumper defaultCurrent={this.current} current={pageNum} total={total} pageSize={pageSize}
                  onChange={this.onPaginate} />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

PoPrintList.propTypes = {
  fetchPoMngList: PropTypes.func,
}

export default withRouter(Form.create()(PoPrintList));
