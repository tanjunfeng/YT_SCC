/**
 * @file App.jsx
 * @author shijinhua
 *
 * 浮出层表单搜索
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';

class SearchInput extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    handleWrapClick = (e) => {
        console.log(e);
    }

    render() {
        console.log(this.props.children)
        const suffix = <Icon type="loading" />
        return (
            <span
                onClick={this.handleWrapClick}
                style={{position: 'relative', display: 'inline-block'}}
            >
                {this.props.children}
                {/* {
                    this.state.show && */}
                    <div
                        style={{position: 'absolute', width: '100%', top: '0px', width: '200px', border: '1px solid #eee', backgroundColor: 'transparent'}}
                    >
                        <Input
                            suffix={suffix}
                            placeholder={this.props.placeholder}
                        />
                        <div>
                            123123123
                        </div>
                    </div>
                {/* } */}
            </span>
        )
    }
}

export default SearchInput;
