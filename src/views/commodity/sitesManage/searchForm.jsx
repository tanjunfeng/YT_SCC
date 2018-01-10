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
import ClassifiedSelect from '../../../components/threeStageClassification';
import SearchMind from '../../../components/searchMind';
import Commodity from '../../../container/search/Commodity';
import { logisticsList, siteTypeList } from './constant';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends PureComponent {
    state = {
        classify: {}
    }
    componentDidMount() {}

    /**
     * 三级下拉菜单
     * @param {Object} data 各级
     * @param {string} that 回显信息1
     */
    handleSelectChange = (selectData, that) => {
        this.slect = that;
        const { first, second, third, fourth } = selectData;
        const NOT_SELECT = -1;
        this.setState({
            classify: {
                firstLevelCategoryId: first.categoryId !== NOT_SELECT ? first.categoryId : '',
                secondLevelCategoryId: second.categoryId !== NOT_SELECT ? second.categoryId : '',
                thirdLevelCategoryId: third.categoryId !== NOT_SELECT ? third.categoryId : '',
                fourthLevelCategoryId: fourth.categoryId !== NOT_SELECT ? fourth.categoryId : '',
            }
        })
    }

    handleChangeSiteType = val => {

    }

    handleChangeLogisticsModel = val => {

    }

    handleSearch = () => {

    }

    handleAdd = () => {

    }

    handleDelete = () => {

    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { pubFetchValueList } = this.props;
        return (
            <div className="sites-manage">
                <Form layout="inline" className="sites-manage-form">
                    <Row gutter={40}>
                        <Col>
                            <FormItem label="商品分类">
                                <ClassifiedSelect onChange={this.handleSelectChange} />
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="品牌">
                                <SearchMind
                                    compKey="search-mind-brand"
                                    ref={ref => { this.brandSearchMind = ref }}
                                    fetch={(param) =>
                                        pubFetchValueList({
                                            name: param.value,
                                            pageSize: param.pagination.pageSize,
                                            pageNum: param.pagination.current || 1
                                        }, 'queryBrandsByPages')
                                    }
                                    onChoosed={this.handleBrandChoose}
                                    onClear={this.handleBrandClear}
                                    renderChoosedInputRaw={(brandData) => (
                                        <div>{brandData.id}-{brandData.name}</div>
                                    )}
                                    pageSize={5}
                                    columns={[
                                        {
                                            title: 'id',
                                            dataIndex: 'id',
                                            width: 98
                                        }, {
                                            title: '名称',
                                            dataIndex: 'name',
                                            width: 140
                                        }
                                    ]}
                                />
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
    pubFetchValueList: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(SearchForm));
