/**
 * @file Layout
 * @author denglingbo
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Menu, Dropdown, Layout, Icon } from 'antd';
import SiderMenu from '../../common/siderMenu/SiderMenu';
import Breadcrumb from '../../common/breadcrumb/Breadcrumb';
import TopMenu from '../../common/topMenu/TopMenu';
import AuthRoute from '../../Route';
import { CODE } from '../../constant';
import { logout } from '../../service';
import ModifyThePassword from './modifyThePassword';
import './layout.scss';

const { Header, Content, Sider } = Layout;

@connect(
    state => ({
        pub: state.toJS().pub,
        initData: state.toJS().user.data,
        rights: state.toJS().user.rights,
    })
)
class AuthLayout extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSelect = :: this.handleSelect;

        this.state = {
            visible: false
        }

        this.menu = (
            <Menu onClick={this.handleSelect}>
                <Menu.Item key="modifyThePassword">
                    <a rel="noopener noreferrer">修改密码</a>
                </Menu.Item>
                <Menu.Item key="logout">
                    <a rel="noopener noreferrer">退出登录</a>
                </Menu.Item>
            </Menu>
        );

        const { initData } = props;
        const { topMenus } = initData;
        this.defaultSelect = topMenus.menu.find((item) => item.code === CODE)
    }

    visibleChange = (visible) => {
        this.setState({
            visible
        })
    }

    handleSelect(item) {
        const { key } = item;
        switch (key) {
            case 'modifyThePassword':
                this.setState({
                    visible: true
                })
                break;
            case 'logout':
                logout()
                    .then(() => {
                        /* eslint-disable */
                        location.href = config.loginLink;
                        /* eslint-enable */
                    })
                    .catch(() => {
                    })
                break;
            default:
                break;
        }
    }

    render() {
        const { initData, pub } = this.props;
        const { menus, user, topMenus } = initData;
        return (
            <Layout>
                {/* Header */}
                <Header>
                    <div className="ant-layout-header-left">
                        <div className="ant-layout-sider-logo">Logo</div>
                        <TopMenu topMenus={topMenus}/>
                        {/* <Menu
                            onClick={this.handleClick}
                            selectedKeys={[`${this.defaultSelect.id}`]}
                            mode="horizontal"
                        >
                            {
                                topMenus.menu.map((item) => (
                                    <Menu.Item key={item.id}>
                                        <Icon type="mail" />{item.name}
                                    </Menu.Item>
                                ))
                            }
                        </Menu> */}
                    </div>
                    <div className="ant-layout-header-right">
                        <div className="ant-layout-header-user">
                            <Dropdown
                                overlay={this.menu}
                                onSelect={this.handleSelect}
                                placement="bottomCenter"
                            >
                                <a className="ant-layout-header-drop">
                                    <span className="ant-layout-header-username" title={user.employeeName} alt={user.employeeName}>{user.employeeName}</span><Icon type="down" />
                                </a>
                            </Dropdown>
                        </div>
                    </div>
                </Header>
                {/* Layout */}
                <Layout>

                    {/* 侧边栏容器 */}
                    <Sider collapsed={pub.collapsed}>
                        <SiderMenu menu={menus.menu} />
                    </Sider>

                    {/* 内容主容器 */}
                    <Content>
                        {/* 内容容器 */}
                        <div className="content-main">
                            {/* 面包屑 */}
                            <Breadcrumb menu={menus.menu} />
                            <AuthRoute menu={menus.menu} />
                        </div>
                    </Content>
                </Layout>
                <ModifyThePassword visible={this.state.visible} onChange={this.visibleChange} />
            </Layout>
        );
    }
}

AuthLayout.propTypes = {
    initData: PropTypes.objectOf(PropTypes.any),
    pub: PropTypes.objectOf(PropTypes.any),
}

AuthLayout.defaultProps = {
    initData: {},
    pub: {},
}

export default withRouter(AuthLayout);
