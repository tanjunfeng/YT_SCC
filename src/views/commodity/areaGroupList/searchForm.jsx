/**
 * 区域组管理查询条件
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Row, Col, Input } from 'antd';
import { withRouter } from 'react-router';

import Util from '../../../util/util';
import { BranchCompany } from '../../../container/search';

const FormItem = Form.Item;

class SearchForm extends PureComponent {
    getFormData = () => {
        const {
            areaGroupIdOrName,
            branchCompany
        } = this.props.form.getFieldsValue();
        return Util.removeInvalid({
            areaGroupIdOrName,
            branchCompany: branchCompany.id
        });
    }

    handleSearch = () => {
        // 通知父页面执行搜索
        this.props.onSearch(this.getFormData());
    }

    handleReset = () => {
        this.props.form.resetFields(); // 清除当前查询条件
        this.props.onReset(); // 通知查询条件已清除
        // 点击重置时清除 seachMind 引用文本
        this.props.form.setFieldsValue({
            branchCompany: { reset: true }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" className="area-group">
                <Row>
                    <Col>
                        <FormItem label="所属子公司">
                            {getFieldDecorator('branchCompany', {
                                initialValue: { id: '', name: '' }
                            })(<BranchCompany />)}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="区域组">
                            {getFieldDecorator('areaGroupIdOrName', {
                                initialValue: ''
                            })(<Input size="default" />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="end">
                    <Col>
                        <Button type="primary" size="default" onClick={this.handleSearch}>
                            查询
                        </Button>
                        <Button size="default" onClick={this.handleReset}>
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm.propTypes = {
    onSearch: PropTypes.func,
    onReset: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(SearchForm));
