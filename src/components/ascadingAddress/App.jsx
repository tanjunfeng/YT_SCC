/**
 * @file App.jsx
 * @author shijh
 *
 * 三级联动选地区
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Select } from 'antd';
import { fetchRegionByCode } from '../../actions/pub';
import Utils from './util';

const Option = Select.Option;

const defaultItem = [{regionType: '-1', code: '-1', regionName: '全部'}]

@connect(
    state => ({
        gegion: state.toJS().pub.gegion
    }),
    dispatch => bindActionCreators({
        fetchRegionByCode
    }, dispatch)
)
class CasadingAddress extends PureComponent {
    constructor(props) {
        super(props);

        this.onfirstChange = ::this.onfirstChange;
        this.onsecondChange = ::this.onsecondChange;
        this.onthirdChange = ::this.onthirdChange;

        this.selectDate = {
            first: [],
            second: [],
            Third: []
        }
        this.resultData = {
            firstValue: '',
            secondValue: '',
            thirdValue: ''
        }
    }

    state = {
        firstDate: {
            key: 0,
            code: '100000'
        },
        secondDate: {},
        thirdDate: {},
        firstValue: '-1',
        secondValue: '-1',
        thirdValue: '-1',
        select: 0

    }

    componentDidMount() {
        const { defaultValue, gegion, showNum } = this.props;
        const data = {};
        this.props.fetchRegionByCode({}).then(() => {
            if (defaultValue[0]) {
                const code = defaultValue[0];
                data.firstValue = code;
                data.secondDate = {
                    key: 1,
                    code
                }
            }
            if (defaultValue[1]) {
                const code = defaultValue[1];
                data.secondValue = code;
                data.thirdDate = {
                    key: 2,
                    code
                }
            }
            if (defaultValue[2]) {
                data.thirdValue = defaultValue[2];
            }
            this.setState({...data});
        })
        for (let i = 0; i < showNum; i++) {
            const code = defaultValue[i];
            const index = i + 1;
            if (code && !(gegion[index] && gegion[index][code])) {
                this.props.fetchRegionByCode({type: index, code}).then(() => {
                    this.setState({
                        select: 3
                    });
                });
            } else if (code) {
                this.setState({
                    select: index
                });
            }
        }
    }

    onfirstChange(key) {
        const { firstValue, secondValue, thirdValue } = this.state;
        const { gegion } = this.props;
        const { first, second, Third } = this.selectDate;
        const curr = first.filter(item => item.code === key)
        const { code } = curr[0];
        let select = 1;
        if (!(gegion[1] && gegion[1][code])) {
            select = 0;
            this.props.fetchRegionByCode({type: 1, code}).then(() => {
                this.setState({
                    select: 1
                })
            })
        }
        this.setState({
            secondDate: {
                key: 1,
                code
            },
            firstValue: key,
            secondValue: '-1',
            thirdValue: '-1',
            select
        })
    }

    onsecondChange(key) {
        const { gegion } = this.props;
        const { firstValue, secondValue, thirdValue } = this.state;
        const { first, second, Third } = this.selectDate;
        const curr = second.filter((item) => item.code === key)
        const { code } = curr[0];
        let select = 2;
        if (!(gegion[2] && gegion[2][code])) {
            select = 1;
            this.props.fetchRegionByCode({type: 2, code}).then(() => {
                this.setState({
                    select: 2
                })
            })
        }
        this.setState({
            thirdDate: {
                key: 2,
                code
            },
            secondValue: key,
            thirdValue: '-1',
            select
        })
    }

    onthirdChange(key) {
        const { firstValue, secondValue, thirdValue } = this.state;
        const { first, second, Third } = this.selectDate;
        this.setState({
            thirdValue: key,
            select: 3
        })
    }

    getSelectData(item) {
        const { gegion, hasAll } = this.props;
        const data = gegion[item.key]
            && gegion[item.key][item.code]
            ? gegion[item.key][item.code] : [];
        return hasAll ? defaultItem.concat(data) : data;
    }

    render() {
        const {
            firstDate,
            secondDate,
            thirdDate,
            firstValue,
            secondValue,
            thirdValue,
            select
        } = this.state;

        const { showNum, id, hasAll, width, marginRight } = this.props;

        this.selectDate = {
            first: this.getSelectData(firstDate),
            second: this.getSelectData(secondDate),
            Third: this.getSelectData(thirdDate),
        }

        const { first, second, Third } = this.selectDate;

        this.resultData = {
            firstValue: !hasAll && firstValue === '-1' && first[0] ? first[0].code : firstValue,
            secondValue: !hasAll && secondValue === '-1' && second[0] ? second[0].code : secondValue,
            thirdValue: !hasAll && thirdValue === '-1' && Third[0] ? Third[0].code : thirdValue
        }

        this.props.onChange({
            firstValue: Utils.getItem(first, this.resultData.firstValue, firstValue, select, 1),
            secondValue: Utils.getItem(second, this.resultData.secondValue, secondValue, select, 2),
            thirdValue: Utils.getItem(Third, this.resultData.thirdValue, thirdValue, select, 3)
        })

        return (
            <div
                className="area-select-wrap"
                id={id}
            >
                <Select
                    className="classify-selete-item classify-selete-item1"
                    placeholder="请选择"
                    value={this.resultData.firstValue}
                    style={{width, marginRight}}
                    getPopupContainer={() => document.getElementById(`${id}`)}
                    onSelect={this.onfirstChange}
                >
                    {
                        first.map((item2, index) => {
                            return <Option key={`${item2.regionType}-${item2.code}`} value={String(item2.code)}>{item2.regionName}</Option>;
                        })
                    }
                </Select>
                {
                    select >= 1 && showNum > 1 &&
                    <Select
                        className="classify-selete-item classify-selete-item1"
                        placeholder="请选择"
                        style={{width, marginRight}}
                        value={this.resultData.secondValue}
                        getPopupContainer={() => document.getElementById(`${id}`)}
                        onSelect={this.onsecondChange}
                    >
                        {
                            second.map((item2, index) => {
                                return <Option key={`${item2.regionType}-${item2.code}`} value={String(item2.code)}>{item2.regionName}</Option>;
                            })
                        }
                    </Select>
                }
                {
                    select >= 2 && showNum > 2 &&
                    <Select
                        className="classify-selete-item classify-selete-item1"
                        placeholder="请选择"
                        style={{width, marginRight}}
                        value={this.resultData.thirdValue}
                        getPopupContainer={() => document.getElementById(`${id}`)}
                        onSelect={this.onthirdChange}
                    >
                        {
                            Third.map((item2, index) => {
                                return <Option key={`${item2.regionType}-${item2.code}`} value={String(item2.code)}>{item2.regionName}</Option>;
                            })
                        }
                    </Select>
                }
            </div>
        );
    }
}

CasadingAddress.propTypes = {
    fetchRegionByCode: PropTypes.func,
    showNum: PropTypes.string,
    hasAll: PropTypes.bool,
    gegion: PropTypes.arrayOf(PropTypes.any),
    onChange: PropTypes.func,
    defaultValue: PropTypes.arrayOf(PropTypes.any),
    id: PropTypes.string,
    width: PropTypes.string,
    marginRight: PropTypes.string
};

CasadingAddress.defaultProps = {
    showNum: '3',
    onChange: () => {},
    hasAll: false,
    defaultValue: [],
    width: '100px',
    marginRight: '10px'
}

export default CasadingAddress;
