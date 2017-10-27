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

@connect(() => ({}), dispatch => bindActionCreators({
    pubFetchValueList
}, dispatch))

class SubCompanies extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSubCompanyClear = this.handleSubCompanyClear.bind(this);
        this.handleSubCompanyChoose = this.handleSubCompanyChoose.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value === '') {
            this.searchMind.reset();
        }
    }

    /**
     * 子公司-清除
     */
    handleSubCompanyClear() {
        this.searchMind.reset();
        this.props.onSubCompaniesClear();
    }

    /**
     * 子公司-值清单
     */
    handleSubCompanyChoose = ({ record }) => {
        this.props.onSubCompaniesChooesd(record.id);
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
                onChoosed={this.handleSubCompanyChoose}
                onClear={this.handleSubCompanyClear}
                renderChoosedInputRaw={(row) => (
                    <div>{row.id} - {row.name}</div>
                )}
                pageSize={6}
                columns={[
                    {
                        title: '子公司id',
                        dataIndex: 'id',
                        width: 98
                    }, {
                        title: '子公司名字',
                        dataIndex: 'name'
                    }
                ]}
            />
        );
    }
}

SubCompanies.propTypes = {
    disabled: PropTypes.bool,
    pubFetchValueList: PropTypes.func,
    onSubCompaniesChooesd: PropTypes.func,
    onSubCompaniesClear: PropTypes.func,
    value: PropTypes.string
}

export default SubCompanies;
