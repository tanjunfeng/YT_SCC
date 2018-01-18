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
import Utils from '../../util/util';
import './SearchMind.scss';

@connect(() => ({}), dispatch => bindActionCreators({
    pubFetchValueList
}, dispatch))

class AreaGroup extends PureComponent {
    componentWillReceiveProps(nextProps) {
        if (this.props.value.areaGroupCode !== '' && nextProps.value.areaGroupCode === '') {
            this.searchMind.reset();
        }
        if (nextProps.value.reset && !this.props.value.reset) {
            this.handleClear();
        }
    }

    // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/prodSell/findCompanyBaseInfo
    query = params =>
        this.props.pubFetchValueList(Utils.removeInvalid({
            groupCodeOrName: params.value,
            pageNum: params.pagination.current || 1,
            pageSize: params.pagination.pageSize
        }), this.props.url)

    /**
     * 子公司-清除
     */
    handleClear = () => {
        this.searchMind.reset();
        this.props.onChange({ areaGroupCode: '', areaGroupName: '' });
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
                compKey="areaGroupCode"
                ref={ref => { this.searchMind = ref }}
                fetch={this.query}
                disabled={this.props.disabled}
                onChoosed={this.handleChoose}
                onClear={this.handleClear}
                renderChoosedInputRaw={(row) => (
                    <div>{row.areaGroupCode} - {row.areaGroupName}</div>
                )}
                pageSize={6}
                columns={[
                    {
                        title: '编码',
                        dataIndex: 'areaGroupCode',
                        width: 78
                    }, {
                        title: '区域组名称',
                        dataIndex: 'areaGroupName'
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
    value: PropTypes.objectOf(PropTypes.any)
}

AreaGroup.defaultProps = {
    url: 'queryAreaGroupList'
}


export default AreaGroup;
