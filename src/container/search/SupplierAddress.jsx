/**
 * 查询供应商地点
 *
 * @author liujinyu
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

class SupplierAdderss extends PureComponent {
    componentWillReceiveProps(nextProps) {
        const { providerNo } = nextProps.value;
        if (this.props.value.providerNo !== '' && providerNo === '') {
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
        this.props.onChange({ providerNo: '', providerName: '' });
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
                compKey="providerNo"
                ref={ref => { this.searchMind = ref }}
                fetch={(params) =>
                    this.props.pubFetchValueList({
                        condition: params.value,
                        pageNum: params.pagination.current || 1,
                        pageSize: params.pagination.pageSize
                    }, 'supplierAdrSearchBox')
                }
                disabled={this.props.disabled}
                defaultValue={this.props.initialValue}
                addonBefore=""
                onChoosed={this.handleChoose}
                onClear={this.handleClear}
                renderChoosedInputRaw={(data) => (
                    <div>{data.providerNo} - {data.providerName}</div>
                )}
                rowKey="providerNo"
                pageSize={5}
                columns={[
                    {
                        title: '供应商地点编码',
                        dataIndex: 'providerNo',
                        width: 76
                    }, {
                        title: '供应商地点名称',
                        dataIndex: 'providerName',
                    }
                ]}
            />
        );
    }
}

SupplierAdderss.propTypes = {
    disabled: PropTypes.bool,
    pubFetchValueList: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.objectOf(PropTypes.any),
    initialValue: PropTypes.string
}

export default SupplierAdderss;
