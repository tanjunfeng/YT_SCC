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
    Dropdown,
    Icon,
    message,
    Modal,
    Menu
} from 'antd';
import {
    modifyAuditVisible,
    modifyCheckReasonVisible,
    modifyDeleteOrderNum
} from '../../../actions';
import { PAGE_SIZE } from '../../../constant';
import fetchCategoryList from '../../../actions/fetch/fetchCategory';
import { categoryList } from '../../../constant/formColumns';
import { modifyCategoryVisible } from '../../../actions';
import SearchForm from '../searchForm';

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
class StoreAdjList extends Component {
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
        // this.props.fetchCategoryList({
        //     pageSize: PAGE_SIZE,
        //     pageNum: this.current,
        //     shelfStatus: 0
        // })
    }

    handlePaginationChange(goto) {
        // this.current = goto;
        // this.props.fetchCategoryList({
        //     pageSize: PAGE_SIZE,
        //     pageNum: goto,
        //     shelfStatus: 0
        // })
    }

    // 搜索
    handleSearch() {    
        // const {
        //     id,
        //     name,
        //     firstCategoryId,
        //     secondCategoryId,
        //     thirdCategoryId
        // } = this.props.form.getFieldsValue();
        // const data = {
        //     firstCategoryId,
        //     secondCategoryId,
        //     thirdCategoryId,
        //     name,
        //     id,
        // }
        // this.props.fetchCategoryList({
        //     pageSize: PAGE_SIZE,
        //     pageNum: this.current,
        //     shelfStatus: 0,
        //     ...Utils.removeInvalid(this.classify),
        //     ...Utils.removeInvalid(data)
        // })
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
        columns[columns.length - 1].render = this.renderOperation;
        return (
            <div className="onsale">
                <div className="onsale-form">
                    <Form layout="inline">
                        <div className="manage-form-item">
                            <SearchForm
                                isSuplierAddMenu
                                onSearch={this.handleFormSearch}
                                onReset={this.handleFormReset}
                                onInput={this.handleInputSupplier}
                                onExcel={this.handleDownLoad}
                            />
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

StoreAdjList.propTypes = {
    modifyDeleteOrderNum: PropTypes.func,
    toAddPriceVisible: PropTypes.func,
    fetchCategoryList: PropTypes.func,
    modifyCategoryVisible: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    categoryorderlist: PropTypes.objectOf(PropTypes.any),
}

StoreAdjList.defaultProps = {
}

export default withRouter(Form.create()(StoreAdjList));
