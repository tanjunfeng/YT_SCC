/**
 * 查询地点
 *
 * @author zhouchanglong
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

class Sites extends PureComponent {
    state = {
        loactionColumn: {
            code: '',
            name: ''
        }
    }
    componentWillReceiveProps(nextProps) {
        const { siteTypeCode, placeFieldMap } = this.props;
        /**
         * placeField为选择具体地点类型时，地点的id字段
        */
        const placeField = [placeFieldMap[siteTypeCode]];
        const { [placeField]: id } = nextProps.value;
        if (this.props.value[placeField] !== '' &&  id === '') {
            this.siteSearchMind.reset();
        }
        if (nextProps.value.reset && !this.props.value.reset) {
            this.handleClear();
        }
    }

    /**
     * 获取地点查询类型
    */
    getSiteQueryType = siteTypeCode => {
        let SiteQueryType = '';
        if (siteTypeCode == '1') {
            SiteQueryType = 'findCompanyBaseInfo';
            this.setState({
                loactionColumn: {
                    code: 'id',
                    name: 'name'
                }
            });
        }

        if (siteTypeCode == '2') {
            SiteQueryType = 'queryAreaGroupList';
            this.setState({
                loactionColumn: {
                    code: 'areaGroupCode',
                    name: 'areaGroupName'
                }
            });
        }

        if (siteTypeCode == '3') {
            SiteQueryType = 'getStoreInfo';
            this.setState({
                loactionColumn: {
                    code: 'id',
                    name: 'name'
                }
            });
        }
        return SiteQueryType;
    }

    /**
     * 清除
    */
    handleClear = () => {
        const { loactionColumn: { code, name} } = this.state;
        this.siteSearchMind.reset();
        this.props.onChange({ [code]: '', [name]: '' });
    }

    /**
    * 值清单
    */
    handleChoose = (val) => {
        this.props.onChange(val);
    }

    query = (params) => {
        const { siteTypeCode, branchCompanyId = '' } = this.props;
        const conditions = {
            param: params.value,
            branchCompanyId,
            pageNum: params.pagination.current || 1,
            pageSize: params.pagination.pageSize
        };
        return this.props.pubFetchValueList(
            Utils.removeInvalid(conditions),
            this.getSiteQueryType(siteTypeCode)
        );
    }

    render() {
        const { loactionColumn } = this.state;
        return (
            <SearchMind
                style={{ zIndex: this.props.zIndex }}
                compKey={loactionColumn.code}
                ref={ref => { this.siteSearchMind = ref }}
                fetch={this.query}
                disabled={this.props.disabled}
                defaultValue={this.props.initialValue}
                rowKey={loactionColumn.code}
                onChoosed={this.handleChoose}
                onClear={this.handleClear}
                renderChoosedInputRaw={(row) => (
                    <div>{row[loactionColumn.code]}-{row[loactionColumn.name]}</div>
                )}
                pageSize={6}
                columns={[
                    {
                        title: '编码',
                        dataIndex: loactionColumn.code,
                        width: 100,
                    }, {
                        title: '名字',
                        dataIndex: loactionColumn.name,
                        width: 120,
                    }
                ]}
            />
        );
    }
}

Sites.propTypes = {
    disabled: PropTypes.bool,
    pubFetchValueList: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.objectOf(PropTypes.any),
    initialValue: PropTypes.string,
    siteTypeCode: PropTypes.string,
    placeFieldMap: PropTypes.object
};

Sites.defaultProps = {
    siteTypeCode: '0',
    zIndex: 1000
};

export default Sites;
