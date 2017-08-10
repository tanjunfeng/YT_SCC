/**
 * @file modifyContentlist.jsx
 * @author shixinyuan
 *
 * 管理列表页面
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Modal, Button, Input, Table } from 'antd';
import { DicContentListVisible, Dictionarycontentlist, updateContentData, dictionaryContent } from '../../../actions/dictionary';

const InputGroup = Input.Group;

@connect(
    state => ({
        maintenanceVisible: state.toJS().dictionary.maintenanceVisible,
        contentlistData: state.toJS().dictionary.contentlistData,
        id: state.toJS().dictionary.id,
        dictionary: state.toJS().dictionary.dictionary,
        remark: state.toJS().dictionary.remark
    }),
    dispatch => bindActionCreators({
        DicContentListVisible,
        Dictionarycontentlist,
        updateContentData,
        dictionaryContent
    }, dispatch)
)
class modifyContentlist extends PureComponent {
    constructor(props) {
        super(props);
        this.handleCancelModify = ::this.handleCancelModify;
        this.handleOk = ::this.handleOk;
        this.handleModify = ::this.handleModify;
        this.renderOperation = ::this.renderOperation;
        this.handleAdd = ::this.handleAdd;
        this.onContentChange = ::this.onContentChange;
        this.modifyContentlistColumns = [{
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => index + 1
        }, {
            title: '内容名称',
            dataIndex: 'contentName',
            key: 'contentName',
            render: (text, record) => (
                <InputGroup size="large">
                    <Input
                        defaultValue={text}
                        onChange={(e) => {
                            this.onContentChange(record, e)
                        }}
                    />
                </InputGroup>
            )
        }, {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: (text, record, index) => {
                const { state } = record;
                return (
                    state === 0 ? '停用' : '启用'
                )
            }
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action'
        }]
        this.state = {
            value: '',
            columndata: [],
        }
    }
    componentDidMount() {
        const { id } = this.props;
        this.props.Dictionarycontentlist({ dictionaryId: id })
    }

    componentWillReceiveProps(nextProps) {
        const { contentlistData } = nextProps;
        this.setState({
            columndata: contentlistData
        })
    }

    onContentChange(record, e) {
        const { value } = e.target;
        this.setState({
            contentName: value
        })
    }

    handleOk() {
        const id = this.props.id;
    }

    handleCancelModify() {
        this.props.DicContentListVisible({ isVisible: false })
    }

    handleDisable(record) {
        const { id, contentName, state } = record;
        const newState = state === 0 ? 1 : 0;
        const dictionaryId = this.props.id;
        this.props.updateContentData({
            id,
            contentName,
            state: newState
        }).then(
            this.props.Dictionarycontentlist({ dictionaryId })
            )
    }

    handleModify(record) {
        const { id, state } = record;
        const { contentName } = this.state;
        const dictionaryId = this.props.id;
        this.props.updateContentData({
            id,
            contentName,
            state
        }).then(
            this.props.Dictionarycontentlist({ dictionaryId })
            )
    }

    handleSave(record) {
        const { contentName } = this.state;
        const { state } = record;
        const dictionaryId = this.props.id;
        this.props.dictionaryContent({
            dictionaryId,
            contentName,
            state
        }).then(
            this.props.Dictionarycontentlist({ dictionaryId })
            )
    }

    handleAdd = () => {
        const { columndata } = this.state;
        const count = columndata.length;
        const newData = {
            dictionaryId: columndata.dictionaryId,
            state: 1,
            flag: 1
        };
        this.setState({
            columndata: [...columndata, newData],
            count: count + 1,
        });
    }

    renderOperation(text, record) {
        const { state } = record;
        return (
            <span>
                {
                    record.flag
                        ? <a rel="noopener noreferrer" onClick={() => this.handleSave(record)}>保存</a>
                        : <a rel="noopener noreferrer" onClick={() => this.handleModify(record)}>修改</a>
                }
                <a rel="noopener noreferrer" onClick={() => this.handleDisable(record)}> {state === 0 ? '启用' : '停用'}</a>
            </span>
        )
    }

    render() {
        this.modifyContentlistColumns[this.modifyContentlistColumns.length - 1].render = this.renderOperation;
        const { dictionary, remark } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { columndata } = this.state;
        return (
            <Modal
                onCancel={this.handleCancelModify}
                visible={this.props.maintenanceVisible}
                footer={null}
                title="维护字典内容"
            >
                <div>
                    <div className="ant-form-item-control">
                        <span className="manage-form-label change-form-label">字典名称:</span>
                        <span>{dictionary}</span>
                    </div>
                    <div className="ant-form-item-control">
                        <span className="manage-form-label change-form-label">说明:</span>
                        <span>{remark}</span>
                    </div>
                    <div className="ant-form-item-control">
                        <span className="manage-form-label change-form-label">字典内容:</span>
                        <Button onClick={this.handleAdd} type="default" size="default">
                            添加
                        </Button>
                    </div>
                    <div>
                        <Table
                            dataSource={columndata}
                            columns={this.modifyContentlistColumns}
                            rowKey="id"
                            pagination={{

                            }}
                        />
                    </div>
                </div>
            </Modal >
        );
    }
}
export default withRouter(Form.create()(modifyContentlist));
