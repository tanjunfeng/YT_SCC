/**
 * 查询可选加盟商值清单
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

class Franchisee extends PureComponent {
    componentWillReceiveProps(nextProps) {
        if (nextProps.value.franchiseeId === '') {
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
        this.props.onChange({ franchiseeId: '', franchiseeName: '' });
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
                rowKey="franchiseeId"
                compKey="search-mind-joining"
                defaultValue={this.defaultValue}
                disabled={this.props.disabled}
                ref={ref => { this.searchMind = ref }}
                fetch={(params) =>
                    this.props.pubFetchValueList({
                        param: params.value,
                        pageNum: params.pagination.current || 1,
                        pageSize: params.pagination.pageSize
                    }, 'getFranchiseeInfo')
                }
                onChoosed={this.handleChoose}
                onClear={this.handleClear}
                renderChoosedInputRaw={(row) => (
                    <div>
                        {row.franchiseeId} - {row.franchiseeName}
                    </div>
                )}
                pageSize={6}
                columns={[
                    {
                        title: '加盟商id',
                        dataIndex: 'franchiseeId',
                        width: 98
                    }, {
                        title: '加盟商名字',
                        dataIndex: 'franchiseeName',
                        width: 140
                    }
                ]}
            />
        );
    }
}

Franchisee.propTypes = {
    disabled: PropTypes.bool,
    pubFetchValueList: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.objectOf(PropTypes.any)
}

export default Franchisee;
