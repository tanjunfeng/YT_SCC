import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Select, DatePicker, message, Row, Col} from 'antd';
import { changePriceType } from '../constants';
import { Supplier, BranchCompany } from '../../../../container/search';
import SearchMind from '../../../../components/searchMind';
import Utils from '../../../../util/util';
import { DATE_FORMAT, PAGE_SIZE } from '../../../../constant/index';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const formItemLayout = {
    labelCol: { 
        span: 6 
    },
    wrapperCol: { 
        span: 14
    }
};

class SearchFormInput extends PureComponent {
    /**
     * props数据类型约束
     */

    static propTypes = {
        form: PropTypes.objectOf(PropTypes.any),
        onExcel: PropTypes.func,
        onQueryList: PropTypes.func,
        pubFetchValueList: PropTypes.func
    };

    queryParams = {};
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
     * 清空DatePicker
     */
    handleDatePickerClear = () => {
        this.setState({
            startTime: '',
            endTime: ''
        });
        this.props.form.resetFields(['rengeTime']);
    }

    /**
     * 选择子公司
     */
    handleBranchCompanyChange = ({ id }) => {
        this.setState({
            branchCompanyId: id
        });
    }

    /**
     * 商品-值清单
     */
    handleProductChoose = ({ record }) => {
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
        this.productSearchMind.reset();
    }

    /**
     * 价格变更记录日期选择
     * @param {array} result [moment, moment]
     */
    onEnterTimeChange = (result) => {
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

    handleSearch = () => {
        const { changeType } = this.props.form.getFieldsValue();
        this.queryParams = {...this.state, changeType: parseInt(changeType, 10)};
        this.handleQueryList();
    }

    handleReset = () => {
        this.queryParams = {};
        this.props.form.resetFields();
        this.handleSupplierAddrClear();
        this.handleProductClear();
        this.handleDatePickerClear();
        this.props.form.setFieldsValue({
            supplier: { reset: true }
        });

        this.props.form.setFieldsValue({
            branchCompany: { reset: true }
        });
    }

    handleExport = () => {
        const { onExcel } = this.props;
        onExcel(this.queryParams);
    }

    handleQueryList = () => {
        this.props.onQueryList(this.queryParams);
    }
    
    componentDidMount() {
        this.handleSearch();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { pubFetchValueList } = this.props;
        return (
            <div className="manage-form" id="prize-change-search-form">
                <Form  layout="inline">
                    <Row gutter = {40}>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="价格类型" className="sc-form-item">
                                {getFieldDecorator('changeType', {
                                    initialValue: changePriceType.defaultValue
                                })(
                                    <Select
                                        className="sc-form-item-select price-type"                                             
                                        size="large"
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
                        <Col span={8}>
                             <FormItem {...formItemLayout} label="供应商" className="sc-form-item">
                                    {getFieldDecorator('supplier', {
                                        initialValue: { spId: '', spNo: '', companyName: '' }
                                    })(
                                        <Supplier
                                            onChange={this.handleSupplierChange}
                                        />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="供应商地点" className="sc-form-item">
                                <SearchMind
                                    compKey="providerNo"
                                    ref={ref => { this.adressMind = ref }}
                                    disabled={this.props.form.getFieldValue('supplier').spId === ''}
                                    fetch={(params) =>
                                            pubFetchValueList(Utils.removeInvalid({
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
                        
                    </Row>

                    <Row  gutter = {40}>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="子公司" className="sc-form-item">
                                {getFieldDecorator('branchCompany', {
                                    initialValue: { id: '', name: '' }
                                })(<BranchCompany onChange={this.handleBranchCompanyChange} />)}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem  {...formItemLayout} label="商品" className="sc-form-item">
                                <SearchMind
                                    compKey="search-mind-sub-company"
                                    ref={ref => { this.productSearchMind = ref }}
                                    fetch={(params) =>
                                            pubFetchValueList({
                                            teamText: params.value,
                                            pageNum: params.pagination.current || 1,
                                            pageSize: params.pagination.pageSize
                                        }, 'queryProductForSelect')
                                    }
                                    rowKey="productId"
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
                        <Col span={8}>
                            <FormItem  {...formItemLayout} label="选择日期" className="sc-form-item">
                            {
                                getFieldDecorator('rengeTime', {})(
                                    <RangePicker
                                        className="rengeTime"
                                        format={DATE_FORMAT}
                                        placeholder={['开始时间', '结束时间']}
                                        onChange={this.onEnterTimeChange}
                                    />
                                )
                            }
                            </FormItem>
                        </Col>
                    </Row>

                    <Row gutter={40} type="flex" justify="end">
                        <Col span={8} className="tr">
                            <FormItem>
                                <Button
                                    type="primary"
                                    onClick={this.handleSearch}
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
                                    type="primary"
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
