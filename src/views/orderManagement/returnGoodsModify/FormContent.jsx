import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Select, DatePicker, Input } from 'antd';
import SearchMind from '../../../components/searchMind';
import {
    pubFetchValueList,
} from '../../../actions/pub';

const Option = Select.Option;
const { TextArea } = Input;

@connect(
    state => ({}),
    dispatch => bindActionCreators({
        pubFetchValueList,
    }, dispatch)
)
class FormContent extends PureComponent {
    static propTypes = {
        prefixCls: PropTypes.string,
        match: PropTypes.objectOf(PropTypes.any),
        pubFetchValueList: PropTypes.func,
    }

    static defaultProps = {
        prefixCls: 'return-goods-top'
    }

    constructor(props) {
        super(props);

        const { match } = this.props;
        const { params } = match;

        if (params.id) {
            this.type = 'edit';
        } else {
            this.type = 'new';
        }

        this.state = {
            locDisabled: true
        }
    }

    componentDidMount() {

    }

    handleSupplyChoose = () => {

    }

    handleSupplyClear = () => {

    }

    handleAdressChoose = () => {

    }

    handleSupplyClear = () => {

    }

    handleTypeChange = () => {

    }

    handleTimeChange = () => {

    }

    handleGetAddressMap = (param) => {
        const { locTypeCode } = this.props.form.getFieldsValue(['locTypeCode'])
        const libraryCode = '0';
        const storeCode = '1';
        let locationTypeParam = '';
        if (locTypeCode === libraryCode) {
            locationTypeParam = 'getWarehouseInfo1';
            this.setState({
                locationData: {
                    code: 'warehouseCode',
                    name: 'warehouseName'
                }
            })
        }
        if (locTypeCode === storeCode) {
            locationTypeParam = 'getStoreInfo';
            this.setState({
                locationData: {
                    code: 'id',
                    name: 'name'
                }
            })
        }
        return this.props.pubFetchValueList({
            param: param.value,
            pageNum: param.pagination.current || 1,
            pageSize: param.pagination.pageSize
        }, locationTypeParam);
    }

    render() {
        const { prefixCls } = this.props;

        const cls = classnames(
            `${prefixCls}-modify`,
            {
                [`${prefixCls}-modify-${this.type}`]: this.type
            }
        )

        return (
            <div
                className={cls}
            >
                <Row>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            退货单号
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            1709120001
                        </span>
                    </Col>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            供应商
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            <SearchMind
                                compKey="search-mind-supply1"
                                ref={ref => { this.supplySearchMind = ref }}
                                fetch={(params) => this.props.pubFetchValueList({
                                    condition: params.value,
                                    pageSize: params.pagination.pageSize,
                                    pageNum: params.pagination.current || 1
                                }, 'supplierSearchBox')}
                                onChoosed={this.handleSupplyChoose}
                                onClear={this.handleSupplyClear}
                                renderChoosedInputRaw={(data) => (
                                    <div>{data.spNo} - {data.companyName}</div>
                                )}
                                pageSize={6}
                                columns={[
                                    {
                                        title: '供应商编码',
                                        dataIndex: 'spNo',
                                        width: 98
                                    }, {
                                        title: '供应商名称',
                                        dataIndex: 'companyName',
                                        width: 140
                                    }
                                ]}
                            />
                        </span>
                    </Col>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            供应商
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            <SearchMind
                                compKey="search-mind-supply2"
                                ref={ref => { this.addressSearchMind = ref }}
                                fetch={(params) => this.props.pubFetchValueList({
                                    condition: params.value,
                                    pageSize: params.pagination.pageSize,
                                    pageNum: params.pagination.current || 1
                                }, 'supplierAdrSearchBox')}
                                onChoosed={this.handleAdressChoose}
                                onClear={this.handleAdressClear}
                                renderChoosedInputRaw={(data) => (
                                    <div>{data.providerNo} - {data.providerName}</div>
                                )}
                                pageSize={6}
                                columns={[
                                    {
                                        title: '供应商地点编码',
                                        dataIndex: 'providerNo',
                                        width: 98
                                    }, {
                                        title: '供应商地点名称',
                                        dataIndex: 'providerName'
                                    }
                                ]}
                            />
                        </span>
                    </Col>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            状态
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            制单
                        </span>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            *退货地点类型
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            <Select
                                defaultValue="lucy"
                                style={{ width: 120 }}
                                onChange={this.handleTypeChange}
                            >
                                <Option value="jack">请选择</Option>
                                <Option value="lucy">仓库</Option>
                                <Option value="Yiminghe">门店</Option>
                            </Select>
                        </span>
                    </Col>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            *退货地点
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            <SearchMind
                                style={{ zIndex: 101 }}
                                compKey="comPoAddress"
                                ref={ref => { this.poAddress = ref }}
                                onClear={this.handleAddressClear}
                                fetch={this.handleGetAddressMap}
                                onChoosed={this.handleAddressChoose}
                                renderChoosedInputRaw={(row) => (
                                    <div>
                                        {row[this.state.locationData.code]}
                                        - {row[this.state.locationData.name]
                                        }
                                    </div>
                                )}
                                disabled={this.state.locDisabled}
                                pageSize={6}
                                columns={[
                                    {
                                        title: '编码',
                                        width: 80
                                    }, {
                                        title: '名称',
                                    }
                                ]}
                            />
                        </span>
                    </Col>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            退货日期早于
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            <DatePicker onChange={this.handleTimeChange} />
                        </span>
                    </Col>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            货币类型
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            <Select
                                defaultValue="lucy"
                                style={{ width: 120 }}
                                onChange={this.handleTypeChange}
                            >
                                <Option value="jack">CNY</Option>
                            </Select>
                        </span>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            创建人
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            李云
                        </span>
                    </Col>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            创建日期
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            2017-07-02
                        </span>
                    </Col>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            审核人
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            李云
                        </span>
                    </Col>
                    <Col span={6}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            退货日期
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            123123123
                        </span>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <span
                            className={`${prefixCls}-modify-item-left`}
                        >
                            备注
                        </span>
                        <span
                            className={`${prefixCls}-modify-item-right`}
                        >
                            <TextArea placeholder="请填写备注" autosize />
                        </span>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default withRouter(FormContent)
