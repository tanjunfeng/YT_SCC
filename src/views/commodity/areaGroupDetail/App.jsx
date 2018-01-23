/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 区域组详情
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Row, Col, Button } from 'antd';

import {
    getAreaGroup, clearAreaGroup, getGroupedStores, clearGroupedStores
} from '../../../actions/commodity';
import StoresForm from './storesForm';
import { PAGE_SIZE } from '../../../constant/index';

const FormItem = Form.Item;

@connect(state => ({
    areaGroup: state.toJS().commodity.areaGroup,
    groupedStores: state.toJS().commodity.groupedStores,
}), dispatch => bindActionCreators({
    getAreaGroup, clearAreaGroup, getGroupedStores, clearGroupedStores
}, dispatch))

class AreaGroupDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            groupedStoreId: '',
            selectedGroupedStores: [],  // 选中的已有门店索引列表
            selectedFreeStores: [], // 已选中的未分组门店索引列表
        };
        this.areaGroupId = this.props.match.params.id; // 区域组编号
        this.branchCompanyId = ''; // 分公司编号
        // 已存在的门店列表查询条件
        this.paramsGrouped = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        };
        this.currentGrouped = 1;
    }

    componentWillMount() {
        this.props.clearAreaGroup();
        this.props.clearGroupedStores();
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.getAreaGroup({
            areaGroupIdOrName: id
        }).then(() => {
            this.queryGrouped();
        }).catch(() => {});
    }

    /**
     * 已分组的门店列表
     */
    getGroupedStoresValues = () => {
        const { groupedStores } = this.props;
        const { records, pageNo, pageSize, totalCount } = groupedStores;
        const { selectedGroupedStores } = this.state;
        return ({
            title: '已有门店',
            records,
            selectedStores: selectedGroupedStores,
            pageNo,
            pageSize,
            totalCount,
            current: this.currentGrouped
        })
    }

    getFreeStoresValues = () => this.getGroupedStoresValues()

    queryGrouped = () => {
        this.props.getGroupedStores({
            ...this.paramsGrouped,
            areaGroupId: this.areaGroupId,
            branchCompanyId: this.branchCompanyId,
        });
    }

    handleGroupedFormSearch = params => {
        this.paramsGrouped = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            ...params
        };
    }

    renderTitle = info => {
        const data = info || {
            id: '',
            areaGroupName: '',
            branchCompanyId: '',
            branchCompanyName: ''
        }
        const {
            id, areaGroupName, branchCompanyId, branchCompanyName
        } = data;
        this.branchCompanyId = branchCompanyId;
        return (
            <Form layout="inline">
                <Row>
                    <Col>
                        <FormItem label="区域组">
                            {`${id} - ${areaGroupName}`}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="所属子公司">
                            {`${branchCompanyId} - ${branchCompanyName}`}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }

    renderButtonGroup = () => (
        <div className="col-center">
            <Button type="primary" size="default" onClick={this.handleAddAll}>
                &lt;&lt; 添加查询结果
            </Button>
            <Button type="primary" size="default" onClick={this.handleAddSelected}>
                &lt;&nbsp; 添加所选门店
            </Button>
            <Button type="danger" size="default" onClick={this.handleDelSelected}>
                删除所选门店 &nbsp;&gt;
            </Button>
            <Button type="danger" size="default" onClick={this.handleDelAll}>
                删除查询结果 &gt;&gt;
            </Button>
        </div>
    )

    render() {
        const { areaGroup } = this.props;
        return (
            <div className="area-group-detail">
                {this.renderTitle(areaGroup.records[0])}
                <div className="shuttle-form">
                    <StoresForm
                        value={this.getGroupedStoresValues()}
                        onSearch={this.handleGroupedFormSearch}
                    />
                    {this.renderButtonGroup()}
                    <StoresForm
                        value={this.getFreeStoresValues()}
                    />
                </div>
            </div>
        );
    }
}

AreaGroupDetail.propTypes = {
    clearAreaGroup: PropTypes.func,
    getAreaGroup: PropTypes.func,
    clearGroupedStores: PropTypes.func,
    getGroupedStores: PropTypes.func,
    groupedStores: PropTypes.objectOf(PropTypes.any),
    areaGroup: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(AreaGroupDetail));
