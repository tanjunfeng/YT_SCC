import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Select, DatePicker, message, Row, Col, Cascader} from 'antd';
import { changePriceType } from '../constants';
import { Supplier, BranchCompany } from '../../../../container/search';
import SearchMind from '../../../../components/searchMind';
import Utils from '../../../../util/util';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pubFetchValueList } from '../../../../actions/pub';
import { DATE_FORMAT, PAGE_SIZE } from '../../../../constant/index';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const options = [{
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{
      value: 'hangzhou',
      label: 'Hangzhou',
      children: [{
        value: 'xihu',
        label: 'West Lake',
      }],
    }],
  }, {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [{
      value: 'nanjing',
      label: 'Nanjing',
      children: [{
        value: 'zhonghuamen',
        label: 'Zhong Hua Men',
      }],
    }],
  }];
  
const onChange = value => {
    console.log(value);
  };

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};

@connect(() => ({}), dispatch => bindActionCreators({
    pubFetchValueList
}, dispatch))

class SearchFormInput extends Component {

    state = {
        changeType: '',
        spId: '',
        spAdrId: '',
        branchCompanyId: '',
        productId: null,
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: PAGE_SIZE
    }

    /**
     * 供应商选择
     */
    handleSupplierChange = ({spId}) => {
        this.setState({
            spId
        });
    }

    /**
     * 供应商地址选择
     */
    handleSupplierAddrSelect = ({record}) => {
        this.setState({
            spAdrId: record.spAdrid
        });
    }

     /**
     * 清空选择的供应商地址
     */
    handleSupplierAddrClear = () => {
        this.setState({
            spAdrId: ''
        });
        this.adressMind.reset();
    }

    /**
     * 选择子公司
     */
    handleBranchCompanyChange = ({ id }) => {
        this.setState({
            branchCompanyId: id
        });
    }

    handleProductSelect = val => {
        console.log(val);
    }


    /**
     * 商品-值清单
     */
    handleProductChoose = ({ record }) => {
        console.log(record);
        this.setState({
            productId: record.productId,
        });
    }

       /**
     * 商品-清除
     */
    handleProductClear = () => {
        this.setState({
            productId: null,
        });
    }

    /**
     * 价格变更记录日期选择
     * @param {array} result [moment, moment]
     */
    onEnterTimeChange = (result) => {
        console.log(result)
        let startTime = '';
        let endTime = '';
        
        if (result.length === 2) {
            startTime = result[0].valueOf().toString();
            endTime = result[1].valueOf().toString();
        }

        if (result.length === 0) {
            startTime = '';
            endTime = '';
        }

        this.setState({
            startTime,
            endTime
        });
    }

    handleGetValSearch = () => {
        const { priceType } = this.props.form.getFieldsValue();
        // console.log(this.props.form.getFieldsValue());
        // const { changeType, spId, spAdrId, branchCompanyId, productId, startTime, endTime, pageNum, pageSize } = this.state;
        const queryParams = {priceType, ...this.state};
        console.log(queryParams);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="manage-form prize-change-search-form" id="prize-change-search-form">
                <Form  layout="inline" onSubmit={this.handleSubmit}>
                    <Row gutter = {40}>
                        <Col span={6}>
                            <FormItem {...formItemLayout} className="sc-form-item" label="价格类型">
                                {getFieldDecorator('priceType', {
                                    initialValue: changePriceType.defaultValue
                                })(
                                    <Select
                                        className="sc-form-item-select"                                             
                                        size="large"
                                        style={{ width: 270 }} 
                                        onChange={this.handleChange}>
                                        {
                                            changePriceType.data.map(item => (
                                                <Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                             <FormItem {...formItemLayout} className="sc-form-item" label="供应商">
                                    {getFieldDecorator('supplier', {
                                        initialValue: { spId: '', spNo: '', companyName: '' }
                                    })(
                                        <Supplier
                                            onChange={this.handleSupplierChange}
                                        />
                                    )}
                            </FormItem>
                        </Col>
                        <Col  className="gutter-row" span={6}>
                            <FormItem {...formItemLayout} label="供应商地点" className="sc-form-item">
                                <SearchMind
                                    style={{ zIndex: 9 }}
                                    compKey="providerNo"
                                    ref={ref => { this.adressMind = ref }}
                                    disabled={this.props.form.getFieldValue('supplier').spId === ''}
                                    fetch={(params) =>
                                        this.props.pubFetchValueList(Utils.removeInvalid({
                                            condition: params.value,
                                            pageSize: params.pagination.pageSize,
                                            pageNum: params.pagination.current || 1
                                        }), 'supplierAdrSearchBox').then((res) => {
                                            const dataArr = res.data.data || [];
                                            if (!dataArr || dataArr.length === 0) {
                                                message.warning('没有可用的数据');
                                            }
                                            return res;
                                        })}
                                    rowKey="providerNo"
                                    onChoosed={this.handleSupplierAddrSelect}
                                    onClear={this.handleSupplierAddrClear}
                                    renderChoosedInputRaw={(res) => (
                                        <div>{res.providerNo} - {res.providerName}</div>
                                    )}
                                    pageSize={6}
                                    columns={[
                                        {
                                            title: '供应商地点编码',
                                            dataIndex: 'providerNo',
                                            width: 98
                                        }, {
                                            title: '供应商地点名称',
                                            dataIndex: 'providerName'
                                        }
                                    ]}
                                />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout} className="sc-form-item" label="子公司">
                                {getFieldDecorator('branchCompany', {
                                    initialValue: { id: '', name: '' }
                                })(<BranchCompany onChange={this.handleBranchCompanyChange} />)}
                            </FormItem>
                        </Col>
                    </Row>

                    <Row  gutter = {40}>
                        <Col span={6}>
                            <FormItem {...formItemLayout} className="sc-form-item" label="商品分类">
                                <Cascader placeholder="请选择" style={{ width: 270 }} options={options} onChange={this.handleProductSelect} />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem  {...formItemLayout} label="选择日期"  className="sc-form-item">
                                <RangePicker
                                    // value={this.state.rengeTime}
                                    style={{ width: 210 }} 
                                    format={DATE_FORMAT}
                                    placeholder={['开始时间', '结束时间']}
                                    onChange={this.onEnterTimeChange}
                                />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem  {...formItemLayout} label="商品"  className="sc-form-item">
                                <SearchMind
                                    compKey="search-mind-sub-company"
                                    ref={ref => { this.productSearchMind = ref }}
                                    fetch={(params) =>
                                        this.props.pubFetchValueList({
                                            teamText: params.value,
                                            pageNum: params.pagination.current || 1,
                                            pageSize: params.pagination.pageSize
                                        }, 'queryProductForSelect')
                                    }
                                    onChoosed={this.handleProductChoose}
                                    onClear={this.handleProductClear}
                                    renderChoosedInputRaw={(row) => (
                                        <div>{row.saleName}</div>
                                    )}
                                    pageSize={6}
                                    columns={[
                                        {
                                            title: '商品ID',
                                            dataIndex: 'productId',
                                            width: 180,
                                        }, {
                                            title: '商品名字',
                                            dataIndex: 'saleName',
                                            width: 200,
                                        }
                                    ]}
                                />
                            </FormItem>
                        </Col>
                    </Row>

                    <Row gutter={40} type="flex" justify="end">
                        <Col span={8} className="tr">
                            <FormItem>
                                <Button
                                    type="primary"
                                    onClick={this.handleGetValSearch}
                                    size="default">
                                        搜索
                                    </Button>
                            </FormItem>
                            <FormItem>
                                <Button 
                                    size="default" 
                                    onClick={this.handleReset}>
                                        重置
                                    </Button>
                            </FormItem>
                            <FormItem>
                                <Button 
                                    onClick={this.handleExport}
                                    size="default">
                                        导出供应商列表
                                    </Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default Form.create()(SearchFormInput);
