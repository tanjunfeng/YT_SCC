import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Form,
    Table
    // message
} from 'antd';
import { pubFetchValueList } from '../../../actions/pub';
import SearchForm from './searchForm';
import { sitesManageColumns } from './columns';

const dataSource = [
        {
            firstLevelCategoryName: '休闲',
            secondLevelCategoryName: '饮料',
            thirdLevelCategoryName: '水饮料',
            fourthLevelCategoryName: '碳酸饮料',
            brand: '百事可乐',
            saleName: '123456-百事可乐',
            companyCode: '10001',
            subCompany: '四川子公司',
            storeName: '四川子公司玉林菜市场店',
            supplier: '100001-红太阳商贸有限公司',
            supplierAddr: '1000011-红太阳商贸有限公司-四川',
            logisticsMode: '直送'
        }
];

@connect(state => ({
    priceImportlist: state.toJS().priceImport.priceImportlist,
}), dispatch => bindActionCreators({
    pubFetchValueList
}, dispatch))
class SiteManage extends PureComponent {
    componentDidMount() {}
    render() {
        const { pubFetchValueList } = this.props;
        return (
            <div>
                <SearchForm pubFetchValueList={ pubFetchValueList }/>
                <Table
                    dataSource={dataSource}
                    columns={sitesManageColumns}
                />
            </div>
        );
    }
}

export default withRouter(Form.create()(SiteManage));
