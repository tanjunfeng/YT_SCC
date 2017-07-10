import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
const Option = Select.Option;

const provinceData = ['Zhejiang', 'Jiangsu'];
const cityData = {
    Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
    Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
};

class PriceAreaDetail extends PureComponent {
    state = {
        cities: cityData[provinceData[0]],
        secondCity: cityData[provinceData[0]][0],
    }

    handleProvinceChange = (value) => {
        this.setState({
            cities: cityData[value],
            secondCity: cityData[value][0],
        });
    }

    onSecondCityChange = (value) => {
        this.setState({
            secondCity: value,
        });
    }

    render() {
        const provinceOptions = provinceData.map(province => <Option key={province}>{province}</Option>);
        const cityOptions = this.state.cities.map(city => <Option key={city}>{city}</Option>);
        return (
            <div>
                <Select defaultValue={provinceData[0]} style={{ width: 90 }} onChange={this.handleProvinceChange}>
                    {provinceOptions}
                </Select>
                <Select value={this.state.secondCity} style={{ width: 90 }} onChange={this.onSecondCityChange}>
                    {cityOptions}
                </Select>
            </div>
        );
    }
}
export default PriceAreaDetail;

