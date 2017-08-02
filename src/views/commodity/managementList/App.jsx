/**
 * @file App.jsx
 * @author caoyanxuan
 *
 * 商品管理列表
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Row, Col, Select, Icon, Table, Menu, Dropdown, message, Modal} from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import SearchMind from '../../../components/searchMind';
import {
    commodityStatusOptions,
    deliveryStatusOptions,
    subCompanyStatusOptions,
    commoditySortOptions
} from '../../../constant/searchParams';
// import { fetchBrandsByPages } from '../../../actions/classifiedList';
import { pubFetchValueList } from '../../../actions/pub';

import {
    queryCommodityList
} from '../../../actions';
import { PAGE_SIZE } from '../../../constant';

import Util from '../../../util/util';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const commodityML = 'commodity-management'

const columns = [{
    title: '商品信息',
    dataIndex: 'name',
    key: 'name',
    width: 400,
    render: (text, record) => {
        const {
            productCode,
            saleName,
            thumbnailImage,
        } = record;
        return (
            <div className="table-commodity">
                <div className="table-commodity-number">
                    <span>商品编号：</span>
                    <span>{productCode}</span>
                </div>
                <div className="table-commodity-description">
                    <img alt="未上传" className="table-commodity-description-img" src={thumbnailImage} />
                    <span className="table-commodity-description-name">{saleName}</span>
                </div>
            </div>
        )
    }
}, {
    title: '部门',
    dataIndex: 'firstLevelCategoryName',
    key: 'firstLevelCategoryName',
}, {
    title: '大类',
    dataIndex: 'secondLevelCategoryName',
    key: 'secondLevelCategoryName',
}, {
    title: '中类',
    dataIndex: 'thirdLevelCategoryName',
    key: 'thirdLevelCategoryName',
}, {
    title: '小类',
    dataIndex: 'fourthLevelCategoryName',
    key: 'fourthLevelCategoryName',
}, {
    title: '品牌',
    dataIndex: 'brand',
    key: 'brand',
}, {
    title: '状态',
    dataIndex: 'supplyChainStatus',
    key: 'supplyChainStatus',
    render: (text) => {
        switch (text) {
            case '1':
                return '草稿';
            case '2':
                return '生效';
            case '3':
                return '暂停使用';
            case '4':
                return '停止使用';
            default:
                return text;
        }
    }
}, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
}];


@connect(
    state => ({
        goods: state.toJS().commodity.goods,
        CommodityListData: state.toJS().queryCommodityList.data
    }),
    dispatch => bindActionCreators({
        queryCommodityList,
        pubFetchValueList
    }, dispatch)
)
class ManagementList extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSelectChange = ::this.handleSelectChange;
        this.renderOperation = ::this.renderOperation;
        this.onCopy = ::this.onCopy;
        this.handleSuspendPurchase = ::this.handleSuspendPurchase;
        this.handleRestorePurchases = ::this.handleRestorePurchases;
        this.handleAreaDownSold = ::this.handleAreaDownSold;
        this.handleAreaUpSold = ::this.handleAreaUpSold;
        this.handleNationalDownSold = ::this.handleNationalDownSold;
        this.handleNationalUpSold = ::this.handleNationalUpSold;
        this.handleFormReset = ::this.handleFormReset;
        this.handleFormSearch = ::this.handleFormSearch;
        this.handleBrandChoose = ::this.handleBrandChoose;
        this.handleSupplyChoose = ::this.handleSupplyChoose;
        this.handleSubsidiaryChoose = ::this.handleSubsidiaryChoose;
        this.handleBrandClear = ::this.handleBrandClear;
        this.handleSupplyClear = ::this.handleSupplyClear;
        this.handleSubsidiaryClear = ::this.handleSubsidiaryClear;
        this.searchMind1 = null;
        this.STOP_BUY_DISABLED = true;
        this.state = {
            choose: [],
            brandChoose: null,
            supplyChoose: '',
            subsidiaryChoose: '',
        };

        this.sortType = '';
    }

    componentDidMount() {
        this.props.queryCommodityList({
            pageSize: PAGE_SIZE
        });
    }

    /**
     * 复制链接
     */
    onCopy() {
        message.success('复制成功')
    }

    /**
     * 三级下拉菜单
     * @param {Object} data 各级
     * @param {string} that 回显信息
     */
    handleSelectChange(data, that) {
        const { first, second, third } = data;
        if (third.id !== -1) {
            this.setState({
                isDisabled: false
            })
        } else if (
            this.classify.thirdCategoryId !== third.id
            && third.id === -1
        ) {
            this.props.form.resetFields(['id']);
            this.setState({
                isDisabled: true
            })
        }
        this.classify = {
            firstCategoryId: first.id,
            secondCategoryId: second.id,
            thirdCategoryId: third.id,
            firstCategoryName: first.categoryName,
            secondCategoryName: second.categoryName,
            thirdCategoryName: third.categoryName
        }
        this.classifyRef = that;
    }

    /**
     * table复选框
     */
    rowSelection = {
        onChange: (selectedRowKeys) => {
            this.setState({
                choose: selectedRowKeys,
            });
        }
    }
    /**
     * 品牌-值清单
     */
    handleBrandChoose = ({ record }) => {
        this.setState({
            brandChoose: record,
        });
    }

    /**
     * 供货供应商-值清单
     */
    handleSupplyChoose = ({ record }) => {
        this.setState({
            supplyChoose: record
        })
        console.log(record);
        this.STOP_BUY_DISABLED = false;
    }

    // 供货供应商值清单-清除
    handleSupplyClear() {
        this.setState({
            supplyChoose: '',
        });
        this.STOP_BUY_DISABLED = true;
    }

    /**
     * 经营子公司-值清单
     */
    handleSubsidiaryChoose = ({ record }) => {
        this.setState({
            subsidiaryChoose: record,
        });
    }

    /**
     * 暂停购进
     */
    handleSuspendPurchase() {
        console.log(this.childCompany.value);
        const confirmTitle = '';
        confirm({
            title: '暂停购进',
            content: '请确认对选中商品进行暂停购进操作，商品将不可进行采购下单',
            onOk: () => {
            },
            onCancel() {},
        });
    }

    /**
     * 恢复采购
     */
    handleRestorePurchases() {
        confirm({
            title: '恢复采购',
            content: '请确认对选中商品进行恢复采购操作',
            onOk: () => {
            },
            onCancel() {},
        });
    }

    /**
     * 区域下架
     */
    handleAreaDownSold() {
        confirm({
            title: '区域下架',
            content: '请确认对选中商品进行区域下架操作，商品将在该区域停止销售',
            onOk: () => {
            },
            onCancel() {},
        });
    }

    /**
     * 区域上架
     */
    handleAreaUpSold() {
        confirm({
            title: '区域上架',
            content: '请确认对选中商品进行区域上架操作，商品将在该区域恢复销售',
            onOk: () => {
            },
            onCancel() {},
        });
    }

    /**
     * 全国性下架
     */
    handleNationalDownSold() {
        const { choose } = this.state;
        confirm({
            title: '全国性下架',
            content: '请确认对选中商品进行全国性下架操作',
            onOk: () => {
                message.success(choose);
            },
            onCancel() {},
        });
    }

    /**
     * 全国性上架
     */
    handleNationalUpSold() {
        const { choose } = this.state;
        confirm({
            title: '全国性上架',
            content: '请确认对选中商品进行全国性上架操作',
            onOk: () => {
                message.success(choose);
            },
            onCancel() {},
        });
    }

    /**
     * 品牌值清单-清除
     */
    handleBrandClear() {
        this.setState({
            brandChoose: null,
        });
    }

    /**
     * 经营子公司值清单-清除
     */
    handleSubsidiaryClear() {
        this.setState({
            subsidiaryChoose: '',
        });
    }

    /**
     * 重置
     */
    handleFormReset() {
        this.brandSearchMind.handleClear();
        this.supplySearchMind.handleClear();
        this.subsidiarySearchMind.handleClear();
        this.props.form.resetFields();
    }

    // 获取排序类型
    hanldeGetSortType = (value) => {
        /**
         * dim_flatCategory  分类排序
         * brand             品牌排序
         * productCode       商品编号排序
         * productCode       商品编号排序
         * 0 / 1             升序 / 降序
         */
        const sortType = ['dim_flatCategory|0', 'brand|0', 'productCode|0', 'productCode|1'];
        this.sortType = sortType[value];
    };

    /**
     * 获取所有查询表单值
     *
     * @return {object}  返回所有填写了有效的表单值
     */
    getFormAllVulue = () => {
        const {
            supplyChainStatus,
            internationalCode,
            productName,
            productCode,
            supplierInfo,
            salesInfo

        } = this.props.form.getFieldsValue();
        return Util.removeInvalid({
            supplyChainStatus,
            internationalCode,
            productName,
            productCode,
            brand: this.state.brandChoose,
            supplierInfo: this.hasSpecifyValue(this.state.supplyChoose, supplierInfo),
            salesInfo: this.hasSpecifyValue(this.state.subsidiaryChoose, salesInfo),
            sort: this.sortType
        });
    }

    /**
     * @param {string} param1  供应商id或子公司id
     * @param {string} param2  供应商状态或子公司状态
     *
     * 用于拼接供应商id-供货状态，子公司id-子公司状态
     */
    hasSpecifyValue = (param1, parma2) => {
        // 代表初始值（全部）
        const IS_INIT_SELECT = -1;
        const SELECT_VALUE = parma2 === IS_INIT_SELECT ? '' : parma2;
        const str = (!param1 && SELECT_VALUE) ? '' : `${param1}-${SELECT_VALUE}`;

        return str;
    };

    /**
     * 查询
     */
    handleFormSearch = () => {
        const postData = this.getFormAllVulue();
        this.props.queryCommodityList({...postData});
    }

    /**
     * 分页页码改变的回调
     */
    handleChangePage = (page) => {
        const currentPage = page;
        this.props.queryCommodityList({
            pageNum: currentPage,
            pageSize: PAGE_SIZE
        });
    }
    changeButtonStatus = () => {
        // this.SUPPLIER_HAS_value
    }

    /**
     * 表单操作
     * @param {Object} text 当前行的值
     * @param {object} record 单行数据
     */
    renderOperation(text, record) {
        const { id, productId } = record;
        const { pathname } = this.props.location;
        const origin = window.location.origin;
        // console.log(record)
        const menu = (
            <Menu>
                <Menu.Item key={0}>
                    <Link to={`${pathname}/commodifyDetail/${id}`}>商品详情</Link>
                </Menu.Item>
                <Menu.Item key={1}>
                    <CopyToClipboard text={`${origin}${pathname}/commodifyDetail/${id}`} onCopy={this.onCopy}>
                        <span>复制链接</span>
                    </CopyToClipboard>
                </Menu.Item>
                <Menu.Item key={2}>
                    <Link to={`${pathname}/salesMaintenance/${productId}`}>销售维护</Link>
                </Menu.Item>
                <Menu.Item key={3}>
                    <Link to={`${pathname}/procurementMaintenance/${productId}`}>采购维护</Link>
                </Menu.Item>
            </Menu>
        );
        return (
            <Dropdown overlay={menu} placement="bottomCenter">
                <a className="ant-dropdown-link">
                    表单操作 <Icon type="down" />
                </a>
            </Dropdown>
        )
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        columns[columns.length - 1].render = this.renderOperation;
        const isPurchaseDisabled = !(
            this.state.supplyChoose
            && this.state.choose.length !== 0
        );
        const isSoldDisabled = !(
            this.state.subsidiaryChoose
            && this.state.choose.length !== 0
        );
        console.log(this.STOP_BUY_DISABLED);
        const { data = [], total = 0, pageNum = 1 } = this.props.CommodityListData;
        return (
            <div className={`${commodityML}`}>
                <div className="manage-form">
                    <Form layout="inline">
                        <div className="gutter-example">
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    {/* 商品名称 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">商品名称</span>
                                            {getFieldDecorator('productName')(
                                                <Input
                                                    className="input"
                                                    placeholder="商品名称"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 商品编号 */}
                                    <FormItem className="">
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
                                    {/* 商品分类 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">商品分类</span>
                                            <div className="level-four-classification">
                                                <Input />
                                            </div>
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    {/* 商品条码 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">商品条码</span>
                                            {getFieldDecorator('internationalCode')(
                                                <Input
                                                    className="input"
                                                    placeholder="商品条码"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 商品状态 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">商品状态</span>
                                            {getFieldDecorator('supplyChainStatus', {
                                                initialValue: commodityStatusOptions.defaultValue
                                            })(
                                                <Select
                                                    className=""
                                                    size="default"
                                                >
                                                    {
                                                        commodityStatusOptions.data.map((item) =>
                                                            (<Option
                                                                key={item.key}
                                                                value={item.key}
                                                            >
                                                                {item.value}
                                                            </Option>)
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 品牌 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">品牌</span>
                                            <SearchMind
                                                compKey="search-mind-brand"
                                                ref={ref => { this.brandSearchMind = ref }}
                                                fetch={(param) =>
                                                    this.props.pubFetchValueList({
                                                        name: param.value
                                                    }, 'queryBrandsByPages')
                                                }
                                                onChoosed={this.handleBrandChoose}
                                                onClear={this.handleBrandClear}
                                                renderChoosedInputRaw={(brandData) => (
                                                    <div>{brandData.id}-{brandData.name}</div>
                                                )}
                                                pageSize={5}
                                                columns={[
                                                    {
                                                        title: 'id',
                                                        dataIndex: 'id',
                                                        width: 150,
                                                    }, {
                                                        title: '名称',
                                                        dataIndex: 'name',
                                                        width: 200,
                                                    }, {
                                                        title: '标签',
                                                        dataIndex: 'brandLabel',
                                                        width: 200,
                                                    }
                                                ]}
                                            />
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    {/* 供货供应商 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">供货供应商</span>
                                            <span className="value-list-input">
                                                <SearchMind
                                                    compKey="search-mind-supply"
                                                    ref={ref => { this.supplySearchMind = ref }}
                                                    fetch={(params) =>
                                                        this.props.pubFetchValueList({
                                                            condition: params.value
                                                        }, 'querySuppliersList')
                                                    }
                                                    addonBefore=""
                                                    onChoosed={this.handleSupplyChoose}
                                                    onClear={this.handleSupplyClear}
                                                    renderChoosedInputRaw={(companyList) => (
                                                        <div ref={childCompany => { this.childCompany = childCompany }}>{companyList.spId}-{companyList.companyName}</div>
                                                    )}
                                                    rowKey="spAdrid"
                                                    pageSize={5}
                                                    columns={[
                                                        {
                                                            title: '供应商ID',
                                                            dataIndex: 'spId',
                                                            width: 150,
                                                        }, {
                                                            title: '供应商名称',
                                                            dataIndex: 'companyName',
                                                            width: 200,
                                                        }
                                                    ]}
                                                />
                                            </span>
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 供货状态 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">供货状态</span>
                                            {getFieldDecorator('supplierInfo', {
                                                initialValue: deliveryStatusOptions.defaultValue
                                            })(
                                                <Select
                                                    className=""
                                                    size="default"
                                                >
                                                    {
                                                        deliveryStatusOptions.data.map((item) =>
                                                            (<Option
                                                                key={item.key}
                                                                value={item.key}
                                                            >
                                                                {item.value}
                                                            </Option>)
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={this.STOP_BUY_DISABLED}
                                            onClick={this.handleSuspendPurchase}
                                        >暂停购进</Button>
                                    </FormItem>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={isPurchaseDisabled}
                                            onClick={this.handleRestorePurchases}
                                        >恢复采购</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    {/* 经营子公司 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">经营子公司</span>
                                            <span className="value-list-input">
                                                <SearchMind
                                                    compKey="search-mind-subsidiary"
                                                    ref={ref => { this.subsidiarySearrchMind = ref }}
                                                    fetch={(params) =>
                                                        this.props.pubFetchValueList({
                                                            branchCompanyId: (typeof parseFloat(params.value) === 'number') ? params.value : '',
                                                            branchCompanyName: (typeof parseFloat(params.value) !== 'number') ? params.value : ''
                                                        }, 'findCompanyBaseInfo')
                                                    }
                                                    addonBefore=""
                                                    onChoosed={this.handleSubsidiaryChoose}
                                                    onClear={this.handleSubsidiaryClear}
                                                    renderChoosedInputRaw={(data) => (
                                                        <div>{data.id}-{data.name}</div>
                                                    )}
                                                    pageSize={2}
                                                    columns={[
                                                        {
                                                            title: '子公司id',
                                                            dataIndex: 'id',
                                                            width: 150,
                                                        }, {
                                                            title: '子公司名字',
                                                            dataIndex: 'name',
                                                            width: 200,
                                                        }
                                                    ]}
                                                />
                                            </span>
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 子公司状态 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">子公司状态</span>
                                            {getFieldDecorator('salesInfo', {
                                                initialValue: subCompanyStatusOptions.defaultValue
                                            })(
                                                <Select
                                                    size="default"
                                                >
                                                    { subCompanyStatusOptions.data.map((item) =>
                                                            (<Option
                                                                key={item.key}
                                                                value={item.key}
                                                            >
                                                                {item.value}
                                                            </Option>)
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={isSoldDisabled}
                                            onClick={this.handleAreaDownSold}
                                        >区域下架</Button>
                                    </FormItem>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={isSoldDisabled}
                                            onClick={this.handleAreaUpSold}
                                        >区域上架</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={this.state.choose.length === 0}
                                            onClick={this.handleNationalDownSold}
                                        >全国性下架</Button>
                                    </FormItem>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={this.state.choose.length === 0}
                                            onClick={this.handleNationalUpSold}
                                        >全国性上架</Button>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 排序 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label">排序</span>
                                            {getFieldDecorator('sort', {
                                                initialValue: commoditySortOptions.defaultValue
                                            })(
                                                <Select
                                                    className=""
                                                    size="default"
                                                    onChange={this.hanldeGetSortType}
                                                >
                                                    {
                                                        commoditySortOptions.data.map((item) =>
                                                            (<Option
                                                                key={item.key}
                                                                value={item.key}
                                                                data-dataIndex={item.dataIndex}
                                                            >
                                                                {item.value}
                                                            </Option>)
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <FormItem className="">
                                        <Button
                                            type="primary"
                                            size="default"
                                            onClick={this.handleFormSearch}
                                        >查询</Button>
                                    </FormItem>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            onClick={this.handleFormReset}
                                        >重置</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </div>
                <div className="area-list">
                    <Table
                        dataSource={data}
                        columns={columns}
                        pagination={{
                            total,
                            pageSize: PAGE_SIZE,
                            current: pageNum,
                            showQuickJumper: true,
                            onChange: this.handleChangePage
                        }}
                        rowSelection={this.rowSelection}
                        rowKey="productId"
                    />
                </div>
            </div>
        );
    }
}

ManagementList.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    CommodityListData: PropTypes.objectOf(PropTypes.any),
    queryCommodityList: PropTypes.func,
    pubFetchValueList: PropTypes.func
}

ManagementList.defaultProps = {
}

export default withRouter(Form.create()(ManagementList));
