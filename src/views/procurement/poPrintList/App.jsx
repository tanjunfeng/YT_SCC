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
  Button
} from 'antd';

import { fetchPoPrintList } from '../../../actions';
import SearchForm from '../../../components/poSearchForm';
import { poCodes } from '../../../constant/procurement';
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
    //初始采购单查询参数
    this.searchParams = {};
  }

  componentDidMount() {
    this.queryPoPrintList();
  }

  queryPoPrintList(params) {
    let tmp = params || {};
    let searchParams = Object.assign({
    }, searchParams, tmp);
    this.props.fetchPoPrintList(searchParams);
  }


  /**
   * 点击查询按钮回调
   * @param {*} res 
   */
  applySearch(res) {
    this.searchParams = res;
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
 * 点击打印按钮回调
 * @param {*} res 
 */
  applyPrint(res) {
    //TODO
    //call print api
  }
  /**
 * 点击下载PDF按钮回调
 * @param {*} res 
 */
  applyDownPDF(res) {
    //TODO
    //call download pdf api
  }


  /**
   * 点击打印按钮
   */
  handlePrint() {
    //TODO
  }
  /**
   * 点击下载按钮
   */
  handleDownPDF() {
    //TODO
  }

  render() {
    //采购单打印列表
    let poPrintListTmp = this.props.poPrintList || [];
    return (
      <div >
        <SearchForm auth={{ delete: false, new: false, print: true, downPDF: true }}
          onSearch={this.applySearch}
          onReset={this.applyReset}
          onPrint={this.applyPrint}
          onDownPDF={this.applyDownPDF} />
        <div className="reports">
          {
            poPrintListTmp.map(function (item) {
              return <Report data={item} key={item.id} />;
            })
          }
          <div className="actions">
            <Row gutter={40} type="flex" justify="end">
              <Col span={4}>
                <Button size="default" onClick={this.handlePrint} style={{ marginRight: 20 }}>
                  打印
                                        </Button>
                <Button size="default" onClick={this.handleDownPDF}>
                  下载PDF
                                        </Button>
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
