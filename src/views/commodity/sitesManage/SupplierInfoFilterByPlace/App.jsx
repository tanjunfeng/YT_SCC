/**
 * 根据地点查询可选供应商或者供应商地点清单
 *
 * @author zhoucl
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pubFetchValueList } from '../../../../actions/pub';
import SearchMind from '../../../../components/searchMind';
import './SearchMind.scss';

const coumnsFields = {
    1: [
        {
            title: '供应商编号',
            dataIndex: 'spNo',
            width: 76
        }, {
            title: '供应商名称',
            dataIndex: 'companyName',
        }
    ],
    2: [
        {
            title: '供应商地点编码',
            dataIndex: 'providerNo',
            width: 76
        }, {
            title: '供应商地点名称',
            dataIndex: 'providerName',
        }
    ]
};

@connect(() => ({}), dispatch => bindActionCreators({
    pubFetchValueList
}, dispatch))

class SupplierInfo extends PureComponent {
    componentWillReceiveProps(nextProps) {
        const fieldName = this.props.queryType === '1' ? 'spId' : 'providerNo';
        const { [fieldName]: id } = nextProps.value;
        if (this.props.value[fieldName] !== '' && id === '') {
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
        let initialValue = null;
        if (this.props.queryType === '1') {
            initialValue = { spId: '', spNo: '', companyName: '' };
        } else {
            initialValue = { providerNo: '', providerName: '' };
        }
        this.props.onChange(initialValue);
    }

    /**
     * 子公司-值清单
     */
    handleChoose = ({ record }) => {
        this.props.onChange(record);
    }

    render() {
        const { queryType, selectedPlace } = this.props;
        const compKey = queryType === '1' ? 'spId' : 'providerNo';
        return (
            <SearchMind
                style={{ zIndex: this.props.zIndex }}
                compKey={compKey}
                ref={ref => { this.searchMind = ref }}
                fetch={(params) =>
                    this.props.pubFetchValueList({
                        condition: params.value,
                        queryType,
                        pageNum: params.pagination.current || 1,
                        pageSize: params.pagination.pageSize,
                        ...selectedPlace
                    }, 'filterSupplyInfo')
                }
                defaultRaw={this.props.defaultRaw}
                disabled={this.props.disabled}
                defaultValue={this.props.initialValue}
                addonBefore=""
                onChoosed={this.handleChoose}
                onClear={this.handleClear}
                renderChoosedInputRaw={data => (queryType === '1' ? (<div>{data.spNo} - {data.companyName}</div>) :
                (<div>{data.providerNo} - {data.providerName}</div>))}
                rowKey={compKey}
                pageSize={5}
                columns={coumnsFields[queryType]}
            />
        );
    }
}

SupplierInfo.propTypes = {
    disabled: PropTypes.bool,
    pubFetchValueList: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.objectOf(PropTypes.any),
    initialValue: PropTypes.string,
    selectedPlace: PropTypes.objectOf(PropTypes.any),
    queryType: PropTypes.string,
    defaultRaw: PropTypes.objectOf(PropTypes.any),
    zIndex: PropTypes.number
};

SupplierInfo.defaultProps = {
    zIndex: 1000,
    defaultRaw: null,
    queryType: '1',
    selectedPlace: {}
};

export default SupplierInfo;
