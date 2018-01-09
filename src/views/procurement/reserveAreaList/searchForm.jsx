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
import {
    queryDirectInfo,
    clearDirectInfo
} from '../../../actions/procurement';
import { processingState } from '../../../constant/procurement';
import { DATE_FORMAT, PAGE_SIZE } from '../../../constant/index';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(state => ({
}), dispatch => bindActionCreators({
}, dispatch))

class SearchForm extends PureComponent {

    render() {
        const { form, directInfo = {} } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className="wisharea-List">
                <Form layout="inline">
                    <div className="wisharea-List-form">
                        <Row gutter={40}>
                            <Col>
                                <FormItem label="子公司">
                                    {getFieldDecorator('company', {
                                        initialValue: { id: '', name: '' }
                                    })(<BranchCompany />)}
                                </FormItem>
                            </Col>
                            <Col>
                                <FormItem label="订单日期">
                                    <RangePicker
                                        format={DATE_FORMAT}
                                        placeholder={['开始时间', '结束时间']}
                                        onChange={this.onEnterTimeChange}
                                    />
                                </FormItem>
                            </Col>
                            <Col>
                                {/* 采购单类型 */}
                                <FormItem label="采购单类型">
                                    {getFieldDecorator('purchaseTypeCode', {
                                        initialValue: processingState.defaultValue
                                    })(
                                        <Select style={{ width: '153px' }} size="default">
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
