/**
 * @file App.jsx
 * @author zhangbaihua
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
    commoditySortOptions,
    commodityListOptions
} from '../../../constant/searchParams';

import LevelTree from '../../../common/levelTree';
import ClassifiedSelect from '../../../components/threeStageClassification'


import { pubFetchValueList } from '../../../actions/pub';

import { queryCommodityList } from '../../../actions';
import { PAGE_SIZE } from '../../../constant';

import Util from '../../../util/util';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const commodityML = 'commodity-management';

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
        this.state = {
            stopBuyDisabled: true,
            supplierId: '',
            chooseGoodsList: [],
            brandName: '',
            childCompanyMeg: {},
            subsidiaryChoose: '',
            areaShelvesDisabled: true,
            errorGoodsCode: '',
            classify: {},
            sortType: '',
            selectedDate: [],
        };
    }
    componentDidMount() {
        this.props.queryCommodityList({
            pageSize: PAGE_SIZE
        });
    }

    shouldComponentUpdate() {
        if (Object.values(this.props.CommodityListData).length === 0) {
            return false;
        }
        return true;
    }

    // 复制链接
    onCopy = () => {
        message.success('复制成功')
    }

     /**
     * 获取所有有效的表单值
     *
     * @return {object}  返回所有填写了有效的表单值
     */
    getFormAllVulue = () => {
        const { supplierId, classify, childCompanyMeg, brandName, sortType } = this.state;
        const {
            supplyChainStatus,
            internationalCode,
            productName,
            productCode,
            supplierInfo,
            salesInfo
        } = this.props.form.getFieldsValue();

        return Util.removeInvalid({
            supplyChainStatus: supplyChainStatus + 1 > 0 ? supplyChainStatus : '',
            internationalCode,
            productName,
            productCode,
            brand: brandName,
            supplierInfo: this.hasSpecifyValue(supplierId, supplierInfo),
            salesInfo: this.hasSpecifyValue(childCompanyMeg.id, salesInfo),
            sort: sortType,
            ...classify
        });
    }


    /* *************** 供货供应商 ************************* */

    // 供货供应商-值清单
    handleSupplyChoose = ({ record }) => {
        this.setState({
            stopBuyDisabled: false,
            supplierId: record.spAdrid
        })
    }

    // 供货供应商值清单-清除
    handleSupplyClear = () => {
        this.setState({
            stopBuyDisabled: true
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
        const hasChildCompany = !!purchasedata.hasSelectValue;

        // 没有可处理的id，错误状态吗
        const availbleGoodsId = 10027;

        const goodsListLengh = this.state.chooseGoodsList.length > 0;
        const hasCompanyTxt = purchasedata.hasCompanyTxt;
        const notCompanyTxt = '请先选择经营子公司';
        const notSelectGoods = `请选择一件商品，再进行${purchasedata.tipsTitleTxt}操作`;
        let confirmTitle = '';

        if (!hasChildCompany) {
            confirmTitle = notCompanyTxt;
        } else if (goodsListLengh) {
            confirmTitle = hasCompanyTxt;
        } else {
            confirmTitle = notSelectGoods;
        }

        // this.selectedDataStateIsTrue(purchasedata.availableState);

        confirm({
            title: purchasedata.tipsTitleTxt,
            content: confirmTitle,
            onOk: () => {
                if (goodsListLengh) {
                    callback(purchasedata.goodsStatus);

                    if (this.state.errorGoodsCode === availbleGoodsId) {
                        message.error('请选择有效状态的商品，请重新选择！')
                    } else {
                        message.success(purchasedata.tipsMessageTxt);
                    }

                    this.handleFormSearch();
                }
            },
            onCancel() {},
        })
    }

    // 判断商品状态是否正确，不正确则把商品编号存起来，用于提示用户取消选中
    // selectedDataStateIsTrue = (status) => {
    //     console.log(this.state.selectedListData);
    //     let goodsNumber = [];
    //     this.state.selectedListData.forEach((item) => {
    //         if (item.supplyChainStatus !== status) {
    //             goodsNumber.push(item.productCode)
    //         }
    //     });
    //     this.setState({
    //         errorGoodsCode: goodsNumber
    //     })
    // }

    // 商品的暂停购进和恢复采购接口回调
    goodstatusChange = (status) => {
        const availbleGoodsId = 10027;
        this.props.pubFetchValueList({
            productIdList: this.state.chooseGoodsList,
            spAdrId: this.state.supplierId,
            status
        }, 'goodsChangeStatus')
            .catch(err => {
                if (err.code === availbleGoodsId) {
                    this.setState({
                        errorGoodsCode: err.code
                    })
                }
            });
    }


    // 暂停购进
    handleStopPurchaseClick = () => {
        const stopMsg = {
            tipsTitleTxt: '暂停购进',
            tipsMessageTxt: '暂停购进，操作成功',
            goodsStatus: 0,
            availableState: 2,
            hasCompanyTxt: '请确认对选中商品进行暂停购进操作，商品将不可进行采购下单',
            hasSelectValue: this.supplier
        };
        this.handleSuspendPurchase({...stopMsg}, this.goodstatusChange);
    }

    // 恢复采购
    handleResumedPurchaseClick = () => {
        const stopMsg = {
            tipsTitleTxt: '恢复采购',
            tipsMessageTxt: '恢复采购，操作成功',
            goodsStatus: 1,
            availableState: 2,
            hasCompanyTxt: '请确认对选中商品进行恢复采购操作',
            hasSelectValue: this.supplier
        };

        this.handleSuspendPurchase({...stopMsg}, this.goodstatusChange);
    }


    /* **************** 区域上下架 ****************** */

    // 选择子公司
    handleSubsidiaryChoose = ({ record }) => {
        this.setState({
            childCompanyMeg: record,
            areaShelvesDisabled: false
        });
    }

    // 清除经营子公司列表值
    handleSubsidiaryClear = () => {
        this.setState({
            childCompanyMeg: {},
            areaShelvesDisabled: true
        });
    }

    // 区域下架
    handleAreaDownSold = () => {
        const areaMessage = {
            tipsTitleTxt: '区域下架',
            tipsMessageTxt: '区域下架，操作成功',
            goodsStatus: 0,
            hasCompanyTxt: '请确认对选中商品进行区域下架操作，商品将在该区域停止销售',
            hasSelectValue: this.childCompany
        };
        this.handleSuspendPurchase({...areaMessage}, this.prodBatchUpdate);
    }

    // 区域上架
    handleAreaUpSold = () => {
        const areaMessage = {
            tipsTitleTxt: '区域上架',
            tipsMessageTxt: '区域上架，操作成功',
            goodsStatus: 1,
            hasCompanyTxt: '请确认对选中商品进行区域上架操作，商品将在该区域恢复销售',
            hasSelectValue: this.childCompany
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
            tipsTitleTxt: '全国性下架',
            tipsMessageTxt: '全国性下架，操作成功',
            goodsStatus: 3,
            hasCompanyTxt: '请确认对选中商品进行全国性下架操作',
            hasSelectValue: true
        };
        this.handleSuspendPurchase({...areaMessage}, this.availablProducts);
    }

    // 全国性上架
    handleNationalUpSold = () => {
        const areaMessage = {
            tipsTitleTxt: '全国性上架',
            tipsMessageTxt: '全国性上架，操作成功',
            goodsStatus: 2,
            hasCompanyTxt: '请确认对选中商品进行全国性上架操作',
            hasSelectValue: true
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
            brandName: '',
        });
    }


    // 重置
    handleFormReset = () => {
        this.brandSearchMind.handleClear();
        this.supplySearchMind.handleClear();
        this.subsidiarySearchMind.handleClear();
        this.props.form.resetFields();
        this.slect.resetValue();
        this.setState({
            classify: {},
            chooseGoodsList: []
        })
    }

    // 获取排序类型
    hanldeGetSortType = (value) => {
        /**
         * dim_flatCategory  分类排序
         * brand             品牌排序
         * productCode       商品编号排序
         * 0 / 1             升序 / 降序
         */
        const sortType = ['fourthLevelCategoryId|0', 'brand|0', 'productCode|0', 'productCode|1'];
        this.setState({
            sortType: sortType[value]
        });
    };

    /**
     * 三级下拉菜单
     * @param {Object} data 各级
     * @param {string} that 回显信息1
     */
    handleSelectChange = (selectData, that) => {
        this.slect = that;
        const { first, second, third, fourth } = selectData;
        const NOT_SELECT = -1;
        this.setState({
            classify: {
                firstLevelCategoryId: first.categoryId !== NOT_SELECT ? first.categoryId : '',
                secondLevelCategoryId: second.categoryId !== NOT_SELECT ? second.categoryId : '',
                thirdLevelCategoryId: third.categoryId !== NOT_SELECT ? third.categoryId : '',
                fourthLevelCategoryId: fourth.categoryId !== NOT_SELECT ? fourth.categoryId : '',
            }
        })
    }

    /**
     * @param {string} id      供应商id或子公司id
     * @param {string} status  供应商状态或子公司状态
     *
     * 用于拼接供应商id-供货状态，子公司id-子公司状态
     */
    hasSpecifyValue = (id = '', status) => {
        let str = '';
        if (!id && status) {
            str = `-${status}`;
        } else if (id && !status) {
            str = `${id}-`;
        } else if (id && status) {
            str = `${id}-${status}`;
        }
        return str;
    };

    /**
     * 查询
     */
    handleFormSearch = () => {
        const postData = this.getFormAllVulue();
        this.props.queryCommodityList({...postData});
        this.setState({
            chooseGoodsList: []
        });
    }

    /**
     * 分页页码改变的回调
     */
    handleChangePage = (page) => {
        const currentPage = page;
        const allFormValue = this.getFormAllVulue();
        this.props.queryCommodityList({
            pageNum: currentPage,
            pageSize: PAGE_SIZE,
            ...allFormValue
        });
    }

    /**
     * 表单操作
     * @param {Object} text 当前行的值
     * @param {object} record 单行数据
     */
    renderOperation = (text, record) => {
        const { id, productId } = record;
        const { pathname } = this.props.location;
        const origin = window.location.origin;
        const menu = (
            <Menu>
                <Menu.Item key={0}>
                    <Link to={`/commodifyList/${productId}`}>商品详情</Link>
                </Menu.Item>
                <Menu.Item key={1}>
                    <CopyToClipboard text={`${origin}${pathname}/commodifyList/${productId}`} onCopy={this.onCopy}>
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

    /**
     * 商品信息,编号,以及图片
     *
     */
    renderGoodsOpations = (text, record) => {
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
                    <img alt="未上传" className="table-commodity-description-img" src={`${this.props.CommodityListData.imgDomain}/${thumbnailImage}`} />
                    <span className="table-commodity-description-name">{saleName}</span>
                </div>
            </div>
        )
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { data = [], total = 0, pageNum = 1 } = this.props.CommodityListData;
        commodityListOptions[commodityListOptions.length - 1].render = this.renderOperation;
        commodityListOptions[0].render = this.renderGoodsOpations;
        const COUNTRY_OFF_THE_SHELF = this.state.chooseGoodsList.length === 0;
        const { chooseGoodsList } = this.state;
        const rowSelection = {
            selectedRowKeys: chooseGoodsList,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    chooseGoodsList: selectedRowKeys,
                    selectedListData: selectedRows
                })
                // console.log(this.state.selectedListData)
            },
        }
        return (
            <div className={`${commodityML}`}>
                <div className="manage-form">
                    <Form layout="inline">
                        <div className="gutter-example">
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    {/* 商品名称 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">商品名称</span>
                                            {getFieldDecorator('productName')(
                                                <Input
                                                    className="input"
                                                    style={{paddingLeft: '10px', paddingRight: '10px'}}
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
                                                    style={{paddingLeft: '10px', paddingRight: '10px'}}
                                                    placeholder="商品编号"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row commodityType-wrap" span={8}>
                                    {/* 商品分类 */}
                                    <FormItem>
                                        <div className="commodityType-title">商品分类</div>
                                        <LevelTree className="levelTree-wrap" />
                                        <ClassifiedSelect onChange={this.handleSelectChange} />
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
                                                    style={{paddingLeft: '10px', paddingRight: '10px'}}
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
                                                <Select size="default" >
                                                    { commodityStatusOptions.data.map((item) => (
                                                        <Option
                                                            key={item.key}
                                                            value={item.key}
                                                        >
                                                            {item.value}
                                                        </Option>
                                                    ))}
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
                                                    style={{zIndex: 101}}
                                                    compKey="search-mind-supply"
                                                    ref={ref => { this.supplySearchMind = ref }}
                                                    fetch={(params) =>
                                                        this.props.pubFetchValueList({
                                                            condition: params.value
                                                        }, 'querySuppliersList')
                                                    }
                                                    onChoosed={this.handleSupplyChoose}
                                                    onClear={this.handleSupplyClear}
                                                    renderChoosedInputRaw={(companyList) => (
                                                        <div ref={supplier => { this.supplier = supplier }}>{companyList.providerNo}-{companyList.providerName}</div>
                                                    )}
                                                    rowKey="spAdrid"
                                                    pageSize={5}
                                                    columns={[
                                                        {
                                                            title: '地点编码',
                                                            dataIndex: 'providerNo',
                                                            width: 150,
                                                        }, {
                                                            title: '地点名称',
                                                            dataIndex: 'providerName',
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
                                                <Select size="default">
                                                    { deliveryStatusOptions.data.map((item) => (
                                                        <Option
                                                            key={item.key}
                                                            value={item.key}
                                                        >
                                                            {item.value}
                                                        </Option>)
                                                    )}
                                                </Select>
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={this.state.stopBuyDisabled}
                                            onClick={this.handleStopPurchaseClick}
                                        >暂停购进</Button>
                                    </FormItem>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={this.state.stopBuyDisabled}
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
                                                    ref={ref => { this.subsidiarySearchMind = ref }}
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
                                                <Select size="default" >
                                                    { subCompanyStatusOptions.data.map((item) => (
                                                        <Option
                                                            key={item.key}
                                                            value={item.key}
                                                        >
                                                            {item.value}
                                                        </Option>)
                                                    ) }
                                                </Select>
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={this.state.areaShelvesDisabled}
                                            onClick={this.handleAreaDownSold}
                                        >区域下架</Button>
                                    </FormItem>
                                    <FormItem className="">
                                        <Button
                                            size="default"
                                            disabled={this.state.areaShelvesDisabled}
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
                        columns={commodityListOptions}
                        pagination={{
                            total,
                            pageSize: PAGE_SIZE,
                            current: pageNum,
                            showQuickJumper: true,
                            onChange: this.handleChangePage
                        }}
                        rowSelection={rowSelection}
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
