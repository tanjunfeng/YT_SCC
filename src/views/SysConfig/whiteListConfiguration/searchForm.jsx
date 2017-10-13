/**
 * 促销管理查询条件
 *
 * @author taoqiyu,tanjf
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, Row, Col, Modal } from 'antd';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Utils from '../../../util/util';
import { promotionStatus } from './constants';
import { SubCompanies } from '../../../container/search';
import SearchMind from '../../../components/searchMind';
import { pubFetchValueList } from '../../../actions/pub';
import { queryWhitelist } from '../../../actions/whiteListConfiguration';
import { PAGE_SIZE } from '../../../constant';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        data: state.toJS().queryWhiteList.data,
    }),
    dispatch => bindActionCreators({
        pubFetchValueList,
        queryWhitelist
    }, dispatch)
)

class SearchForm extends PureComponent {
    constructor(props) {
        super(props);
        this.joiningSearchMind = null;
        this.state = {
            branchCompanyId: '',
            isReleaseCouponModalVisible: false,
            grantMethod: 0,
            warehouseVisible: false,
            companyVisible: false,
            supplyChoose: {},
            modalXXXvisible: this.props.modalXXXvisible
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleSubCompanyChoose = this.handleSubCompanyChoose.bind(this);
        this.hanldeSubCompanyClear = this.hanldeSubCompanyClear.bind(this);
        this.handleJoiningChoose = this.handleJoiningChoose.bind(this);
        this.handleJoiningClear = this.handleJoiningClear.bind(this);
        this.handleGoOnline = this.handleGoOnline.bind(this);
        this.handleOffline = this.handleOffline.bind(this);
    }

    getStatus() {
        const keys = Object.keys(promotionStatus);
        return keys.map((key) => (
            <Option key={key} value={key}>
                {promotionStatus[key]}
            </Option>
        ));
    }

    getFormData() {
        const {
            franchiseeId,
            franchinessName,
            storeId,
            storename,
            scPurchaseFlag
        } = this.props.form.getFieldsValue();
        const branchCompanyId = this.state.branchCompanyId;
        const { warehouseCode } = this.state;
        let status = scPurchaseFlag;
        const pageSize = PAGE_SIZE;
        if (scPurchaseFlag === 'all') {
            status = '';
        }
        return Utils.removeInvalid({
            franchiseeId,
            franchinessName,
            storeId,
            warehouseCode,
            storename,
            status,
            branchCompanyId,
            pageSize,
            pageNum: 1,
        });
    }

    /**
     * 仓库-值清单
     */
    handleJoiningChoose = ({ record }) => {
        this.setState({
            warehouseCode: record.warehouseCode,
        });
    }

    /**
     * 调整仓库-清除
     */
    handleJoiningClear() {
        this.setState({
            warehouseCode: '',
        });
    }

    handleSubCompanyChoose(branchCompanyId) {
        this.setState({ branchCompanyId });
    }

    hanldeSubCompanyClear() {
        this.setState({ branchCompanyId: '' });
    }

    handleSearch() {
        // 将查询条件回传给调用页
        this.props.queryWhitelist(this.getFormData());
    }

    handleReset() {
        this.hanldeSubCompanyClear(); // 清除子公司值清单
        this.handleJoiningClear(); // 清除仓库值清单
        this.props.form.resetFields();  // 清除当前查询条件
        this.props.onPromotionReset();  // 通知父页面已清空
    }

    handleQueryResults() {
        this.setState({ isReleaseCouponModalVisible: true, grantMethod: 0 });
    }

    handleQueryCoupons() {
        this.setState({ isReleaseCouponModalVisible: true, grantMethod: 1 });
    }

    handleSelectCancel() {
        this.setState({ isReleaseCouponModalVisible: false });
    }

    handleGoOnline() {
        this.setState({
            warehouseVisible: true,
        });
    }

    handleOk = () => {
        this.setState({
            warehouseVisible: false,
            modalXXXvisible: false
        });
        const params = getFormData();
        this.props.onChange(params);
    }
    handleCancel = () => {
        this.setState({
            warehouseVisible: false,
        })
    }

    handleOffline() {
        Modal.confirm({
            title: '确认',
            content: '确认下线选择的商家？',
            okText: '提交',
            cancelText: '取消',
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { prefixCls } = this.props;
        return (
            <div className="search-box promotion">
                <Form layout="inline">
                    <div className="search-conditions">
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem label="加盟商编号" style={{ paddingRight: 10 }}>
                                    {getFieldDecorator('franchiseeId')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="加盟商名称">
                                    {getFieldDecorator('franchinessName')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem>
                                    <div className="row">
                                        <span className="sc-form-item-label search-mind-label">所属子公司</span>
                                        <SubCompanies
                                            value={this.state.branchCompanyId}
                                            onSubCompaniesChooesd={this.handleSubCompanyChoose}
                                            onSubCompaniesClear={this.hanldeSubCompanyClear}
                                        />
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem label="门店编号" style={{ paddingRight: 10 }}>
                                    {getFieldDecorator('storeId')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="门店名称" style={{ paddingRight: 10 }}>
                                    {getFieldDecorator('storeName')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 状态 */}
                                <FormItem label="状态">
                                    {getFieldDecorator('scPurchaseFlag', {
                                        initialValue: 'all'
                                    })(
                                        <Select style={{ width: '153px' }} size="default">
                                            {this.getStatus()}
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40} type="flex" justify="end">
                            <Col>
                                <FormItem>
                                    <Button type="primary" size="default" onClick={this.handleSearch}>
                                        查询
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button size="default" onClick={this.handleReset}>
                                        重置
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" size="default" onClick={this.handleGoOnline}>
                                        上线
                                    </Button>
                                    <Modal
                                        title="选择仓"
                                        visible={this.state.warehouseVisible || this.props.value.modalXXXvisible}
                                        onOk={this.handleOk}
                                        onCancel={this.handleCancel}
                                    >
                                        <FormItem>
                                            <span className={`${prefixCls}-label`}>送货仓：</span>
                                            <span className={`${prefixCls}-data-pic`}>
                                                <SearchMind
                                                    rowKey="franchiseeId"
                                                    compKey="search-mind-joining"
                                                    ref={ref => { this.joiningSearchMind = ref }}
                                                    fetch={(params) =>
                                                        this.props.pubFetchValueList({
                                                            param: params.value,
                                                            pageNum: params.pagination.current || 1,
                                                            pageSize: params.pagination.pageSize
                                                        }, 'getWarehouseInfo1')
                                                    }
                                                    onChoosed={this.handleJoiningChoose}
                                                    onClear={this.handleJoiningClear}
                                                    renderChoosedInputRaw={(row) => (
                                                        <div>
                                                            {row.warehouseCode} - {row.warehouseName}
                                                        </div>
                                                    )}
                                                    pageSize={6}
                                                    columns={[
                                                        {
                                                            title: '仓库编码',
                                                            dataIndex: 'warehouseCode',
                                                            width: 150,
                                                        }, {
                                                            title: '仓库名称',
                                                            dataIndex: 'warehouseName',
                                                            width: 200,
                                                        }
                                                    ]}
                                                />
                                            </span>
                                        </FormItem>
                                    </Modal>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" size="default" onClick={this.handleOffline}>
                                        下线
                                    </Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div >
        );
    }
}

SearchForm.propTypes = {
    queryWhitelist: PropTypes.func,
    onPromotionReset: PropTypes.func,
    pubFetchValueList: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    value: PropTypes.objectOf(PropTypes.any),
    prefixCls: PropTypes.string,
    modalXXXvisible: PropTypes.bool
};

SearchForm.defaultProps = {
    prefixCls: 'whiteListConfiguration'
}

export default withRouter(Form.create()(SearchForm));
