/**
 * @file app.jsx
 * @author shixinyuan
 *
 * 管理列表页面
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Form, Menu, Modal, Dropdown, Icon, Button, Input } from 'antd';
import {
    dictionarylist,
    DictionaryVisible,
    DeleteDictionary,
    DicContentListVisible
} from '../../../actions/dictionary';
import Utils from '../../../util/util';
import { PAGE_SIZE } from '../../../constant';
import ModifyDictionary from './modifyDictionary';
import ModifyContentlist from './modifyContentlist';
import { dictionaryColumns } from '../../../constant/formColumns';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const columns = dictionaryColumns;

@connect(
    state => ({
        dictionaryData: state.toJS().dictionary.dictionaryData,
        dictionaryVisible: state.toJS().dictionary.dictionaryVisible,
        maintenanceVisible: state.toJS().dictionary.maintenanceVisible,
    }),
    dispatch => bindActionCreators({
        dictionarylist,
        DictionaryVisible,
        DeleteDictionary,
        DicContentListVisible
    }, dispatch)
)
class DataDictionary extends PureComponent {
    constructor(props) {
        super(props);
        this.searchForm = {};
        this.handleAddWatch = this.handleAddWatch.bind(this);
        this.handleMaintain = this.handleMaintain.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.renderOperation = this.renderOperation.bind(this);
        this.fetNewData = this.fetNewData.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleQuery = this.handleQuery.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);

        this.current = 1;
    }


    componentDidMount() {
        this.fetNewData();
    }
    fetNewData() {
        const params = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
        }
        this.props.dictionarylist(params);
    }
    saveFormRef = (form) => {
        this.form = form;
    }
    handleDelete(id) {
        confirm({
            title: '删除字典',
            content: '确定删除数据字典？',
            onOk: () => {
                this.props.DeleteDictionary({ id })
                    .then(() => {
                        this.fetNewData()
                    })
            },
            onCancel() { },
        })
    }
    handleMaintain(id, dictionary, remark) {
        this.props.DicContentListVisible({ isVisible: true, id, dictionary, remark });
    }
    handleSelect() {

    }

    handleEdit(record) {
        this.props.DictionaryVisible({ isVisible: true, isEdit: true, record });
    }

    handleAddWatch() {
        this.props.DictionaryVisible({ isVisible: true, isEdit: false })
    }

    handleQuery() {
        const { productName } = this.props.form.getFieldsValue();
        this.props.dictionarylist({
            pageNum: 1,
            pageSize: 20,
            ...Utils.removeInvalid({keyword: productName})
        })
    }

    handlePaginationChange(goto) {
        this.current = goto;
        this.props.fetNewData({
            pageSize: PAGE_SIZE,
            pageNum: goto,
        })
    }

    renderOperation(text, record) {
        const { id, dictionary, remark } = record;
        const menu = (
            <Menu onClick={this.handleSelect}>
                <Menu.Item key="modify">
                    <a
                        rel="noopener noreferrer"
                        onClick={() => this.handleEdit(record)}
                    >修改</a>
                </Menu.Item>
                <Menu.Item key="delete">
                    <a
                        rel="noopener noreferrer"
                        onClick={() => this.handleDelete(id)}
                    >删除</a>
                </Menu.Item>
                <Menu.Item key={id}>
                    <a
                        rel="noopener noreferrer"
                        onClick={() => this.handleMaintain(id, dictionary, remark)}
                    >维护字典内容</a>
                </Menu.Item>
            </Menu>
        );
        return (
            <Dropdown overlay={menu} placement="bottomCenter" record>
                <a className="ant-dropdown-link">
                    表单操作 <Icon type="down" />
                </a>
            </Dropdown>
        )
    }
    render() {
        columns[columns.length - 1].render = this.renderOperation;
        const { getFieldDecorator } = this.props.form;
        const {
            data,
            pageNum,
            pageSize,
            total
             } = this.props.dictionaryData;
        return (
            <div className="dictionary-warp">
                <div className="gys-layout">
                    <Form layout="inline">
                        <span className="classify-select-btn-warp">
                            <FormItem>
                                <div>
                                    {getFieldDecorator('productName', {
                                    })(
                                        <Input
                                            className="manage-form-companyName"
                                            placeholder="字典名称/字典编码"
                                        />
                                        )}
                                </div>
                            </FormItem>
                            <FormItem>
                                <Button
                                    type="primary"
                                    size="default"
                                    onClick={this.handleQuery}
                                >
                                    查询
                                </Button>
                            </FormItem>
                            <FormItem>
                                <Button onClick={this.handleAddWatch} size="default">
                                    新增
                                </Button>
                            </FormItem>
                        </span>
                    </Form>
                </div>
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
                {
                    this.props.dictionaryVisible &&
                    <ModifyDictionary
                        fetchList={this.fetNewData}
                    />
                }
                {
                    this.props.maintenanceVisible &&
                    <ModifyContentlist />
                }
            </div>
        );
    }
}

DataDictionary.propTypes = {
    maintenanceVisible: PropTypes.objectOf(PropTypes.any),
    dictionaryVisible: PropTypes.objectOf(PropTypes.any),
    dictionarylist: PropTypes.objectOf(PropTypes.any),
    DeleteDictionary: PropTypes.objectOf(PropTypes.any),
    DicContentListVisible: PropTypes.objectOf(PropTypes.any),
    DictionaryVisible: PropTypes.objectOf(PropTypes.any),
    getFieldsValue: PropTypes.objectOf(PropTypes.any),
    form: PropTypes.objectOf(PropTypes.any),
    fetNewData: PropTypes.objectOf(PropTypes.any),
    dictionaryData: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create({})(DataDictionary));
