/*
 * @Author: tanjf
 * @Description: 上线弹窗
 * @CreateDate: 2017-10-16 17:32:20
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-10-16 17:32:20
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Modal, Form, message } from 'antd';
import SearchMind from '../../../../components/searchMind';
import { pubFetchValueList } from '../../../../actions/pub';
import { PAGE_SIZE } from '../../../../constant';
import Utils from '../../../../util/util';
import {
    queryAliveCouponsList,
    clearCouponsList
} from '../../../../actions/promotion';

const FormItem = Form.Item;

@connect(state => ({
    couponsList: state.toJS().promotion.couponsList
}), dispatch => bindActionCreators({
    queryAliveCouponsList,
    clearCouponsList,
    pubFetchValueList
}, dispatch))

class ModalOnline extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            promoIds: [],
            modalOnlineVisible: false,
            warehouseCode: '',
            warehouseName: ''
        };
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            current: 1
        };
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value === '') {
            this.joiningSearchMind.reset();
        }
    }

    getFormData() {
        return Utils.removeInvalid({
            warehouseCode: this.state.warehouseCode,
            warehouseName: this.state.warehouseName,
        });
    }

    handleOk() {
        if (this.state.warehouseCode === '') {
            message.error('请选择至少一个送货仓');
        } else {
            this.props.onOk(this.getFormData());
        }
    }

    handleCancel() {
        this.props.onCancel();
    }

    /**
     * 送货仓-值清单
     */
    handleJoiningChoose = ({ record }) => {
        this.setState({
            warehouseCode: record.warehouseCode,
            warehouseName: record.warehouseName,
        });
    }

    /**
     * 送货仓-清除
     */
    handleJoiningClear() {
        this.setState({
            warehouseCode: '',
            warehouseName: '',
        });
        this.searchMind.reset();
        this.props.onSubCompaniesClear();
    }

    render() {
        return (
            <Modal
                title="选择仓"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <FormItem>
                    <span>送货仓：</span>
                    <span>
                        <SearchMind
                            rowKey="franchiseeId"
                            compKey="search-mind-joining"
                            ref={ref => { this.joiningSearchMind = ref }}
                            fetch={(params) =>
                                this.props.pubFetchValueList({
                                    param: params.value,
                                    pageNum: params.pagination.current || 1,
                                    pageSize: params.pagination.pageSize
                                }, 'getWarehouseInfo1')
                            }
                            onChoosed={this.handleJoiningChoose}
                            onClear={this.handleJoiningClear}
                            renderChoosedInputRaw={(row) => (
                                <div>
                                    {row.warehouseCode} - {row.warehouseName}
                                </div>
                            )}
                            pageSize={6}
                            columns={[
                                {
                                    title: '仓库编码',
                                    dataIndex: 'warehouseCode',
                                    width: 150,
                                }, {
                                    title: '仓库名称',
                                    dataIndex: 'warehouseName',
                                    width: 200,
                                }
                            ]}
                        />
                    </span>
                </FormItem>
            </Modal>
        );
    }
}

ModalOnline.propTypes = {
    visible: PropTypes.bool,
    pubFetchValueList: PropTypes.func,
    value: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    onSubCompaniesClear: PropTypes.func,
}

export default withRouter(Form.create()(ModalOnline));
