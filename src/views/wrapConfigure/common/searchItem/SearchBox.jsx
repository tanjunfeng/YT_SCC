/**
 * @file App.jsx
 * @author liujinyu
 *
 * 首页样式管理条件查询区
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button, Select } from 'antd';
import { BranchCompany } from '../../../../container/search';
import { operationState } from '../../../../constant/wrapConfigure';

const FormItem = Form.Item;

class SearchBox extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isDisabled: true,
            isHide: true
        }
    }

    componentWillReceiveProps(nextProps) {
        const companyObj = nextProps.form.getFieldValue('branchCompany');
        if (companyObj.name === '总公司') {
            this.setState({
                isDisabled: false
            })
        } else if (companyObj.name !== '' && companyObj.name !== '总公司') {
            this.setState({
                isDisabled: false,
                isHide: false
            })
        } else {
            this.setState({
                isDisabled: true,
                isHide: true
            })
        }
    }

    formSubmit = () => {
        const submitObj = this.props.form.getFieldsValue()
        this.props.searchChange(submitObj)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="search-box wap-search-box">
                <Form
                    layout="inline"
                    className="ant-advanced-search-form"
                >
                    <Row gutter={40}>
                        <Col span={8}>
                            {/* 子公司 */}
                            <FormItem label="分公司">
                                {getFieldDecorator('branchCompany', {
                                    initialValue: { id: '', name: '' }
                                })(<BranchCompany />)}
                            </FormItem>
                        </Col>
                        <Col span={8} className={this.state.isHide ? 'homePageType-hide' : 'homePageType-show'}>
                            {/* 运营方式 */}
                            <FormItem label="运营方式">
                                {getFieldDecorator('homePageType', {
                                    initialValue: operationState.defaultValue
                                })(
                                    <Select style={{ width: '200px' }} size="default">
                                        {
                                            operationState.data.map((item) => (
                                                <Select.Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <Button disabled={this.state.isDisabled} onClick={this.formSubmit} type="primary" className="search-btn">查看</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

SearchBox.propTypes = {
    searchChange: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(SearchBox));
