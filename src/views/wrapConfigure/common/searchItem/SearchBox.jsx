/**
 * @file App.jsx
 * @author liujinyu
 *
 * 首页样式管理条件查询区
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button, Select } from 'antd';
import { fetchQueryBranchCompanyInfo } from '../../../../actions/wap';
import { operationState } from '../../../../constant/wrapConfigure';

const FormItem = Form.Item;

@connect(
    state => ({
        companyData: state.toJS().wap.companyData
    }),
    dispatch => bindActionCreators({
        fetchQueryBranchCompanyInfo
    }, dispatch)
)

class SearchBox extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isDisabled: true,
            isHide: true
        }
    }

    componentDidMount() {
        this.props.fetchQueryBranchCompanyInfo();
    }

    componentWillReceiveProps(nextProps) {
        const { companyId, homePageType } = nextProps.form.getFieldsValue();
        // 判断是否已经选择子公司及运营类型
        this.isCompany(companyId, homePageType)
    }

    /**
     * 判断是否已经选择子公司及运营类型
     * @param {number} companyId form中子公司id
     * @param {string} homePageType form中运营类型的数据
     */
    isCompany = (companyId, homePageType) => {
        if (companyId === 'headquarters') {
            this.setState({
                isDisabled: false,
                isHide: true
            })
        } else if (companyId && companyId !== 'headquarters') {
            this.setState({
                isHide: false
            })
            // 判断是否选择运营类型
            this.isType(companyId, homePageType)
        } else {
            this.setState({
                isDisabled: true,
                isHide: true
            })
        }
    }

    /**
     * 判断是否已经选择运营类型
     * @param {number} companyId form中子公司id
     * @param {string} homePageType form中运营类型的数据
     */
    isType = (companyId, homePageType) => {
        if (homePageType && homePageType !== '0') {
            this.setState({
                isDisabled: false
            })
        } else {
            this.setState({
                isDisabled: true
            })
        }
    }

    /**
     * 点击查询后的回调
     */
    formSubmit = () => {
        const { companyId, homePageType } = this.props.form.getFieldsValue()
        // 根据选择的id获取id和name并通知父组件
        const branchCompany = this.props.companyData.data.find(item => (
            item.id === companyId
        ))
        const submitObj = {
            branchCompany,
            homePageType
        }
        const headquarters = this.props.companyData.headquarters
        this.props.searchChange(submitObj, headquarters)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { companyData } = this.props
        return (
            companyData
                ? <div className="search-box wap-search-box">
                    <Form
                        layout="inline"
                        className="ant-advanced-search-form"
                    >
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem label="子公司">
                                    {getFieldDecorator('companyId', {
                                        initialValue: ''
                                    })(
                                        <Select style={{ width: '200px' }} size="default">
                                            {
                                                companyData.data.map((item) => (
                                                    <Select.Option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </Select.Option>
                                                ))
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            {
                                !this.state.isHide
                                    ? <Col span={8}>
                                        {/* 运营方式 */}
                                        <FormItem label="运营方式">
                                            {getFieldDecorator('homePageType', {
                                                initialValue: operationState.defaultValue
                                            })(
                                                <Select style={{ width: '200px' }} size="default">
                                                    {
                                                        operationState.data.map((item) => (
                                                            <Select.Option
                                                                key={item.key}
                                                                value={item.key}
                                                            >
                                                                {item.value}
                                                            </Select.Option>
                                                        ))
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    : null
                            }
                            <Col span={8}>
                                <Button disabled={this.state.isDisabled} onClick={this.formSubmit} type="primary" className="search-btn">查看</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                : null
        )
    }
}

SearchBox.propTypes = {
    searchChange: PropTypes.func,
    fetchQueryBranchCompanyInfo: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    companyData: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(SearchBox));
