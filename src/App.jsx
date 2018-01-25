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
import { Layout, message } from 'antd';
import { receiveUser, fetchRightsAction } from './actions/user';
import AuthLayout from './views/layout/AuthLayout';
import LoginLayout from './views/login/LoginLayout';
import { findCodeByPath } from './routes/util';
import routes from './routes';
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
 *
 * @return {Number} id > 0
 */
const findIdByCode = (code, data) => {
    let id = -1;
    if (!data || !code) {
        return id;
    }
    data.forEach(value => {
        if (value.submenu.length > 0) {
            value.submenu.forEach((subMenu) => {
                if (subMenu.code === code) {
                    id = subMenu.id;
                }
            });
        }
    });
    return id;
}

@connect(
    () => ({}),
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
            const firstMenu = this.getFirstMenu(menus);
            if (firstMenu === null) {
                message.error('当前用户未被授予任何权限');
            } else {
                this.getFirstPath(firstMenu);
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

    getFirstMenu = (menus) => {
        for (let i = 0, menu = menus.menu[i]; menu; i++) {
            if (menu.submenu.length > 0) {
                return menu;
            }
        }
        return null;
    }

    /**
     * 获取第一个主菜单下面的第一个有权限的子菜单
     */
    getFirstPath = (menu) => {
        const { code, submenu } = menu;
        const secondRouteList = routes.find(r => code === r.key).routes;
        const path = secondRouteList.find(s => s.key === submenu[0].code).path;
        this.props.history.replace(path);
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
            if (id > 0) this.props.fetchRightsAction(id);
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
