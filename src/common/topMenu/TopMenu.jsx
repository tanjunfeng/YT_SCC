/**
 * @file SiderMenu
 * @author wuxinwei
 *
 * 顶部菜单根据 后端数据进行 render
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon, Dropdown } from 'antd';
import { CODE } from '../../constant';
import Utils from '../../util/util';
import './topMenu.scss';

class TopMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropDownMenu: [],
            menuStyle: {}
        }

        const { topMenus } = props;
        this.defaultSelect = topMenus.menu.find((item) => item.code === CODE);
        this.showDropdown = false;
    }

    componentDidMount() {
        this.winWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
        this.topMenuWidth = parseInt(this.winWidth, 10) - 200 - 140;
        const ul = document.querySelector('.top-menu-warp .ant-menu');
        const { widthArr } = Utils.getListWidthObj(ul);
        let count = 1
        this.totalWidth = widthArr.reduce(function (sum, value, index) {
            const difference = (sum + value) - this.topMenuWidth;
            if (difference > 0) {
                if (count === 1) {
                    this.menuIndex = index;
                    count++;
                }
            }
            return sum + value;
        }.bind(this), 0);
        this.showDropdown = this.totalWidth > this.topMenuWidth;
        const newArr = this.props.topMenus.menu.slice(this.menuIndex);
        const newWidthArr = widthArr.slice(this.menuIndex);
        if (this.showDropdown) {
            this.setState({
                dropDownMenu: newArr,
                menuStyle: {
                    width: `${this.totalWidth - newWidthArr.reduce((sum, value) => sum + value)}px`
                }
            })
        }
    }
    /**
     * 列表点击事件
     * @param {Object} item
     */
    handleClick = (item) => {
        const { key } = item;
        const keyArr = key.split(',');
        const id = keyArr[0];
        const url = keyArr[1];
        if (parseInt(id, 10) === this.defaultSelect.id) {
            return;
        }
        if (/[a-zA-z]+:\/\/[^\s]+/.test(url)) {
            window.open(url, '_self');
        } else {
            /* eslint-disable */
            window.open(`${config.topMenusLink}${id}.htm`, '_self');
            /* eslint-enable */
        }
    }

    /**
     * 渲染按钮列表
     */
    renderMenuList = () => (
        this.props.topMenus.menu.map((item) => (
            <Menu.Item key={`${item.id},${item.url}`}>
                <Icon type="mail" />{item.name}
            </Menu.Item>
        ))
    )
    /**
     * 渲染下拉按钮按钮列表
     */
    renderDropDownMenuList = () => (
        this.state.dropDownMenu.map((item) => (
            <Menu.Item key={`${item.id},${item.url}`}>
                <Icon type="mail" />{item.name}
            </Menu.Item>
        ))
    )
    /**
     * 渲染下拉按钮
     */
    renderDropDown = () => {
        const menu = (<Menu
            onClick={this.handleClick}
            selectedKeys={[`${this.defaultSelect.id},${this.defaultSelect.url}`]}
        >
            {
                this.renderDropDownMenuList()
            }
        </Menu>)
        return (
            <Dropdown
                overlay={menu}
                placement="bottomCenter"
            >
                <a className="ant-dropdown-link" href="#">
                    更多 <Icon type="down" />
                </a>
            </Dropdown>
        )
    }
    render() {
        return (
            <div className="top-menu-warp">
                <div className={this.showDropdown ? 'ant-menu-warp on' : 'ant-menu-warp'}>
                    <Menu
                        onClick={this.handleClick}
                        selectedKeys={[`${this.defaultSelect.id},${this.defaultSelect.url}`]}
                        mode="horizontal"
                        style={this.state.menuStyle}
                    >
                        {
                            this.renderMenuList()
                        }
                    </Menu>

                </div>
                {
                    this.showDropdown && this.renderDropDown()
                }
            </div>
        );
    }
}

TopMenu.propTypes = {
    topMenus: PropTypes.objectOf(PropTypes.any),
}

export default TopMenu
