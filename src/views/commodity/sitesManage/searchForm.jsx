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
import {BranchCompany, Commodity } from '../../../container/search';
import { Category } from '../../../container/cascader';
import Brands from '../../../container/search/Brands';
import Sites from '../../../container/search/Sites';
import { logisticsList, placeTypeListQuery, placeFieldMap, productLevel } from './constant';
import Utils from '../../../util/util';
import { PAGE_SIZE } from '../../../constant';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends PureComponent {
    state = {
        selectedOptions: [],
        initialPlaceValue: {},
        category: 0,
        isClearCategory: false
    }

    componentDidMount() {
        this.queryNoCondition();
    }

    getQueryParams = () => {
        const { getFieldsValue } = this.props.form;
        const { selectedOptions } = this.state;
        const {
            barCode,
            brand,
            commodity,
            branchCompany,
            logisticsModel,
            place,
            placeType
        } = getFieldsValue();

        this.baseQueryParams = {
            internationalCode: barCode,
            brand: brand.record ? brand.record.name : '',
            productId: commodity.record ? commodity.record.productId : '',
            productName: commodity.record ? commodity.record.productName : '',
            logisticsModel,
            // 根据不同的值清单取place.record对应字段
            placeId: place.record ? place.record[placeFieldMap[placeType]] : '',
            placeType: parseInt(placeType, 10),
            branchCompanyId: branchCompany.id ? branchCompany.id : ''
        };
        if (selectedOptions.length > 0) {
            /**
             * 商品类别
             */
            selectedOptions.forEach((item, i) => {
                this.baseQueryParams[productLevel[i]] = item;
            });
        }
    }

    /**
     * 初始数据查询
     */
    queryNoCondition = () => {
        this.props.queryList({
            pageNum: 1,
            branchCompanyId: '',
            pageSize: PAGE_SIZE
        });
    }

    handleSearch = () => {
        this.getQueryParams();
        const { selectedOptions } = this.state;
        const { branchCompanyId } = this.baseQueryParams;
        if (selectedOptions.length > 0 && selectedOptions.length < 3) {
            message.error('请选择至少三级商品分类');
            return;
        }

        if (!branchCompanyId) {
            message.error('请选择一个子公司');
            return;
        }
        this.props.queryList(Utils.removeInvalid(this.baseQueryParams));
    }

    handleAdd = () => {
        const { pathname } = this.props.location;
        const win = window.open(`${pathname}/create`, '_blank');
        win.focus();
    }

    /**
     * 重置搜索条件
     */
    handleReset = () => {
        const { setFieldsValue } = this.props.form;
        this.setState({
            isClearCategory: true
        });
        this.props.form.resetFields();
        setFieldsValue({
            branchCompany: { reset: true }
        });
        setFieldsValue({
            brand: { reset: true }
        });
        setFieldsValue({
            commodity: { reset: true }
        });
        setFieldsValue({
            place: { reset: true }
        });
        this.queryNoCondition();
    }

    handleCategorySelect = (category, selectedOptions) => {
        this.setState({
            selectedOptions: selectedOptions.map(item => item.value)
        });
    }

    handPlaceTypeChange = val => {
        const { setFieldsValue, resetFields } = this.props.form;
        /**
         * 设置门店初始值
         */
        if (parseInt(val, 10) === 1 || parseInt(val, 10) === 3) {
            this.setState({
                initialPlaceValue: {
                    id: '',
                    name: ''
                }
            });
        }

        /**
         * 设置区域组初始值
         */
        if (parseInt(val, 10) === 2) {
            this.setState({
                initialPlaceValue: {
                    id: '',
                    areaGroupName: ''
                }
            });
        }

        setTimeout(() => {
            setFieldsValue({
                place: { reset: true }
            });
            resetFields(['place']);
        });
    }

    resetClearCategoryFlag = () => {
        this.setState({
            isClearCategory: false
        });
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { initialPlaceValue, isClearCategory} = this.state;
        return (
            <div className="sites-manage">
                <Form layout="inline" className="sites-manage-form">
                    <Row gutter={40}>
                        <Col>
                            <FormItem label="子公司" >
                                {getFieldDecorator('branchCompany', {
                                    initialValue: { id: '', name: '' },
                                    rules: [{
                                        required: true,
                                    }]
                                })(
                                    <BranchCompany zIndex={1001} />
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="商品分类">
                                <Category
                                    disabled={!getFieldValue('branchCompany').id}
                                    isClearCategory={isClearCategory}
                                    onChange={this.handleCategorySelect}
                                    resetFlag={this.resetClearCategoryFlag}
                                />
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="品牌">
                                {getFieldDecorator('brand', { initialValue: {
                                    id: '', name: '' }})(<Brands zIndex={1001} disabled={!getFieldValue('branchCompany').id} />)
                                }
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="商品" >
                                {getFieldDecorator('commodity', { initialValue: {
                                    productId: '', productName: '' }})(<Commodity zIndex={999} api="queryProductForSelect" disabled={!getFieldValue('branchCompany').id} />)
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
                                        disabled={!getFieldValue('branchCompany').id}
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
                                        disabled={!getFieldValue('branchCompany').id}
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
                                    initialValue: placeTypeListQuery.defaultValue
                                })(
                                    <Select
                                        disabled={!getFieldValue('branchCompany').id}
                                        size="large"
                                        onChange={this.handPlaceTypeChange}
                                    >
                                        {
                                            placeTypeListQuery.data.map(item => (
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
                                        branchCompanyId={getFieldValue('branchCompany').id}
                                        disabled={getFieldValue('placeType') === ''}
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
    location: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(SearchForm));
