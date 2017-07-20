/**
 * @file App.jsx
 * @author caoyanxuan
 *
 * 商品管理列表
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Row, Col, Select, Icon, Table, Menu, Dropdown, message, Modal} from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import SearchMind from '../../../components/searchMind';
import {
    commodityStatusOptions,
    deliveryStatusOptions,
    subCompanyStatusOptions,
    commoditySortOptions
} from '../../../constant/searchParams';
import {fetchTest} from '../../../actions/classifiedList';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const commodityML = 'commodity-management'

const columns = [{
    title: '商品信息',
    dataIndex: 'name',
    key: 'name',
    width: 400,
    render: (text, record) => {
        const {
            id,
            name,
            imageUrl,
        } = record;
        return (
            <div className="table-commodity">
                <div className="table-commodity-number">
                    <span>商品编号：</span>
                    <span>{id}</span>
                </div>
                <div className="table-commodity-description">
                    <img alt="未上传" className="table-commodity-description-img" src={imageUrl} />
                    <span className="table-commodity-description-name">{name}</span>
                </div>
            </div>
        )
    }
}, {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
}, {
    title: '大类',
    dataIndex: 'bigClass',
    key: 'bigClass',
}, {
    title: '中类',
    dataIndex: 'middleClass',
    key: 'middleClass',
}, {
    title: '小类',
    dataIndex: 'smallClass',
    key: 'smallClass',
}, {
    title: '品牌',
    dataIndex: 'brand',
    key: 'brand',
}, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
}, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
}];

const datas = [{
    id: 'prod426521',
    name: '百事可乐 极度（Max）碳酸饮料 把乐带回家 330ml*12听箱装,百事可乐 极度（Max）碳酸饮料 把乐带回家 330ml*12听箱装',
    imageUrl: 'http://sit.image.com/group1/M00/00/FB/rB4KPVlsFXOAGDZWAABb5O0UTso681.jpg',
    department: '饮料酒水',
    bigClass: '水饮料',
    middleClass: '有汽饮料',
    smallClass: '碳酸饮料',
    brand: '百事',
    status: '暂停使用',
}, {
    id: 'pro12564',
    name: '百事可乐 极度（Max）碳酸饮料 把乐带回家 330ml*12听箱装',
    imageUrl: 'http://sit.image.com/group1/M00/00/FB/rB4KPVlsFXOAGDZWAABb5O0UTso681.jpg',
    department: '饮料酒水',
    bigClass: '水饮料',
    middleClass: '有汽饮料',
    smallClass: '碳酸饮料',
    brand: '百事',
    status: '暂停使用',
}, {
    id: 'pro4554',
    name: '百事可乐 极度（Max）碳酸饮料 把乐带回家 330ml*12听箱装',
    department: '饮料酒水',
    bigClass: '水饮料',
    middleClass: '有汽饮料',
    smallClass: '碳酸饮料',
    brand: '百事',
    status: '暂停使用',
}];


@connect(
    state => ({
        goods: state.toJS().commodity.goods,
    }),
    dispatch => bindActionCreators({

    }, dispatch)
)
class ManagementList extends Component {
    constructor(props) {
        super(props);
        this.handleSelectChange = ::this.handleSelectChange;
        this.renderOperation = ::this.renderOperation;
        this.onCopy = ::this.onCopy;
        this.handleSuspendPurchase = ::this.handleSuspendPurchase;
        this.handleRestorePurchases = ::this.handleRestorePurchases;
        this.handleAreaDownSold = ::this.handleAreaDownSold;
        this.handleAreaUpSold = ::this.handleAreaUpSold;
        this.handleNationalDownSold = ::this.handleNationalDownSold;
        this.handleNationalUpSold = ::this.handleNationalUpSold;
        this.handleFormReset = ::this.handleFormReset;
        this.handleFormSearch = ::this.handleFormSearch;
        this.handleBrandChoose = ::this.handleBrandChoose;
        this.handleSupplyChoose = ::this.handleSupplyChoose;
        this.handleSubsidiaryChoose = ::this.handleSubsidiaryChoose;
        this.searchMind1 = null;
        this.state = {
            choose: [],
            brandChoose: null,
            supplyChoose: null,
            subsidiaryChoose: null,
        }
    }

    componentDidMount() {
    }

    /**
     * 复制链接
     */
    onCopy() {
        message.success('复制成功')
    }

    /**
     * 三级下拉菜单
     * @param {Object} data 各级
     * @param {string} that 回显信息
     */
    handleSelectChange(data, that) {
        const { first, second, third } = data;
        if (third.id !== -1) {
            this.setState({
                isDisabled: false
            })
        } else if (
            this.classify.thirdCategoryId !== third.id
            && third.id === -1
        ) {
            this.props.form.resetFields(['id']);
            this.setState({
                isDisabled: true
            })
        }
        this.classify = {
            firstCategoryId: first.id,
            secondCategoryId: second.id,
            thirdCategoryId: third.id,
            firstCategoryName: first.categoryName,
            secondCategoryName: second.categoryName,
            thirdCategoryName: third.categoryName
        }
        this.classifyRef = that;
    }

    /**
     * table复选框
     */
    rowSelection = {
        onChange: (selectedRowKeys) => {
            this.setState({
                choose: selectedRowKeys,
            });
        }
    }
    /**
     * 品牌-值清单
     */
    handleBrandChoose = ({ record }) => {
        this.setState({
            brandChoose: record,
        });
    }

    /**
     * 供货供应商-值清单
     */
    handleSupplyChoose = ({ record }) => {
        this.setState({
            supplyChoose: record,
        });
    }

    /**
     * 经营子公司-值清单
     */
    handleSubsidiaryChoose = ({ record }) => {
        this.setState({
            subsidiaryChoose: record,
        });
    }

    /**
     * 暂停购进
     */
    handleSuspendPurchase() {
        confirm({
            title: '暂停购进',
            content: '请确认对选中商品进行暂停购进操作，商品将不可进行采购下单',
            onOk: () => {
            },
            onCancel() { },
        });
    }

    /**
     * 恢复采购
     */
    handleRestorePurchases() {
        confirm({
            title: '恢复采购',
            content: '请确认对选中商品进行恢复采购操作',
            onOk: () => {
            },
            onCancel() { },
        });
    }

    /**
     * 区域下架
     */
    handleAreaDownSold() {
        confirm({
            title: '区域下架',
            content: '请确认对选中商品进行区域下架操作，商品将在该区域停止销售',
            onOk: () => {
            },
            onCancel() { },
        });
    }

    /**
     * 区域上架
     */
    handleAreaUpSold() {
        confirm({
            title: '区域上架',
            content: '请确认对选中商品进行区域上架操作，商品将在该区域恢复销售',
            onOk: () => {
            },
            onCancel() { },
        });
    }

    /**
     * 全国性下架
     */
    handleNationalDownSold() {
        const { choose } = this.state;
        confirm({
            title: '全国性下架',
            content: '请确认对选中商品进行全国性下架操作',
            onOk: () => {
                message.success(choose);
            },
            onCancel() { },
        });
    }

    /**
     * 全国性上架
     */
    handleNationalUpSold() {
        const { choose } = this.state;
        confirm({
            title: '全国性上架',
            content: '请确认对选中商品进行全国性上架操作',
            onOk: () => {
                message.success(choose);
            },
            onCancel() { },
        });
    }

    /**
     * 重置
     */
    handleFormReset() {
        this.props.form.resetFields();
    }

    /**
     * 查询
     */
    handleFormSearch() {
    }

    /**
     * 值清单请求
     * @param {string} value, 输入框返回的值
     * @param {number} pagination, 分页
     * @return {Promise}
     */
    handleTestFetch = ({ value, pagination }) => fetchTest({
        value,
        pagination
    })

    /**
     * 表单操作
     * @param {Object} text 当前行的值
     * @param {object} record 单行数据
     */
    renderOperation(text, record) {
        const { id } = record;
        const { pathname } = this.props.location;
        const origin = window.location.origin;
        const menu = (
            <Menu>
                <Menu.Item key={0}>
                    <Link to={`${pathname}/commodifyDetail/${id}`}>商品详情</Link>
                </Menu.Item>
                <Menu.Item key={1}>
                    <CopyToClipboard text={`${origin}${pathname}/commodifyDetail/${id}`} onCopy={this.onCopy}>
                        <span>复制链接</span>
                    </CopyToClipboard>
                </Menu.Item>
                <Menu.Item key={2}>
                    <Link to={`${pathname}/price/${id}`}>销售维护</Link>
                </Menu.Item>
                <Menu.Item key={3}>
                    <Link to={`${pathname}/purchasingPice/${id}`}>采购维护</Link>
                </Menu.Item>
            </Menu>
        );
        return (
            <Dropdown overlay={menu} placement="bottomCenter">
                <a className="ant-dropdown-link">
                    表单操作 <Icon type="down" />
                </a>
            </Dropdown>
        )
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        columns[columns.length - 1].render = this.renderOperation;
        const isPurchaseDisabled = !(
            this.state.supplyChoose !== null
            && this.state.choose.length !== 0
        );
        const isSoldDisabled = !(
            this.state.subsidiaryChoose !== null
            && this.state.choose.length !== 0
        );
        return (
            <div className={`${commodityML}`}>
                <div className="manage-form">
                    <Form layout="inline">
                        <div className="gutter-example">
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    {/* 商品名称 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">商品名称</span>
                                            {getFieldDecorator('commodityName')(
                                                <Input
                                                    className="input"
                                                    placeholder="商品名称"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 商品编号 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">商品编号</span>
                                            {getFieldDecorator('commodityNumber')(
                                                <Input
                                                    className="input"
                                                    placeholder="商品编号"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 商品分类 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">商品分类</span>
                                            <div className="level-four-classification">
                                                <Input />
                                            </div>
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    {/* 商品条码 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">商品条码</span>
                                            {getFieldDecorator('commodityCode')(
                                                <Input
                                                    className="input"
                                                    placeholder="商品条码"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 商品状态 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">商品状态</span>
                                            {getFieldDecorator('supplierStatus', {
                                                initialValue: commodityStatusOptions.defaultValue
                                            })(
                                                <Select
                                                    className=""
                                                    size="default"
                                                >
                                                    {
                                                        commodityStatusOptions.data.map((item) =>
                                                            (<Option
                                                                key={item.key}
                                                                value={item.key}
                                                            >
                                                                {item.value}
                                                            </Option>)
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 品牌 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">品牌</span>
                                            <SearchMind
                                                compKey="search-mind-brand"
                                                ref={ref => { this.searchMind1 = ref }}
                                                fetch={(value, pager) =>
                                                    this.handleTestFetch(value, pager)
                                                }
                                                addonBefore=""
                                                onChoosed={this.handleBrandChoose}
                                                renderChoosedInputRaw={(data) => (
                                                    <div>{data.id} - {data.address}</div>
                                                )}
                                                pageSize={2}
                                                columns={[
                                                    {
                                                        title: 'Name',
                                                        dataIndex: 'name',
                                                        width: 150,
                                                    }, {
                                                        title: 'Address',
                                                        dataIndex: 'address',
                                                        width: 200,
                                                    }
                                                ]}
                                            />
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    {/* 供货供应商 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">供货供应商</span>
                                            <span className="value-list-input">
                                                <SearchMind
                                                    compKey="search-mind-supply"
                                                    ref={ref => { this.searchMind = ref }}
                                                    fetch={(value, pager) =>
                                                        this.handleTestFetch(value, pager)
                                                    }
                                                    addonBefore=""
                                                    onChoosed={this.handleSupplyChoose}
                                                    renderChoosedInputRaw={(data) => (
                                                        <div>{data.id} - {data.name}</div>
                                                    )}
                                                    pageSize={2}
                                                    columns={[
                                                        {
                                                            title: 'Name',
                                                            dataIndex: 'name',
                                                            width: 150,
                                                        }, {
                                                            title: 'Address',
                                                            dataIndex: 'address',
                                                            width: 200,
                                                        }
                                                    ]}
                                                />
                                            </span>
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 供货状态 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">供货状态</span>
                                            {getFieldDecorator('deliveryStatus', {
                                                initialValue: deliveryStatusOptions.defaultValue
                                            })(
                                                <Select
                                                    className=""
                                                    size="default"
                                                >
                                                    {
                                                        deliveryStatusOptions.data.map((item) =>
                                                            (<Option
                                                                key={item.key}
                                                                value={item.key}
                                                            >
                                                                {item.value}
                                                            </Option>)
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={isPurchaseDisabled}
                                            onClick={this.handleSuspendPurchase}
                                        >暂停购进</Button>
                                    </FormItem>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={isPurchaseDisabled}
                                            onClick={this.handleRestorePurchases}
                                        >恢复采购</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    {/* 经营子公司 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">经营子公司</span>
                                            <span className="value-list-input">
                                                <SearchMind
                                                    compKey="search-mind-subsidiary"
                                                    ref={ref => { this.searchMind = ref }}
                                                    fetch={(value, pager) =>
                                                        this.handleTestFetch(value, pager)
                                                    }
                                                    addonBefore=""
                                                    onChoosed={this.handleSubsidiaryChoose}
                                                    renderChoosedInputRaw={(data) => (
                                                        <div>{data.id} - {data.name}</div>
                                                    )}
                                                    pageSize={2}
                                                    columns={[
                                                        {
                                                            title: 'Name',
                                                            dataIndex: 'name',
                                                            width: 150,
                                                        }, {
                                                            title: 'Address',
                                                            dataIndex: 'address',
                                                            width: 200,
                                                        }
                                                    ]}
                                                />
                                            </span>
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 子公司状态 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">子公司状态</span>
                                            {getFieldDecorator('subCompanyStatus', {
                                                initialValue: subCompanyStatusOptions.defaultValue
                                            })(
                                                <Select
                                                    className=""
                                                    size="default"
                                                >
                                                    {
                                                        subCompanyStatusOptions.data.map((item) =>
                                                            (<Option
                                                                key={item.key}
                                                                value={item.key}
                                                            >
                                                                {item.value}
                                                            </Option>)
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={isSoldDisabled}
                                            onClick={this.handleAreaDownSold}
                                        >区域下架</Button>
                                    </FormItem>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={isSoldDisabled}
                                            onClick={this.handleAreaUpSold}
                                        >区域上架</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={this.state.choose.length === 0}
                                            onClick={this.handleNationalDownSold}
                                        >全国性下架</Button>
                                    </FormItem>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={this.state.choose.length === 0}
                                            onClick={this.handleNationalUpSold}
                                        >全国性上架</Button>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 排序 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">排序</span>
                                            {getFieldDecorator('commoditySort', {
                                                initialValue: commoditySortOptions.defaultValue
                                            })(
                                                <Select
                                                    className=""
                                                    size="default"
                                                >
                                                    {
                                                        commoditySortOptions.data.map((item) =>
                                                            (<Option
                                                                key={item.key}
                                                                value={item.key}
                                                            >
                                                                {item.value}
                                                            </Option>)
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <FormItem className="">
                                        <Button
                                            type="primary"
                                            size="default"
                                            onClick={this.handleFormSearch}
                                        >查询</Button>
                                    </FormItem>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            onClick={this.handleFormReset}
                                        >重置</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </div>
                <div className="area-list">
                    <Table
                        dataSource={datas}
                        columns={columns}
                        rowSelection={this.rowSelection}
                        rowKey="id"
                    />
                </div>
            </div>
        );
    }
}

ManagementList.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
}

ManagementList.defaultProps = {
}

export default withRouter(Form.create()(ManagementList));
