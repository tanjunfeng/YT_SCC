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
    componentWillMount() {
        this.props.clearAreaGroup();
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.getAreaGroup({
            areaGroupIdOrName: id
        });
    }

    renderTitle = info => {
        const data = info || {
            id: '',
            areaGroupName: '',
            branchCompanyId: '',
            branchCompanyName: ''
        }
        const {
            id, areaGroupName, branchCompanyId, branchCompanyName
        } = data;
        return (
            <Form layout="inline">
                <Row>
                    <Col>
                        <FormItem label="区域组">
                            {`${id} - ${areaGroupName}`}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="所属子公司">
                            {`${branchCompanyId} - ${branchCompanyName}`}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }

    render() {
        const { areaGroup } = this.props;
        return (
            <div className="area-group-detail">
                {this.renderTitle(areaGroup.records[0])}
                <div className="shuttle-form">
                    <div className="col-half">1</div>
                    <div className="col-center">
                        <div className="button-group">
                            <Button size="default" onClick={this.handleAddAll}>
                                &lt;&lt; 添加查询结果
                            </Button>
                            <Button type="primary" size="default" onClick={this.handleAddSelected}>
                                &lt; 添加所选门店
                            </Button>
                            <Button type="danger" size="default" onClick={this.handleDelSelected}>
                                删除所选门店 &gt;
                            </Button>
                            <Button type="danger" size="default" onClick={this.handleDelAll}>
                                删除查询结果 &gt;&gt;
                            </Button>
                        </div>
                    </div>
                    <div className="col-half">2</div>
                </div>
            </div>
        );
    }
}

AreaGroupDetail.propTypes = {
    clearAreaGroup: PropTypes.func,
    getAreaGroup: PropTypes.func,
    areaGroup: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(AreaGroupDetail));
