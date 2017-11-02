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
import './BranchCompany.scss';

@connect(() => ({}), dispatch => bindActionCreators({
    pubFetchValueList
}, dispatch))

class BranchCompany extends PureComponent {
    componentWillReceiveProps(nextProps) {
        console.log(nextProps.value);
        if (nextProps.value === null) {
            this.defaultValue = '';
            this.searchMind.reset();
        }
        if (nextProps.value && nextProps.value.id) {
            this.defaultValue = `${nextProps.value.id} - ${nextProps.value.name}`
        }
    }

    defaultValue = '';

    /**
     * 子公司-清除
     */
    handleSubCompanyClear = () => {
        this.searchMind.reset();
        this.props.onChange(null);
    }

    /**
     * 子公司-值清单
     */
    handleSubCompanyChoose = ({ record }) => {
        this.props.onChange(record);
    }

    render() {
        return (
            <SearchMind
                compKey="spId"
                defaultValue={this.defaultValue}
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
