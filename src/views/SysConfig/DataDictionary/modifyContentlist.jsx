/**
 * @file list.jsx
 * @author shijh
 *
 * 管理列表页面
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Modal, Input, Button } from 'antd';
import { DicContentListVisible, Dictionarycontentlist } from '../../../actions/dictionary';
const FormItem = Form.Item;

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
        Dictionarycontentlist
    }, dispatch)
)
class modifyContentlist extends PureComponent {
    constructor(props) {
        super(props);
        this.handleCancelModify = ::this.handleCancelModify;
        this.handleOk = ::this.handleOk;
        this.handleModify = ::this.handleModify;
        this.handleAdd =::this.handleAdd;
    }
    componentDidMount() {
        const { id } = this.props;
        this.props.Dictionarycontentlist({ dictionaryId: id })
    }
    handleOk() {
        const id = this.props.id;
    }

    handleCancelModify() {
        this.props.DicContentListVisible({ isVisible: false })
    }
    handleDisable() {

    }
    handleModify() {

    }
    handleAdd() {
        const { contentlistData } = this.props;
        const length = contentlistData.length;
    }
    render() {
        const { dictionary, remark } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { contentlistData = [] } = this.props;
        if (contentlistData.length === 0) {
            return null
        }
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
                        <table className="detail-table">
                            <tr className="detail-table-tr">
                                <th>序号</th>
                                <th>内容名称</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                            {
                                contentlistData.map((item, index) => (
                                    <tr className="detail-table-tr">
                                        <td key={index}>{index}</td>
                                        <td>{item.contentName}</td>
                                        <td>{item.state ? '已启用' : '已停用'}</td>
                                        <td>
                                            <a className="manage-form-label" onClick={this.handleModify}>修改</a>
                                            <a className="manage-form-label" onClick={this.handleDisable}>停用</a>
                                        </td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                </div>
            </Modal >
        );
    }
}
export default withRouter(Form.create()(modifyContentlist));
