/**
 * @file SiderMenu
 * @author wuxinwei
 *
 * 顶部菜单根据 后端数据进行 render
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Menu, Icon, Carousel, Dropdown } from 'antd';
import { CODE } from '../../constants';
import Utils from '../../util/util';
import './topMenu.scss';

const SubMenu = Menu.SubMenu;

class TopMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropDownMenu: [],
            menuStyle: {},
            totalStyle: {}
        }
        
        const { topMenus } = props;
        this.defaultSelect = topMenus.menu.find((item) => item.code === CODE);
        this.showDropdown = false;
    }
    componentDidMount() {
        this.winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.topMenuWidth = parseInt(this.winWidth, 10) - 200 - 140;
        const ul = document.querySelector('.top-menu-warp .ant-menu');
        const { widthArr } = Utils.getListWidthObj(ul);
        this.count = 1;
        this.totalWidth = widthArr.reduce(this.reduceCallback);
        delete this.count;
        this.showDropdown = this.totalWidth > this.topMenuWidth ? true : false;
        const newArr = this.props.topMenus.menu.slice(this.menuIndex - 1);
        const topMenuWidthArr = widthArr.slice(0, this.menuIndex - 1);
        if(this.showDropdown){
            this.setState({
                dropDownMenu : newArr,
                menuStyle: {
                    width: `${topMenuWidthArr.reduce((sum, value) => sum + value)}px`
                },
                totalStyle: {
                    width: `${topMenuWidthArr.reduce((sum, value) => sum + value) + 57}px`
                }
            })
        }
        console.log(this);
    }
    /**
     *  reduce 回调
     * @param {Number} sum 执行函数后返回的值
     * @param {Number} value 当前执行的值
     * @param {Number} index 当前的索引
     */
    reduceCallback = (sum, value, index) => {
        const difference = (sum + value) - this.topMenuWidth;
        if(difference > 0){
            if(this.count === 1){
                this.menuIndex = index;
                this.count++; 
            }
        }
        return sum + value;
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
     * 列表点击事件
     * @param e 事件对象
     */
    handPrev = (e) => {
        console.log(e);
        
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
        const { dropDownMenu } = this.state;
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
            <div className={this.showDropdown ? "top-menu-warp on" : "top-menu-warp"} style={this.state.totalStyle}>
                <div className="ant-menu-warp">
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
