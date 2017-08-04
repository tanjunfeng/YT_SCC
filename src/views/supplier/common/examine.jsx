import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Table, Form, Select, Input, message } from 'antd';
import { fetchOldAndNew, approveSupplier } from '../../../actions/checkSupplier';

import { showChange } from '../../../constant/formColumns';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        changeData: state.toJS().supplier.changeData
    }),
    dispatch => bindActionCreators({
        fetchOldAndNew,
        approveSupplier
    }, dispatch)
)
class Examine extends PureComponent {
    constructor(props) {
        super(props);
        this.handleOk = ::this.handleOk;
        this.handleCancel = ::this.handleCancel;
        this.handleSelectChange = ::this.handleSelectChange;
        this.state = {
            selected: -1
        }
    }
    componentDidMount() {
        const { id, type } = this.props;
        this.props.fetchOldAndNew({id}, type);
    }

    handleOk() {
        const { validateFields } = this.props.form;
        const { selected } = this.state;
        const { spId, id, type, handleHide, changeData, getDtail } = this.props;
        if (selected === -1) {
            message.warning('请选择审核结果！');
            return;
        }
        validateFields((err, values) => {
            if (!err) {
                this.props.approveSupplier({
                    spId,
                    id: changeData[0].old,
                    newId: id,
                    status: parseInt(selected, 10),
                    failedReason: values.failedReason
                }, type).then(() => {
                    getDtail().then(() => {
                        handleHide();
                    })
                })
            }
        })
    }

    handleCancel() {
        this.props.handleHide()
    }

    handleSelectChange(key) {
        this.setState({
            selected: key
        })
    }

    render() {
        const { changeData } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                visible
                title={this.props.title}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Table
                    columns={showChange}
                    dataSource={changeData.slice(1, changeData.length)}
                    rowKey="type"
                    size="small"
                    bordered
                    pagination={false}
                />
                <div>
                    <div className="application-modal-select">
                        <span className="application-modal-label">审核：</span>
                        <Select
                            style={{ width: '153px', marginLeft: '15px' }}
                            size="default"
                            placeholder="请选择"
                            onChange={this.handleSelectChange}
                        >
                            <Option value="2">通过</Option>
                            <Option value="1">不通过</Option>
                        </Select>
                    </div>
                    {
                        this.state.selected === '1' &&
                        <Form layout="inline">
                            <FormItem className="application-form-item">
                                <span className="application-modal-label">*不通过原因：</span>
                                {getFieldDecorator('failedReason', {
                                    rules: [{ required: true, message: '请输入不通过原因', whitespace: true }]
                                })(
                                    <Input
                                        onChange={this.handleTextChange}
                                        type="textarea"
                                        placeholder="请输入不通过原因"
                                        className="application-modal-textarea"
                                        autosize={{ minRows: 2, maxRows: 8 }}
                                    />
                                    )}
                            </FormItem>
                        </Form>
                    }
                </div>
            </Modal>
        );
    }
}

Examine.propTypes = {
    fetchOldAndNew: PropTypes.func,
    title: PropTypes.string,
    form: PropTypes.objectOf(PropTypes.any),
    approveSupplier: PropTypes.func,
    spId: PropTypes.string,
    changeData: PropTypes.objectOf(PropTypes.any),
    type: PropTypes.string,
    handleHide: PropTypes.func,
    getDtail: PropTypes.func,
    id: PropTypes.string,
};

export default Form.create()(Examine);
