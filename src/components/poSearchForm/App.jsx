import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, DatePicker, Row, Col, Icon } from 'antd';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import AscadeChoice from '../ascadeChoice';
import Utils from '../../util/util';
import { poStatus, locType, poType, locTypeCodes, poStatusCodes } from '../../constant/procurement';
import SearchMind from '../searchMind';
import moment from 'moment';
import {
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
    getBigClassMap
} from '../../actions'
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
@connect(
    state => ({
    }),
    dispatch => bindActionCreators({ getWarehouseAddressMap, getShopAddressMap, getSupplierMap, getSupplierLocMap, getBigClassMap }, dispatch)
)
class PoSearchForm extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSearch = ::this.handleSearch;
        this.handleResetValue = ::this.handleResetValue;
        this.handleCreate = ::this.handleCreate;
        this.handleDelete =::this.handleDelete;
        this.handleDownPDF =::this.handleDownPDF;
        this.onLocTypeChange =::this.onLocTypeChange;
        this.handleGetAddressMap =::this.handleGetAddressMap;
        this.handleGetBigClassMap =::this.handleGetBigClassMap;
        this.handleGetSupplierMap =::this.handleGetSupplierMap;
        this.handleGetSupplierLocMap =::this.handleGetSupplierLocMap;
        this.searchParams = {};
        this.state = {
            //地点是否可编辑
            locDisabled: true
        }

    }

    onLocTypeChange(value) {
        //地点类型有值
        if (value) {
            //地点类型有值时，地点可编辑
            //TODO
        } else {
            //地点类型无值时，地点不可编辑
            //TODO
        }
        //清空地点值
        this.poAddress.reset();
    }

    onSupplierChange(value) {
        //地点类型有值
        if (value) {
            //地点类型有值时，供应商地点可编辑
            //TODO
        } else {
            //地点类型无值时，供应商地点不可编辑
            //TODO
            //地点类型无值时，供应商清空地点值
        }
        //清空地点值
        this.supplierLoc.reset();
    }
    getSearchParams() {
        const {
            poNo,
            locTypeCd,
            poTypeCd,
            statusCd,
        } = this.props.form.getFieldsValue();

        //获取创建日期区间
        let createdDuringArr = this.props.form.getFieldValue("createdDuring") || [];
        let createdDuringFrom, createdDuringTo;
        if (createdDuringArr.length > 0) {
            createdDuringFrom = createdDuringArr[0].format(dateFormat);
        }
        if (createdDuringArr.length > 1) {
            createdDuringTo = createdDuringArr[1].format(dateFormat);
        }

        //获取审批日期区间
        let auditDuringArr = this.props.form.getFieldValue("auditDuring") || [];
        let auditDuringFrom, auditDuringTo;
        if (auditDuringArr.length > 0) {
            auditDuringFrom = auditDuringArr[0].format(dateFormat);
        }
        if (auditDuringArr.length > 1) {
            auditDuringTo = auditDuringArr[1].format(dateFormat);
        }

        //地点
        let addressCd;
        let selectedAddressRawData = this.poAddress.state.selectedRawData;
        if (selectedAddressRawData) {
            addressCd = selectedAddressRawData.code;
        }
        //供应商
        let supplierCd;
        let selectedSupplierRawData = this.supplier.state.selectedRawData;
        if (selectedSupplierRawData) {
            supplierCd = selectedSupplierRawData.code;
        }

        //供应商地点
        let supplierLocCd;
        let selectedSupplierLocRawData = this.supplierLoc.state.selectedRawData;
        if (selectedSupplierLocRawData) {
            supplierLocCd = selectedSupplierLocRawData.code;
        }

        //大类
        let bigClassCd = null;
        let selectedBigClassRawData = this.bigClass.state.selectedRawData;
        if (selectedBigClassRawData) {
            bigClassCd = selectedBigClassRawData.code;
        }
        const searchParams = {
            poNo,
            locTypeCd,
            addressCd,
            poTypeCd,
            statusCd,
            bigClassCd,
            supplierCd,
            supplierLocCd,
            createdDuringFrom,
            createdDuringTo,
            auditDuringFrom,
            auditDuringTo
        };

        this.searchParams = Utils.removeInvalid(searchParams);
        return this.searchParams;
    }

    handleSearch() {
        const { onSearch } = this.props;
        //call回调函数
        if (onSearch) {
            onSearch(this.getSearchParams());
        }

    }

    handleResetValue() {
        const { onReset } = this.props;
        //重置查询条件
        this.searchParams = {};
        //重置form
        this.props.form.resetFields();
        //重置值清单
        this.bigClass.reset();
        this.supplier.reset();
        this.supplierLoc.reset();
        this.poAddress.reset();
        //call回调函数
        if (onReset) {
            onReset(this.searchParams);
        }
    }

    handleDelete() {
        const { onDelete } = this.props;
        //call回调函数
        onDelete();
    }

    handleDownPDF() {
        const { onDownPDF } = this.props;
        //call回调函数
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

    handleGetAddressMap = ({ value, pagination }) => {
        //地点类型
        let { locTypeCd } = this.props.form.getFieldsValue(["locTypeCd"])
        //子公司ID
        let companyId = null;  //TODO 从session获取子公司ID？
        let pageNum = pagination.current || 1;
        console.log("selectedLocTypeCd", locTypeCd);
        //根据选择的地点类型获取对应地点的值清单
        if (locTypeCd === locTypeCodes.warehouse) {
            //地点类型为仓库
            return this.props.getWarehouseAddressMap({
                value, companyId, pageNum
            });
        } else if (locTypeCd === locTypeCodes.shop) {
            //地点类型为门店
            return this.props.getShopAddressMap({
                value, companyId, pageNum
            });
        } else {
            //如果地点类型为空，返回空promise
            return new Promise(function (resolve, reject) {
                resolve({ total: 0, data: [] });
            });
        }
    }




    handleGetBigClassMap = ({ value, pagination }) => {
        return this.props.getBigClassMap({
            value,
        });

    }

    handleGetSupplierMap = ({ value, pagination }) => {
        //子公司ID
        let companyId = null;  //TODO 从session获取子公司ID？
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
        //子公司ID
        let companyId = null;  //TODO 从session获取子公司ID？
        let pageNum = pagination.current || 1;
        //如果供应商地点为空，返回空promise
        if (!supplierCd) {
            return new Promise(function (resolve, reject) {
                resolve({ total: 0, data: [] });
            });
        }
        //根据供应商编码、输入查询内容获取供应商地点信息
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
                                    {getFieldDecorator('poNo', {
                                    })(
                                        <Input
                                        />
                                        )}

                                </FormItem>
                            </Col>
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
                                    <div className="row small">
                                        <span className="ant-form-item-label"><label>地点</label> </span>
                                        <SearchMind
                                            compKey="comPoAddress"
                                            ref={ref => { this.poAddress = ref }}
                                            fetch={(value, pager) => this.handleGetAddressMap(value, pager)}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.code} - {data.name}</div>
                                            )}
                                            pageSize={2}
                                            columns={[
                                                {
                                                    title: '编码',
                                                    dataIndex: 'code',
                                                    width: 150,
                                                }, {
                                                    title: '名称',
                                                    dataIndex: 'name',
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
                                <FormItem label="状态">
                                    {getFieldDecorator('statusCd', {
                                        initialValue: poStatusCodes.approved
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
                                            fetch={(value, pager) => this.handleGetBigClassMap(value, pager)}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.code} - {data.name}</div>
                                            )}
                                            pageSize={2}
                                            columns={[
                                                {
                                                    title: '编码',
                                                    dataIndex: 'code',
                                                    width: 150,
                                                }, {
                                                    title: '名称',
                                                    dataIndex: 'name',
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
                                            fetch={(value, pager) => this.handleGetSupplierMap(value, pager)}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.code} - {data.name}</div>
                                            )}
                                            pageSize={2}
                                            columns={[
                                                {
                                                    title: '编码',
                                                    dataIndex: 'code',
                                                    width: 150,
                                                }, {
                                                    title: '名称',
                                                    dataIndex: 'name',
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
                                            fetch={(value, pager) => this.handleGetSupplierLocMap(value, pager)}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.code} - {data.name}</div>
                                            )}
                                            pageSize={2}
                                            columns={[
                                                {
                                                    title: '编码',
                                                    dataIndex: 'code',
                                                    width: 150,
                                                }, {
                                                    title: '名称',
                                                    dataIndex: 'name',
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
                                        {getFieldDecorator('createdDuring', {
                                            initialValue: [moment(new Date(), dateFormat), moment(new Date(), dateFormat)]
                                        })(
                                            <RangePicker
                                                style={{ width: '200px' }}
                                                format={dateFormat}
                                                placeholder={['开始日期', '结束日期']}
                                            />)}
                                    </div>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 审批日期 */}
                                <FormItem >
                                    <div>
                                        <span className="ant-form-item-label"><label>审批日期</label> </span>
                                        {getFieldDecorator('auditDuring', {

                                        })(
                                            <RangePicker
                                                style={{ width: '200px' }}
                                                format={dateFormat}
                                                placeholder={['开始日期', '结束日期']}
                                            />)}
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
    doSearch: PropTypes.func,
    onReset: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    prefixCls: PropTypes.any
};

PoSearchForm.defaultProps = {
    prefixCls: 'po-modal'
}

export default withRouter(Form.create()(PoSearchForm));
