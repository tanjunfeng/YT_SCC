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
        this.searchMind1 = null;

        this.state = {
            STOP_BUY_DISABLED: true,
            STOP_BUY_CHILDCOMPANY_ID: '',
            chooseGoodsList: [],
            brandChoose: null,
            childCompanyMeg: null,
            supplyChoose: '',
            subsidiaryChoose: '',

            // 区域上下架
            AREA_SHELVES_DISABLED: true
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
    onCopy = () => {
        message.success('复制成功')
    }

    /**
     * 三级下拉菜单
     * @param {Object} data 各级
     * @param {string} that 回显信息1
     */
    handleSelectChange = (data, that) => {
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
                chooseGoodsList: selectedRowKeys
            })
            console.log(selectedRowKeys);
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

    /* *************** 供货供应商 ************************* */

    // 供货供应商-值清单
    handleSupplyChoose = ({ record }) => {
        this.setState({
            supplyChoose: record,
            STOP_BUY_DISABLED: false,
            STOP_BUY_CHILDCOMPANY_ID: record.spAdrid
        })
    }

    // 供货供应商值清单-清除
    handleSupplyClear = () => {
        this.setState({
            supplyChoose: '',
            STOP_BUY_DISABLED: true
        });
    }

    /**
     * @param {object}    purchasedata  根据点击的按钮不同，传递不同的值
     * @param {function}  callback      点击确认按钮之后的后端回调接口
     *
     * 恢复/暂停购进、区域上/下架 逻辑封装
     */
    handleSuspendPurchase = (purchasedata, callback) => {
        // 列表是否有正确的值
        const HAS_CHILDCOMPANY = !!purchasedata.HAS_SELECT_VALUE;
        const GOODS_LIST_LENGH = this.state.chooseGoodsList.length > 0;
        const HAS_COMPANY_TXT = purchasedata.HAS_COMPANY_TXT;
        const NOT_COMPANY_TXT = '请先选择经营子公司';
        const NOT_SELECT_GOODS = `请选择一件商品，再进行${purchasedata.TIPS_TITLE_TXT}操作`;
        let confirmTitle = '';
        if (!HAS_CHILDCOMPANY) {
            confirmTitle = NOT_COMPANY_TXT;
        } else if (!GOODS_LIST_LENGH) {
            confirmTitle = NOT_SELECT_GOODS;
        } else {
            confirmTitle = HAS_COMPANY_TXT;
        }
        confirm({
            title: purchasedata.TIPS_TITLE_TXT,
            content: confirmTitle,
            onOk: () => {
                if (GOODS_LIST_LENGH) {
                    callback(purchasedata.GOODS_STATUS);
                    this.props.queryCommodityList({
                        pageSize: PAGE_SIZE
                    });
                    message.success(purchasedata.TIPS_MESSAGE_TXT);
                }
            },
            onCancel() {},
        })
    }

    // 商品的暂停购进和恢复采购接口回调
    goodstatusChange = (status) => {
        this.props.pubFetchValueList({
            productIdList: this.state.chooseGoodsList,
            spAdrId: this.state.STOP_BUY_CHILDCOMPANY_ID,
            status
        }, 'goodsChangeStatus');
    }

    // 暂停购进
    handleStopPurchaseClick = () => {
        const stopMsg = {
            TIPS_TITLE_TXT: '暂停购进',
            TIPS_MESSAGE_TXT: '暂停购进，操作成功',
            GOODS_STATUS: 0,
            HAS_COMPANY_TXT: '请确认对选中商品进行暂停购进操作，商品将不可进行采购下单',
            HAS_SELECT_VALUE: this.supplier
        };
        this.handleSuspendPurchase({...stopMsg}, this.goodstatusChange);
    }

    // 恢复采购
    handleResumedPurchaseClick = () => {
        const stopMsg = {
            TIPS_TITLE_TXT: '恢复采购',
            TIPS_MESSAGE_TXT: '恢复采购，操作成功',
            GOODS_STATUS: 1,
            HAS_COMPANY_TXT: '请确认对选中商品进行恢复采购操作',
            HAS_SELECT_VALUE: this.supplier
        };
        this.handleSuspendPurchase({...stopMsg}, this.goodstatusChange);
    }

    /* **************** 区域上下架 ****************** */

    // 选择子公司
    handleSubsidiaryChoose = ({ record }) => {
        this.setState({
            childCompanyMeg: record,
            AREA_SHELVES_DISABLED: false
        });
    }

    // 清除经营子公司列表值
    handleSubsidiaryClear = () => {
        this.setState({
            childCompanyMeg: null,
            AREA_SHELVES_DISABLED: true
        });
    }

    // 区域下架
    handleAreaDownSold = () => {
        const areaMessage = {
            TIPS_TITLE_TXT: '区域下架',
            TIPS_MESSAGE_TXT: '区域下架，操作成功',
            GOODS_STATUS: 0,
            HAS_COMPANY_TXT: '请确认对选中商品进行区域下架操作，商品将在该区域停止销售',
            HAS_SELECT_VALUE: this.childCompany
        };
        this.handleSuspendPurchase({...areaMessage}, this.prodBatchUpdate);
    }

    // 区域上架
    handleAreaUpSold = () => {
        const areaMessage = {
            TIPS_TITLE_TXT: '区域上架',
            TIPS_MESSAGE_TXT: '区域上架，操作成功',
            GOODS_STATUS: 1,
            HAS_COMPANY_TXT: '请确认对选中商品进行区域上架操作，商品将在该区域恢复销售',
            HAS_SELECT_VALUE: this.childCompany
        };
        this.handleSuspendPurchase({...areaMessage}, this.prodBatchPutaway);
    }

    // 区域上架回调接口
    prodBatchPutaway = (status) => {
        const { name, id } = this.state.childCompanyMeg;
        this.props.pubFetchValueList({
            branchCompanyName: name,
            branchCompanyId: id,
            productIds: this.state.chooseGoodsList,
            status
        }, 'prodBatchPutAway');
    }

    // 区域下架回调接口
    prodBatchUpdate = (status) => {
        const { name, id } = this.state.childCompanyMeg;
        this.props.pubFetchValueList({
            branchCompanyName: name,
            branchCompanyId: id,
            productIds: this.state.chooseGoodsList,
            status
        }, 'prodBatchUpdate');
    }

    /* **************** 全国上下架 ****************** */

    // 全国性下架
    handleNationalDownSold = () => {
        const areaMessage = {
            TIPS_TITLE_TXT: '全国性下架',
            TIPS_MESSAGE_TXT: '全国性下架，操作成功',
            GOODS_STATUS: 3,
            HAS_COMPANY_TXT: '请确认对选中商品进行全国性下架操作',
            HAS_SELECT_VALUE: true
        };
        this.handleSuspendPurchase({...areaMessage}, this.availablProducts);
    }

    // 全国性上架
    handleNationalUpSold = () => {
        const areaMessage = {
            TIPS_TITLE_TXT: '全国性上架',
            TIPS_MESSAGE_TXT: '全国性上架，操作成功',
            GOODS_STATUS: 2,
            HAS_COMPANY_TXT: '请确认对选中商品进行全国性上架操作',
            HAS_SELECT_VALUE: true
        };
        this.handleSuspendPurchase({...areaMessage}, this.availablProducts);
    }

    // 全国性上/下架接口回调
    availablProducts = (status) => {
        this.props.pubFetchValueList({
            supplyChainStatus: status,
            ids: this.state.chooseGoodsList
        }, 'availablProducts');
    };

    /**
     * 品牌值清单-清除
     */
    handleBrandClear = () => {
        this.setState({
            brandChoose: null,
        });
    }


    /**
     * 重置
     */
    handleFormReset = () => {
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
    hasSpecifyValue = (id, status) => {
        // 代表初始值（全部）
        const IS_INIT_SELECT = -1;
        const SELECT_VALUE = status === IS_INIT_SELECT ? '' : status;
        const str = (!id && SELECT_VALUE) ? '' : `${id}-${SELECT_VALUE}`;

        return str;
    };

    /**
     * 查询
     */
    handleFormSearch = () => {
        const postData = this.getFormAllVulue();
        console.log(postData);
        // this.props.queryCommodityList({...postData});
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

    /**
     * 表单操作
     * @param {Object} text 当前行的值
     * @param {object} record 单行数据
     */
    renderOperation = (text, record) => {
        const { id } = record;
        const { pathname } = this.props.location;
        const origin = window.location.origin;
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
                    <Link to={`${pathname}/price/${id}`}>销售维护</Link>
                </Menu.Item>
                <Menu.Item key={3}>
                    <Link to={`${pathname}/purchasingPice/${id}`}>采购维护</Link>
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
        const { data = [], total = 0, pageNum = 1 } = this.props.CommodityListData;
        const COUNTRY_OFF_THE_SHELF = this.state.chooseGoodsList.length === 0;
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
                                                        <div ref={supplier => { this.supplier = supplier }}>{companyList.spId}-{companyList.companyName}</div>
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
                                            disabled={this.state.STOP_BUY_DISABLED}
                                            onClick={this.handleStopPurchaseClick}
                                        >暂停购进</Button>
                                    </FormItem>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={this.state.STOP_BUY_DISABLED}
                                            onClick={this.handleResumedPurchaseClick}
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
                                                            branchCompanyId: !(isNaN(parseFloat(params.value))) ? params.value : '',
                                                            branchCompanyName: isNaN(parseFloat(params.value)) ? params.value : ''
                                                        }, 'findCompanyBaseInfo')
                                                    }
                                                    onChoosed={this.handleSubsidiaryChoose}
                                                    onClear={this.handleSubsidiaryClear}
                                                    renderChoosedInputRaw={(companyList = []) => (
                                                        <div ref={childCompany => { this.childCompany = childCompany }}>{companyList.id}-{companyList.name}</div>
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
                                            disabled={this.state.AREA_SHELVES_DISABLED}
                                            onClick={this.handleAreaDownSold}
                                        >区域下架</Button>
                                    </FormItem>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={this.state.AREA_SHELVES_DISABLED}
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
                                            disabled={COUNTRY_OFF_THE_SHELF}
                                            onClick={this.handleNationalDownSold}
                                        >全国性下架</Button>
                                    </FormItem>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={COUNTRY_OFF_THE_SHELF}
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
