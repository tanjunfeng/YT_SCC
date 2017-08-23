import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
}

function Common(WrappedComponent) {
    @connect(
        state => ({
            RIGHTS: state.toJS().user.rights
        }),
        dispatch => bindActionCreators({
        }, dispatch)
    )
    class HOC extends Component {
        static displayName = `HOC(${getDisplayName(WrappedComponent)})`
        render() {
            const { right, RIGHTS = [] } = this.props;
            const hasRight = RIGHTS.indexOf(right) > -1;
            if (!hasRight) {
                return null;
            }
            return (
                <WrappedComponent {...this.props} />
            );
        }
    }
    HOC.propTypes = {
        right: PropTypes.string,
        RIGHTS: PropTypes.arrayOf(PropTypes.string)
    }
    return HOC;
}

export default Common;
