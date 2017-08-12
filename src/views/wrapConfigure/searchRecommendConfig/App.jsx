/**
 * @file App.jsx
 *
 * @author caoyanxuan
 *
 * 搜索推荐配置
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Input, Form, Button, Dropdown, Menu, Icon, Modal, message } from 'antd';
import Utils from '../../../util/util';
import HotLableItem from './common/hotLableItem';
import ChangeModalMessage from './common/changeModalMessage';
import { PAGE_SIZE } from '../../../constant';
import { fetchAllHot, addSaveInput, fetchInputKeyword, modifyModalVisible, removeTableHot } from '../../../actions/wap';

const FormItem = Form.Item;
const confirm = Modal.confirm;

const columns = [
    {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
    },
    {
        title: '参数内容（5个字以内）',
        dataIndex: 'content',
        key: 'content',
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
    }
];

@connect(
    state => ({
        ikData: state.toJS().wap.ikData,
        ahData: state.toJS().wap.ahData,
        modalVisible: state.toJS().wap.modalVisible,
    }),
    dispatch => bindActionCreators({
        fetchAllHot,
        addSaveInput,
        removeTableHot,
        fetchInputKeyword,
        modifyModalVisible
    }, dispatch)
)
class SearchRecommendConfig extends Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
        this.showAddModal = this.showAddModal.bind(this);
        this.handleSaveInput = this.handleSaveInput.bind(this);
        this.renderOperation = this.renderOperation.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.current = 1;
        this.state = {
            inputValue: '',
            setModalVisible: false,
            ModalItem: {}
        };
    }

    componentDidMount() {
        this.props.fetchInputKeyword();
        this.props.fetchAllHot({pageSize: PAGE_SIZE, pageNum: 1});
    }

    handlePaginationChange(goto) {
        this.current = goto;
        this.props.fetchAllHot({pageSize: PAGE_SIZE, pageNum: goto});
    }

    // 输入框-保存
    handleSaveInput() {
        const { content } = this.props.form.getFieldsValue();
        const data = { content }
        this.props.addSaveInput({
            ...Utils.removeInvalid(data)
        }).then((res) => {
            message.success(res.message);
        }).catch((err) => {
            // message.error(err.message);
        });
    }

    // “添加”模态框
    showAddModal() {
        this.props.modifyModalVisible({isVisible: true, mTitle: '新增'});
    }
    // 选择操作项
    handleSelect(record, items) {
        const { id } = record;
        const { key } = items;
        const { ahData = {} } = this.props;// table查询数据
        const { total } = ahData;
        switch (key) {
            case 'changeMessage':
                this.props.modifyModalVisible({isVisible: true, mTitle: '修改', record });
                break;
            case 'tableDelete':
                confirm({
                    title: '你确认要删除此关键字吗？',
                    onOk: () => {
                        this.props.removeTableHot({ id
                        }).then(() => {
                            message.success('删除成功！');
                            if (total % PAGE_SIZE === 1) {
                                this.current = 1
                            }
                            this.props.fetchAllHot({pageSize: PAGE_SIZE, pageNum: this.current});
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

    // table操作
    renderOperation(text, record) {
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, item)}>
                <Menu.Item key="changeMessage">
                    <a target="_blank" rel="noopener noreferrer">修改</a>
                </Menu.Item>
                <Menu.Item key="tableDelete">
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
        const { ahData = {} } = this.props;// table查询数据
        const { ikData = {} } = this.props;
        const { content } = ikData;
        const { data = [], pageSize, pageNum, total } = ahData;
        const { getFieldDecorator } = this.props.form;
        const hotLable01 = '搜索输入框内推荐关键字';
        const hotLable02 = '搜索框下方推荐关键字';
        const tooltipTitle01 = '输入推荐关键字，所有搜索框初始默认为该关键字';
        const tooltipTitle02 = '可以添加多个，但前台显示一定数量搜索关键词（用户前台点击搜索关键字，调用搜索引擎搜索并转到对应结果页）';

        columns[columns.length - 1].render = this.renderOperation;
        return (
            <div className="search-recommend-config wap-management">
                <div>
                    <Form
                        layout="inline"
                        className="ant-advanced-search-item"
                    >
                        <HotLableItem hotLable={hotLable01} tooltipTitle={tooltipTitle01} />
                        <FormItem>
                            {getFieldDecorator('content', {
                                rules: [
                                    {
                                        max: 10,
                                        message: '不能输入超过10个字'
                                    }
                                ],
                                initialValue: content
                            })(
                                <Input placeholder="10个字节以内" maxLength={11} name="content" />
                            )}
                        </FormItem>
                        <Button
                            type="primary"
                            onClick={this.handleSaveInput}
                        >保存</Button>
                    </Form>
                </div>
                <div className="ant-advanced-search-item">
                    <HotLableItem hotLable={hotLable02} tooltipTitle={tooltipTitle02} />
                    <Button className="add-menu" onClick={this.showAddModal}>添加</Button>
                </div>
                <div className="hot-search-title">热门搜索</div>
                {
                    this.props.modalVisible &&
                    <ChangeModalMessage />
                }
                <div className="area-list">
                    <Table
                        dataSource={data}
                        columns={columns}
                        rowKey="id"
                        footer={null}
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

SearchRecommendConfig.propTypes = {
    ikData: PropTypes.objectOf(PropTypes.any),
    ahData: PropTypes.objectOf(PropTypes.any),
    form: PropTypes.objectOf(PropTypes.any),
    modifyModalVisible: PropTypes.func,
    removeTableHot: PropTypes.func,
    fetchInputKeyword: PropTypes.func,
    fetchAllHot: PropTypes.func,
    addSaveInput: PropTypes.func,
    modalVisible: PropTypes.bool
};

export default Form.create()(SearchRecommendConfig);
