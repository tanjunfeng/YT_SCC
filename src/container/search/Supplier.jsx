/**
 * 查询可选供应商清单
 *
 * @author wuxinwei
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

class Supplier extends PureComponent {
    componentWillReceiveProps(nextProps) {
        const { spId } = nextProps.value;
        if (this.props.value.spId !== '' && spId === '') {
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
        this.props.onChange({ spId: '', spNo: '', companyName: '' });
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
                style={{ zIndex: 10000 }}
                compKey="spId"
                ref={ref => { this.searchMind = ref }}
                fetch={(params) =>
                    // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/supplier/supplierSearchBox
                    this.props.pubFetchValueList({
                        condition: params.value,
                        pageNum: params.pagination.current || 1,
                        pageSize: params.pagination.pageSize
                    }, 'querySuppliersList')
                }
                disabled={this.props.disabled}
                defaultValue={this.props.initialValue}
                addonBefore=""
                onChoosed={this.handleChoose}
                onClear={this.handleClear}
                renderChoosedInputRaw={(data) => (
                    <div>{data.spNo} - {data.companyName}</div>
                )}
                rowKey="spId"
                pageSize={5}
                columns={[
                    {
                        title: '供应商编号',
                        dataIndex: 'spNo',
                        width: 76
                    }, {
                        title: '供应商名称',
                        dataIndex: 'companyName',
                    }
                ]}
            />
        );
    }
}

Supplier.propTypes = {
    disabled: PropTypes.bool,
    pubFetchValueList: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.objectOf(PropTypes.any),
    initialValue: PropTypes.string
}

export default Supplier;
