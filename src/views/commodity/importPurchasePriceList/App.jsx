import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Form, Input, Button, Row, Col, Select,
    Icon, Table, message, Upload,
    DatePicker
} from 'antd';
import moment from 'moment';
import { Supplier } from '../../../container/search';
import SearchMind from '../../../components/searchMind';
import { pubFetchValueList } from '../../../actions/pub';
import {
    queryPurchasePriceInfo,
    createPurchase,
} from '../../../actions/purchasePrice';
import Utils from '../../../util/util';
import {processResult} from '../../../constant/procurement';
import { purchasePriceColumns } from './columns';
import { PAGE_SIZE } from '../../../constant';
import {
    purchasePriceChangeExport,
    purchasePriceChangeExcelTemplate,
} from '../../../service';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(state => ({
    purchasePriceInfo: state.toJS().purchasePrice.purchasePriceInfo,
}), dispatch => bindActionCreators({
    pubFetchValueList,
    queryPurchasePriceInfo,
    createPurchase
}, dispatch))

class ImportPurchasePriceList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            spAdrId: '',
            spId: '',
            productId: ''
        }
        this.param = {};
        this.uploadProps = {
            name: 'excel',
            action: '/prodPurchase/purchasePriceChangeUpload',
            onChange(info) {
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 导入成功`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 导入失败`);
                }
            },
        };
    }
    componentDidMount() {
        this.handleReset();
        this.queryPurchasePrice();
    }
    /**
     * 点击翻页
     * @param {pageNumber}    pageNumber
     */
    onPaginate = (pageNum) => {
        Object.assign(this.param, { pageNum});
        this.queryPurchasePrice();
    }

    /**
     * 获取查询参数
     */
    getSearchParam = () => {
        const formValues = this.props.form.getFieldsValue();
        const {id, importTime, result, supplier} = formValues;
        const spId = supplier.spId;
        const uploadStartDate = importTime ? importTime[0].valueOf().toString() : null;
        const uploadEndDate = importTime ? importTime[1].valueOf().toString() : null;
        return {
            ...Utils.removeInvalid({
                importsId: id,
                spId,
                handleResult: result,
                spAdrId: this.state.spAdrId,
                productId: this.state.productId,
                uploadStartDate,
                uploadEndDate
            })
        }
    }
    queryPurchasePrice = () => {
        this.props.queryPurchasePriceInfo(this.param);
    }

    /**
    * 导出Excel
    */
    handleDownResult = () => {
        const searchData = this.getSearchParam();
        Utils.exportExcel(purchasePriceChangeExport, searchData);
    }

    /**
     * 下载模板
     */
    handleDownloadTemplate = () => {
        Utils.exportExcel(purchasePriceChangeExcelTemplate);
    }
    handleReset = () => {
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        }
    }
    handleResetFields = () => {
        this.props.form.resetFields();
        this.supplyAddressSearchMind.reset();
        this.product.reset();
        this.setState({
            spAdrId: '',
            productId: ''
        })
    }
    /**
     * 获取搜索框参数，进行采购进价表查询
     */
    handleQuery = () => {
        this.handleReset();
        const data = this.getSearchParam();
        this.props.queryPurchasePriceInfo(Object.assign({}, data, this.param));
    }
    /**
     * 获取供应商地点编号
     */
    handleSupplierAddressChoose = ({ record }) => {
        this.setState({ spAdrId: record.spAdrid });
    }

    /**
     * 获取供应商
     */
    handleSupplierChange = (record) => {
        this.setState({spId: record.spId});
    }
    /**
     * 清空供应商地点编号
     */
    handleSupplierAddressClear = () => {
        this.setState({ spAdrId: '' });
        this.supplyAddressSearchMind.reset();
    }
    /**
     * 获取商品id
     */
    handleProductChoosed = (record) => {
        this.setState({productId: record.record.productId})
    }
    /**
     * 创建变价单
     */
    handleCreate = () => {
        this.props.createPurchase()
            .then(res => {
                if (res.code === 200) {
                    message.success(res.message);
                }
            })
    }
    render() {
        const { getFieldDecorator} = this.props.form;
        const { spAdrId, spId } = this.state;
        const supplierInfo = spAdrId ? `${spAdrId}-1` : null;
        const { purchasePriceInfo = {} } = this.props;
        if (!purchasePriceInfo) {
            return null;
        }
        const { data = [], total, pageNum } = purchasePriceInfo;
        let errorResult = false;
        for (let i = 0; i < data.length; i++) {
            if (data[i].handleResult === 0) {
                errorResult = true;
            }
        }
        return (
            <div className="purchase-Price-list">
                <Form>
                    <Row className="purchase-price-search-box">
                        <Col>
                            {/* 上传ID */}
                            <FormItem label="上传ID">
                                {getFieldDecorator('id', {
                                })(<Input size="default" />)}
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 供应商 */}
                            <FormItem label="供应商" className="label-top">
                                {getFieldDecorator('supplier', {
                                    initialValue: { spId: '', spNo: '', companyName: '' }
                                })(<Supplier onChange={this.handleSupplierChange} />)}
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 供应商地点 */}
                            <FormItem label="供应商地点" className="label-top">
                                <SearchMind
                                    compKey="providerNo"
                                    rowKey="providerNo"
                                    disabled={spId === ''}
                                    ref={ref => { this.supplyAddressSearchMind = ref }}
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
                                    onChoosed={this.handleSupplierAddressChoose}
                                    onClear={this.handleSupplierAddressClear}
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
                        <Col>
                            {/* 商品 */}
                            <FormItem className="product-search">
                                <SearchMind
                                    style={{ zIndex: 6000, marginBottom: 5 }}
                                    compKey="productCode"
                                    rowKey="productCode"
                                    ref={ref => { this.product = ref }}
                                    fetch={(params) =>
                                        this.props.pubFetchValueList({
                                            supplierInfo,
                                            teamText: params.value,
                                            pageNum: params.pagination.current || 1,
                                            pageSize: params.pagination.pageSize
                                        }, 'queryProductForSelect')
                                    }
                                    disabled={spId === ''}
                                    addonBefore="商品"
                                    onChoosed={this.handleProductChoosed}
                                    renderChoosedInputRaw={(product) => (
                                        <div>{product.productCode} - {product.saleName}</div>
                                    )}
                                    pageSize={6}
                                    columns={[
                                        {
                                            title: '商品编码',
                                            dataIndex: 'productCode',
                                            width: 98
                                        }, {
                                            title: '商品名称',
                                            dataIndex: 'saleName',
                                            width: 140
                                        }
                                    ]}
                                />
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 处理结果 */}
                            <FormItem label="处理结果">
                                {getFieldDecorator('result', { initialValue: processResult.defaultValue })(
                                    <Select size="default">
                                        {
                                            processResult.data.map((item) => (
                                                <Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Option>))
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 上传日期 */}
                            <FormItem label="上传日期">
                                {getFieldDecorator('importTime', {})(
                                    <RangePicker
                                        format={dateFormat}
                                        showTime={{
                                            hideDisabledOptions: true,
                                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                        }}
                                        placeholder={['开始日期', '结束日期']}
                                    />
                                )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={40} type="flex" justify="end">
                        <Col >
                            <Button size="default" type="primary" onClick={this.handleQuery}>
                                查询
                            </Button>
                            <Button size="default" onClick={this.handleResetFields}>
                                重置
                            </Button>
                            <a onClick={this.handleDownloadTemplate}>
                                下载模板
                            </a>
                            <Upload {...this.uploadProps}>
                                <Button>
                                    <Icon type="upload" /> 导入Excel
                                </Button>
                            </Upload>
                            <Button type="primary" size="default" onClick={this.handleDownResult} disabled={data.length === 0}>
                                下载导入结果
                            </Button>
                            <Button type="primary" onClick={this.handleCreate} size="default" disabled={data.length === 0 || errorResult}>
                                创建变价单
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <div>
                    <Table
                        dataSource={data}
                        columns={purchasePriceColumns}
                        rowKey="list"
                        scroll={{
                            x: 1600
                        }}
                        pagination={{
                            current: pageNum,
                            total,
                            pageSize: PAGE_SIZE,
                            showQuickJumper: true,
                            onChange: this.onPaginate
                        }}
                    />
                </div>
            </div>
        )
    }
}
ImportPurchasePriceList.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    pubFetchValueList: PropTypes.func,
    queryPurchasePriceInfo: PropTypes.func,
    purchasePriceInfo: PropTypes.objectOf(PropTypes.any),
    createPurchase: PropTypes.func,
}
export default withRouter(Form.create()(ImportPurchasePriceList));
