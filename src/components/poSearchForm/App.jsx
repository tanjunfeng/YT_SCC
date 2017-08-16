import React, { PureComponent } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Input, Form, Select, DatePicker, Row, Col, Icon } from 'antd';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import AscadeChoice from '../ascadeChoice';
import Utils from '../../util/util';
import { poStatus, locType, poType, locTypeCodes, poStatusCodes } from '../../constant/procurement';
import SearchMind from '../searchMind';
import {
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
    getBigClassMap
} from '../../actions'

import { pubFetchValueList } from '../../actions/pub';
import { PAGE_SIZE } from '../../constant';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
@connect(
    state => ({
        data: state.toJS().user.data || {}
    }),
    dispatch => bindActionCreators({
        getWarehouseAddressMap,
        getShopAddressMap,
        getSupplierMap,
        getSupplierLocMap,
        getBigClassMap,
        pubFetchValueList
    }, dispatch)
)

class PoSearchForm extends PureComponent {
    constructor(props) {
        super(props);
        this.handleCreate = ::this.handleCreate;
        this.handleDelete =::this.handleDelete;
        this.handleGetBigClassMap =::this.handleGetBigClassMap;
        this.handleGetSupplierMap =::this.handleGetSupplierMap;
        this.handleGetSupplierLocMap =::this.handleGetSupplierLocMap;
        this.state = {
            spId: '',   // 供应商ID
            isSupplyAdrDisabled: true, // 供应商地点禁用
            locDisabled: true,
            locationData: {}
        }
    }

    // 地点类型改变时回调
    onLocTypeChange = (value) => {
        let disabled = locType.defaultValue === value ? true : false;
        this.poAddress.reset();
        this.adressTypeCode = '';
        this.setState({
            locDisabled: disabled
        })
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
            locationTypeParam = 'getWarehouseInfo1';
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
            pageSize: PAGE_SIZE,
            param: param.value
        }, locationTypeParam);
    }

    // 选择供应商回调
    handleSupplyChoose = ({record}) => {
        this.setState({
            spId: record.spId,
            isSupplyAdrDisabled: false
        });
        this.supplierEncoded = record.spNo;
        return <div>{record.spNo} - {record.companyName}</div>
    }

    // 清除供应商值
    handleSupplyClear = () => {
        this.supplier.reset();
        this.supplierEncoded = '';
        this.setState({
            spId: '',
            isSupplyAdrDisabled: true
        });
        this.handleClearSupplierAdress();
    }

    // 选择供应商地点回调
    handleAdressChoose = (record) => {
        this.supplierAdressId = record.spAdrid;
    }

    /**
     * 清空供应商地点编号
     */
    handleAdressClear = () => {
        this.supplierLoc.reset();
        this.supplierAdressId = '';
    }

    // 选择地点回调
    chooseAddress = (record) => {
        const encoded = record[this.state.locationData.code];
        this.adressTypeCode = encoded;
    }

    // 清除地点值
    handleClearLocation = () => {
        this.poAddress.reset();
        this.adressTypeCode = '';
        this.setState({
            locDisabled: true
        })
    }

    // 选择大类回调
    chooseGoodsType = (record) => {
        this.GoodsTypeId = record.id;
        return <div>{record.id} - {record.categoryName}</div>;
    }

    // 清除大类值
    hanldeClearType = () => {
        this.bigClass.reset();
        this.GoodsTypeId = '';
    }

    // 获取用于搜索的所有有效表单值
    getSearchParams = () => {
        const ordinary = '1';
        const ordinaryCode = 0;
        const {
            purchaseNumber,
            locTypeCode,
            purchaseTypeCode,
            statusCode,
            createTime,
            auditTime
        } = this.props.form.getFieldsValue();

        const startCreateTime = createTime ? createTime[0].valueOf() : '';
        const endCreateTime = createTime ? createTime[1].valueOf() : '';
        const startAuditTime = auditTime ? auditTime[0].valueOf() : '';
        const endAuditTime = auditTime ? auditTime[1].valueOf() : '';

        const searchParams = {
            purchaseOrderNo: purchaseNumber,
            spNo: this.supplierEncoded,
            spAdrId: this.supplierAdressId,
            adrType: locTypeCode,
            adrTypeCode: this.adressTypeCode,
            secondCategoryId: this.GoodsTypeId,
            purchaseOrderType: purchaseTypeCode === ordinary ? ordinaryCode : '',
            status: statusCode,
            startCreateTime,
            endCreateTime,
            startAuditTime,
            endAuditTime
        };

        return Utils.removeInvalid(searchParams);
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
        this.handleClearSupplierAdress();
        this.handleClearLocation();
        this.hanldeClearType();

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
        const { history } = this.props;
        history.push('/po/create');
    }

    handleGetBigClassMap = ({ value, pagination }) => {
        return this.props.getBigClassMap({
            value,
        });

    }

    handleGetSupplierMap = ({ value, pagination }) => {
        // //子公司ID
        // let companyId = null;  //TODO 从session获取子公司ID？
        let pageNum = pagination.current || 1;
        return this.props.getSupplierMap({
            value, companyId, pageNum
        });
    }

    handleGetSupplierLocMap = ({ value, pagination }) => {
        let supplierCd;
        let selectedSupplierRawData = this.supplier.state.selectedRawData;
        if (selectedSupplierRawData) {
            supplierCd = selectedSupplierRawData.code;
        }
        // // 子公司ID
        // let companyId = null;  //TODO 从session获取子公司ID？
        // let pageNum = pagination.current || 1;
        // // 如果供应商地点为空，返回空promise
        if (!supplierCd) {
            return new Promise(function (resolve, reject) {
                resolve({ total: 0, data: [] });
            });
        }
        // 根据供应商编码、输入查询内容获取供应商地点信息
        return this.props.getSupplierLocMap({
            value,
            supplierCd, companyId, pageNum
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {
            auth
        } = this.props;
        const formItemLayout = {
            labelCol: {
                span: 3
            },
            wrapperCol: {
                span: 21
            }
        };
        let ecId = this.props.data.user.employeeCompanyId;
        return (
            <div className="search-box">
                <Form layout="inline">
                    <div className="">
                        <Row gutter={40}>
                            <Col span={8}>
                                {/* 采购单号 */}
                                <FormItem label="采购单号" formItemLayout>
                                    {getFieldDecorator('purchaseNumber', {
                                    })(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 地点类型 */}
                                <FormItem label="地点类型">
                                    {getFieldDecorator('locTypeCode', {
                                        initialValue: locType.defaultValue
                                    })(
                                        <Select style={{ width: '153px' }} size="default" onChange={this.onLocTypeChange}>
                                            {locType.data.map((item) => (
                                                <Option key={item.key} value={item.key}>{item.value}</Option>
                                            ))}
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 地点 */}
                                <FormItem formItemLayout >
                                    <div className="row small">
                                        <span className="ant-form-item-label"><label>地点</label></span>
                                        <SearchMind
                                            style={{ zIndex: 101 }}
                                            compKey="comPoAddress"
                                            ref={ref => { this.poAddress = ref }}
                                            onClear={this.handleClearLocation}
                                            fetch={(param) => this.handleGetAddressMap(param)}
                                            onChoosed={this.chooseAddress}
                                            renderChoosedInputRaw={(record) => (
                                                <div>{record[this.state.locationData.code]} - {record[this.state.locationData.name]}</div>
                                            )}
                                            disabled={this.state.locDisabled}
                                            pageSize={5}
                                            columns={[
                                                {
                                                    title: '编码',
                                                    dataIndex: this.state.locationData.code,
                                                    width: 150,
                                                }, {
                                                    title: '名称',
                                                    dataIndex: this.state.locationData.name,
                                                    width: 200,
                                                }
                                            ]}
                                        />
                                    </div>
                                </FormItem>

                            </Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={8}>
                                {/* 采购单类型 */}
                                <FormItem label="采购单类型">
                                    {getFieldDecorator('purchaseTypeCode', {
                                        initialValue: poType.defaultValue
                                    })(
                                        <Select style={{ width: '153px' }} size="default">
                                            {
                                                poType.data.map((item) => (
                                                    <Option key={item.key} value={item.key}>{item.value}</Option>
                                                ))
                                            }
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 状态 */}
                                <FormItem label="状态">
                                    {getFieldDecorator('statusCode', {
                                        initialValue: poStatus.defaultValue
                                    })(
                                        <Select style={{ width: '153px' }} size="default">
                                            {
                                                poStatus.data.map((item) => (
                                                    <Option key={item.key} value={item.key}>{item.value}</Option>
                                                ))
                                            }
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 大类 */}
                                <FormItem formItemLayout >
                                    <div className="row small">
                                        <span className="ant-form-item-label"><label>大类</label></span>
                                        <SearchMind
                                            compKey="comBigClass"
                                            ref={ref => { this.bigClass = ref }}
                                            onClear={this.hanldeClearType}
                                            fetch={(param) => this.props.pubFetchValueList({
                                                param: param.value,
                                                level: 2
                                            }, 'querycategories')}
                                            renderChoosedInputRaw={this.chooseGoodsType}
                                            pageSize={5}
                                            columns={[
                                                {
                                                    title: '编码',
                                                    dataIndex: 'id',
                                                    width: 150,
                                                }, {
                                                    title: '名称',
                                                    dataIndex: 'categoryName',
                                                    width: 200,
                                                }
                                            ]}
                                        />
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={8}>
                                {/* 供应商 */}
                                <FormItem formItemLayout >
                                    <div className="row middle">
                                        <span className="ant-form-item-label"><label>供应商</label></span>
                                        <SearchMind
                                            compKey="comSupplier"
                                            ref={ref => { this.supplier = ref }}
                                            fetch={(param) => this.props.pubFetchValueList({
                                                condition: param.value,
                                                pageSize: 5,
                                                pageNum: 1
                                            }, 'supplierSearchBox')}
                                            onChoosed={this.handleSupplyChoose}
                                            onClear={this.handleSupplyClear}
                                            renderChoosedInputRaw={(row) => (
                                                <div>{row.spNo}-{row.companyName}</div>
                                            )}
                                            rowKey="spId"
                                            pageSize={5}
                                            columns={[
                                                {
                                                    title: '供应商编号',
                                                    dataIndex: 'spNo',
                                                    width: 150
                                                }, {
                                                    title: '供应商名称',
                                                    dataIndex: 'companyName',
                                                    width: 200
                                                }
                                            ]}
                                        />
                                    </div>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 供应商地点 */}
                                <FormItem formItemLayout >
                                    <div className="row middle">
                                        <span className="ant-form-item-label"><label>供应商地点</label></span>
                                        <SearchMind
                                            compKey="comSupplierLoc"
                                            ref={ref => { this.supplierLoc = ref }}
                                            fetch={(param) => this.props.pubFetchValueList({
                                                orgId: ecId,
                                                pId: this.state.spId,
                                                condition: param.value,
                                                pageSize: 5,
                                                pageNum: 1
                                            }, 'supplierAdrSearchBox')}
                                            onChoosed={this.handleAdressChoose}
                                            onClear={this.handleAdressClear}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.providerNo} - {data.providerName}</div>
                                            )}
                                            disabled={this.state.isSupplyAdrDisabled}
                                            rowKey="providerNo"
                                            pageSize={2}
                                            columns={[
                                                {
                                                    title: '供应商地点编码',
                                                    dataIndex: 'providerNo',
                                                    width: 150,
                                                }, {
                                                    title: '供应商地点名称',
                                                    dataIndex: 'providerName',
                                                    width: 200,
                                                }
                                            ]}
                                        />
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row gutter={40}>
                            <Col span={8}>
                                {/* 创建日期 */}
                                <FormItem >
                                    <div className="row middle">
                                        <span className="ant-form-item-label"><label>创建日期</label></span>
                                        {getFieldDecorator('createTime')(
                                            <RangePicker
                                                className="date-range-picker"
                                                format={dateFormat}
                                                placeholder={['开始日期', '结束日期']}
                                                onChange={this.chooseCreateDate}
                                            />
                                        )}
                                    </div>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 审批日期 */}
                                <FormItem >
                                    <div className="row middle">
                                        <span className="ant-form-item-label"><label>审批日期</label> </span>
                                        {getFieldDecorator('auditTime')(
                                            <RangePicker
                                                className="date-range-picker"
                                                format={dateFormat}
                                                placeholder={['开始日期', '结束日期']}
                                                onChange={this.chooseApproval}
                                            />
                                        )}
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row gutter={40} type="flex" justify="end">
                            <Col>
                                {auth.new &&
                                    <FormItem>
                                        <Button size="default" onClick={this.handleCreate}>
                                            新建
                                        </Button>
                                    </FormItem>
                                }
                                {auth.delete && <FormItem>
                                    <Button size="default" onClick={this.handleDelete}>
                                        删除
                                        </Button>
                                </FormItem>
                                }
                                <FormItem>
                                    <Button size="default" onClick={this.handleResetValue}>
                                        重置
                                        </Button>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" onClick={this.handleSearch} size="default">
                                        搜索
                                        </Button>
                                </FormItem>
                                {auth.downPDF &&
                                    <FormItem>
                                        <Button size="default" onClick={this.handleDownPDF}>
                                            <Link to="./poprintlist">下载PDF</Link>
                                        </Button>
                                    </FormItem>
                                }
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div >
        );
    }
}

PoSearchForm.propTypes = {
    pubFetchValueList: PropTypes.func,
    onSearch: PropTypes.func,
    onDelete: PropTypes.func,
    onDownPDF: PropTypes.func,
    doSearch: PropTypes.func,
    onReset: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    prefixCls: PropTypes.any
};

PoSearchForm.defaultProps = {
    prefixCls: 'po-modal'
}

export default withRouter(Form.create()(PoSearchForm));
