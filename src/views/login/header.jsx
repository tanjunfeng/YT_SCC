import React, { Component, PureComponent } from 'react';


class Header extends PureComponent {
  
    render() {

        return (
            <div className="yt-login-head">
                <div className="yt-login-head-logo">
                    <img src={require('../../images/login/yt-logo.png')} />
                    <span>供应链采购平台</span>
                </div>
            </div>
        )
    }
}

export default Header;