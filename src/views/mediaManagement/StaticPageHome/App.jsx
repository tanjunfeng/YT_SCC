/**
 * @file App.jsx
 * @author Tan junfeng
 *
 * 静态页管理
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Form,
    Input,
    Button,
    Table,
    Dropdown,
    Icon,
    Menu
} from 'antd';

import {
    modifyAuditVisible,
    modifyCheckReasonVisible,
    modifyDeleteOrderNum
} from '../../../actions';
import { PAGE_SIZE } from '../../../constant';
import Utils from '../../../util/util';
import fetchStaticPageList from '../../../actions/fetch/fetchStaticPageList';
import { staticPageHome } from '../../../constant/formColumns';
import ChangeMessage from './changeCategoryMessage';
import { modifyMediaAddVisible } from '../../../actions';

const FormItem = Form.Item;
const columns = staticPageHome;

@connect(
    state => ({
        findstaticpagelist: state.toJS().mediaManage.findstaticpagelist,
        toAddPriceVisible: state.toJS().mediaManage.toAddPriceVisible,
    }),
    dispatch => bindActionCreators({
        fetchStaticPageList,
        modifyAuditVisible,
        modifyCheckReasonVisible,
        modifyMediaAddVisible,
        modifyDeleteOrderNum,
    }, dispatch)
)
class CateGory extends Component {
    constructor(props) {
        super(props);

        this.handleSearch = this.handleSearch.bind(this);
        this.renderOperation = this.renderOperation.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);

        this.state = {
            times: null
        }
        this.current = 1;
        this.times = [null, null];
    }

    componentDidMount() {
        this.props.fetchStaticPageList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            shelfStatus: 0
        })
        // this.props.updateOffShelf({ status: 0})
    }

    handlePaginationChange(goto) {
        this.current = goto;
        this.props.fetchStaticPageList({
            pageSize: PAGE_SIZE,
            pageNum: goto,
            shelfStatus: 0
        })
    }

    handleSearch() {
        const {
            name,
            linkUrl,
        } = this.props.form.getFieldsValue();
        this.props.fetchStaticPageList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            shelfStatus: 0,
            ...Utils.removeInvalid({linkUrl, name})
        })
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
        this.classifyRef && this.classifyRef.resetValue()
    }

    handleAdd() {
        this.props.modifyMediaAddVisible({
            isVisible: true,
            toAddMediaTitle: '新增静态页'
        });
    }

    handleSelect(record, index, items) {
        const { key } = items;
        switch (key) {
            case 'changeMessage':
                this.props.modifyMediaAddVisible({
                    isVisible: true,
                    record,
                    toAddMediaTitle: '基础编辑'
                });
                break;
            default:
                break;
        }
    }
    renderOperation(text, record, index) {
        const { id } = record;
        const { pathname } = this.props.location;
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                <Menu.Item key="changeMessage">
                    <a target="_blank" rel="noopener noreferrer">基础编辑</a>
                </Menu.Item>
                <Menu.Item key="ckEditor">
                    <Link to={`${pathname}/${id}`}>页面编辑</Link>
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
        const { findstaticpagelist = {} } = this.props;
        const {
            data,
            pageNum,
            total,
            pageSize,
        } = findstaticpagelist;
        columns[columns.length - 1].render = this.renderOperation;
        return (
            <div className="onsale">
                <div className="onsale-form">
                    <Form layout="inline">
                        <div className="manage-form-item">
                            {/* 商品名称 */}
                            <FormItem className="manage-form-item1">
                                <div>
                                    <span
                                        className="manage-form-label"
                                    >静态页名称</span>
                                    {getFieldDecorator('name', {
                                    })(
                                        <Input
                                            className="manage-form-companyName"
                                            placeholder="静态页名称"
                                        />
                                    )}
                                </div>
                            </FormItem>
                            {/* 商品编号 */}
                            <FormItem className="manage-form-item1">
                                <div>
                                    <span
                                        className="manage-form-label"
                                    >链接地址</span>
                                    {getFieldDecorator('linkUrl', {
                                    })(
                                        <Input
                                            className="manage-form-companyName"
                                            placeholder="链接地址"
                                        />
                                    )}
                                </div>
                            </FormItem>
                            <span className="classify-select-btn-warp">
                                <FormItem>
                                    <Button
                                        type="primary"
                                        onClick={this.handleSearch}
                                        size="default"
                                    >
                                        查询
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button
                                        size="default"
                                        onClick={this.handleReset}
                                    >
                                        重置
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button
                                        size="default"
                                        onClick={this.handleAdd}
                                    >
                                        新增
                                    </Button>
                                </FormItem>
                            </span>
                        </div>
                    </Form>
                </div>
                {
                    this.props.toAddPriceVisible &&
                        <ChangeMessage />
                }
                <div className="onsale-list">
                    <Table
                        dataSource={data}
                        columns={columns}
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

CateGory.propTypes = {
    toAddPriceVisible: PropTypes.func,
    fetchStaticPageList: PropTypes.func,
    modifyMediaAddVisible: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    findstaticpagelist: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
}

CateGory.defaultProps = {
}

export default withRouter(Form.create()(CateGory));
