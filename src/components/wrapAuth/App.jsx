import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const WrapAuth = (ComposedComponent) => (
    class WrapComponent extends PureComponent {
        constructor(props) {
            super(props);
        }

        static propTypes = {
            auth: PropTypes.string.isRequired,
        };

        render() {
            if (tool.getAuth(this.props.auth)) {
                return <ComposedComponent  { ...this.props} />;
            } else {
                return null;
            }
        }
    }
)

export default WrapAuth;