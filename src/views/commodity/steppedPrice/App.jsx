/**
 * @file App.jsx
 * @author shijh
 *
 * 价格区间选择组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';

import InputItem from './inputItem';

const initValue = [{
    startNumber: 1,
    endNumber: 2,
    price: 0
}]

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
        this.handleAddItem = ::this.handleAddItem;
        this.handleDeleteItem = ::this.handleDeleteItem;
        this.handleValueChange = ::this.handleValueChange;
        const { defaultValue } = props;
        const initState = defaultValue.length === 0 ? initValue : defaultValue;
        this.state = {
            defaultValue: initState
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
        this.setState({defaultValue}, () => {
            this.handleChange();
        })
    }

    handleDeleteItem(index) {
        const { defaultValue } = this.state;
        defaultValue.splice(index, 1);
        this.setState({defaultValue}, () => {
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
        const newItem = {
            startNumber: endNumber + 1,
            endNumber: endNumber + 2,
            price: 0
        }
        this.setState({
            defaultValue: [...defaultValue, newItem]
        }, () => {
            this.handleChange();
        })
    }

    render() {
        const { prefixCls } = this.props;
        const { defaultValue } = this.state;
        const len = defaultValue.length;
        return (
            <div className={prefixCls}>
                <div>
                    <div className={`${prefixCls}-title`}>
                        <span className={`${prefixCls}-title-left`}>数量区间</span>
                        <span className={`${prefixCls}-title-right`}>售价/元</span>
                    </div>
                    <ul className={`${prefixCls}-content`}>
                        <QueueAnim type={'left'}>
                            {
                                defaultValue.map((item, index) => {
                                    const { startNumber, endNumber, price } = item;
                                    return (
                                        <InputItem
                                            {...this.props}
                                            data-item={index}
                                            index={index}
                                            allLength={len}
                                            key={`${item.startNumber}${item.endNumber}${item.price}`}
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
                        </QueueAnim>
                    </ul>
                </div>
            </div>
        )
    }
}

SteppedPrice.propTypes = {
    prefixCls: PropTypes.string,
    defaultValue: PropTypes.arrayOf(PropTypes.any),
    handleChange: PropTypes.func,
    maxLength: PropTypes.number,
}

SteppedPrice.defaultProps = {
    prefixCls: 'stepped-Price',
    inputSize: 'small',
    min: 1,
    defaultValue: initValue,
    handleChange: () => {}
}

export default SteppedPrice;
