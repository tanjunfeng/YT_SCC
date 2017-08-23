import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
    Form,
    Input,
    Select,
    Modal,
    Row,
    Col,
} from 'antd';
import { auditType, auditTypeCodes } from '../../constant/procurement';

const FormItem = Form.Item;
const Option = Select.Option;


class Audit extends PureComponent {
    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.onAuditTypeChange = this.onAuditTypeChange.bind(this);
        this.state = {
            visible: false,
            rejectReasonVisible: false
        }
    }

    componentDidMount() {
        this.setState({ visible: this.props.visible });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ visible: nextProps.visible });
    }

    onAuditTypeChange(vale) {
        if (vale === auditTypeCodes.reject) {
            this.setState({ rejectReasonVisible: true });
        }
    }
    handleOk = () => {
        let isOk = false;
        this.props.form.validateFields(['auditTypeCd'], (err) => {
            if (!err) {
                const auditTypeCd = this.props.form.getFieldValue('auditTypeCd');
                if (auditTypeCd === auditTypeCodes.reject) {
                    this.props.form.validateFields(['rejectReason'], () => {
                        if (!err) {
                            isOk = true;
                        }
                    });
                } else {
                    isOk = true;
                }
            }
        });

        if (isOk) {
            const { onOk } = this.props;
            const values = this.props.form.getFieldsValue();
            if (onOk) {
                onOk({ ...values });
            }
        }
    }
    handleCancel = () => {
        const { onCancel } = this.props;
        if (onCancel) {
            onCancel();
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title="审核"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <div>

                    <Form layout="vertical">
                        <Row>
                            <Col>
                                <FormItem label="审核" formItemLayout>
                                    {getFieldDecorator('auditTypeCd', {
                                        initialValue: '',
                                        rules: [{ required: true, message: '请审核' }],
                                    })(
                                        <Select
                                            style={{ width: '153px' }}
                                            size="default"
                                            onChange={this.onAuditTypeChange}
                                        >
                                            {
                                                auditType.data.map((item) => (
                                                    <Option
                                                        key={item.key}
                                                        value={item.key}
                                                    >{item.value}</Option>
                                                ))
                                            }
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {this.state.rejectReasonVisible && <FormItem label="拒绝原因">
                                    {getFieldDecorator('rejectReason', {
                                        rules:
                                        [{
                                            required: true,
                                            message: '请输入拒绝原因',
                                            whitespace: true
                                        }]
                                    })(
                                        <Input.TextArea
                                            placeholder="请输入拒绝原因"
                                        />
                                        )}
                                </FormItem>}
                            </Col>
                        </Row>
                    </Form>

                </div>
            </Modal>
        );
    }
}

Audit.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    visible: PropTypes.bool,
    onOk: PropTypes.objectOf(PropTypes.any),
    onCancel: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(Audit));
