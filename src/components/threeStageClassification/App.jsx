/**
 * @file App.jsx
 *
 * @author shijh
 *
 * 在售商品列表
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Select } from 'antd';

import { fetchCategorys } from '../../actions/pub';

const Option = Select.Option;

const All = [{categoryId: -1, name: '全部', childCategories: []}];

@connect(
    state => ({
        categorys: state.toJS().pub.categorys,
    }),
    dispatch => bindActionCreators({
        fetchCategorys,
    }, dispatch)
)
class ClassifiedSelect extends Component {
    constructor(props) {
        super(props);

        this.onFirstChange = ::this.onFirstChange;
        this.onSecondChange = ::this.onSecondChange;
        this.onThirdChange = ::this.onThirdChange;
        this.onFourthChange = ::this.onFourthChange;
        this.resetValue = ::this.resetValue;

        this.state = {
            secondDate: All,
            thirdDate: All,
            fourthDate: All,
            firstSelect: All[0].name,
            secondSelect: All[0].name,
            thirdSelect: All[0].name,
            fourthSelect: All[0].name,
        }

        this.result = {
            first: All[0],
            second: All[0],
            third: All[0],
            fourth: All[0]
        }
    }

    componentDidMount() {
        const { defaultValue } = this.props;
        this.props.fetchCategorys().then(() => {
            if (defaultValue.length > 0) {
                this.onFirstChange(defaultValue[0]);
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        const { defaultValue } = nextProps;
        if (defaultValue !== this.props.defaultValue) {
            this.onFirstChange(defaultValue[0]);
            this.onSecondChange(defaultValue[1]);
            this.onThirdChange(defaultValue[2])
        }
    }

    onFirstChange(key) {
        const { categorys } = this.props;
        const current = categorys.filter(item => {
            if (item.name === key) {
                return item;
            }
            return null;
        })

        Object.assign(this.result, {
            first: current[0] ? current[0] : All[0],
            second: All[0],
            third: All[0]
        })

        this.setState({
            secondDate: All.concat(current.length > 0 ? current[0].childCategories : []),
            thirdDate: All,
            firstSelect: key,
            secondSelect: this.result.second.name,
            thirdSelect: this.result.third.name
        }, () => {
            this.props.onChange(this.result, this);
        })
    }

    onSecondChange(key) {
        const { secondDate } = this.state;
        const current = secondDate.filter(item => {
            if (item.name === key) {
                return item;
            }
            return null;
        })

        Object.assign(this.result, {
            second: (current.length > 0 ? current[0] : All[0]),
            third: All[0]
        });

        this.setState({
            thirdDate: All.concat(current.length > 0 ? current[0].childCategories : []),
            secondSelect: this.result.second.name,
            thirdSelect: this.result.third.name
        }, () => {
            this.props.onChange(this.result, this);
        })
    }

    onThirdChange(key) {
        const { thirdDate } = this.state;
        const current = thirdDate.filter(item => {
            if (item.name === key) {
                return item;
            }
            return null;
        })

        Object.assign(this.result, {
            third: (current.length > 0 ? current[0] : All[0]),
            fourth: All[0]
        });

        this.setState({
            fourthDate: All.concat(current.length > 0 ? current[0].childCategories : []),
            thirdSelect: this.result.third.name,
            fourthSelect: this.result.fourth.name
        }, () => {
            this.props.onChange(this.result, this);
        })
    }

    onFourthChange(key) {
        const { fourthDate } = this.state;
        const current = fourthDate.filter(item => {
            if (item.name === key) {
                return item;
            }
            return null;
        })

        Object.assign(this.result, {
            fourth: (current.length > 0 ? current[0] : All[0])
        });

        this.setState({
            fourthSelect: this.result.fourth.name
        }, () => {
            this.props.onChange(this.result, this);
        })
    }

    resetValue() {
        Object.assign(this.result, {
            first: All[0],
            second: All[0],
            third: All[0],
            fourth: All[0],
        })
        this.setState({
            firstSelect: All[0].name
        }, () => {
            this.props.onChange(this.result, this);
        })
    }

    render() {
        const { wrapClass, width } = this.props;
        let { categorys } = this.props;
        const {
            secondDate, thirdDate, fourthDate,
            firstSelect, thirdSelect, secondSelect, fourthSelect
        } = this.state;
        const { first, second, third } = this.result;
        categorys = All.concat(categorys);
        const firstOptions = categorys.map(item =>
            <Option key={item.name}>{item.name}</Option>
        );
        const SecondOptions = secondDate.map(item =>
            <Option key={item.name}>{item.name}</Option>
        );
        const ThirdOptions = thirdDate.map(item =>
            <Option key={item.name}>{item.name}</Option>
        );
        const FourthOptions = fourthDate.map(item =>
            <Option key={item.name}>{item.name}</Option>
        );
        return (
            <div className={wrapClass}>
                <Select
                    className="classify-selete-item classify-selete-item1"
                    defaultValue="全部"
                    placeholder="请选择"
                    value={firstSelect}
                    style={{ width }}
                    onChange={this.onFirstChange}
                >
                    {firstOptions}
                </Select>
                {
                    first.categoryId !== -1 &&
                    <Select
                        className="classify-selete-item classify-selete-item2"
                        value={secondSelect}
                        placeholder="请选择"
                        style={{ width }}
                        onChange={this.onSecondChange}
                    >
                        {SecondOptions}
                    </Select>
                }
                {
                    second.categoryId !== -1 &&
                    <Select
                        className="classify-selete-item classify-selete-item3"
                        value={thirdSelect}
                        placeholder="请选择"
                        style={{ width }}
                        onChange={this.onThirdChange}
                    >
                        {ThirdOptions}
                    </Select>
                }
                {
                    third.categoryId !== -1 &&
                    <Select
                        className="classify-selete-item classify-selete-item4"
                        value={fourthSelect}
                        placeholder="请选择"
                        style={{ width }}
                        onChange={this.onFourthChange}
                    >
                        {FourthOptions}
                    </Select>
                }
            </div>
        );
    }
}

ClassifiedSelect.propTypes = {
    onChange: PropTypes.func,
    fetchCategorys: PropTypes.func,
    width: PropTypes.number,
    categorys: PropTypes.arrayOf(PropTypes.any),
    defaultValue: PropTypes.arrayOf(PropTypes.any),
    wrapClass: PropTypes.string
}

ClassifiedSelect.defaultProps = {
    onChange: () => {},
    width: 80,
}

export default ClassifiedSelect;
