/**
 * 根据子公司id或者名字查询子公司信息
 *
 * @author liujinyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { queryBranchCompanyInfo } from '../../../../actions/wap';
import SearchMind from '../../../../components/searchMind';

// @connect(() => ({}), dispatch => bindActionCreators({
//     pubFetchValueList
// }, dispatch))

class Subsidiary extends PureComponent {
    componentWillReceiveProps(nextProps) {
        if (nextProps.value.id === '') {
            this.defaultValue = '';
            this.searchMind.reset();
        }
    }

    defaultValue = '';

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
                defaultValue={this.defaultValue}
                ref={ref => { this.searchMind = ref }}
                fetch={(params) =>
                    // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/prodSell/findCompanyBaseInfo
                    this.props.queryBranchCompanyInfo({
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

Subsidiary.propTypes = {
    disabled: PropTypes.bool,
    pubFetchValueList: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.objectOf(PropTypes.any)
}

export default Subsidiary;
