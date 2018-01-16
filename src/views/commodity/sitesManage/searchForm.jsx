import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
    Form,
    Row,
    Col,
    Input,
    Select,
    Button,
    message
} from 'antd';
import Commodity from '../../../container/search/Commodity';
import { Category } from '../../../container/cascader';
import Brands from '../../../container/search/Brands';
import Sites from '../../../container/search/Sites';
import { logisticsList, placeTypeList, placeFieldMap, productLevel } from './constant';
import Utils from '../../../util/util';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends PureComponent {
    state = {
        classify: {},
        selectedOptions: [],
        initialPlaceValue: {},
        category: 0,
        isClearCategory: false
    }
    componentDidMount() {
        this.props.queryList();
    }

    handleSearch = () => {
        const { getFieldsValue } = this.props.form;
        const { selectedOptions } = this.state;
        const {
            barCode,
            brand,
            commodity,
            logisticsModel,
            place,
            placeType
        } = getFieldsValue();
        const baseParams = {
            internationalCode: barCode,
            brand: brand.record ? brand.record.id : '',
            productId: commodity.record ? commodity.record.productId : '',
            logisticsModel,
            // 根据不同的值清单取place.record对应字段
            placeId: place.record ? place.record[placeFieldMap[placeType]] : '',
            placeType
        };
        if (selectedOptions.length > 0) {
            selectedOptions.forEach((item, i) => {
                baseParams[productLevel[i]] = item;
            });
        }

        if (selectedOptions.length > 0 && selectedOptions.length < 3) {
            message.error('请选择至少三级商品分类');
            return;
        }

        this.props.queryList({
            queryJson: Utils.removeInvalid(baseParams)
        });
    }

    handleAdd = () => {
        this.props.history.push('/sitesManage/create');
    }

    handleReset = () => {
        // this.props.form.setFieldsValue({
        //     place: { reset: true }
        // });
        this.setState({
            isClearCategory: true
        });
        this.props.form.resetFields();
    }

    handleCategorySelect = (category, selectedOptions) => {
        this.setState({
            selectedOptions: selectedOptions.map(item => item.value)
        });
    }

    handPlaceTypeChange = val => {
        if (parseInt(val, 10) === 1 || parseInt(val, 10) === 3) {
            this.setState({
                initialPlaceValue: {
                    id: '',
                    name: ''
                }
            });
        }

        if (parseInt(val, 10) === 2) {
            this.setState({
                initialPlaceValue: {
                    areaGroupCode: '',
                    areaGroupName: ''
                }
            });
        }
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { initialPlaceValue, isClearCategory} = this.state;
        return (
            <div className="sites-manage">
                <Form layout="inline" className="sites-manage-form">
                    <Row gutter={40}>
                        <Col>
                            <FormItem label="商品分类">
                                <Category
                                    isClearCategory={isClearCategory}
                                    onChange={this.handleCategorySelect}
                                />
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="品牌">
                                {getFieldDecorator('brand', { initialValue: {
                                    id: '', name: '' }})(<Brands />)
                                }
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="商品" >
                                {getFieldDecorator('commodity', { initialValue: {
                                    productId: '', productName: '' }})(<Commodity api="queryProductForSelect" />)
                                }
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="商品条码" >
                                {getFieldDecorator('barCode')(
                                    <Input
                                        className="input"
                                        style={{ paddingLeft: '10px', paddingRight: '10px' }}
                                        placeholder="商品条码"
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem label="物流模式" >
                                {getFieldDecorator('logisticsModel', {
                                    initialValue: logisticsList.defaultValue
                                })(
                                    <Select
                                        size="large"
                                    >
                                        {
                                            logisticsList.data.map(item => (
                                                <Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="地点类型" >
                                {getFieldDecorator('placeType', {
                                    initialValue: placeTypeList.defaultValue
                                })(
                                    <Select
                                        size="large"
                                        onChange={this.handPlaceTypeChange}
                                    >
                                        {
                                            placeTypeList.data.map(item => (
                                                <Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="地点" >
                                {getFieldDecorator('place', {
                                    initialValue: initialPlaceValue
                                })(
                                    <Sites
                                        disabled={getFieldValue('placeType') === '0'}
                                        siteTypeCode={getFieldValue('placeType')}
                                        placeFieldMap={placeFieldMap}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={40} type="flex" justify="end" className="sites-manage-search-container">
                        <Col>
                            <Button
                                type="primary"
                                onClick={this.handleSearch}
                                size="default"
                            >查询</Button>
                            <Button
                                onClick={this.handleReset}
                                size="default"
                            >重置</Button>
                            <Button
                                type="primary"
                                size="default"
                                onClick={this.handleAdd}
                            >新增</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

SearchForm.propTypes = {
    queryList: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(SearchForm));
