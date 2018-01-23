/**
 * 区域组管理查询条件
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Row, Col } from 'antd';
import { withRouter } from 'react-router';

import Util from '../../../util/util';
import Stores from './stores';
import { Address } from '../../../container/cascader';
import { ADDRESS_INDEX, REGION_TYPE } from './constant';

const FormItem = Form.Item;

class SearchForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // 省市区地址编码
            provinceId: '',
            cityId: '',
            districtId: '',
            resetAddress: false // 是否重置地址
        }
        this.getFormData = this.getFormData.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.getAddressCode = this.getAddressCode.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
    }

    getFormData() {
        const { provinceId, cityId, districtId } = this.state;
        const { store } = this.props.form.getFieldsValue();
        return Util.removeInvalid({
            storeId: store.id,
            provinceId,
            cityId,
            districtId
        });
    }

    /**
     * 判断省市区级别并返回 code
     *
     * @param {*object} item
     * @param {*number} level
     */
    getAddressCode(item, level) {
        if (item && item.value && +(item.level) === level) {
            return item.value;
        }
        return '';
    }

    handleSearch() {
        // 通知父页面执行搜索
        this.props.onSearch(this.getFormData());
    }

    handleReset() {
        // 点击重置时清除 seachMind 引用文本
        this.props.form.setFieldsValue({
            store: { reset: true }
        });
        this.setState({
            provinceId: '',
            cityId: '',
            districtId: '',
            resetAddress: true
        });
        this.props.onReset(); // 通知查询条件已清除
    }

    /**
     * 判断是否清空地址，若没清空分别给省市区赋值
     *
     * @param {*object} address 当前选中的最后一个对象
     * @param {*array} options 当前选中所有对象
     */
    handleAddressChange(address, options) {
        if (address === null) {
            this.setState({
                provinceId: '',
                cityId: '',
                districtId: '',
                resetAddress: false
            });
        } else {
            const provinceId = this.getAddressCode(
                options[ADDRESS_INDEX.PROVINCE], REGION_TYPE.PROVINCE
            );
            const cityId = this.getAddressCode(
                options[ADDRESS_INDEX.CITY], REGION_TYPE.CITY
            );
            const districtId = this.getAddressCode(
                options[ADDRESS_INDEX.DISTRICT], REGION_TYPE.DISTRICT
            );
            this.setState({
                provinceId, cityId, districtId
            });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { resetAddress } = this.state;
        return (
            <Form layout="inline" className="stores-search-form">
                <Row>
                    <Col>
                        <FormItem label="所属城市">
                            <Address
                                reset={resetAddress}
                                onChange={this.handleAddressChange}
                            />
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="门店">
                            {getFieldDecorator('store', {
                                initialValue: { id: '', name: '' }
                            })(<Stores
                                onChange={this.handleDirectStoresChange}
                            />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="end">
                    <Col>
                        <Button type="primary" size="default" onClick={this.handleSearch}>
                            查询
                        </Button>
                        <Button size="default" onClick={this.handleReset}>
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm.propTypes = {
    onSearch: PropTypes.func,
    onReset: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(SearchForm));
