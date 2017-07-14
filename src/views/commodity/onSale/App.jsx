/**
 * @file App.jsx
 * @author shixinyuan
 *
 * 在售商品列表
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Input, DatePicker, Button, Table, Dropdown, Menu, Icon, message, Modal } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';

import { PAGE_SIZE } from '../../../constant';
import Utils from '../../../util/util';
import ClassifiedSelect from '../../../components/threeStageClassification';
import moment from 'moment';

import { fetchGoods, fetchSelfProduct } from '../../../actions';
import { updateOffShelf } from '../../../actions/producthome'

const confirm = Modal.confirm;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

const columns = [{
    title: '商品信息',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => {
        const {
             id,
            name,
            imageUrl,
            firstLevelCategoryName,
            secondLevelCategoryName,
            thirdLevelCategoryName,
                 } = record;
        return (
            <div>
                <div>
                    <span className="onsale-number">
                        <span>商品编号：</span>
                        <span>{id}</span>
                    </span>
                    <span className="onsale-classify">
                        <span>所属分类：</span>
                        <span>{firstLevelCategoryName && `${firstLevelCategoryName}`}{secondLevelCategoryName && `>${secondLevelCategoryName}`}{thirdLevelCategoryName && `>${thirdLevelCategoryName}`}</span>
                    </span>
                </div>
                <div className="onsale-img-wrap">
                    <img alt="" className="onsale-img" src={imageUrl} /><span className="onsale-name">{name}</span>
                </div>
            </div>
        )
    }
}, {
    title: '品牌',
    dataIndex: 'brand',
    key: 'brand',
}, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (text) => (
        <span>
            {moment(parseInt(text, 10)).format('YYYY-MM-DD HH:mm:ss')}
        </span>
    )
}, {
    title: '上架时间',
    dataIndex: 'onShelfTime',
    key: 'onShelfTime',
    render: (text) => (
        <span>
            {moment(parseInt(text, 10)).format('YYYY-MM-DD HH:mm:ss')}
        </span>
    )
}, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
}];

@connect(
    state => ({
        goods: state.toJS().commodity.goods,
        selfProduct: state.toJS().commodity.selfProduct,
        data: state.toJS().commodity.data
    }),
    dispatch => bindActionCreators({
        fetchGoods,
        fetchSelfProduct,
        updateOffShelf
    }, dispatch)
)
class OnSale extends Component {
    constructor(props) {
        super(props);

        this.handleChange = ::this.handleChange;
        this.handleSearch = ::this.handleSearch;
        this.renderOperation = ::this.renderOperation;
        this.onCopy = ::this.onCopy;
        this.handleUpdata = ::this.handleUpdata;
        this.handlePaginationChange = ::this.handlePaginationChange;
        this.onEnterTimeChange = ::this.onEnterTimeChange;
        this.handleReset = ::this.handleReset;
        this.handleSelectChange = ::this.handleSelectChange;
        this.handleSelect = this.handleSelect;

        this.state = {
            times: null
        }
        this.current = 1;
        this.times = [null, null];
        this.classify = {
            firstCategoryId: null,
            secondCategoryId: null,
            thirdCategoryId: null
        }
    }

    componentDidMount() {
        this.props.fetchSelfProduct({ pageSize: PAGE_SIZE, pageNum: this.current, shelfStatus: 0 })
        // this.props.updateOffShelf({ status: 0})
    }

    onCopy() {
        message.success('复制成功')
    }

    onEnterTimeChange(date) {
        this.setState({
            times: date
        })
        this.times[0] = date[0].valueOf();
        this.times[1] = date[1].valueOf();
    }

    handleSelectChange(data, that) {
        const { first, second, third } = data;
        this.classify = {
            firstCategoryId: first.id === -1 ? null : first.id,
            secondCategoryId: second.id === -1 ? null : second.id,
            thirdCategoryId: third.id === -1 ? null : third.id
        }
        this.classifyRef = that;
    }

    handleReset() {
        this.props.form.resetFields();
        this.setState({
            times: null
        })
        this.times = [null, null];
        this.classifyRef.resetValue()
    }

    handleChange(id) {
        confirm({
            title: '下架确认',
            content: '确定把所选商品下架吗？',
            onOk: () => {
                this.props.updateOffShelf({
                    offStatus: 1,
                    productIds: [id]
                }).then(() => {
                    this.props.fetchSelfProduct({
                        pageSize: PAGE_SIZE,
                        pageNum: this.current,
                        shelfStatus: 0
                    })
                })
            },
            onCancel() { },
        });
    }

    handleSearch() {
        const { productName, productNo } = this.props.form.getFieldsValue();
        const data = {
            productName,
            productNo,
            startTime: this.times[0],
            endTime: this.times[1]
        }
        this.props.fetchSelfProduct({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            shelfStatus: 0,
            ...Utils.removeInvalid(this.classify),
            ...Utils.removeInvalid(data)
        })
    }

    handlePaginationChange(goto) {
        this.current = goto;
        this.props.fetchSelfProduct({ pageSize: PAGE_SIZE, pageNum: goto, shelfStatus: 0 })
    }

    rowSelection = {
        onChange: (selectedRowKeys) => {
            this.choose = selectedRowKeys;
        }
    }

    handleUpdata() {
        this.props.updateOffShelf({
            offStatus: 1,
            productIds: this.choose
        }).then(() => {
            this.props.fetchSelfProduct({
                pageSize: PAGE_SIZE,
                pageNum: this.current,
                shelfStatus: 0
            })
        })
    }

    renderOperation(text, record, index) {
        const { id } = record;
        const { pathname } = this.props.location;
        const url = window.location.href;
        const menu = (
            <Menu onClick={() => this.handleSelect(this, record, index)}>
                <Menu.Item key={0}>
                    <Link to={`${pathname}/detail/${id}`}>商品详情</Link>
                </Menu.Item>
                <Menu.Item key={1}>
                    <a rel="noopener noreferrer" onClick={() => this.handleChange(id)}>下架商品</a>
                </Menu.Item>
                <Menu.Item key={2}>
                    <CopyToClipboard text={`${url}${id}`} onCopy={this.onCopy}>
                        <span>复制链接</span>
                    </CopyToClipboard>
                </Menu.Item>
                <Menu.Item key={3}>
                    <Link to={`${pathname}/price/${id}`} rel="noopener noreferrer">销售价格</Link>
                </Menu.Item>
                <Menu.Item key={4}>
                    <Link to={`${pathname}/purchasingPice/${id}`} rel="noopener noreferrer">采购价格</Link>
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
        columns[columns.length - 1].render = this.renderOperation;
        const { getFieldDecorator } = this.props.form;
        const { data, pageSize, total, pageNum } = this.props.selfProduct;
        return (
            <div className="onsale">
                <div className="gys-layout">
                    <Form layout="inline">
                        <div>
                            {/* 商品名称 */}
                            <FormItem className="manage-form-item1">
                                <div>
                                    <span className="manage-form-label">商品名称</span>
                                    {getFieldDecorator('productName', {
                                    })(
                                        <Input className="manage-form-companyName" placeholder="商品名称" />
                                        )}
                                </div>
                            </FormItem>
                            {/* 商品编号 */}
                            <FormItem className="manage-form-item1">
                                <div>
                                    <span className="manage-form-label">商品编号</span>
                                    {getFieldDecorator('productNo', {
                                    })(
                                        <Input className="manage-form-companyName" placeholder="商品编号" />
                                        )}
                                </div>
                            </FormItem>
                            {/* 上架时间 */}
                            <FormItem className="manage-form-item1">
                                <div>
                                    <span className="manage-form-label">上架时间</span>
                                    <RangePicker
                                        style={{ width: '270px' }}
                                        className="manage-form-enterTime"
                                        showTime
                                        value={this.state.times}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder={['开始时间', '结束时间']}
                                        onChange={this.onEnterTimeChange}
                                    />
                                </div>
                            </FormItem>
                            <FormItem className="manage-form-item1">
                                <div>
                                    <span className="manage-form-label">商品分类</span>
                                    <ClassifiedSelect
                                        wrapClass="classify-select"
                                        onChange={this.handleSelectChange}
                                    />
                                </div>
                            </FormItem>
                            <span className="classify-select-btn-warp">
                                <FormItem>
                                    <Button type="primary" onClick={this.handleSearch} size="default">
                                        查询
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button size="default" onClick={this.handleReset}>
                                        重置
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button onClick={this.handleUpdata} size="default" className="sale-btn">下架</Button>
                                </FormItem>
                            </span>
                        </div>
                    </Form>
                </div>
                <div className="onsale-list">
                    <Table
                        dataSource={data}
                        columns={columns}
                        rowSelection={this.rowSelection}
                        rowKey="id"
                        pagination={{
                            current: pageNum,
                            total,
                            pageSize,
                            showQuickJumper: true,
                            onChange: this.handlePaginationChange
                        }}
                    />
                </div>
            </div>
        );
    }
}

OnSale.propTypes = {
    selfProduct: PropTypes.objectOf(PropTypes.any),
    fetchSelfProduct: PropTypes.objectOf(PropTypes.any),
    form: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    updateOffShelf: PropTypes.objectOf(PropTypes.any),
}

OnSale.defaultProps = {
}

export default withRouter(Form.create()(OnSale));
