/*
 * @Author: tanjf
 * @Description: 预定专区详情searchForm
 * @CreateDate: 2018-01-06 10:31:10
 * @Last Modified by: tanjf
 * @Last Modified time: 2018-01-15 09:25:52
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button } from 'antd';
import { withRouter } from 'react-router';
import { DirectStores } from '../../../container/search';
import Util from '../../../util/util';
import {
    queryDirectInfo,
    clearDirectInfo
} from '../../../actions/procurement';

const FormItem = Form.Item;

class SearchForm extends PureComponent {
    constructor(props) {
        super(props);

        this.storeId = null;
    }

    /**
    * 获取所有有效的表单值
    *
    * @return {object}  返回所有填写了有效的表单值
    */
    getFormVulue = () => {
        const { match } = this.props;
        const { params } = match;
        const { id } = params;
        const {
            stores
        } = this.props.form.getFieldsValue();
        if (stores.storeId === '') {
            return Util.removeInvalid({
                wishListId: id,
            });
        }
        if (stores.record.storeId) {
            return Util.removeInvalid({
                wishListId: id,
                storeId: stores.record.storeId
            });
        }
    }

    /**
     * 点击搜索的回调
     */
    handleWishSearch = () => {
        this.props.onAreaListSearch(this.getFormVulue())
    }

    /**
     * 点击重置的回调
     */
    handleWishReset = () => {
        this.props.form.resetFields(); // 清除当前查询条件
        this.props.onAreaListReset(); // 通知查询条件已清除
        this.props.form.setFieldsValue({
            stores: { reset: true }
        });
    }

    /**
     * 导出EXCEL
     */
    handleExport = () => {
        this.props.exportList(this.getFormVulue());
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className="wisharea-List">
                <Form layout="inline">
                    <div className="wisharea-List-form">
                        <Row>
                            <Col>
                                <FormItem label="选择门店">
                                    {getFieldDecorator('stores', {
                                        initialValue: { storeId: '', storeName: '' },
                                        rules: [{ required: true, message: '请选择门店' }]
                                    })(<DirectStores />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" justify="end">
                            <Col>
                                <Button size="default" type="primary" onClick={this.handleWishSearch}>查询</Button>
                                <Button size="default" onClick={this.handleWishReset}>重置</Button>
                                <Button size="default" type="primary" onClick={this.handleExport}>导出EXCEL</Button>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div>
        );
    }
}

SearchForm.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any),
    exportList: PropTypes.func,
    onAreaListReset: PropTypes.func,
    onAreaListSearch: PropTypes.func
};

export default withRouter(Form.create()(SearchForm));
