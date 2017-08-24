/**
 * @file App.js
 * @author denglingbo
 *
 * 此处调用 framework 的 App.js
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Layout } from 'antd';
import { receiveUser, fetchRightsAction } from './actions/user';
import AuthLayout from './views/layout/AuthLayout';
import LoginLayout from './views/login/LoginLayout';
import { findCodeByPath } from './routes/util';
import Routes from './constant/route';
import './style/common.scss';

/**
 * Fix path
 * @param location
 */
const pathListener = (location, history) => {
    try {
        const expr = /(.+)\/$/.exec(location.pathname);
        if (expr) {
            history.replace(expr[1]);
        }

        // 这里先注释掉，重新修改了 hash 会导致再次触发 listen
        if (location.hash === '#/') {
            // history.replace(location.pathname);
        }
    } catch (ex) {
        // Do nothing
    }
}

/**
 * 通过code找id
 * @param {string} code
 * @param {Object} data
 */
const findIdByCode = (code, data) => {
    if (!data || !code) {
        return;
    }
    const values = Object.values(data);
    values.forEach((value) => {
        if (value.submenu.length > 0) {
            const subMenus = Object.values(value.submenu);
            subMenus.forEach((subMenu) => {
                if (subMenu.code === code) {
                    return subMenu.id;
                }
                return '';
            });
        }
        return '';
    });
}

@connect(
    dispatch => bindActionCreators({
        receiveUser, fetchRightsAction
    }, dispatch)
)
class App extends PureComponent {
    componentWillMount() {
        // 此处 user 从后端数据返回, 此处进行 dispatch
        const { initData, history, location } = this.props;

        if (initData != null) {
            this.props.receiveUser(initData);
        }

        // 监听当前的地址变换
        this.unlisten = history.listen(loc => pathListener(loc, history));

        // 如果当前 pathname 为 login，则跳转到到 index
        if (initData && location.pathname === '/') {
            const { menus = {} } = initData;
            const { menu = [] } = menus;
            if (menu.length) {
                const { submenu } = menu[0];
                if (!submenu.length) {
                    return;
                }
                const { code } = submenu[0];
                history.replace(Routes[code]);
            }
        }
    }

    /**
     * 这里去拉取用户权限
     */
    componentDidMount() {
        const { history } = this.props;

        this.unrights = history.listen(() => this.getRights());

        this.getRights();
    }

    componentWillUnmount() {
        this.unlisten();
        this.unrights();
    }

    /**
     * 统一获取用户权限
     */
    getRights() {
        const { pathname } = this.props.location;
        const { initData } = this.props;
        const code = findCodeByPath(`/${pathname.split('/')[1]}`);
        if (code && initData && initData.menus && initData.menus.menu) {
            const id = findIdByCode(code, initData.menus.menu);
            this.props.fetchRightsAction(id);
        }
    }

    render() {
        const { initData } = this.props;
        return (
            <Layout>
                {
                    initData
                    ? <AuthLayout />
                    : <LoginLayout />
                }
            </Layout>
        );
    }
}

App.propTypes = {
    initData: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    receiveUser: PropTypes.func,
    fetchRightsAction: PropTypes.func,
}

export default withRouter(App);
