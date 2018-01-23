/**
 * 查询商品
 *
 * @author zhouchanglong
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pubFetchValueList } from '../../actions/pub';
import SearchMind from '../../components/searchMind';
import Utils from '../../util/util';
import './SearchMind.scss';

@connect(() => ({}), dispatch => bindActionCreators({
    pubFetchValueList
}, dispatch))

class Commodity extends PureComponent {
    componentWillReceiveProps(nextProps) {
        const { productId } = nextProps.value;
        if (this.props.value.productId !== '' && productId === '') {
            this.productSearchMind.reset();
        }
        if (nextProps.value.reset && !this.props.value.reset) {
            this.handleClear();
        }
    }

    /**
     * 清除
     */
    handleClear = () => {
        this.productSearchMind.reset();
        this.props.onChange({ productId: '', productName: '' });
    }

    /**
     * 值清单
     */
    handleChoose = (val) => {
        this.props.onChange(val);
    }

    query = (params) => {
        const conditions = {
            teamText: params.value,
            pageNum: params.pagination.current || 1,
            pageSize: params.pagination.pageSize
        };
        return this.props.pubFetchValueList(Utils.removeInvalid(conditions), this.props.api);
    }

    render() {
        const { zIndex } = this.props.zIndex;
        return (
            <SearchMind
                style={{ zIndex }}
                compKey="productId"
                ref={ref => { this.productSearchMind = ref }}
                fetch={this.query}
                disabled={this.props.disabled}
                defaultValue={this.props.initialValue}
                rowKey="productId"
                onChoosed={this.handleChoose}
                onClear={this.handleClear}
                renderChoosedInputRaw={(row) => (
                    <div>{row.productName}</div>
                )}
                pageSize={6}
                columns={[
                    {
                        title: '商品编码',
                        dataIndex: 'productCode',
                        width: 70,
                    }, {
                        title: '商品名字',
                        dataIndex: 'productName',
                        width: 140,
                    }
                ]}
            />
        );
    }
}

Commodity.propTypes = {
    disabled: PropTypes.bool,
    pubFetchValueList: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.objectOf(PropTypes.any),
    initialValue: PropTypes.string,
    api: PropTypes.string,
    zIndex: PropTypes.number
};

Commodity.defaultProps = {
    api: 'queryProductForSelect',
    zIndex: 1000
};

export default Commodity;
