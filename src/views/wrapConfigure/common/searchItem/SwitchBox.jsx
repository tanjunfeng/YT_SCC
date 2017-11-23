/**
 * @file App.jsx
 * @author liujinyu
 *
 * 首页样式管理条件查询区
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button, Select, Switch } from 'antd';
import { BranchCompany } from '../../../../container/search';
import { operationState } from '../../../../constant/wrapConfigure';

const FormItem = Form.Item;

class SwitchBox extends PureComponent {
    // constructor(props) {
    //     super(props)
    // }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="switch-box">
                <div className="region">
                    当前设置区域：<span>{this.props.areaName}</span>
                </div>
                <div className="mode">
                    <Form
                        layout="inline"
                        className="ant-advanced-search-form"
                        onSubmit={this.handleSearch}
                    >
                        <FormItem label="设置运营方式" >
                            {getFieldDecorator('switch', { valuePropName: 'checked' })(
                                <Switch checkedChildren="总部运营" unCheckedChildren="独立运营" />
                            )}
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

SwitchBox.propTypes = {
    // onPromotionSearch: PropTypes.func,
    // onPromotionReset: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    // upDate: PropTypes.bool,
};

export default withRouter(Form.create()(SwitchBox));
