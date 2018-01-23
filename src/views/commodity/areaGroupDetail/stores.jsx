/**
 * 查询直营店清单
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pubFetchValueList } from '../../../actions/pub';
import SearchMind from '../../../components/searchMind';
import Utils from '../../../util/util';

@connect(() => ({}), dispatch => bindActionCreators({
    pubFetchValueList
}, dispatch))

class Stores extends PureComponent {
    componentWillReceiveProps(nextProps) {
        if (this.props.value.id !== '' && nextProps.value.id === '') {
            this.handleClear();
        }
        if (nextProps.value.reset && !this.props.value.reset) {
            this.handleClear();
        }
    }

    /**
     * 直营店 - 清除
     */
    handleClear = () => {
        this.searchMind.reset();
        this.props.onChange({ id: '', name: '' });
    }

    /**
     * 直营店 - 值清单
     */
    handleChoose = (v) => {
        this.props.onChange(v);
    }

    query = (params) => (
        this.props.pubFetchValueList(Utils.removeInvalid({
            pageNo: params.pagination.current || 1,
            pageSize: params.pagination.pageSize,
            id: params.value
        }), this.props.api)
    )

    render() {
        return (
            <SearchMind
                compKey="id"
                rowKey="id"
                ref={ref => { this.searchMind = ref }}
                fetch={this.query}
                onChoosed={this.handleChoose}
                onClear={this.handleClear}
                renderChoosedInputRaw={(row) => (
                    <div>{row.id} - {row.name}</div>
                )}
                pageSize={6}
                columns={[
                    {
                        title: '门店编号',
                        dataIndex: 'id',
                        width: 68
                    }, {
                        title: '门店名称',
                        dataIndex: 'name'
                    }
                ]}
            />
        );
    }
}

Stores.propTypes = {
    pubFetchValueList: PropTypes.func,
    onChange: PropTypes.func,
    api: PropTypes.string,
    value: PropTypes.objectOf(PropTypes.any)
}

Stores.defaultProps = {
    // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/store/getStoreInfo
    api: 'queryAreaStores'
}

export default Stores;
