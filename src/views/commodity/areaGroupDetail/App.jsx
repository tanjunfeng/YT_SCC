/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 区域组详情
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Row, Col, Button } from 'antd';

import { AreaGroup, BranchCompany } from '../../../container/search';
import { PAGE_SIZE } from '../../../constant';
import {
    getAreaGroup
} from '../../../actions/commodity';

const FormItem = Form.Item;

@connect(state => ({
    areaGroup: state.toJS().commodity.areaGroup
}), dispatch => bindActionCreators({
    getAreaGroup
}, dispatch))

class AreaGroupDetail extends PureComponent {
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="area-group-detail">
                <Form layout="inline">
                    <Row>
                        <Col>
                            <FormItem label="所属子公司">
                                {getFieldDecorator('branchCompany', {
                                    initialValue: { id: '', name: '' }
                                })(<BranchCompany disabled />)}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="区域组">
                                {getFieldDecorator('areaGroup', {
                                    initialValue: { areaGroupCode: '', areaGroupName: '' }
                                })(<AreaGroup disabled />)}
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
            </div>
        );
    }
}

AreaGroupDetail.propTypes = {
    getAreaGroup: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(AreaGroupDetail));
