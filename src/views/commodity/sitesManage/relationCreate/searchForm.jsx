import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
    Form,
    Row,
    Col,
    Input,
    Button,
    message
} from 'antd';
import Commodity from '../../../../container/search/Commodity';
import { Category } from '../../../../container/cascader';
import Brands from '../../../../container/search/Brands';
import Utils from '../../../../util/util';
import { productLevel } from '../constant';

const FormItem = Form.Item;
class SearchForm extends PureComponent {
    state = {
        selectedOptions: [],
        isClearCategory: false
    }
    componentDidMount() {
        this.handleSearch();
    }

    /**
     * 获取查询数据
     */
    getQueryParams = () => {
        const { getFieldsValue } = this.props.form;
        const { selectedOptions } = this.state;
        const {
            brand,
            commodity,
            barCode
        } = getFieldsValue();
        this.queryParams = {
            internationalCode: barCode,
            brand: brand.record ? brand.record.id : '',
            productName: commodity.record ? commodity.record.productName : '',
        };

        if (selectedOptions.length > 0) {
            selectedOptions.forEach((item, i) => {
                this.queryParams[productLevel[i]] = item;
            });
        }
    }

    /**
     * 选择商品分类
    */
    handleCategorySelect = (catogory, selectedOptions) => {
        this.setState({
            selectedOptions: selectedOptions.map(item => item.value)
        });
    }
    /**
     * 查询
    */
    handleSearch = () => {
        const { selectedOptions } = this.state;
        this.getQueryParams();
        if (selectedOptions && selectedOptions.length > 0 && selectedOptions.length < 3) {
            message.error('请选择至少三级商品分类');
            return;
        }
        this.props.queryProducts(Utils.removeInvalid(this.queryParams));
    }

    /**
     * 重置
    */
    handleReset = () => {
        const { setFieldsValue } = this.props.form;
        this.setState({
            selectedOptions: [],
            isClearCategory: true
        });
        this.props.form.resetFields();
        setFieldsValue({
            brand: { reset: true }
        });
        setFieldsValue({
            commodity: { reset: true }
        });
    }

    /**
     * 创建商品地点关系
    */
    handleCreateSiteRelation = () => {
        this.props.openModal();
    }

    resetClearCategoryFlag = () => {
        this.setState({
            isClearCategory: false
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { isCreateRelation } = this.props;
        const { isClearCategory } = this.state;
        return (
            <div className="site-relation-create">
                <Form layout="inline" className="site-relation-create-form">
                    <Row gutter={40}>
                        <Col>
                            <FormItem label="商品分类">
                                <Category
                                    onChange={this.handleCategorySelect}
                                    isClearCategory={isClearCategory}
                                    resetFlag={this.resetClearCategoryFlag}
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
                    <Row gutter={40} type="flex" justify="end" className="sites-manage-search-container">
                        <Col>
                            <Button
                                type="primary"
                                onClick={this.handleSearch}
                                size="default"
                            >查询</Button>
                            <Button
                                size="default"
                                onClick={this.handleReset}
                            >重置</Button>
                            <Button
                                type="primary"
                                size="default"
                                disabled={!isCreateRelation}
                                onClick={this.handleCreateSiteRelation}
                            >创建商品地点关系</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

SearchForm.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    queryProducts: PropTypes.func,
    openModal: PropTypes.func,
    isCreateRelation: PropTypes.bool
};

export default withRouter(Form.create()(SearchForm));
