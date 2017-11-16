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
        let stepsList = 0;
        processDefinitions.filter((item) => (
            item.processAuditLog && stepsList++
        ))
        return (
            <Steps current={stepsList} progressDot>
                {processDefinitions.map((item, index) => (
                    <Step
                        key={`toDo-${index}`}
                        title={item.processNodeName}
                        description={
                            item.processAuditLog === null ? '不同意' : '同意'
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
