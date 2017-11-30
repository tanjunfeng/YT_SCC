/**
 * 通过门店信息添加商品
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pubFetchValueList } from '../../actions/pub';
import SearchMind from '../../components/searchMind';
import Utils from '../../util/util';

@connect(() => ({}), dispatch => bindActionCreators({
    pubFetchValueList
}, dispatch))

class AddingGoodsByStore extends PureComponent {
    componentWillReceiveProps(nextProps) {
        if (nextProps.value.branchCompanyId === '') {
            this.handleClear();
        }
    }

    query = (params) => {
        const conditions = {
            salesInfo: this.props.value.branchCompanyId,
            teamText: params.value,
            pageNum: params.pagination.current || 1,
            pageSize: params.pagination.pageSize
        };
        return this.props.pubFetchValueList(Utils.removeInvalid(conditions), 'queryProductByStore');
    }

    /**
     * 添加商品 - 清除
     */
    handleClear = () => {
        this.searchMind.reset();
        this.props.onChange({
            productId: '',
            productCode: '',
            productName: ''
        });
    }

    /**
     * 添加商品 - 值清单
     */
    handleChoose = (v) => {
        this.props.onChange(v);
    }

    render() {
        return (
            <SearchMind
                style={{ zIndex: 2, marginBottom: 5 }}
                compKey="productId"
                rowKey="productCode"
                ref={ref => { this.searchMind = ref }}
                fetch={this.query}
                disabled={this.props.value.branchCompanyId === ''}
                addonBefore="添加商品"
                onClear={this.handleClear}
                onChoosed={this.handleChoose}
                renderChoosedInputRaw={data => (
                    <div>{data.productCode} - {data.productName}</div>
                )}
                pageSize={6}
                columns={[
                    {
                        title: '商品编码',
                        dataIndex: 'productCode',
                        width: 98
                    }, {
                        title: '商品名称',
                        dataIndex: 'productName'
                    }
                ]}
            />
        );
    }
}

AddingGoodsByStore.propTypes = {
    pubFetchValueList: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.objectOf(PropTypes.any)
}

export default AddingGoodsByStore;
