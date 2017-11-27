/**
 * @file App.jsx
 * @author liujinyu
 *
 * 首页样式运营状态切换区
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Switch, Modal } from 'antd';

const confirm = Modal.confirm;

class SwitchBox extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isChecked: this.props.isChecked,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isChecked !== this.state.isChecked) {
            this.setState({
                isChecked: nextProps.isChecked
            })
        }
    }

    /**
     * 点击切换运营方式
     * @param {bloon} checked 是否为总部运营
     */
    handleChange = (checked) => {
        const _this = this
        confirm({
            title: '请确认',
            content: '是否确认切换运营状态',
            onOk() {
                _this.setState({
                    checked
                })
                _this.props.switchChange(checked)
            },
            onCancel() {
                _this.setState({
                    checked: !checked
                })
            },
        });
    }

    render() {
        return (
            <div className="switch-box">
                <div className="region">
                    当前设置区域：<span>{this.props.companyName}</span>
                </div>
                {
                    !this.props.headquarters
                        ? <div className="mode">
                            <Switch checkedChildren="总部运营" unCheckedChildren="总部运营" onChange={this.handleChange} checked={this.state.isChecked} />
                        </div>
                        : null
                }
            </div>
        )
    }
}

SwitchBox.propTypes = {
    headquarters: PropTypes.bool,
    companyName: PropTypes.string,
    isChecked: PropTypes.bool
};

export default SwitchBox;
