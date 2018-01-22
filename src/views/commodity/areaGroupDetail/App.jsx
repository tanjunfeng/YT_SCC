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
import { Form, Row, Col } from 'antd';

import { AreaGroup, BranchCompany } from '../../../container/search';
import { PAGE_SIZE } from '../../../constant';
import {
    getAreaGroup, clearAreaGroup
} from '../../../actions/commodity';

const FormItem = Form.Item;

@connect(state => ({
    areaGroup: state.toJS().commodity.areaGroup
}), dispatch => bindActionCreators({
    getAreaGroup, clearAreaGroup
}, dispatch))

class AreaGroupDetail extends PureComponent {
    state = {
        initial: {
            id: '',
            areaGroupName: '',
            branchCompanyId: '',
            branchCompanyName: ''
        }
    }

    componentWillMount() {
        this.props.clearAreaGroup();
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.getAreaGroup({
            areaGroupIdOrName: id
        });
    }

    render() {
        const { form, areaGroup } = this.props;
        const { getFieldDecorator } = form;
        console.log(areaGroup.records);
        return (
            <div className="area-group">
                <Form layout="inline">
                    <Row>
                        <Col>
                            <FormItem label="区域组">
                                {getFieldDecorator('areaGroup', {
                                    initialValue: { areaGroupCode: '', areaGroupName: '' }
                                })(<AreaGroup disabled />)}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="所属子公司">
                                {getFieldDecorator('branchCompany', {
                                    initialValue: { id: '', name: '' }
                                })(<BranchCompany disabled />)}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

AreaGroupDetail.propTypes = {
    clearAreaGroup: PropTypes.func,
    getAreaGroup: PropTypes.func,
    areaGroup: PropTypes.objectOf(PropTypes.any),
    form: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(AreaGroupDetail));
