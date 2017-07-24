/**
 * @file App.jsx
 * @author twh
 *
 * 采购单编辑页面
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import {
  Table,
  Form,
  Input,
  Select,
  Icon,
  Dropdown,
  Modal,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Button
} from 'antd';
import { fetchPoMngList } from '../../../actions';
import { poStatus, locType, poType } from '../../../constant/procurement';
import Utils from '../../../util/util';
import MaterialChooser from './MaterialChooser';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
@connect(state => ({ poLines: state.toJS().procurement.poLines }), dispatch => bindActionCreators({

}, dispatch))
class PoDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      //地点是否可编辑
      locDisabled: true
    }
    // 采购单商品行信息
    this.columns = [
      {
        title: '行号',
        dataIndex: 'rowNo',
        key: 'rowNo',
        render: (text, record, index) => { console.log(index); return (<span>{index + 1}</span>) }
      },
      {
        title: '商品编码',
        dataIndex: 'materialCd',
        key: 'materialCd',
        render: (text, record, index) => <MaterialChooser value={text} onChange={this.onCellChange(index, 'name')} />

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
        title: '税率',
        dataIndex: 'rate',
        key: 'rate'
      },
      {
        title: '采购价格（含税）',
        dataIndex: 'poPrice',
        key: 'poPrice'
      },
      {
        title: '采购数量',
        dataIndex: 'poQuatity',
        key: 'poQuatity',
        render: text => <InputNumber value={text} style={{ width: "80px" }} size="default"/>

      },
      {
        title: '采购金额（含税）',
        dataIndex: 'amount',
        key: 'amount'
      }
      ,
      {
        title: '已收货数量',
        dataIndex: 'rcvQuatity',
        key: 'rcvQuatity'
      }
    ];
    this.onLocTypeChange =::this.onLocTypeChange;

  }

  componentDidMount() {

  }
  onLocTypeChange(value) {
    //地点类型有值
    if (value) {
      //地点类型有值时，地点可编辑
      this.setState({ locDisabled: false });
      //清空地点值
      this.props.form.setFieldsValue({ addressCd: "", address: "" });
    } else {
      //地点类型无值时，地点不可编辑
      this.setState({ locDisabled: true });
      //地点类型无值时，清空地点值
      this.props.form.setFieldsValue({ addressCd: "", address: "" });
    }
  }
  onCellChange = (index, key) => {
    return (value) => {
      // const dataSource = [...this.state.dataSource];
      // dataSource[index][key] = value;
      // this.setState({ dataSource });
    };
  }
  render() {

    const { getFieldDecorator } = this.props.form;
    const { data } = this.props.poLines;
    return (
      <div className="">
        <Form layout="inline">
          <div className="">
            <Row >
              <Col span={8}>
                {/* 采购单号 */}
                <FormItem label="采购单号" formItemLayout>
                  {getFieldDecorator('poNo', {
                  })(
                    <Input disabled={true}
                    />
                    )}

                </FormItem>
              </Col>
              <Col span={8}>
                {/* 采购单类型 */}
                <FormItem label="采购单类型">
                  {getFieldDecorator('poTypeCd', {
                    initialValue: poType.defaultValue
                  })(
                    <Select style={{ width: '153px' }} size="default">
                      {
                        poType.data.map((item) => {
                          return <Option key={item.key} value={item.key}>{item.value}</Option>
                        })
                      }
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={8}>
                {/* 状态 */}
                <FormItem formItemLayout >
                  <span className="ant-form-item-label"><label>状态</label> </span>
                  <span>草稿</span>
                </FormItem>
              </Col>
            </Row>

            <Row >
              <Col span={8}>
                {/* 供应商 */}
                <FormItem formItemLayout >
                  <span className="ant-form-item-label"><label>供应商</label> </span>
                  <InputGroup compact style={{ display: 'inline' }}>
                    {getFieldDecorator('supplierCd', {
                    })(
                      <Input style={{ width: '60px' }} />
                      )}
                    {getFieldDecorator('supplierName', {
                    })(
                      <Input style={{ width: '100px' }} />
                      )}
                    <Button icon="ellipsis" style={{ width: '40px', display: 'inline' }} size="large"></Button>
                  </InputGroup>
                </FormItem>
              </Col>
              <Col span={8}>
                {/* 供应商地点 */}
                <FormItem formItemLayout >
                  <span className="ant-form-item-label"><label>供应商地点</label> </span>
                  <InputGroup compact style={{ display: 'inline' }}>
                    {getFieldDecorator('supplierLocCd', {
                    })(
                      <Input style={{ width: '60px' }} />
                      )}
                    {getFieldDecorator('supplierLocName', {
                    })(
                      <Input style={{ width: '100px' }} />
                      )}
                    <Button icon="ellipsis" style={{ width: '40px', display: 'inline' }} size="large"></Button>
                  </InputGroup>
                </FormItem>
              </Col>
              <Col span={8}>
                {/* 预计送货日期 */}
                <FormItem label="预计送货日期" formItemLayout>
                  {getFieldDecorator('poNo', {
                    initialValue: moment('2017-07-20', dateFormat)
                  })(
                    <DatePicker format={dateFormat} />
                    )}

                </FormItem>
              </Col>
            </Row>
            <Row >
              <Col span={8}>
                {/* 账期 */}
                <FormItem formItemLayout >
                  <span className="ant-form-item-label"><label>账期</label> </span>
                  <span>月结</span>
                </FormItem>
              </Col>
              <Col span={8}>
                {/* 付款方式 */}
                <FormItem formItemLayout >
                  <span className="ant-form-item-label"><label>付款方式</label> </span>
                  <span>xxxxx</span>
                </FormItem>
              </Col>
              <Col span={8}>
                {/* 货币类型 */}
                <FormItem label="货币类型" formItemLayout>
                  {getFieldDecorator('poNo', {
                    initialValue: "CNY"
                  })(
                    <Input
                    />
                    )}
                </FormItem>
              </Col>
            </Row>
            <Row >
              <Col span={8}>
                {/* 地点类型 */}
                <FormItem label="地点类型">
                  {getFieldDecorator('locTypeCd', {
                    initialValue: locType.defaultValue
                  })(
                    <Select style={{ width: '153px' }} size="default" onChange={this.onLocTypeChange}>
                      {
                        locType.data.map((item) => {
                          return <Option key={item.key} value={item.key}>{item.value}</Option>
                        })
                      }
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={8}>
                {/* 地点 */}
                <FormItem formItemLayout >
                  <span className="ant-form-item-label"><label>地点</label> </span>
                  <InputGroup compact style={{ display: 'inline' }}>
                    {getFieldDecorator('addressCd', {
                    })(
                      <Input style={{ width: '60px' }} disabled={this.state.locDisabled} />
                      )
                    }
                    {getFieldDecorator('address', {
                    })(
                      <Input style={{ width: '100px' }} disabled={this.state.locDisabled} />
                      )
                    }
                    < Button icon="ellipsis" style={{ width: '40px', display: 'inline' }} disabled={this.state.locDisabled} size="large"></Button>


                  </InputGroup>
                </FormItem>
              </Col>
              <Col span={8}>
                {/* 大类 */}
                <FormItem formItemLayout >
                  <span className="ant-form-item-label"><label>大类</label> </span>
                  <InputGroup compact style={{ display: 'inline' }}>
                    <Input style={{ width: '60px' }} defaultValue="" />
                    <Input style={{ width: '100px' }} defaultValue="" />
                  </InputGroup>
                </FormItem>
              </Col>
            </Row>
            <Row >
              <Col span={8}>
                {/* 创建者 */}
                <FormItem label="创建者">
                  <span>xxx  xxx</span>
                </FormItem>
              </Col>
              <Col span={8}>
                {/* 创建日期 */}
                <FormItem label="创建日期">
                  <span>2017-07-14</span>
                </FormItem>
              </Col>
            </Row>
            <Row >
              <Col span={8}>
                {/* 审核人 */}
                <FormItem label="审核人">
                  <span>xxx  xxx</span>
                </FormItem>
              </Col>
              <Col span={8}>
                {/* 审核日期 */}
                <FormItem label="审核日期">
                  <span>2017-07-14</span>
                </FormItem>
              </Col>
            </Row>
          </div>

          <div className="manage-list">
            <Table dataSource={data} pagination={false} columns={this.columns} rowKey="id" scroll={{
              x: 1300
            }} />
          </div>
        </Form>
      </div>
    )
  }
}

PoDetail.propTypes = {

}

export default withRouter(Form.create()(PoDetail));
