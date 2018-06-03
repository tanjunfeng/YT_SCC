/**
 * @file App.jsx
 * @author zhoucl
 *
 * 管理列表页面
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Table, Input, Icon, Button } from 'antd';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { PAGE_SIZE } from '../../../constant';
import Utils from '../../../util/util';
import { exportProdPriceChangeList } from '../../../service';
import { pubFetchValueList } from '../../../actions/pub';
import {
    queryPriceChangeList,
} from '../../../actions/process';

import SearchFormInput from './searchFormInput';
import { priceChangeColumns } from '../columns';

const FormItem = Form.Item;
let uuid = 0;

@connect(
    state => ({
        priceChangeList: state.toJS().procurement.priceChangeList
    }),
    dispatch => bindActionCreators({
        queryPriceChangeList,
        pubFetchValueList
    }, dispatch))

class toDoPriceChangeList extends PureComponent {
    /**
     * 导出Excel
     */
    handleDownLoad = data => {
        Utils.exportExcel(exportProdPriceChangeList, data);
    }

    /**
     * 分页查询价格变更列表
     */
    handlePaginationChange = pageIndex => {
        this.queryParams.pageNum = pageIndex;
        this.handleQueryPriceChangeList(this.queryParams);
    }

    /**
     * 查询价格变更列表
     */
    handleQueryPriceChangeList = queryParams => {
        this.queryParams = queryParams;
        this.props.queryPriceChangeList(queryParams);
    }

    /**
     * lxt-demo
     */
    remove = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 0) {
            return;
        }
    
        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }
    
    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        uuid++;
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    render() {
        const { data, pageNum, total } = this.props.priceChangeList;
        const { pubFetchValueList } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            return (
                <FormItem
                    {...formItemLayout}
                    label="Passengers"
                    required={false}
                    key={k + 1}
                >
                    {getFieldDecorator(`names[${k + 1}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: "Please input passenger's name or delete this field.",
                        }],
                    })(
                        <Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />
                    )}
                    {keys.length > 0 ? (
                        <span>
                            <Icon
                                className="dynamic-delete-button"
                                type="plus-circle-o"
                                disabled={keys.length === 1}
                                onClick={() => this.add(k)}
                            />
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                disabled={keys.length === 1}
                                onClick={() => this.remove(k)}
                            />
                        </span>
                    ) : null}
                </FormItem>
            );
        });
        return (
            <div>
                <SearchFormInput
                    onExcel={this.handleDownLoad}
                    onQueryList={this.handleQueryPriceChangeList}
                    pubFetchValueList={pubFetchValueList}
                />
                <Table
                    columns={priceChangeColumns}
                    rowKey={record => record.id}
                    dataSource={data}
                    pagination={{
                        current: pageNum,
                        total,
                        pageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.handlePaginationChange
                    }}
                />
                <Form onSubmit={this.handleSubmit} className="add-line">
                    <div className="inline-line">
                        <FormItem
                            {...formItemLayout}
                            label="Passengers"
                            required={false}
                            style={{ display: 'inline-block' }}
                            key="start"
                        >
                            {getFieldDecorator('names[0]', {
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: "Please input passenger's name or delete this field.",
                                }],
                            })(
                                <Input placeholder="passenger name" style={{ width: '200px', marginRight: 8 }} />
                            )}
                        </FormItem>
                        <span>————————————</span>
                        <FormItem
                            {...formItemLayout}
                            required={false}
                            style={{ display: 'inline-block' }}
                            key="begin"
                        >
                            {getFieldDecorator('name[0]', {
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: "Please input passenger's name or delete this field.",
                                }],
                            })(
                                <Input placeholder="passenger name" style={{ width: '200px', marginRight: 8 }} />
                            )}
                            <Icon
                                className="dynamic-delete-button"
                                type="plus-circle-o"
                                onClick={this.add}
                            />
                        </FormItem>
                    </div>
                    {formItems}
                    <FormItem {...formItemLayoutWithOutLabel}>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </FormItem>
                </Form>
                );
            </div>
        );
    }
}

toDoPriceChangeList.propTypes = {
    queryPriceChangeList: PropTypes.func,
    pubFetchValueList: PropTypes.func,
    priceChangeList: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(toDoPriceChangeList));
