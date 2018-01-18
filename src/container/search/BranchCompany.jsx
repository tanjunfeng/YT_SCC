/**
 * 查询可选子公司值清单
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

class BranchCompany extends PureComponent {
    componentWillReceiveProps(nextProps) {
        if (this.props.value.id !== '' && nextProps.value.id === '') {
            this.searchMind.reset();
        }
        if (nextProps.value.reset && !this.props.value.reset) {
            this.handleClear();
        }
    }

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
        const { url, values = {} } = this.props;
        const { id } = values;
        return (
            <SearchMind
                compKey="id"
                rowKey="id"
                ref={ref => { this.searchMind = ref }}
                fetch={(params) =>
                    // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/prodSell/findCompanyBaseInfo
                    this.props.pubFetchValueList({
                        branchCompanyId: !(isNaN(parseFloat(params.value))) ? params.value : '',
                        branchCompanyName: isNaN(parseFloat(params.value)) ? params.value : '',
                        productId: id || ''
                    }, url)
                }
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

BranchCompany.propTypes = {
    disabled: PropTypes.bool,
    url: PropTypes.string,
    pubFetchValueList: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.objectOf(PropTypes.any),
    values: PropTypes.objectOf(PropTypes.any)
}

BranchCompany.defaultProps = {
    url: 'findCompanyBaseInfo',
    disabled: false
}


export default BranchCompany;
