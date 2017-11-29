/**
* @file SearchBar.jsx
* @author zhao zhi jian
*
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Input, Button, Modal, Form, Row, Col } from 'antd';
import {
    getListData
} from '../../../actions/storeRealTime';
import {
    exportQueryStoreRealTime
} from '../../../service';
import Util from '../../../util/util';
import { PAGE_SIZE } from '../../../constant';
import { pubFetchValueList } from '../../../actions/pub';
import SearchMind from '../../../components/searchMind';
import { BranchCompany } from '../../../container/search';

@connect(
    () => ({}),
    dispatch => bindActionCreators({
        /**
         * 请求 列表数据
         */
        getListData,
        /**
         * 调用公共接口
         */
        pubFetchValueList,
    }, dispatch)
)

class Search extends Component {
    constructor(props) {
        super(props);

        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleExport = this.handleExport.bind(this);
        this.handleWarehouseChoose = this.handleWarehouseChoose.bind(this);
        this.handleWarehouseEmpty = this.handleWarehouseEmpty.bind(this);
        this.handleOk = this.handleOk.bind(this)
        this.state = {
            logicWareHouseCode: ''
        };
    }

    // 查询
    handleSearch(e) {
        e.preventDefault();
        this.props.form.validateFields((err, value) => {
            if (!err) {
                // 搜索参数
                const searchData = Util.removeInvalid({
                    productCode: value.productCode,
                    branchCompanyId: value.branchCompany.id,
                    logicWareHouseCode: this.state.logicWareHouseCode
                });
                // 请求参数
                const params = {
                    pageNum: 1,
                    pageSize: PAGE_SIZE,
                    ...searchData
                }
                this.props.saveParams(searchData);
                this.props.getListData(params)
                    .then(() => {
                        this.props.setCurrentPage();
                    });
            }
        });
    }

    // 重置
    handleReset() {
        this.WarehouseSearch.reset();
        this.props.form.resetFields();
        this.props.saveParams();
        this.props.form.setFieldsValue({
            branchCompany: { reset: true }
        });
    }

    // 导出文件
    handleOk(params = {}) {
        Util.exportExcel(exportQueryStoreRealTime, params);
    }

    // 导出
    handleExport() {
        this.props.form.validateFields((err, value) => {
            if (!err) {
                // 搜索参数
                const searchData = Util.removeInvalid({
                    productCode: value.productCode,
                    ...this.state
                });
                this.props.saveParams(searchData);
                if (JSON.stringify(searchData) === '{}') {
                    Modal.confirm({
                        title: '导出全部数据，可能比较耗时！',
                        content: '是否继续？',
                        okText: '确认',
                        cancelText: '取消',
                        onOk: this.handleOk
                    });
                } else {
                    this.handleOk(searchData)
                }
            }
        });
    }

    // 选择所属仓库列表数据
    handleWarehouseChoose(data) {
        this.setState({
            logicWareHouseCode: data.record.warehouseCode
        })
    }

    // 清空所属仓库列表数据
    handleWarehouseEmpty() {
        this.setState({
            logicWareHouseCode: ''
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const FormItem = Form.Item;

        return (
            <div className="order-management">
                <div className="manage-form">
                    <Form layout="inline">
                        <div className="gutter-example">
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    {/* 单据编号 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">商品编号</span>
                                            {getFieldDecorator('productCode')(
                                                <Input
                                                    className="input"
                                                    placeholder="商品编号"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 子公司 */}
                                    <span className="sc-form-item-label">子公司</span>
                                    <FormItem>
                                        {getFieldDecorator('branchCompany', {
                                            initialValue: { id: '', name: '' }
                                        })(<BranchCompany />)}
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 所属仓库 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">所属仓库</span>
                                            <SearchMind
                                                compKey="search-mind-sub-company"
                                                ref={ref => { this.WarehouseSearch = ref }}
                                                fetch={(params) =>
                                                    this.props.pubFetchValueList({
                                                        param: params.value ? params.value : ''
                                                    }, 'getWarehouseInfo1')
                                                }
                                                onChoosed={this.handleWarehouseChoose}
                                                onClear={this.handleWarehouseEmpty}
                                                renderChoosedInputRaw={(row) => (
                                                    <div>{row.warehouseName}</div>
                                                )}
                                                pageSize={6}
                                                columns={[
                                                    {
                                                        title: '所属仓库Code',
                                                        dataIndex: 'warehouseCode',
                                                        width: 98
                                                    }, {
                                                        title: '所属仓库名字',
                                                        dataIndex: 'warehouseName',
                                                        width: 140
                                                    }
                                                ]}
                                            />
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16} type="flex" justify="end">
                                <Col className="tr" span={8}>
                                    <FormItem>
                                        <Button
                                            size="default"
                                            type="primary"
                                            onClick={this.handleSearch}
                                        >查询</Button>
                                    </FormItem>
                                    <FormItem>
                                        <Button
                                            size="default"
                                            onClick={this.handleReset}
                                        >重置</Button>
                                    </FormItem>
                                    <FormItem>
                                        <Button
                                            size="default"
                                            onClick={this.handleExport}
                                        >导出</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </div>
            </div>
        )
    }
}

Search.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    pubFetchValueList: PropTypes.objectOf(PropTypes.any),
    getListData: PropTypes.objectOf(PropTypes.any),
    saveParams: PropTypes.func,
    setCurrentPage: PropTypes.func
}

const SearchBar = Form.create()(Search);

export default withRouter(SearchBar)
