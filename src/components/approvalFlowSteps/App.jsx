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
        console.log(this.props)
        const { processDefinitions, current } = this.props;
        return (
            <Steps current={current} progressDot>
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
    current: PropTypes.number
};

export default OpinionSteps;
