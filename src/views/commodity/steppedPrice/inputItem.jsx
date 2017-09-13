/**
 * @file inputItem.jsx
 * @author shijh
 *
 * 价格区间单项
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Icon } from 'antd';
import KeyCode from 'rc-util/lib/KeyCode';
import { MAXGOODS } from '../../../constant'

class InputItem extends Component {
    constructor(props) {
        super(props)
        this.handleFirstChange = this.handleFirstChange.bind(this);
        this.handleSecondChange = this.handleSecondChange.bind(this);
        this.handleResultChange = this.handleResultChange.bind(this);
        this.handleAddClick = this.handleAddClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        const {
            firstDefault = 1,
            scondDefault = 2,
            resultDefault = 0
        } = props;
        this.state = {
            firstValue: firstDefault,
            secondValue: scondDefault,
            defaultValue: resultDefault
        }
    }

    handleAddClick() {
        this.props.handleAddItem();
    }

    handleDeleteClick() {
        const { handleDeleteItem, index } = this.props;
        handleDeleteItem(index)
    }

    handleKeyDown(event) {
        const { keyCode } = event;
        const {
            firstValue,
            secondValue,
         } = this.state;
        if (firstValue && secondValue && keyCode === KeyCode.ENTER) {
            this.handleAddClick()
        }
    }

    handleFirstChange(value) {
        const { secondValue } = this.state;
        const newState = {
            firstValue: value
        }
        if (value >= secondValue) {
            newState.secondValue = value + 1;
        }
        this.setState(newState, () => {
            this.changeParentResult()
        })
    }

    handleSecondChange(value = 1) {
        const newState = {
            secondValue: value
        }
        this.setState(newState, () => {
            this.changeParentResult()
        })
    }

    handleResultChange(value) {
        this.setState({
            defaultValue: value
        }, () => {
            this.changeParentResult()
        })
    }

    changeParentResult() {
        const { firstValue, secondValue, defaultValue } = this.state;
        const { handleValueChange, index } = this.props;
        handleValueChange(index, {
            firstValue,
            secondValue,
            defaultValue
        })
    }

    render() {
        const {
            prefixCls,
            inputSize,
            min,
            max,
            firstDefault,
            scondDefault,
            resultDefault,
            index,
            allLength
        } = this.props

        const { firstValue, secondValue, defaultValue } = this.state;
        return (
            <li className={`${prefixCls}-item`}>
                <span className={`${prefixCls}-item-first`}>
                    <InputNumber
                        size={inputSize}
                        min={min}
                        max={max}
                        disabled={index === 0}
                        value={firstValue}
                        defaultValue={firstDefault}
                        onChange={this.handleFirstChange}
                        onKeyDown={this.handleKeyDown}
                    />
                </span>
                <Icon type="minus" className={`${prefixCls}-step`} />
                <span className={`${prefixCls}-item-second`}>
                    <InputNumber
                        size={inputSize}
                        min={parseInt(firstValue + 1, 10)}
                        max={MAXGOODS}
                        value={secondValue}
                        defaultValue={scondDefault}
                        onChange={this.handleSecondChange}
                        onKeyDown={this.handleKeyDown}
                    />
                </span>
                <span className={`${prefixCls}-item-result`}>
                    <InputNumber
                        size={inputSize}
                        min={0}
                        max={max}
                        value={defaultValue}
                        defaultValue={resultDefault}
                        onChange={this.handleResultChange}
                        onKeyDown={this.handleKeyDown}
                    />
                </span>
                <span>
                    {
                        index === allLength - 1 &&
                        <Icon
                            type="plus"
                            className={`${prefixCls}-icon-plus`}
                            onClick={this.handleAddClick}
                        />
                    }
                    {
                        index !== 0 &&
                        <Icon
                            type="minus"
                            className={`${prefixCls}-icon-minus`}
                            onClick={this.handleDeleteClick}
                        />
                    }
                </span>
            </li>
        );
    }
}

InputItem.propTypes = {
    prefixCls: PropTypes.string,
    inputSize: PropTypes.string,
    min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    firstDefault: PropTypes.number,
    scondDefault: PropTypes.number,
    resultDefault: PropTypes.number,
    index: PropTypes.number,
    handleValueChange: PropTypes.func,
    allLength: PropTypes.number,
    handleAddItem: PropTypes.func,
    handleDeleteItem: PropTypes.func
}

InputItem.defaultProps = {
    prefixCls: 'stepped-Price',
    inputSize: 'small',
    min: 0,
    isLast: false,
    handleValueChange: () => {},
    allLength: 0,
    handleAddItem: () => {},
    handleDeleteItem: () => {}
}

export default InputItem;
