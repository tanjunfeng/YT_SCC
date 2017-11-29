/**
 * @file App.jsx
 * @author shijh
 *
 * 价格区间选择组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';

import InputItem from './inputItem';

import { MAXGOODS } from '../../../constant';

/**
 * 价格区间是否连续
 *
 * @param {Array[number]} arr 价格区间数组
 * @return {boolean} 是否连续
 */
const isContinuity = (arr) => {
    let i = 0;
    while (arr[i + 1]) {
        if (arr[i].endNumber + 1 !== arr[i + 1].startNumber) {
            return false;
        }
        i++;
    }
    return true;
}

class SteppedPrice extends PureComponent {
    constructor(props) {
        super(props)
        this.handleAddItem = this.handleAddItem.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        const { defaultValue } = props;
        this.initValue = [{
            startNumber: props.startNumber,
            endNumber: props.startNumber + 1,
            price: null
        }]
        const initState = defaultValue.length === 0 ? this.initValue : defaultValue;
        this.state = {
            defaultValue: initState
        }
    }

    componentWillReceiveProps(nextProps) {
        const { startNumber } = this.props;
        if (nextProps.startNumber !== startNumber) {
            this.initValue = [{
                startNumber: nextProps.startNumber,
                endNumber: nextProps.startNumber + 1,
                price: nextProps.price
            }]
        }
    }

    getValue() {
        const { defaultValue } = this.state;
        return {
            results: defaultValue,
            isContinuity: isContinuity(defaultValue)
        }
    }

    handleChange() {
        const { defaultValue } = this.state;
        this.props.handleChange({
            results: defaultValue,
            isContinuity: isContinuity(defaultValue)
        })
    }

    handleValueChange(index, obj) {
        const { defaultValue } = this.state;
        defaultValue[index] = {
            startNumber: obj.firstValue,
            endNumber: obj.secondValue,
            price: obj.defaultValue
        }
        this.setState({ defaultValue }, () => {
            this.handleChange();
        })
    }

    handleDeleteItem(index) {
        const { defaultValue } = this.state;
        defaultValue.splice(index, 1);
        this.setState({ defaultValue }, () => {
            this.forceUpdate();
            this.handleChange();
        })
    }

    handleAddItem() {
        const { defaultValue } = this.state;
        const { maxLength } = this.props;
        if (defaultValue.length >= maxLength) {
            return;
        }
        const { endNumber } = defaultValue[defaultValue.length - 1];
        if (endNumber === MAXGOODS) {
            message.warning('商品数达到最大值，无法再添加！')
            return;
        }
        if (!endNumber) {
            message.error('请填写完整该项数据！')
            return;
        }
        const newItem = {
            startNumber: endNumber + 1,
            endNumber: endNumber + 2,
            price: null
        }
        this.setState({
            defaultValue: [...defaultValue, newItem]
        }, () => {
            this.handleChange();
        })
    }

    reset = () => {
        this.setState({
            defaultValue: this.initValue
        }, () => {
            this.handleChange();
        })
    }

    render() {
        const { prefixCls, initvalue } = this.props;
        const { defaultValue } = this.state;
        const len = defaultValue.length;
        return (
            <div className={prefixCls}>
                <div>
                    <div className={`${prefixCls}-title`}>
                        <span className={`${prefixCls}-title-left`}>数量区间</span>
                        <span className={`${prefixCls}-title-right`}>
                            售价 元/{initvalue}
                        </span>
                    </div>
                    <ul className={`${prefixCls}-content`}>
                        {
                            defaultValue.map((item, index) => {
                                const { startNumber, endNumber, price = null } = item;
                                return (
                                    <InputItem
                                        {...this.props}
                                        data-item={index}
                                        index={index}
                                        allLength={len}
                                        key={`${item.startNumber}`}
                                        handleAddItem={this.handleAddItem}
                                        handleDeleteItem={this.handleDeleteItem}
                                        handleValueChange={this.handleValueChange}
                                        firstDefault={startNumber}
                                        scondDefault={endNumber}
                                        resultDefault={price}
                                    />
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

SteppedPrice.propTypes = {
    prefixCls: PropTypes.string,
    defaultValue: PropTypes.arrayOf(PropTypes.any),
    initvalue: PropTypes.arrayOf(PropTypes.any),
    handleChange: PropTypes.func,
    isEdit: PropTypes.bool,
    maxLength: PropTypes.number,
    startNumber: PropTypes.number,
    price: PropTypes.number
}

SteppedPrice.defaultProps = {
    prefixCls: 'stepped-Price',
    inputSize: 'small',
    min: 0,
    defaultValue: [],
    handleChange: () => { },
    startNumber: 0
}

export default SteppedPrice;
