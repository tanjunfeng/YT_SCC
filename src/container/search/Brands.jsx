/**
 * 查询品牌
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

class Brands extends PureComponent {
    componentWillReceiveProps(nextProps) {
        const { id } = nextProps.value;
        if (this.props.value.id !== '' && id === '') {
            this.brandSearchMind.reset();
        }
        if (nextProps.value.reset && !this.props.value.reset) {
            this.handleClear();
        }
    }

    /**
     * 清除
     */
    handleClear = () => {
        console.log('ok.....');
        this.brandSearchMind.reset();
        this.props.onChange({ id: '', name: '' });
    }

    /**
     * 值清单
     */
    handleChoose = (val) => {
        this.props.onChange(val);
    }

    query = (param) => {
        const conditions = {
            name: param.value,
            pageSize: param.pagination.pageSize,
            pageNum: param.pagination.current || 1
        };
        return this.props.pubFetchValueList(Utils.removeInvalid(conditions), 'queryBrandsByPages');
    }

    render() {
        const { zIndex = 1000 } = this.props;
        return (
            <SearchMind
                style={{ zIndex }}
                compKey="id"
                ref={ref => { this.brandSearchMind = ref }}
                disabled={this.props.disabled}
                fetch={ this.query }
                defaultValue={this.props.initialValue}
                rowKey="id"
                onChoosed={this.handleChoose}
                onClear={this.handleClear}
                renderChoosedInputRaw={(brandData) => (
                    <div>{brandData.id}-{brandData.name}</div>
                )}
                pageSize={5}
                columns={[
                    {
                        title: 'id',
                        dataIndex: 'id',
                        width: 98
                    }, {
                        title: '名称',
                        dataIndex: 'name',
                        width: 140
                    }
                ]}
            />
        );
    }
}

Brands.propTypes = {
    disabled: PropTypes.bool,
    pubFetchValueList: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.objectOf(PropTypes.any),
    initialValue: PropTypes.string,
    zIndex: PropTypes.number
};

export default Brands;
