/**
 * @file NoData.jsx
 * @author denglingbo
 *
 * Des
 */
import React from 'react';
import PropTypes from 'prop-types';

const NoData = (props) => (
    <div className="ywc-smind-no-data">{props.children}</div>
)

NoData.propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
}

export default NoData;
