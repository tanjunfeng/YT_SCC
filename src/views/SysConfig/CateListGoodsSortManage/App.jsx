/**
 * @file app.jsx
 * @author Tan junfeng
 *
 * 分类列表页商品排序管理
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Form,
    Input,
    Button,
    Table,
    Dropdown,
    Icon,
    message,
    Modal,
    Menu
} from 'antd';
import {
    modifyAuditVisible,
    modifyCheckReasonVisible,
    modifyDeleteOrderNum,
    modifyCategoryVisible
} from '../../../actions';
import { PAGE_SIZE } from '../../../constant';
import Utils from '../../../util/util';
import ClassifiedSelect from '../../../components/threeStageClassification';
import fetchCategoryList from '../../../actions/fetch/fetchCategory';
import { categoryList } from '../../../constant/formColumns';
import ChangeMessage from './changeCategoryMessage';

const confirm = Modal.confirm;
const FormItem = Form.Item;

const columns = categoryList;

@connect(
    state => ({
        categoryorderlist: state.toJS().categoryGoodsOrderNum.categoryOrderList,
        toAddPriceVisible: state.toJS().categoryGoodsOrderNum.toAddPriceVisible,
        deleteordernum: state.toJS().categoryGoodsOrderNum.toAddPriceVisible
    }),
    dispatch => bindActionCreators({
        fetchCategoryList,
        modifyAuditVisible,
        modifyCheckReasonVisible,
        modifyCategoryVisible,
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
        this.classify = {
            firstCategoryId: null,
            secondCategoryId: null,
            thirdCategoryId: null
        }
    }

    componentDidMount() {
        this.props.fetchCategoryList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            shelfStatus: 0
        })
    }

    handlePaginationChange(goto) {
        this.current = goto;
        this.props.fetchCategoryList({
            pageSize: PAGE_SIZE,
            pageNum: goto,
            shelfStatus: 0
        })
    }

    // 搜索
    handleSearch() {
        const {
            id,
            name,
            firstCategoryId,
            secondCategoryId,
            thirdCategoryId
        } = this.props.form.getFieldsValue();
        const data = {
            firstCategoryId,
            secondCategoryId,
            thirdCategoryId,
            name,
            id,
        }
        this.props.fetchCategoryList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            shelfStatus: 0,
            ...Utils.removeInvalid(this.classify),
            ...Utils.removeInvalid(data)
        })
    }

    // 表单操作
    handleSelectChange(data, that) {
        const { first, second, third } = data;
        this.classify = {
            firstCategoryId: first.id === -1 ? null : first.id,
            secondCategoryId: second.id === -1 ? null : second.id,
            thirdCategoryId: third.id === -1 ? null : third.id
        }
        this.classifyRef = that;
    }

    // 重置按钮
    handleReset() {
        this.props.form.resetFields();
        this.setState({
            times: null
        })
        this.times = [null, null];
        this.classifyRef && this.classifyRef.resetValue()
    }

    // 新增
    handleAdd() {
        this.props.modifyCategoryVisible({
            isVisible: true,
            record: {
                toAddCategoryTitle: '新增分类商品排序',
                isEdit: false
            }
        });
    }

    // 下拉选项
    handleSelect(record, index, items) {
        const { categoryorderlist = {} } = this.props;
        const { total, data = {} } = categoryorderlist;
        const {
            pkId,
            firstCategoryName,
            secondCategoryName,
        } = data[index];
        const { key } = items;
        switch (key) {
            case 'changeMessage':
                this.props.modifyCategoryVisible({
                    isVisible: true,
                    record: {
                        toAddCategoryTitle: '修改分类商品排序',
                        isEdit: true,
                        ...record
                    }
                });
                break;
            case 'delete':
                confirm({
                    title:
                    `你确认要删除 ${firstCategoryName} > + ${secondCategoryName} > 中的该商品排序吗？`,
                    onOk: () => {
                        this.props.modifyDeleteOrderNum({pkId})
                        .then(() => {
                            message.success('删除成功！');
                            if (total % PAGE_SIZE === 1) {
                                this.current--;
                            }
                            this.props.fetchCategoryList(
                                {pageSize: PAGE_SIZE,
                                    pageNum: this.current
                                });
                        }).catch(() => {
                        });
                    },
                    onCancel() {},
                });
                break;

            default:
                break;
        }
    }

    renderOperation(text, record, index) {
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                <Menu.Item key="changeMessage">
                    <a target="_blank" rel="noopener noreferrer">修改</a>
                </Menu.Item>
                <Menu.Item key="delete">
                    <a target="_blank" rel="noopener noreferrer">删除</a>
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
        const { prefixCls, categoryorderlist = {} } = this.props;
        const {
            data,
            pageNum,
            total,
            pageSize,
        } = categoryorderlist;
        columns[columns.length - 1].render = this.renderOperation;
        return (
            <div className="onsale">
                <div className="onsale-form" style={{marginTop: 10, marginBottom: 20}}>
                    <Form layout="inline">
                        <div className={`${prefixCls}-list`} style={{height: 70}}>
                            <FormItem>
                                <div
                                    className={`${prefixCls}-input xtpz-css-spfl`}
                                    style={{ display: 'flex', marginTop: 20}}
                                >
                                    <span
                                        className="classify-select-label"
                                        style={{minWidth: 60, marginLeft: 10}}
                                    >商品分类</span>
                                    <ClassifiedSelect
                                        style={{marginTop: 6}}
                                        wrapClass="classify-select"
                                        onChange={this.handleSelectChange}
                                    />
                                </div>
                            </FormItem>
                            {/* 商品名称 */}
                            <FormItem className="manage-form-item1">
                                <div
                                    className={`${prefixCls}-input xtpz-css-spfl`}
                                    style={{ display: 'flex', marginTop: 20}}
                                >
                                    <span
                                        className="manage-form-label"
                                        style={{minWidth: 60, marginLeft: 10}}
                                    >商品名称</span>
                                    {getFieldDecorator('name', {
                                    })(
                                        <Input
                                            className="manage-form-companyName"
                                            placeholder="商品名称"
                                        />
                                    )}
                                </div>
                            </FormItem>
                            {/* 商品编号 */}
                            <FormItem className="manage-form-item1">
                                <div
                                    className={`${prefixCls}-input xtpz-css-spfl`}
                                    style={{ display: 'flex', marginTop: 20}}
                                >
                                    <span
                                        className="manage-form-label"
                                        style={{minWidth: 60, marginLeft: 10}}
                                    >商品编号</span>
                                    {getFieldDecorator('id', {
                                    })(
                                        <Input
                                            className="manage-form-companyName"
                                            placeholder="商品编号"
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
                                        style={{marginTop: 21}}
                                    >
                                        查询
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button
                                        size="default"
                                        onClick={this.handleReset}
                                        style={{marginTop: 21}}
                                    >
                                        重置
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button
                                        size="default"
                                        onClick={this.handleAdd}
                                        style={{marginTop: 21}}
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
                        rowKey="pkId"
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
    modifyDeleteOrderNum: PropTypes.func,
    toAddPriceVisible: PropTypes.func,
    fetchCategoryList: PropTypes.func,
    modifyCategoryVisible: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    categoryorderlist: PropTypes.objectOf(PropTypes.any),
}

CateGory.defaultProps = {
    prefixCls: 'cateGory-line',
}

export default withRouter(Form.create()(CateGory));
