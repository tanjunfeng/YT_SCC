import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
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


import { pubFetchValueList } from '../../actions/pub.js';
import { PAGE_SIZE } from '../../constant';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
@connect(
    state => ({

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
        this.handleSearch = ::this.handleSearch;
        this.handleResetValue = ::this.handleResetValue;
        this.handleCreate = ::this.handleCreate;
        this.handleDelete =::this.handleDelete;
        this.handleDownPDF =::this.handleDownPDF;
        this.handleGetBigClassMap =::this.handleGetBigClassMap;
        this.handleGetSupplierMap =::this.handleGetSupplierMap;
        this.handleGetSupplierLocMap =::this.handleGetSupplierLocMap;
        this.searchParams = {};
        this.state = {
            // 地点是否可编辑
            locDisabled: true,
            locationData: {},
            startCreateTime: '',
            endCreateTime: '',
            endAuditTime: '',
            startAuditTime: ''
        }
    }

    // 地点类型改变时回调
    onLocTypeChange = (value) => {
        this.poAddress.reset();
        this.setState({ 
            locDisabled: !value
        })
    }

    /**
     * 地点类型选择
     *
     * @return {Promise}
     */
    handleGetAddressMap = (param) => {
        const { locTypeCode } = this.props.form.getFieldsValue(['locTypeCode'])
        const libraryCode = '1';
        const storeCode = '2';
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
    chooseSupplier = (dataList) => {
        this.supplierEncoded = dataList.spNo;
        return <div>{dataList.spNo} - {dataList.companyName}</div>
    }

    // 选择供应商地点回调
    chooseSupplierAdress = (dataList) => {
        this.supplierAdressId = dataList.spAdrid;
        return <div>{dataList.providerNo} - {dataList.providerName}</div>
    }

    // 选择地点回调
    chooseAdress = (dataList) => {
        const encoded = dataList[this.state.locationData.code];
        this.adressTypeCode = encoded;
        return <div>{encoded} - {dataList[this.state.locationData.name]}</div>;
    }

    // 选择大类回调
    chooseGoodsType = (dataList) => {
        this.GoodsTypeId = dataList.id;
        return <div>{dataList.id} - {dataList.categoryName}</div>;
    }

    // 选择创建时间回调
    chooseCreateDate = (dates, moments) => {
        this.setState({
            startCreateTime: moments[0],
            endCreateTime: moments[1]
        })
    }

    // 选择审批时间回调
    chooseApproval = (dates, moments) => {
        this.setState({
            startAuditTime: moments[0],
            endAuditTime: moments[1]
        })
    }

    onSupplierChange(value) {
        
    }


    getSearchParams = () => {
        const ordinary = '1';
        const ordinaryCode = 0;
        const {
            purchaseNumber,
            locTypeCode,
            purchaseTypeCode,
            statusCode
        } = this.props.form.getFieldsValue();

        const { startCreateTime, endCreateTime, startAuditTime, endAuditTime } = this.state;
        console.log(locTypeCode)
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

    handleSearch() {
        const { onSearch } = this.props;
        if (onSearch) {
            onSearch(this.getSearchParams());
        }
    }

    handleResetValue() {
        const { onReset } = this.props;
        // 重置查询条件
        this.searchParams = {};
        // 重置form
        this.props.form.resetFields();
        // 重置值清单
        this.bigClass.reset();
        this.supplier.reset();
        this.supplierLoc.reset();
        this.poAddress.reset();
        // call回调函数
        if (onReset) {
            onReset(this.searchParams);
        }
    }

    handleDelete() {
        const { onDelete } = this.props;
        // call回调函数
        onDelete();
    }

    handleDownPDF() {
        const { onDownPDF } = this.props;
        // call回调函数
        if (onDownPDF) {
            onDownPDF();
        }
    }
    /**
     * 点击新建跳转到新建采购单
     */
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
        return (
            <div className="search-box">
                <Form layout="inline">
                    <div className="">
                        <Row gutter={40}>
                            <Col span={8}>
                                {/* 采购单号 */}
                                <FormItem label="采购单号" formItemLayout>
                                    {getFieldDecorator('purchaseNumber', {
                                    })(<Input />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 地点类型 */}
                                <FormItem label="地点类型">
                                    {getFieldDecorator('locTypeCode', {
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
                                    <div className="row small">
                                        <span className="ant-form-item-label"><label>地点</label> </span>
                                        <SearchMind
                                            style={{zIndex: 101}}
                                            compKey="comPoAddress"
                                            ref={ref => { this.poAddress = ref }}
                                            fetch={(param) => this.handleGetAddressMap(param)}
                                            renderChoosedInputRaw={this.chooseAdress}
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
                                <FormItem label="状态">
                                    {getFieldDecorator('statusCode', {
                                        initialValue: poStatus.defaultValue
                                    })(
                                        <Select style={{ width: '153px' }} size="default">
                                            {
                                                poStatus.data.map((item) => {
                                                    return <Option key={item.key} value={item.key}>{item.value}</Option>
                                                })
                                            }
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 大类 */}
                                <FormItem formItemLayout >
                                    <div className="row small">
                                        <span className="ant-form-item-label"><label>大类</label> </span>
                                        <SearchMind
                                            compKey="comBigClass"
                                            ref={ref => { this.bigClass = ref }}
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
                                        <span className="ant-form-item-label"><label>供应商</label> </span>
                                        <SearchMind
                                            compKey="comSupplier"
                                            ref={ref => { this.supplier = ref }}
                                            fetch={(param) => this.props.pubFetchValueList({
                                                condition: param.value,
                                                pageSize: 2,
                                                pageNum: 1
                                            }, 'supplierSearchBox')}
                                            renderChoosedInputRaw={this.chooseSupplier}
                                            rowKey="dataIndex"
                                            pageSize={5}
                                            columns={[
                                                {
                                                    title: '编码',
                                                    dataIndex: 'spNo',
                                                    width: 150,
                                                }, {
                                                    title: '名称',
                                                    dataIndex: 'companyName',
                                                    width: 200,
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
                                        <span className="ant-form-item-label"><label>供应商地点</label> </span>
                                        <SearchMind
                                            compKey="comSupplierLoc"
                                            ref={ref => { this.supplierLoc = ref }}
                                            fetch={(param) => this.props.pubFetchValueList({
                                                condition: param.value,
                                                pageSize: 2,
                                                pageNum: 1
                                            }, 'supplierAdrSearchBox')}
                                            renderChoosedInputRaw={this.chooseSupplierAdress}
                                            rowKey="dataIndex"
                                            pageSize={2}
                                            columns={[
                                                {
                                                    title: '编码',
                                                    dataIndex: 'providerNo',
                                                    width: 150,
                                                }, {
                                                    title: '名称',
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
                                    <div>
                                        <span className="ant-form-item-label"><label>创建日期</label> </span>
                                        <RangePicker
                                            style={{ width: '200px' }}
                                            format={dateFormat}
                                            placeholder={['开始日期', '结束日期']}
                                            onChange={this.chooseCreateDate}
                                        />
                                    </div>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 审批日期 */}
                                <FormItem >
                                    <div>
                                        <span className="ant-form-item-label"><label>审批日期</label> </span>
                                        <RangePicker
                                            style={{ width: '200px' }}
                                            format={dateFormat}
                                            placeholder={['开始日期', '结束日期']}
                                            onChange={this.chooseApproval}
                                        />
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
                                            下载PDF
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
    doSearch: PropTypes.func,
    onReset: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    prefixCls: PropTypes.any
};

PoSearchForm.defaultProps = {
    prefixCls: 'po-modal'
}

export default withRouter(Form.create()(PoSearchForm));
