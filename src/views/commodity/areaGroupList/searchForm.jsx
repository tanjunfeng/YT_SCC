/**
 * 区域组管理查询条件
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Row, Col } from 'antd';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Util from '../../../util/util';
import { AreaGroup } from '../../../container/search';
import { getRegionByCode } from '../../../actions/pub';

const FormItem = Form.Item;

@connect(() => ({
}), dispatch => bindActionCreators({
    getRegionByCode
}, dispatch))

class SearchForm extends PureComponent {
    getFormData = () => {
        const {
            id,
            promotionName,
            promotionDateRange,
            statusCode,
            branchCompany
        } = this.props.form.getFieldsValue();
        let status = statusCode;
        if (statusCode === 'all') {
            status = '';
        }
        return Util.removeInvalid({
            id,
            promotionName,
            status,
            startDate: promotionDateRange.length > 1 ? promotionDateRange[0].valueOf() : '',
            endDate: promotionDateRange.length > 1 ? promotionDateRange[1].valueOf() : '',
            branchCompanyId: branchCompany.id
        });
    }

    handleSearch = () => {
        // 通知父页面执行搜索
        this.props.onPromotionSearch(this.getFormData());
    }

    handleReset = () => {
        this.props.form.resetFields(); // 清除当前查询条件
        this.props.onPromotionReset(); // 通知查询条件已清除
        // 点击重置时清除 seachMind 引用文本
        this.props.form.setFieldsValue({
            branchCompany: { reset: true }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" className="area-group">
                <Row>
                    <Col>
                        <FormItem label="区域组">
                            {getFieldDecorator('areaGroup', {
                                initialValue: { id: '', name: '' }
                            })(<AreaGroup />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="end">
                    <Col>
                        <Button type="primary" size="default" onClick={this.handleSearch}>
                            查询
                        </Button>
                        <Button size="default" onClick={this.handleReset}>
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm.propTypes = {
    onPromotionSearch: PropTypes.func,
    onPromotionReset: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(SearchForm));
