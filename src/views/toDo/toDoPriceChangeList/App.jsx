/**
 * @file App.jsx
 * @author zhoucl
 *
 * 管理列表页面
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Input,
    Form,
    Select,
    Row,
    Col,
    Icon,
    Table,
    Menu,
    Dropdown,
    Modal,
    message,
} from 'antd';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import { PAGE_SIZE } from '../../../constant';
import Utils from '../../../util/util';
import {
    locType,
    optionStatus,
    auditStatusOption
} from '../../../constant/procurement';
import SearchMind from '../../../components/searchMind';
import { pubFetchValueList } from '../../../actions/pub';
import {
    queryCommentHis,
    queryProcessDefinitions
} from '../../../actions/procurement';
import {
    queryProcessMsgInfo,
    queryHighChart,
    clearHighChart,
} from '../../../actions/process';
import {
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap
} from '../../../actions';
import ApproModal from '../../../components/approModal'
import FlowImage from '../../../components/flowImage';
import {auditInfo} from '../../../service';

import SearchFormInput from './searchFormInput';

const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
const confirm = Modal.confirm;
const { TextArea } = Input;

const columns = [
    {
        title: '变价类型',
        dataIndex: 'changeType',
        key: 'changeType'
    }, 
    {
        title: '供应商',
        dataIndex: 'spCodeAndName',
        key: 'spCodeAndName',
    }, 
    {
        title: '供应商地点',
        dataIndex: 'spAdrCodeAndName',
        key: 'spAdrCodeAndName',
    }, 
    {
        title: '子公司',
        dataIndex: 'branchCompanyCodeAndName',
        key: 'branchCompanyCodeAndName',
    },
    {
        title: '部类',
        dataIndex: 'firstLevelCategoryName',
        key: 'firstLevelCategoryName',
    },
    {
        title: '大类',
        dataIndex: 'secondLevelCategoryName',
        key: 'secondLevelCategoryName',
    },
    {
        title: '中类',
        dataIndex: 'thirdLevelCategoryName',
        key: 'thirdLevelCategoryName',
    },
    {
        title: '小类',
        dataIndex: 'fourthLevelCategoryName',
        key: 'fourthLevelCategoryName',
    },
    {
        title: '商品信息',
        dataIndex: 'productCodeAndDesc',
        key: 'productCodeAndDesc',
    },
    {
        title: '操作人',
        dataIndex: 'createUserName',
        key: 'createUserName',
    },
    {
        title: '操作时间',
        dataIndex: 'createTime',
        key: 'createTime',
    },
    {
        title: '当前价格',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: '提交价格',
        dataIndex: 'newestPrice',
        key: 'newestPrice',
    },
    {
        title: '商品毛利率',
        dataIndex: 'grossProfitMargin',
        key: 'grossProfitMargin',
    },
    {
        title: '调价百分比',
        dataIndex: 'percentage',
        key: 'percentage',
    }
];

const data = [
    {
        "id":6,
        "changeType":0,
        "changeTypeName":"采购进价变更",
        "spCodeAndName":"10008-四川白家食品产业有限公司",
        "spAdrCodeAndName":"1000009-四川-四川白家食品产业有限公司",
        "branchCompanyCodeAndName":null,
        "firstLevelCategoryName":"粮油副食",
        "secondLevelCategoryName":"粮食类",
        "thirdLevelCategoryName":"奶粉/辅食",
        "fourthLevelCategoryName":"长粒香",
        "productCodeAndDesc":"1000042-",
        "createUserId":null,
        "createUserName":null,
        "createTime":1512616488000,
        "price":3.45,
        "newestPrice":3.45,
        "percentage":"0.00%",
        "grossProfitMargin":null
    },
    {
        "id":7,
        "changeType":0,
        "changeTypeName":"采购进价变更",
        "spCodeAndName":"10008-四川白家食品产业有限公司",
        "spAdrCodeAndName":"1000009-四川-四川白家食品产业有限公司",
        "branchCompanyCodeAndName":null,
        "firstLevelCategoryName":"粮油副食",
        "secondLevelCategoryName":"粮食类",
        "thirdLevelCategoryName":"奶粉/辅食",
        "fourthLevelCategoryName":"长粒香",
        "productCodeAndDesc":"1000042-",
        "createUserId":null,
        "createUserName":null,
        "createTime":1512619755000,
        "price":null,
        "newestPrice":3.45,
        "percentage":"0.00%",
        "grossProfitMargin":null
    }
];

class toDoPriceChangeList extends PureComponent {
    render () {
        return (
            <div className="foo">
                <SearchFormInput></SearchFormInput>
                <Table columns={columns} dataSource={data} />
            </div>
        );
    }
}

export default withRouter(Form.create()(toDoPriceChangeList));
