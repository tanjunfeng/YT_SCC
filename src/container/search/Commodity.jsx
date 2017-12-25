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
        this.props.onChange({ productId: '', saleName: '' });
    }

     /**
     * 值清单
     */
    handleChoose = ({ record }) => {
        this.props.onChange(record);
    }

    render() {
        return (
            <SearchMind
                style={{ zIndex: 10000 }}
                compKey="productId"
                ref={ref => { this.productSearchMind = ref }}
                fetch={(params) =>
                    this.props.pubFetchValueList({
                        teamText: params.value,
                        pageNum: params.pagination.current || 1,
                        pageSize: params.pagination.pageSize
                    }, 'queryProductForSelect')
                }
                disabled={this.props.disabled}
                defaultValue={this.props.initialValue}
                rowKey="productId"
                onChoosed={this.handleChoose}
                onClear={this.handleClear}
                renderChoosedInputRaw={(row) => (
                    <div>{row.saleName}</div>
                )}
                pageSize={6}
                columns={[
                    {
                        title: '商品ID',
                        dataIndex: 'productId',
                        width: 180,
                    }, {
                        title: '商品名字',
                        dataIndex: 'saleName',
                        width: 200,
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
    initialValue: PropTypes.string
}

export default Commodity;
