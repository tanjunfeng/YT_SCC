import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
    Form,
    Row,
    Col,
    Input,
    Select,
    Button
    // Table,
    // message
} from 'antd';
import Commodity from '../../../container/search/Commodity';
import { Category } from '../../../container/cascader';
import Brands from '../../../container/search/Brands';
import { logisticsList, siteTypeList } from './constant';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends PureComponent {
    state = {
        classify: {},
        categoryObj: null,
        category: 0
    }
    componentDidMount() {
        this.props.queryList();
    }

    handleChangeSiteType = val => {

    }

    handleChangeLogisticsModel = val => {

    }

    handleSearch = () => {

    }

    handleAdd = () => {
        this.props.history.push('/sitesManage/add');
    }

    handleDelete = () => {
        const { selectedIds } = this.props;
        console.log(selectedIds);
    }

    handleCategorySelect = categoryObj => {
        // this.setState({ categoryObj });
        console.log(categoryObj)
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="sites-manage">
                <Form layout="inline" className="sites-manage-form">
                    <Row gutter={40}>
                        <Col>
                            <FormItem label="商品分类">
                                {getFieldDecorator('category', {
                                    initialValue: this.state.category,
                                    rules: [{ required: true, message: '请选择使用品类' }]
                                })(<Category onChange={this.handleCategorySelect} />)}
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
                                        onChange={this.handleChangeLogisticsModel}
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
                                {getFieldDecorator('siteType', {
                                    initialValue: siteTypeList.defaultValue
                                })(
                                    <Select
                                        size="large"
                                        onChange={this.handleChangeSiteType}
                                    >
                                        {
                                            siteTypeList.data.map(item => (
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
                                {getFieldDecorator('site', {
                                    initialValue: siteTypeList.defaultValue
                                })(
                                    <Select
                                        size="large"
                                        onChange={this.handleChangeSiteType}
                                    >
                                        {
                                            siteTypeList.data.map(item => (
                                                <Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Option>
                                            ))
                                        }
                                    </Select>
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
                                onClick={this.handleAdd}
                            >新增</Button>
                            <Button
                                onClick={this.handleDelete}
                                size="default"
                            >删除</Button>
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
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(SearchForm));
