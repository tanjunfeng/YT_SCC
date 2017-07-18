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
import ClassifiedSelect from '../../../components/threeStageClassification';
import {
    commodityStatusOptions,
    deliveryStatusOptions,
    subCompanyStatusOptions,
    commoditySortOptions
} from '../../../constant/searchParams';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const confirm = Modal.confirm;
const commodityML = 'commodity-management'

const columns = [{
    title: '商品信息',
    dataIndex: 'name',
    key: 'name',
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
    imageUrl: 'http://sit.image.com/group1/M00/00/FB/rB4KPVlsFXOAGDZWAABb5O0UTso681.jpg',
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
        this.handleButtonClick = ::this.handleButtonClick;
        this.state = {
            choose: [],
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
     *
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

    rowSelection = {
        onChange: (selectedRowKeys) => {
            this.setState({
                choose: selectedRowKeys,
            });
        }
    }

    /**
     * 暂停购进/恢复采购/区域下架/区域上架/全国性上架/全国性下架按钮事件
     *
     * @param {string} witchButton 传入具体的哪个按钮，用以区分
     */
    handleButtonClick(witchButton) {
        let titleIndex = 0;
        const confirmTitles = [
            '请确认对选中商品进行暂停购进操作，商品将不可进行采购下单',
            '请确认对选中商品进行恢复采购操作',
            '请确认对选中商品进行区域下架操作，商品将在该区域停止销售',
            '请确认对选中商品进行区域上架操作，商品将在该区域恢复销售',
            '请确认对选中商品进行全国性上架操作',
            '请确认对选中商品进行全国性下架操作'
        ]
        switch (witchButton) {
            case '暂停购进':
                titleIndex = 0
                break;
            case '恢复采购':
                titleIndex = 1
                break;
            case '区域下架':
                titleIndex = 2
                break;
            case '区域上架':
                titleIndex = 3
                break;
            case '全国性上架':
                titleIndex = 4
                break;
            case '全国性下架':
                titleIndex = 5
                break;
            default:
                break;
        }
        confirm({
            title: witchButton,
            content: confirmTitles[titleIndex],
            onOk: () => {
                switch (witchButton) {
                    case '暂停购进':
                        break;
                    case '恢复采购':
                        break;
                    case '区域下架':
                        break;
                    case '区域上架':
                        break;
                    case '全国性上架':
                        break;
                    case '全国性下架':
                        // console.log(this.state.choose)
                        break;
                    default:
                        break;
                }
            },
            onCancel() { },
        });
    }

    /**
     * 表单操作
     *
     * @param {Object} text 当前行的值
     * @param {object} record 单行数据
     */
    renderOperation(text, record) {
        const { id } = record;
        const { pathname } = this.props.location;
        const url = window.location.href;
        const menu = (
            <Menu>
                <Menu.Item key={0}>
                    <Link to={`${pathname}/commodifyDetail/${id}`}>商品详情</Link>
                </Menu.Item>
                <Menu.Item key={1}>
                    <CopyToClipboard text={`${url}${id}`} onCopy={this.onCopy}>
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
        return (
            <div className={`${commodityML}`}>
                <div className="manage-form">
                    <Form layout="inline">
                        <div className="gutter-example">
                            <Row gutter={16}>
                                <Col className="gutter-row" span={7}>
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
                                <Col className="gutter-row" span={7}>
                                    {/* 商品编号 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">商品编号</span>
                                            {getFieldDecorator('commodityName')(
                                                <Input
                                                    className="input"
                                                    placeholder="商品编号"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={10}>
                                    {/* 商品分类 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">商品分类</span>
                                            <div className="level-four-classification">
                                                <ClassifiedSelect
                                                    onChange={this.handleSelectChange}
                                                />
                                            </div>
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={7}>
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
                                <Col className="gutter-row" span={7}>
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
                                <Col className="gutter-row" span={10}>
                                    {/* 品牌 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">品牌</span>
                                            {getFieldDecorator('commodityBrand')(
                                                <Input
                                                    className="input"
                                                    placeholder="品牌"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={7}>
                                    {/* 供货供应商 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">供货供应商</span>
                                            <span className="value-list-input">
                                                {getFieldDecorator('commodityCode')(
                                                    <InputGroup>
                                                        <Input style={{ width: '30%' }} />
                                                        <Input style={{ width: '60%' }} />
                                                    </InputGroup>
                                                )}
                                            </span>
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={7}>
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
                                <Col className="gutter-row" span={10}>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            onClick={() => {
                                                this.handleButtonClick('暂停购进')
                                            }}
                                        >暂停购进</Button>
                                    </FormItem>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            onClick={() => {
                                                this.handleButtonClick('恢复采购')
                                            }}
                                        >恢复采购</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={7}>
                                    {/* 经营子公司 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">经营子公司</span>
                                            <span className="value-list-input">
                                                {getFieldDecorator('commodityCode')(
                                                    <InputGroup>
                                                        <Input style={{ width: '30%' }} />
                                                        <Input style={{ width: '60%' }} />
                                                    </InputGroup>
                                                )}
                                            </span>
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={7}>
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
                                <Col className="gutter-row" span={10}>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            onClick={() => {
                                                this.handleButtonClick('区域下架')
                                            }}
                                        >区域下架</Button>
                                    </FormItem>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            onClick={() => {
                                                this.handleButtonClick('区域上架')
                                            }}
                                        >区域上架</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={7}>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            onClick={() => {
                                                this.handleButtonClick('全国性上架')
                                            }}
                                        >全国性上架</Button>
                                    </FormItem>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            onClick={() => {
                                                this.handleButtonClick('全国性下架')
                                            }}
                                        >全国性下架</Button>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={7}>
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
                                <Col className="gutter-row" span={10}>
                                    <FormItem className="">
                                        <Button type="primary" size="default">查询</Button>
                                    </FormItem>
                                    <FormItem className="">
                                        <Button size="default">重置</Button>
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
