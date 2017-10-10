/**
 * 添加商品
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

class AddingGoods extends PureComponent {
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
     * 直营店 - 清除
     */
    handleClear() {
        this.searchMind.reset();
        this.props.onChange({ storeId: '', storeName: '' });
    }

    /**
     * 直营店 - 值清单
     */
    handleChoose = (v) => {
        this.props.onChange(v);
    }

    render() {
        return (
            <SearchMind
                /* style={{ zIndex: 6000, marginBottom: 5 }} */
                compKey="productCode"
                ref={ref => { this.addPo = ref }}
                fetch={(params) =>
                    this.props.pubFetchValueList({
                        teamText: params.value,
                        pageNum: params.pagination.current || 1,
                        pageSize: params.pagination.pageSize
                    }, 'queryProductForSelect')
                }
                disabled={this.state.isWarehouseDisabled}
                addonBefore="添加商品"
                onChoosed={this.handleChoosedMaterialMap}
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
                        dataIndex: 'saleName',
                        width: 140
                    }
                ]}
            />
        );
    }
}

AddingGoods.propTypes = {
    disabled: PropTypes.bool,
    pubFetchValueList: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.objectOf(PropTypes.any)
}

export default AddingGoods;
