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
        return (
            <SearchMind
                compKey="spId"
                ref={ref => { this.searchMind = ref }}
                fetch={(params) =>
                    // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/prodSell/findCompanyBaseInfo
                    this.props.pubFetchValueList({
                        branchCompanyId: !(isNaN(parseFloat(params.value))) ? params.value : '',
                        branchCompanyName: isNaN(parseFloat(params.value)) ? params.value : ''
                    }, 'findCompanyBaseInfo')
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
    pubFetchValueList: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.objectOf(PropTypes.any)
}

export default BranchCompany;
