import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Input, Form, Select, DatePicker, Row, Col } from 'antd';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import { connect } from 'react-redux';
import Utils from '../../../util/util';
import { poStatus, locType, poType, businessModeType } from '../../../constant/procurement';
import SearchMind from '../../../components/searchMind';
import {
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierLocMap
} from '../../../actions'

import { pubFetchValueList } from '../../../actions/pub';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
@connect(
    state => ({
        employeeCompanyId: state.toJS().user.data.user.employeeCompanyId
    }),
    dispatch => bindActionCreators({
        getWarehouseAddressMap,
        getShopAddressMap,
        getSupplierLocMap,
        pubFetchValueList
    }, dispatch)
)

class PoSearchForm extends PureComponent {
    constructor(props) {
        super(props);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.state = {
            spId: '',   // 供应商ID
            isSupplyAdrDisabled: true, // 供应商地点禁用
            locDisabled: true,
            locationData: {}
        }
    }

    // 地点类型改变时回调
    onLocTypeChange = (value) => {
        this.poAddress.reset();
        this.adressTypeCode = '';
        this.setState({
            locDisabled: locType.defaultValue === value
        })
    }


    // 获取用于搜索的所有有效表单值
    getSearchParams = () => {
        const {
            purchaseNumber,
            locTypeCode,
            businessModeCode,
            purchaseTypeCode,
            statusCode,
            createTime,
            auditTime
        } = this.props.form.getFieldsValue();

        const startCreateTime = createTime ? Date.parse(createTime[0].format(dateFormat)) : '';
        const endCreateTime = createTime ? Date.parse(createTime[1].format(dateFormat)) : '';
        const startAuditTime = auditTime ? Date.parse(auditTime[0].format(dateFormat)) : '';
        const endAuditTime = auditTime ? Date.parse(auditTime[1].format(dateFormat)) : '';
        const searchParams = {
            purchaseOrderNo: purchaseNumber,
            spNo: this.supplierEncoded,
            spAdrId: this.supplierAdressId,
            adrType: locTypeCode,
            adrTypeCode: this.adressTypeCode,
            secondCategoryId: this.GoodsTypeId,
            purchaseOrderType: purchaseTypeCode,
            status: statusCode,
            startCreateTime,
            endCreateTime,
            startAuditTime,
            endAuditTime,
            businessMode: businessModeCode
        };

        return Utils.removeInvalid(searchParams);
    }

    /**
     * 地点选择
     * @return {Promise}
     */
    handleGetAddressMap = (param) => {
        const { locTypeCode } = this.props.form.getFieldsValue(['locTypeCode'])
        const libraryCode = '0';
        const storeCode = '1';
        let locationTypeParam = '';
        if (locTypeCode === libraryCode) {
            locationTypeParam = 'getWarehouseLogic';
            this.setState({
                locationData: {
                    code: 'warehouseCode',
                    name: 'warehouseName'
                }
            })
        }
        if (locTypeCode === storeCode) {
            locationTypeParam = 'getStoreInfo';
            this.setState({
                locationData: {
                    code: 'id',
                    name: 'name'
                }
            })
        }
        return this.props.pubFetchValueList({
            param: param.value,
            pageNum: param.pagination.current || 1,
            pageSize: param.pagination.pageSize
        }, locationTypeParam);
    }

    // 选择供应商回调
    handleSupplyChoose = ({ record }) => {
        this.setState({
            spId: record.spId,
            orgId: this.props.employeeCompanyId,
            isSupplyAdrDisabled: false
        });
        this.supplierEncoded = record.spNo;
        this.handleSupplierAddressClear();
    }

    // 清除供应商值
    handleSupplyClear = () => {
        this.supplier.reset();
        this.supplierEncoded = '';
        this.setState({
            spId: '',
            isSupplyAdrDisabled: true
        });
        this.handleSupplierAddressClear();
    }

    // 选择供应商地点回调
    handleSupplierAdressChoose = ({ record }) => {
        this.supplierAdressId = record.spAdrid;
    }

    /**
     * 清空供应商地点编号
     */
    handleSupplierAddressClear = () => {
        this.supplierLoc.reset();
        this.supplierAdressId = '';
    }

    // 选择地点回调
    handleAddressChoose = ({ record }) => {
        const encoded = record[this.state.locationData.code];
        this.adressTypeCode = encoded;
    }

    // 清除地点值
    handleAddressClear = () => {
        this.poAddress.reset();
        this.adressTypeCode = '';
        this.setState({
            locDisabled: true
        })
    }

    // 选择大类回调
    handleGoodsTypeChoose = ({ record }) => {
        this.GoodsTypeId = record.id;
    }

    // 清除大类值
    hanldeTypeClear = () => {
        this.bigClass.reset();
        this.GoodsTypeId = '';
    }

    // 搜索回调
    handleSearch = () => {
        const { onSearch } = this.props;
        const seachParams = this.getSearchParams();
        if (onSearch) {
            onSearch(seachParams);
        }
    }

    // 重置回调
    handleResetValue = () => {
        const { onReset } = this.props;

        this.props.form.resetFields();
        this.handleSupplyClear();
        this.handleAddressClear();
        this.hanldeTypeClear();

        if (onReset) {
            onReset();
        }
    }

    handleDelete() {
        const { onDelete } = this.props;
        onDelete();
    }

    handleDownPDF = () => {
        const seachParams = this.getSearchParams();
        const { onDownPDF } = this.props;
        if (onDownPDF) {
            onDownPDF(seachParams);
        }
    }

    // 点击新建跳转到新建采购单
    handleCreate() {
        this.props.history.push('/po/create');
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { auth } = this.props;
        return (
            <Form layout="inline" className="po-mng-list">
                <Row gutter={40}>
                    <Col>
                        <FormItem label="采购单号" >
                            {getFieldDecorator('purchaseNumber', {
                            })(<Input size="default" />)}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="地点类型">
                            {getFieldDecorator('locTypeCode', {
                                initialValue: locType.defaultValue
                            })(
                                <Select size="default" onChange={this.onLocTypeChange}>
                                    {locType.data.map((item) => (
                                        <Option key={item.key} value={item.key}>
                                            {item.value}
                                        </Option>
                                    ))}
                                </Select>)}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="地点">
                            <SearchMind
                                style={{ zIndex: 101 }}
                                compKey="comPoAddress"
                                ref={ref => { this.poAddress = ref }}
                                onClear={this.handleAddressClear}
                                fetch={this.handleGetAddressMap}
                                onChoosed={this.handleAddressChoose}
                                renderChoosedInputRaw={(row) => (
                                    <div>
                                        {row[this.state.locationData.code]}
                                        - {row[this.state.locationData.name]
                                        }
                                    </div>
                                )}
                                disabled={this.state.locDisabled}
                                pageSize={6}
                                columns={[
                                    {
                                        title: '编码',
                                        dataIndex: this.state.locationData.code,
                                        width: 80
                                    }, {
                                        title: '名称',
                                        dataIndex: this.state.locationData.name
                                    }
                                ]}
                            />
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="采购单类型">
                            {getFieldDecorator('purchaseTypeCode', {
                                initialValue: poType.defaultValue
                            })(
                                <Select size="default">
                                    {
                                        poType.data.map((item) => (
                                            <Option key={item.key} value={item.key}>
                                                {item.value}
                                            </Option>
                                        ))
                                    }
                                </Select>
                                )}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="状态">
                            {getFieldDecorator('statusCode', {
                                initialValue: poStatus.defaultValue
                            })(
                                <Select size="default">
                                    {
                                        poStatus.data.map((item) => (
                                            <Option key={item.key} value={item.key}>
                                                {item.value}
                                            </Option>
                                        ))
                                    }
                                </Select>)}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="大类">
                            <SearchMind
                                compKey="comBigClass"
                                ref={ref => { this.bigClass = ref }}
                                fetch={(param) => this.props.pubFetchValueList({
                                    param: param.value,
                                    level: 2,
                                    pageNum: param.pagination.current || 1,
                                    pageSize: param.pagination.pageSize
                                }, 'querycategories')}
                                onChoosed={this.handleGoodsTypeChoose}
                                renderChoosedInputRaw={(row) => (
                                    <div>{row.id} - {row.categoryName}</div>
                                )}
                                onClear={this.hanldeTypeClear}
                                pageSize={6}
                                columns={[
                                    {
                                        title: '编码',
                                        dataIndex: 'id',
                                        width: 80
                                    }, {
                                        title: '名称',
                                        dataIndex: 'categoryName'
                                    }
                                ]}
                            />
                        </FormItem>
                    </Col>
                    <Col>
                        {/* 供应商 */}
                        <FormItem label="供应商">
                            <SearchMind
                                compKey="comSupplier"
                                ref={ref => { this.supplier = ref }}
                                fetch={(param) => this.props.pubFetchValueList({
                                    condition: param.value,
                                    pageNum: param.pagination.current || 1,
                                    pageSize: param.pagination.pageSize
                                }, 'supplierSearchBox')}
                                onChoosed={this.handleSupplyChoose}
                                onClear={this.handleSupplyClear}
                                renderChoosedInputRaw={(row) => (
                                    <div>{row.spNo}-{row.companyName}</div>
                                )}
                                rowKey="spId"
                                pageSize={6}
                                columns={[
                                    {
                                        title: '供应商编号',
                                        dataIndex: 'spNo',
                                        width: 80
                                    }, {
                                        title: '供应商名称',
                                        dataIndex: 'companyName'
                                    }
                                ]}
                            />
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="供应商地点">
                            <SearchMind
                                compKey="comSupplierLoc"
                                ref={ref => { this.supplierLoc = ref }}
                                fetch={(param) => this.props.pubFetchValueList({
                                    orgId: this.props.employeeCompanyId,
                                    pId: this.state.spId,
                                    condition: param.value,
                                    pageNum: param.pagination.current || 1,
                                    pageSize: param.pagination.pageSize
                                }, 'supplierAdrSearchBox')}
                                onChoosed={this.handleSupplierAdressChoose}
                                onClear={this.handleSupplierAddressClear}
                                renderChoosedInputRaw={(row) => (
                                    <div>{row.providerNo} - {row.providerName}</div>
                                )}
                                disabled={this.state.isSupplyAdrDisabled}
                                rowKey="providerNo"
                                pageSize={5}
                                columns={[
                                    {
                                        title: '供应商地点编码',
                                        dataIndex: 'providerNo',
                                        width: 68
                                    }, {
                                        title: '供应商地点名称',
                                        dataIndex: 'providerName'
                                    }
                                ]}
                            />
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="经营模式">
                            {getFieldDecorator('businessModeCode', {
                                initialValue: businessModeType.defaultValue
                            })(
                                <Select size="default" >
                                    {businessModeType.data.map((item) => (
                                        <Option key={item.key} value={item.key}>
                                            {item.value}
                                        </Option>
                                    ))}
                                </Select>)}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="创建日期">
                            {getFieldDecorator('createTime')(
                                <RangePicker
                                    className="date-range-picker"
                                    style={{ width: 250 }}
                                    format={dateFormat}
                                    showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                    }}
                                    placeholder={['开始日期', '结束日期']}
                                    onChange={this.chooseCreateDate}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="审批日期">
                            {getFieldDecorator('auditTime')(
                                <RangePicker
                                    className="date-range-picker"
                                    style={{ width: 250 }}
                                    format={dateFormat}
                                    showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                    }}
                                    placeholder={['开始日期', '结束日期']}
                                    onChange={this.chooseApproval}
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={40} type="flex" justify="end">
                    <Col>
                        {auth.new &&
                            <Button size="default" onClick={this.handleCreate}>
                                新建
                                        </Button>
                        }
                        {auth.delete &&
                            <Button size="default" onClick={this.handleDelete}>
                                删除</Button>
                        }
                        <Button size="default" onClick={this.handleResetValue}>
                            重置</Button>
                        <Button type="primary" onClick={this.handleSearch} size="default">
                            搜索</Button>
                        {auth.downPDF &&
                            <Button size="default" onClick={this.handleDownPDF}>
                                <Link to="./poprintlist">下载PDF</Link>
                            </Button>
                        }
                    </Col>
                </Row>
            </Form >);
    }
}

PoSearchForm.propTypes = {
    employeeCompanyId: PropTypes.string,
    pubFetchValueList: PropTypes.func,
    onSearch: PropTypes.func,
    onDelete: PropTypes.func,
    onDownPDF: PropTypes.func,
    onReset: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    auth: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any)
};

PoSearchForm.defaultProps = {
    prefixCls: 'po-modal'
}

export default withRouter(Form.create()(PoSearchForm));
