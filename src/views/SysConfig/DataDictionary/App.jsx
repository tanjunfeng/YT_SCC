/**
 * @file list.jsx
 * @author shijh
 *
 * 管理列表页面
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Form, Button, Input } from 'antd';
import { dictionarylist, DictionaryVisible } from '../../../actions/dictionary';
import ModifyDictionary from './modifyDictionary'
const FormItem = Form.Item;

const columns = [{
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    render: text => <a href="#">{text}</a>,
}, {
    title: '字典名称',
    dataIndex: 'dictionary',
    key: 'dictionary',
}, {
    title: '字典编码',
    dataIndex: 'code',
    key: 'code',
}, {
    title: '说明',
    dataIndex: 'remark',
    key: 'remark',
}, {
    title: '操作',
    key: 'action',
    render: () => (
        <span>
            <a>修改</a>
            <span className="ant-divider" />
            <a >删除</a>
            <span className="ant-divider" />
            <a >维护字典内容</a>
        </span>
    ),
}];

@connect(
    state => ({
        dictionaryData: state.toJS().dictionary.dictionaryData,
        dictionaryVisible: state.toJS().dictionary.dictionaryVisible
    }),
    dispatch => bindActionCreators({
        dictionarylist,
        DictionaryVisible
    }, dispatch)
)
class DataDictionary extends PureComponent {
    constructor(props) {
        super(props);
        this.searchForm = {};
        this.handleAddWatch =::this.handleAddWatch;
    }

    componentDidMount() {
        const params = {
            pageNum: 1,
            pageSize: 2,
        }
        this.props.dictionarylist(params);
        // this.props.contentlist({ dictionaryId: 1 });
        // this.props.updateOffShelf({ status: 0})
    }

    saveFormRef = (form) => {
        this.form = form;
    }

    handleAddWatch() {
        this.props.DictionaryVisible({ isVisible: true })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props.dictionaryData;
        return (
            <div>
                <div className="gys-layout">
                    <Form layout="inline">
                        <span className="classify-select-btn-warp">
                            <FormItem>
                                <Button onClick={this.handleAddWatch} type="primary" size="default">
                                    新增
                                </Button>
                            </FormItem>
                            <FormItem>
                                <div>
                                    {getFieldDecorator('productName', {
                                    })(
                                        <Input className="manage-form-companyName" placeholder="字典名称/字典编码" />
                                        )}
                                </div>
                            </FormItem>
                            <FormItem>
                                <Button size="default">
                                    查询
                                    </Button>
                            </FormItem>
                        </span>
                    </Form>
                </div>
                <div className="onsale-list">
                    <Table
                        dataSource={data}
                        columns={columns}
                        pagination={{

                        }}
                    />
                </div>
                <ModifyDictionary />
            </div>
        );
    }
}
export default withRouter(Form.create({})(DataDictionary));
