import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Steps } from 'antd';
import {
    queryProcessDefinitions
} from '../../actions/procurement';

const Step = Steps.Step;

@connect(state => ({
    processDefinitions: state.toJS().procurement.processDefinitions
}), dispatch => bindActionCreators({
    queryProcessDefinitions
}, dispatch))

class OpinionSteps extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { processDefinitions } = this.props;
        let stepsList = -1;
        processDefinitions.forEach(item => {
            if (item.processAuditLog !== null) {
                stepsList++;
            }
        });
        if (stepsList === -1) {
            stepsList = 0;
        }
        return (
            <Steps progressDot current={stepsList}>
                {processDefinitions.map((item, index) => (
                    <Step
                        key={`toDo-${index}`}
                        title={item.processNodeName}
                        description={
                            !item.processAuditLog || item.processAuditLog.auditResult !== 1 ? '未同意' : '同意'
                        }
                    />
                ))}
            </Steps>
        );
    }
}

OpinionSteps.propTypes = {
    processDefinitions: PropTypes.arrayOf(PropTypes.any),
};

export default OpinionSteps;
