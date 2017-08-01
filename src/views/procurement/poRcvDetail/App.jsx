/**
 * @file App.jsx
 * @author twh
 *
 * 采购收货单新建，显示界面
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import EditableCell from './EditableCell';
import moment from 'moment';
import {
  Table,
  Form,
  Input,
  Icon,
  Modal,
  Row,
  Col,
  Button,
  message
} from 'antd';
import {
  fetchPoRcvInit,
  fetchPoRcvDetail,
  updatePoRcvBasicinfo,
  updatePoRcvLine,
  createPoRcv
} from '../../../actions';
import Utils from '../../../util/util';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
@connect(state => ({
  poRcv: state.toJS().procurement.poRcv,
  basicInfo: state.toJS().procurement.poRcv.basicInfo || {},
  poLines: state.toJS().procurement.poRcv.poLines || []
}), dispatch => bindActionCreators({
  fetchPoRcvInit,
  fetchPoRcvDetail,
  updatePoRcvLine,
  updatePoRcvBasicinfo,
  createPoRcv
}, dispatch))
class PoRcvDetail extends PureComponent {
  state = {
    editable: false
  }
  constructor(props) {
    super(props);
    this.handleSave =::this.handleSave;
    this.applyRcvQuantityChange =::this.applyRcvQuantityChange;
    this.hasInvalidateMaterial =::this.hasInvalidateMaterial;
    this.autoRcv =::this.autoRcv;
    this.searchParams = {};
    let that = this;
    // 收货单商品行信息
    this.columns = [
      {
        title: '行号',
        dataIndex: 'rowNo',
        key: 'rowNo',
        render: (text, record, index) => { return (<span>{index + 1}</span>) }
      },
      {
        title: '商品编码',
        dataIndex: 'materialCd',
        key: 'materialCd',

      },
      {
        title: '商品名称',
        dataIndex: 'materialName',
        key: 'materialName',
      },
      {
        title: '规格',
        dataIndex: 'spec',
        key: 'spec',
      },
      {
        title: '产地',
        dataIndex: 'madeIn',
        key: 'madeIn',
      }, {
        title: '采购内装数',
        dataIndex: 'poInnerAmount',
        key: 'poInnerAmount',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit'
      },

      {
        title: '采购数量',
        dataIndex: 'poQuantity',
        key: 'poQuantity'

      },
      {
        title: '供应商出库数量',
        dataIndex: 'deliveriedQuantity',
        key: 'deliveriedQuantity'
      }
      ,
      {
        title: '收货数量',
        dataIndex: 'rcvQuantity',
        key: 'rcvQuantity',
        render: (text, record, index) => <EditableCell
          value={text}
          editable={this.state.editable}
          deliveriedQuantity={record.deliveriedQuantity}
          onChange={value => this.applyRcvQuantityChange(record, index, value)}
        />
      }
    ];
  }

  /**
   * 采购数量变化回调
   * 
   * result:{value:输入值,isValidate:检验结果 true/false}
   */
  applyRcvQuantityChange = (record, index, result) => {
    let { value, isValidate } = result;
    if (record) {
      //未输入收货数量，则清空store中收货数量，校验结果
      if (!value) {
        record.rcvQuantity = null;
        record.isValidate = null;
        this.props.updatePoRcvLine(record);
      } else {
        //保存输入数据和校验状态 给submit用
        record.rcvQuantity = value;
        record.isValidate = isValidate;
        this.props.updatePoRcvLine(record);
        //输入采购收货数量合法，更新store
        if (!isValidate) {
          message.error("采购数量必须小于供应商出库数量");
        }
      }
    }
  }
  /**
   * 根据传入参数，判断是新建收货单 还是显示收获单详情
   * 
   * step 1：校验采购单id 收货单id
   *    a.两者都不存在，校验失败，返回前一界面
   * step 2:根据收货单id，采购单id 查询收货单详情
   *    a.若查询出收货单详情，显示收货单详情（不可编辑）
   *    b.若查询不出收获单详情，执行step 3
   * step 3:根据传入采购单id，查询采购单信息并做成收获单
   *        
   */
  componentDidMount() {
    let that = this;
    const { match } = this.props;
    //收货单id
    let poRcvId = match.params.porcvid;
    //采购单id
    let poId = match.params.poid;

    //step 1：校验采购单id 收货单id
    if (!poRcvId && !poId) {
      history.back();
    }
    //step 2:根据收货单id或采购单id 查询收货单详情
    this.searchParams = { poRcvId: poRcvId, poId: poId };
    //TODO  设想改接口可以根据 （采购单id 或 收获单id 或二者同时） 进行查询并返回唯一记录
    //请根据后端api进行调整
    this.props.fetchPoRcvDetail({ poRcvId: poRcvId, poId: poId }).then(
      function (res) {
        //a.若查询出收货单详情，显示收货单详情（不可编辑）
        if (res.data && res.data.basicInfo && res.data.basicInfo.rcvNo) {
          that.setState({ editable: false });
        } else {
          if (poId) {
            //step 3:根据传入采购单id，查询采购单信息并做成收获单
            that.props.fetchPoRcvInit({ poId: poId });
            that.setState({ editable: true });
          } else {
            //采购单id不存在，则返回前一界面
            history.back();
          }
        }
      }

    );
  }
  /**
   * 一键收货
   * 根据供应商发货数量自动填充收货数量
   * 
   * 填充条件：收货数量为空
   * 
   */
  autoRcv() {
    let that = this;
    this.props.poLines.forEach(function (record) {
      if (!record.rcvQuantity) {
        record.rcvQuantity = record.deliveriedQuantity;
        that.props.updatePoRcvLine(record);
      }
    });
  }
  /**
   *返回商品行中是否存在检验失败记录
   * true/false
   **/
  hasInvalidateMaterial() {
    return this.props.poLines.some((element, index, array) => {
      if (typeof element.isValidate == undefined || element.isValidate == null) {
        return false;
      }
      return (!element.isValidate);
    })
  }

  /**
   *step1:检验form(基本信息)和商品行信息
   *      a.检验失败，显示错误信息
   *      b.校验成功，执行step2
   * step2:准备数据 basicInfo:{},poLines:[]
   * 
   * step3:调用创建收购单api
   */
  handleSave() {
    const { form } = this.props;
    form.validateFields((err, values) => {
      //step1:检验form(基本信息)和商品行信息
      if (!err && !this.hasInvalidateMaterial()) {
        //step2:准备数据 basicInfo:{},poLines:[]
        const { asn } = values;
        this.props.updatePoRcvBasicinfo({ asn });
        let materials = []
        this.props.poLines.forEach(function (element) {
          materials.push({ id: element.id, rcvQuantity: element.rcvQuantity, materialCd: element.materialCd });
        }, this);
        //step3:调用创建收购单api
        this.props.createPoRcv({ basicInfo: { asn: asn }, poLines: materials }).then(function (res) {
          console.log(res);
          //如果创建成功，返回列表界面
          if (res.success) {
            message.success("采购收货单创建成功！");
            history.back();
          } else {
            message.error("采购收货单创建失败，请检查！");
          }
        });
      } else {
        //step1 a.检验失败，显示错误信息
        message.error("校验失败，请检查！");
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { poLines } = this.props;
    return (
      <div className="po-rcv-detail">
        <Form layout="inline">
          <div className="basic-box">
            <div className="header">
              <Icon type="solution" className="header-icon" />基础信息
            </div>
            <div className="body">
              <Row >
                <Col span={8}>
                  {/* 收货单号 */}
                  <span className="ant-form-item-label"><label>收货单号</label> </span>
                  <span className="text">{this.props.basicInfo.rcvNo}</span>
                </Col>
                <Col span={8}>
                  {/* 采购单号 */}
                  <span className="ant-form-item-label"><label>采购单号</label> </span>
                  <span className="text">{this.props.basicInfo.poNo}</span>
                </Col>
                <Col span={8}>
                  {/* ASN */}
                  <FormItem formItemLayout >
                    {this.state.editable && <FormItem label="ASN" formItemLayout>
                      {getFieldDecorator('asn', {
                        rules: [{ required: true, message: '请选输入ASN!' }],
                      })(
                        <Input
                        />
                        )}

                    </FormItem>
                    }
                    {!this.state.editable &&
                      <div><span className="ant-form-item-label"><label>ASN</label> </span>
                        <span className="text">{this.props.basicInfo.asn}</span></div>
                    }
                  </FormItem>
                </Col>
              </Row>

              <Row >
                <Col span={8}>
                  {/* 供应商 */}
                  <FormItem  >
                    <span className="ant-form-item-label"><label>供应商</label> </span>
                    <span className="text">{this.props.basicInfo.supplierCd}-{this.props.basicInfo.supplierName}</span>
                  </FormItem>
                </Col>
                <Col span={8}>
                  {/* 供应商地点 */}
                  <FormItem formItemLayout >
                    <span className="ant-form-item-label"><label>供应商地点</label> </span>
                    <span className="text">{this.props.basicInfo.supplierLocCd}-{this.props.basicInfo.supplierLocName}</span>
                  </FormItem>
                </Col>
                <Col span={8}>
                  {/*收货单状态 */}
                  <FormItem >
                    <span className="ant-form-item-label"><label>收货单状态</label> </span>
                    <span className="text">{this.props.basicInfo.poRcvStatusName}</span>
                  </FormItem>
                </Col>
              </Row>
              <Row >
                <Col span={8}>
                  {/* 地点类型 */}
                  <span className="ant-form-item-label"><label>地点类型</label> </span>
                  <span className="text">{this.props.basicInfo.locTypeName}</span>
                </Col>
                <Col span={8}>
                  {/* 地点 */}
                  <span className="ant-form-item-label"><label>地点</label> </span>
                  <span className="text">{this.props.basicInfo.addressCd}-{this.props.basicInfo.address}</span>
                </Col>
                <Col span={8}>
                  {/* 预计收货日期 */}
                  <span className="ant-form-item-label"><label>预计收货日期</label> </span>
                  <span className="text">{this.props.basicInfo.estDeliveryDate}</span>
                </Col>
              </Row>
              <Row >
                <Col span={8}>
                  {/* 预计到货日期 */}
                  <span className="ant-form-item-label"><label>预计到货日期</label> </span>
                  <span className="text">{this.props.basicInfo.estRcvDate}</span>
                </Col>
                <Col span={8}>
                  {/* 收货日期 */}
                  <span className="ant-form-item-label"><label>收货日期</label> </span>
                  <span className="text">{this.props.basicInfo.rcvDate}</span>
                </Col>
              </Row>
            </div>
          </div>
          <div className="">
            <Table dataSource={poLines} pagination={false} columns={this.columns} rowKey="id" scroll={{
              x: 1300
            }} />
          </div>
          {this.state.editable &&
            <div className="actions">
              <Row gutter={40} type="flex" justify="end" >
                <Col>
                  <FormItem>
                    <Button size="default" onClick={this.handleSave} type="primary">
                      确认收货
                                        </Button>
                  </FormItem>

                  <FormItem>
                    <Button size="default" onClick={this.autoRcv} >
                      一键收货
                                        </Button>
                  </FormItem>

                </Col>
              </Row>
            </div>
          }
        </Form>
      </div>
    )
  }
}

PoRcvDetail.propTypes = {

}

export default withRouter(Form.create()(PoRcvDetail));
