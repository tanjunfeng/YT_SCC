/**
 * 查询可选子公司值清单
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Radio } from 'antd';

import { AreaSelector } from '../../../container/tree';

const RadioGroup = Radio.Group;

@connect(() => ({}), dispatch => bindActionCreators({

}, dispatch))

class Area extends PureComponent {
    state = {
        areaSelectorVisible: false,
        categorySelectorVisible: false,
        storeSelectorVisible: false,
        companies: [],  // 所选区域子公司
        categoryObj: {}, // 所选品类对象
        checkedList: []
    }

    handleSelectorOk(companies) {
        this.setState({
            areaSelectorVisible: false,
            companies
        });
    }

    handleSelectorCancel = () => {
        this.setState({
            areaSelectorVisible: false
        });
    }

    /**
     * 所选区域选项
     * @param {*object} e
     */
    handleAreaChange = (e) => {
        const nextArea = e.target.value;
        if (nextArea === 0) {
            this.setState({
                areaSelectorVisible: false,
                companies: []
            });
        } else {
            this.setState({
                areaSelectorVisible: true
            });
        }
    }

    render() {
        const subCompanies = this.state.companies.map(company => company.companyName);
        return (
            <div>
                <RadioGroup onChange={this.handleAreaChange}>
                    <Radio className="default" value={0}>全部区域</Radio>
                    <Radio value={1}>指定区域</Radio>
                    {subCompanies.length > 0 ?
                        subCompanies.join(',')
                        : null}
                    <Radio value={2}>指定门店</Radio>
                </RadioGroup>
                <AreaSelector
                    isSelectorVisible={this.state.areaSelectorVisible}
                    onSelectorOk={this.handleSelectorOk}
                    onSelectorCancel={this.handleSelectorCancel}
                />
            </div>
        );
    }
}

Area.propTypes = {
    onChange: PropTypes.func
}

export default Area;
