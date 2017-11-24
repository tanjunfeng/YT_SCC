/**
 * @file App.jsx
 * @author liujinyu
 *
 * 首页样式管理条件查询区
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Form, Switch } from 'antd';

const FormItem = Form.Item;

class SwitchBox extends PureComponent {
    componentWillReceiveProps(nextProps) {
        const isUsingNation = nextProps.form.getFieldValue('isUsingNation')
        const isUsingNationOld = this.props.form.getFieldValue('isUsingNation')
        if (isUsingNation !== isUsingNationOld) {
            this.props.switchChange(isUsingNation)
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="switch-box">
                <div className="region">
                    当前设置区域：<span>{this.props.companyName}</span>
                </div>
                {
                    this.props.companyId && this.props.companyId !== 'headquarters'
                        ? <div className="mode">
                            <Form
                                layout="inline"
                                className="ant-advanced-search-form"
                                onSubmit={this.handleSearch}
                            >
                                <FormItem label="设置运营方式" >
                                    {getFieldDecorator('isUsingNation', { valuePropName: 'checked' })(
                                        <Switch checkedChildren="总部运营" unCheckedChildren="独立运营" />
                                    )}
                                </FormItem>
                            </Form>
                        </div>
                        : null
                }
            </div>
        )
    }
}

SwitchBox.propTypes = {
    switchChange: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    companyId: PropTypes.string,
    companyName: PropTypes.string
};

export default withRouter(Form.create()(SwitchBox));
