/**
 * 进价审核 - 查询条件
 *
 * @author liujinyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Select, Row, Col } from 'antd';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Util from '../../../util/util';
import { purchaseStatus } from '../constants';
import { Commodity } from '../../../container/search';
import SearchMind from '../../../components/searchMind';
import { pubFetchValueList } from '../../../actions/pub';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        employeeCompanyId: state.toJS().user.data.user.employeeCompanyId
    }),
    dispatch => bindActionCreators({
        pubFetchValueList
    }, dispatch)
)

class SearchForm extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.getFormData = this.getFormData.bind(this);
        this.selectMap = this.selectMap.bind(this);
        this.state = {
            spId: '', // 供应商ID
            isSupplyAdrDisabled: true, // 供应商地点禁用
        }
    }

    /**
     * 获取表单数据
     */
    getFormData() {
        const {
            status,
            product,
        } = this.props.form.getFieldsValue();
        return Util.removeInvalid({
            status,
            spNo: this.supplierEncoded,
            spAdrNo: this.supplierAdressId,
            productNo: product.productCode
        });
    }

    /**
     * 点击搜索的回调
     */
    handleSearch() {
        // 通知父页面执行搜索
        this.props.handlePurchaseSearch(this.getFormData());
    }

    /**
     * 点击重置的回调
     */
    handleReset() {
        this.props.form.resetFields(); // 清除当前查询条件
        this.handleSupplyClear(); // 清除供应商
        this.props.handlePurchaseReset(); // 通知查询条件已清除
    }

    /**
     * 选择供应商回调
     * @param {object} record 表单值
     */
    handleSupplyChoose = ({ record }) => {
        this.setState({
            spId: record.spId,
            orgId: this.props.employeeCompanyId,
            isSupplyAdrDisabled: false
        });
        this.supplierEncoded = record.spNo;
        this.handleSupplierAddressClear();
    }

    /**
     * 清除供应商值
     */
    handleSupplyClear = () => {
        this.supplier.reset();
        this.supplierEncoded = '';
        this.setState({
            spId: '',
            isSupplyAdrDisabled: true
        });
        this.handleSupplierAddressClear();
    }

    /**
     * 选择供应商地点回调
     * @param {object} record 表单值
     */
    handleSupplierAdressChoose = ({ record }) => {
        this.supplierAdressId = record.providerNo;
    }

    /**
     * 清空供应商地点编号
     */
    handleSupplierAddressClear = () => {
        this.supplierLoc.reset();
        this.supplierAdressId = '';
    }

    /**
     * 遍历select框选项
     */
    selectMap() {
        return purchaseStatus.data.map(item => (
            <Option key={item.key} value={item.key}>
                {item.value}
            </Option>))
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" className="purchase">
                <Row gutter={40}>
                    <FormItem label="状态">
                        {getFieldDecorator('status', { initialValue: purchaseStatus.defaultValue })(
                            <Select size="default" onChange={this.statusChange}>
                                {this.selectMap()}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="供应商">
                        <SearchMind
                            compKey="comSupplier"
                            ref={ref => { this.supplier = ref }}
                            fetch={(param) => this.props.pubFetchValueList({
                                condition: param.value,
                                pageNum: param.pagination.current || 1,
                                pageSize: param.pagination.pageSize
                            }, 'supplierSearchBox')}
                            onChoosed={this.handleSupplyChoose}
                            onClear={this.handleSupplyClear}
                            renderChoosedInputRaw={(row) => (
                                <div>{row.spNo}-{row.companyName}</div>
                            )}
                            rowKey="spId"
                            pageSize={6}
                            columns={[
                                {
                                    title: '供应商编号',
                                    dataIndex: 'spNo',
                                    width: 80
                                }, {
                                    title: '供应商名称',
                                    dataIndex: 'companyName'
                                }
                            ]}
                        />
                    </FormItem>
                    <FormItem label="供应商地点">
                        <SearchMind
                            compKey="comSupplierLoc"
                            ref={ref => { this.supplierLoc = ref }}
                            fetch={(param) => this.props.pubFetchValueList({
                                orgId: this.props.employeeCompanyId,
                                pId: this.state.spId,
                                condition: param.value,
                                pageNum: param.pagination.current || 1,
                                pageSize: param.pagination.pageSize
                            }, 'supplierAdrSearchBox')}
                            onChoosed={this.handleSupplierAdressChoose}
                            onClear={this.handleSupplierAddressClear}
                            renderChoosedInputRaw={(row) => (
                                <div>{row.providerNo} - {row.providerName}</div>
                            )}
                            disabled={this.state.isSupplyAdrDisabled}
                            rowKey="providerNo"
                            pageSize={5}
                            columns={[
                                {
                                    title: '供应商地点编码',
                                    dataIndex: 'providerNo',
                                    width: 68
                                }, {
                                    title: '供应商地点名称',
                                    dataIndex: 'providerName'
                                }
                            ]}
                        />
                    </FormItem>
                    <FormItem label="商品">
                        {getFieldDecorator('product', {
                            initialValue: { productId: '', saleName: '' }
                        })(<Commodity />)
                        }
                    </FormItem>
                </Row>
                <Row gutter={40} type="flex" justify="end">
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
    handlePurchaseSearch: PropTypes.func,
    handlePurchaseReset: PropTypes.func,
    pubFetchValueList: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    employeeCompanyId: PropTypes.string
};

export default withRouter(Form.create()(SearchForm));
