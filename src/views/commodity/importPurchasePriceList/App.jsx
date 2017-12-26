import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Form, Input, Button, Row, Col, Select,
    Icon, Table, Menu, Dropdown, message, Modal,
    DatePicker
} from 'antd';
import moment from 'moment';
import { Supplier } from '../../../container/search';
import SearchMind from '../../../components/searchMind';
import { pubFetchValueList } from '../../../actions/pub';
import { queryPurchasePriceInfo } from '../../../actions/purchasePrice';
import Utils from '../../../util/util';
import {processResult} from '../../../constant/procurement';
import { purchasePriceColumns } from './columns';
import { PAGE_SIZE } from '../../../constant';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(state => ({
    // purchasePriceInfo: state.toJS().purchasePrice.purchasePriceInfo,
}), dispatch => bindActionCreators({
    pubFetchValueList,
    queryPurchasePriceInfo
}, dispatch))

class ImportPurchasePriceList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            spAdrId: '',
            spId: '',
            businessMode: '',
        }
    }
    /**
     * 点击翻页
     * @param {pageNumber}    pageNumber
     */
    onPaginate = (pageNumber) => {
        this.current = pageNumber
        this.queryPoList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            ...this.searchParams
        });
    }
    /**
     * 获取供应商地点编号
     */
    handleSupplierAddressChoose = ({ record }) => {
        this.setState({ spAdrId: record.spId });
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
        this.setState({})
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { spAdrId, businessMode, spId } = this.state;
        const supplierInfo = spAdrId ? `${spAdrId}-1` : null;
        const distributionStatus = businessMode;
        const { purchasePriceInfo = {} } = this.props;
        const { data = [], total, pageNum } = purchasePriceInfo;
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
                                })(<Supplier />)}
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 供应商地点 */}
                            <FormItem label="供应商地点" className="label-top">
                                <SearchMind
                                    compKey="providerNo"
                                    disabled={getFieldValue('supplier').spId === ''}
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
                            <FormItem className="product-search" className="">
                                <SearchMind
                                    style={{ zIndex: 6000, marginBottom: 5 }}
                                    compKey="productCode"
                                    rowKey="productCode"
                                    ref={ref => { this.addPo = ref }}
                                    fetch={(params) =>
                                        this.props.pubFetchValueList({
                                            supplierInfo,
                                            distributionStatus,
                                            teamText: params.value,
                                            pageNum: params.pagination.current || 1,
                                            pageSize: params.pagination.pageSize
                                        }, 'queryProductForSelect')
                                    }
                                    disabled={spId !== ''}
                                    addonBefore="商品"
                                    onChoosed={this.handleProductChoosed}
                                    renderChoosedInputRaw={(data) => (
                                        <div>{data.productCode} - {data.saleName}</div>
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
                            <Button size="default" type="danger" onClick={this.handleResetValue}>
                                重置
                            </Button>
                            <a onClick={this.handleDown}>
                                下载模板
                            </a>
                            <Button size="default" onClick={this.handleExport}>
                                导入Excel
                            </Button>
                            <Button size="default" onClick={this.handleResetValue}>
                                下载导入结果
                            </Button>
                            <Button type="primary" onClick={this.handleSearch} size="default">
                                创建变价单
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <div>
                    <Table
                        dataSource={data}
                        columns={purchasePriceColumns}
                        rowKey="id"
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
}
export default withRouter(Form.create()(ImportPurchasePriceList));
