/**
 * 直营店查询表单
 *
 * @returns 分公司编号
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Row, Modal, Col, DatePicker, Select, Button  } from 'antd';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DirectStores } from '../../../container/search';
import { BranchCompany } from '../../../container/search';
import Util from '../../../util/util';
import {
    queryDirectInfo,
    clearDirectInfo
} from '../../../actions/procurement';
import { processingState } from '../../../constant/procurement';
import { PAGE_SIZE } from '../../../constant/index';
import { DATE_FORMAT, MINUTE_FORMAT } from '../../../constant';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(state => ({
}), dispatch => bindActionCreators({
}, dispatch))

class SearchForm extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    /**
    * 获取所有有效的表单值
    *
    * @return {object}  返回所有填写了有效的表单值
    */
    getFormVulue = () => {
        const { supplierId, classify, brandName, sortType } = this.state;
        const {
            company,
            processingState,
            orderDate
        } = this.props.form.getFieldsValue();

        return Util.removeInvalid({
            branchCompanyId: company.id,
            processingState,
            orderDate
        });
    }

    handleComChange = (record) => {
        console.log(record)
    }

    /**
     * 点击搜索的回调
     */
    handleWishSearch = () => {
        console.log(this.getFormVulue())
        this.props.onAreaListSearch(this.getFormVulue())
    }

    /**
     * 点击重置的回调
     */
    handleReset() {
        this.props.form.resetFields(); // 清除当前查询条件
        this.props.onAreaListReset(); // 通知查询条件已清除
    }

    /**
     * 导出EXCEL
     */
    handleExport = () => {
        this.props.exportList();
    }

    render() {
        const { form, directInfo = {} } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className="wisharea-List">
                <Form layout="inline">
                    <div className="wisharea-List-form">
                        <Row>
                            <Col>
                                <FormItem label="子公司">
                                    {getFieldDecorator('company', {
                                        initialValue: { id: '', name: '' }
                                    })(<BranchCompany />)}
                                </FormItem>
                            </Col>
                            <Col>
                                <FormItem label="订单日期">
                                    {getFieldDecorator('orderDate', {
                                        initialValue: []
                                    })(<RangePicker
                                        size="default"
                                        showTime={{ format: MINUTE_FORMAT }}
                                        format={`${DATE_FORMAT} ${MINUTE_FORMAT}`}
                                        placeholder={['开始时间', '结束时间']}
                                    />)}
                                </FormItem>
                            </Col>
                            <Col>
                                {/* 采购单类型 */}
                                <FormItem label="处理状态">
                                    {getFieldDecorator('processingState', {
                                        initialValue: processingState.defaultValue
                                    })(
                                        <Select size="default">
                                            {
                                                processingState.data.map((item) => (
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
                        <Row type="flex" justify="end">
                            <Col>
                                <Button size="default" type="primary" onClick={this.handleWishSearch}>查询</Button>
                                <Button size="default" onClick={this.handleWishReset}>重置</Button>
                                <Button size="default" type="primary" onClick={this.handleExport}>导出EXCEL</Button>
                            </Col>
                        </Row>
                    </div>
                </Form>
                <Modal
                    title="重新选择门店"
                    /* visible={this.state.modalRechooseVisible} */
                    onOk={this.handleRechooseOk}
                    onCancel={this.handleRechooseCancel}
                />
            </div>
        );
    }
}

SearchForm.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    directInfo: PropTypes.objectOf(PropTypes.any),
    value: PropTypes.objectOf(PropTypes.any),
    shouldClear: PropTypes.bool,
    queryDirectInfo: PropTypes.func,
    clearDirectInfo: PropTypes.func,
    onChange: PropTypes.func
};

export default withRouter(Form.create()(SearchForm));
