/**
 * @file MaterialChooser.jsx
 * @author twh
 *
 * 采购商品选择控件
 */
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchMaterialByCd } from '../../../actions';
import {
    Input,
    Button
} from 'antd';
const InputGroup = Input.Group;
@connect(state => ({ poLines: state.toJS().procurement.data }), dispatch => bindActionCreators({
    fetchMaterialByCd
}, dispatch))
export default class MaterialChooser extends PureComponent {
    state = {
        value: this.props.value
    }
    handleChange = (e) => {
        let value = e.target.value;
        this.setState({ value });
    }
    handlePressEnter = () => {
    }
    // edit = () => {
    //     this.setState({ editable: true });
    // }
    handleBlur = (e) => {
        let materialCd = this.state.value;
        this.props.fetchMaterialByCd({
            materialCd: materialCd
        });
    }
    render() {
        const { value, editable } = this.state;
        return (
            <div className="editable-cell">
                {
                    <div className="editable-cell-input-wrapper">
                        <InputGroup compact style={{ display: 'inline' }}>
                            <Input
                                value={value}
                                onChange={this.handleChange}
                                onPressEnter={this.handlePressEnter}
                                onBlur={this.handleBlur}
                                size="default"
                                style={{ width: "80px" }}
                            />
                            <Button icon="ellipsis" style={{ width: '40px', display: 'inline' }} size="default"></Button>
                        </InputGroup>
                    </div>
                }
            </div>
        );
    }
}