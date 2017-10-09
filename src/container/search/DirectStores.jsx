/**
 * 查询直营店清单
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

class DirectStores extends PureComponent {
    constructor(props) {
        super(props);
        this.handleClear = this.handleClear.bind(this);
        this.handleChoose = this.handleChoose.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value === '') {
            this.searchMind.reset();
        }
    }

    /**
     * 直营店 - 清除
     */
    handleClear() {
        this.searchMind.reset();
        this.props.onDirectStoresClear();
    }

    /**
     * 直营店 - 值清单
     */
    handleChoose = ({ record }) => {
        this.props.onDirectStoresChoose(record.storeId);
    }

    render() {
        return (
            <SearchMind
                compKey="storeId"
                ref={ref => { this.searchMind = ref }}
                fetch={() =>
                    // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/directStore/getAllStores
                    this.props.pubFetchValueList({}, 'queryDirectStores')
                }
                disabled={this.props.disabled}
                onChoosed={this.handleChoose}
                onClear={this.handleClear}
                renderChoosedInputRaw={(row) => (
                    <div>{row.storeId} - {row.storeName}</div>
                )}
                pageSize={6}
                columns={[
                    {
                        title: '门店编号',
                        dataIndex: 'storeId',
                        width: 98
                    }, {
                        title: '门店名称',
                        dataIndex: 'storeName'
                    }
                ]}
            />
        );
    }
}

DirectStores.propTypes = {
    disabled: PropTypes.bool,
    pubFetchValueList: PropTypes.func,
    onDirectStoresChoose: PropTypes.func,
    onDirectStoresClear: PropTypes.func,
    value: PropTypes.string
}

export default DirectStores;
