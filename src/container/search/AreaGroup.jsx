/**
 * 查询可选区域组
 *
 * @author taoqiyu
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

class AreaGroup extends PureComponent {
    componentWillReceiveProps(nextProps) {
        if (this.props.value.id !== '' && nextProps.value.id === '') {
            this.searchMind.reset();
        }
        if (nextProps.value.reset && !this.props.value.reset) {
            this.handleClear();
        }
    }

    // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/prodSell/findCompanyBaseInfo
    query = params =>
        this.props.pubFetchValueList({
            branchCompanyId: !(isNaN(parseFloat(params.value))) ? params.value : '',
            branchCompanyName: isNaN(parseFloat(params.value)) ? params.value : '',
            productId: this.props.value.id || ''
        }, this.props.url)

    /**
     * 子公司-清除
     */
    handleClear = () => {
        this.searchMind.reset();
        this.props.onChange({ id: '', name: '' });
    }

    /**
     * 子公司-值清单
     */
    handleChoose = ({ record }) => {
        this.props.onChange(record);
    }

    render() {
        return (
            <SearchMind
                compKey="spId"
                ref={ref => { this.searchMind = ref }}
                fetch={this.query}
                disabled={this.props.disabled}
                onChoosed={this.handleChoose}
                onClear={this.handleClear}
                renderChoosedInputRaw={(row) => (
                    <div>{row.id} - {row.name}</div>
                )}
                pageSize={6}
                columns={[
                    {
                        title: '子公司id',
                        dataIndex: 'id',
                        width: 68
                    }, {
                        title: '子公司名字',
                        dataIndex: 'name'
                    }
                ]}
            />
        );
    }

}

AreaGroup.propTypes = {
    disabled: PropTypes.bool,
    url: PropTypes.string,
    pubFetchValueList: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.objectOf(PropTypes.any),
    values: PropTypes.objectOf(PropTypes.any)
}

AreaGroup.defaultProps = {
    url: 'findCompanyBaseInfo'
}


export default AreaGroup;
