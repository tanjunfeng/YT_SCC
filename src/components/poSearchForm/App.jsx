import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, DatePicker, Row, Col, Icon } from 'antd';
import { withRouter } from 'react-router';
import AscadeChoice from '../ascadeChoice';
import Utils from '../../util/util';
import { poStatus, locType, poType, locTypeCodes } from '../../constant/procurement';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class PoSearchForm extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSearch = ::this.handleSearch;
        this.handleResetValue = ::this.handleResetValue;
        this.handleCreate = ::this.handleCreate;
        this.handleDelete =::this.handleDelete;
        this.handlePrint =::this.handlePrint;
        this.handleDownPDF =::this.handleDownPDF;
        this.onCreatedDuringChange =::this.onCreatedDuringChange;
        this.onAuditDuringChange =::this.onAuditDuringChange;
        this.onLocTypeChange =::this.onLocTypeChange;
        this.searchParams = {};
        this.state = {
            //创建者期间
            createdDuring: [],
            createdDuringStr: [],
            //审计期间
            auditDuring: [],
            auditDuringStr: [],

            //地点是否可编辑
            locDisabled: true
        }

    }

    onCreatedDuringChange(dates, dateStrings) {
        this.setState({ createdDuring: dates, createdDuringStr: dateStrings });
    }

    onAuditDuringChange(dates, dateStrings) {
        this.setState({ auditDuring: dates, auditDuringStr: dateStrings });
    }
    onLocTypeChange(value) {
        //地点类型有值
        if (value) {
            //地点类型有值时，地点可编辑
            this.setState({ locDisabled: false });
        } else {
            //地点类型无值时，地点不可编辑
            this.setState({ locDisabled: true });
            //地点类型无值时，清空地点值
            this.props.form.setFieldsValue({ addressCd: "", address: "" });
        }
    }

    onSupplierChange(value) {
        //地点类型有值
        if (value) {
            //地点类型有值时，地点可编辑
            this.setState({ locDisabled: false });
        } else {
            //地点类型无值时，地点不可编辑
            this.setState({ locDisabled: true });
            //地点类型无值时，清空地点值
            this.props.form.setFieldsValue({ addressCd: "", address: "" });
        }
    }
    getSearchParams() {
        const {
            poNo,
            locTypeCd,
            addressCd,
            poTypeCd,
            statusCd,
            bigCLassCd,
            supplierCd,
            supplierLocCd
        } = this.props.form.getFieldsValue();

        let createdDuring = this.state.createdDuringStr;
        let auditDuring = this.state.auditDuringStr;
        const searchParams = {
            poNo,
            locTypeCd,
            addressCd,
            poTypeCd,
            statusCd,
            bigCLassCd,
            supplierCd,
            supplierLocCd,
            createdDuring,
            auditDuring
        };

        console.log("searchParams", searchParams);
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
        this.searchParams = {};
        this.props.form.resetFields();
        //清空创建日期范围，审批日期范围
        this.setState({ createdDuring: [], createdDuringStr: [], auditDuring: [], auditDuringStr: [] });
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
    handlePrint() {
        const { onPrint } = this.props;
        //call回调函数
        if (onPrint) {
            onPrint();
        }
    }
    handleDownPDF() {
        const { onDownPDF } = this.props;
        //call回调函数
        if (onDownPDF) {
            onDownPDF();
        }
    }
    /**
     * 跳转到新建采购单
     */
    handleCreate() {
        const { history } = this.props;
        history.push('/po/create');
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
                                    <span className="ant-form-item-label"><label>大类</label> </span>
                                    <InputGroup compact style={{ display: 'inline' }}>
                                        {getFieldDecorator('bigCLassCd', {
                                        })(
                                            <Input style={{ width: '60px' }} />
                                            )
                                        }
                                        {getFieldDecorator('bigCLassName', {
                                        })(
                                            <Input style={{ width: '100px' }} />
                                            )
                                        }
                                        <Button icon="ellipsis" style={{ width: '40px', display: 'inline' }} size="large"></Button>
                                    </InputGroup>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row gutter={40}>
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
                        </Row>

                        <Row gutter={40}>
                            <Col span={8}>
                                {/* 创建日期 */}
                                <FormItem >
                                    <div>
                                        <span className="ant-form-item-label"><label>创建日期</label> </span>
                                        <RangePicker
                                            style={{ width: '200px' }}
                                            format="YYYY-MM-DD"
                                            value={this.state.createdDuring}
                                            placeholder={['开始日期', '结束日期']}
                                            onChange={this.onCreatedDuringChange}
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
                                            format="YYYY-MM-DD"
                                            value={this.state.auditDuring}
                                            placeholder={['开始日期', '结束日期']}
                                            onChange={this.onAuditDuringChange}
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
                                {auth.print &&
                                    <FormItem>
                                        <Button size="default" onClick={this.handlePrint}>
                                            打印
                                        </Button>
                                    </FormItem>
                                }
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
};

export default withRouter(Form.create()(PoSearchForm));
