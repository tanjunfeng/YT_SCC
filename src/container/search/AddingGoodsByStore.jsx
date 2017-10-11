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

@connect(() => ({}), dispatch => bindActionCreators({
    pubFetchValueList
}, dispatch))

class AddingGoodsByStore extends PureComponent {
    constructor(props) {
        super(props);
        this.handleClear = this.handleClear.bind(this);
        this.handleChoose = this.handleChoose.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value.storeId === '') {
            this.searchMind.reset();
        }
    }

    /**
     * 添加商品 - 清除
     */
    handleClear() {
        this.searchMind.reset();
        this.props.onChange({ storeId: '', storeName: '' });
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
                style={{ zIndex: 1, marginBottom: 5 }}
                compKey="productCode"
                ref={ref => { this.searchMind = ref }}
                fetch={(params) =>
                    this.props.pubFetchValueList({
                        branchCompanyId: params.value,
                        searchTerm: params.value,
                        pageNum: params.pagination.current || 1,
                        pageSize: params.pagination.pageSize
                    }, 'queryProductByStore')
                }
                disabled={this.props.disabled}
                addonBefore="添加商品"
                onClear={this.handleClear}
                onChoosed={this.handleChoose}
                renderChoosedInputRaw={(data) => (
                    <div>{data.productCode} - {data.saleName}</div>
                )}
                pageSize={6}
                columns={[
                    {
                        title: '商品编码',
                        dataIndex: 'productCode',
                        width: 98
                    }, {
                        title: '商品名称',
                        dataIndex: 'saleName'
                    }
                ]}
            />
        );
    }
}

AddingGoodsByStore.propTypes = {
    disabled: PropTypes.bool,
    pubFetchValueList: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.objectOf(PropTypes.any)
}

export default AddingGoodsByStore;
