/**
 * @file Route.js
 * @author denglingbo
 *
 * Route 被 framework 引入，用于创建路由
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import { getRoutes, WidthRoutes } from './routes/util';

const App = (props) => {
    const menu = props.menu;

    if (menu.length === 0) {
        return null;
    }

    return (
        <Switch>
            {getRoutes(menu).map((route, index) => {
                const cc = (<WidthRoutes
                    key={index}
                    {...route}
                />);
                return cc;
            })}
        </Switch>
    )
}

App.propTypes = {
    menu: PropTypes.arrayOf(PropTypes.object)
}

App.defaultProps = {
    menu: [],
}

export default withRouter(App);
