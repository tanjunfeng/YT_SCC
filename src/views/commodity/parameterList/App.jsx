/**
 * @file App.jsx
 *
 * @author shixinyuan
 *
 * 商品参数列表
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Input, Button, Table } from 'antd';

import { fetchParameterList, modifyAreaVisible } from '../../../actions';

const FormItem = Form.Item;
const columns = [{
    title: '一级分类',
    dataIndex: 'oneCategory',
    key: 'oneCategory',
    width: '15%'
}, {
    title: '二级分类',
    dataIndex: 'twoCategory',
    key: 'twoCategory',
    width: '15%'
}, {
    title: '三级分类',
    dataIndex: 'threeCategory',
    key: 'threeCategory',
    width: '10%'
}, {
    title: '参数名称',
    dataIndex: 'parameterName',
    key: 'parameterName',
    width: '10%'
}, {
    title: '参数类型',
    dataIndex: 'parameterType',
    key: 'parameterType',
    width: '10%'
}, {
    title: '输入类型',
    dataIndex: 'inputType',
    key: 'inputType',
    width: '10%'
}, {
    title: '是否必填',
    dataIndex: 'ifRequired',
    key: 'ifRequired',
    width: '5%'
}, {
    title: '是否显示',
    dataIndex: 'ifDisplay',
    key: 'ifDisplay',
    width: '5%'
}, {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: '5%'
}, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: '10%'
}]
@connect(
    state => ({
        commodity: state.toJS().commodity.data,
    }),
    dispatch => bindActionCreators({
        fetchParameterList
    }, dispatch)
)
class ParameterList extends PureComponent {
    constructor(props) {
        super(props);
        console.log(props.form);
        this.handleHi = ::this.handleHi;
    }

    componentWillMount() { }

    componentDidMount() {
        this.props.fetchParameterList();
    }

    handleHi() {
        // Do
    }

    render() {
        const { data } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { list, current, number, total } = this.props.commodity;

        return (
            <div className="area">
                <div className="area-form">
                    <Form layout="inline">
                        {/* 公司名称 */}
                        <FormItem>
                            {getFieldDecorator('companyName', {
                            })(
                                <div>
                                    <span className="manage-form-label">公司名称</span>
                                    <Input className="manage-form-companyName" placeholder="公司名称" />
                                </div>
                                )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('supplierNumber', {
                            })(
                                <div>
                                    <span className="manage-form-label">供应商编号</span>
                                    <Input className="manage-form-companyName" placeholder="供应商编号" />
                                </div>
                                )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" size="default">
                                查询
                            </Button>
                        </FormItem>
                        <FormItem>
                            <Button size="default">
                                重置
                            </Button>
                        </FormItem>
                        <FormItem>
                            <Button size="default">
                                编辑排序
                            </Button>
                        </FormItem>
                    </Form>
                </div>
                <div className="area-list">
                    <Table
                        dataSource={list}
                        columns={columns}
                    />
                </div>
            </div>
        )
    }
}

ParameterList.propTypes = {
    user: PropTypes.objectOf(PropTypes.string),
}

ParameterList.defaultProps = {
    user: {
        name: 'Who?'
    }
}

export default Form.create()(ParameterList);
