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
    getAreaGroup,
    clearAreaGroup,
    getGroupedStores,
    clearGroupedStores,
    getFreeStores,
    clearFreeStores,
    insertStoreToGroup,
    deleteStoreFromArea
} from '../../../actions/commodity';
import StoresForm from './storesForm';
import { PAGE_SIZE } from '../../../constant/index';

const FormItem = Form.Item;

@connect(state => ({
    areaGroup: state.toJS().commodity.areaGroup,
    groupedStores: state.toJS().commodity.groupedStores,
    freeStores: state.toJS().commodity.groupedStores
}), dispatch => bindActionCreators({
    getAreaGroup,
    clearAreaGroup,
    getGroupedStores,
    clearGroupedStores,
    getFreeStores,
    clearFreeStores,
    insertStoreToGroup,
    deleteStoreFromArea
}, dispatch))

class AreaGroupDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedGroupedStores: [],  // 选中的已有门店索引列表
            selectedFreeStores: [], // 已选中的未分组门店索引列表
        };
        this.areaGroupId = this.props.match.params.id; // 区域组编号
        this.areaGroupName = ''
        this.branchCompanyId = ''; // 分公司编号
        // 已存在的门店列表查询条件
        this.paramsGrouped = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        };
        // 未分组的门店列表查询条件
        this.paramsFree = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        };
        this.currentGrouped = 1;
        this.currentFree = 1;
    }

    componentWillMount() {
        this.props.clearAreaGroup();
        this.props.clearGroupedStores();
        this.props.clearFreeStores();
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.getAreaGroup({
            areaGroupIdOrName: id
        }).then(() => {
            this.freshData();
        });
    }

    /**
     * 已分组的门店列表显示参数
     */
    getGroupedStoresValues = () => {
        const { groupedStores } = this.props;
<<<<<<< HEAD
        const { records, pageNo, pageSize, totalCount } = groupedStores;
        const { selectedGroupedStores } = this.state;
        return ({
            title: '已有门店',
            records,
            selectedStores: selectedGroupedStores,
            pageNo,
=======
        const { data, pageNum, pageSize, totalCount } = groupedStores;
        const { selectedGroupedStores } = this.state;
        return ({
            title: '已有门店',
            data,
            selectedStores: selectedGroupedStores,
            pageNum,
>>>>>>> 57eba3bbd6776bd362442f9b7d04198c6f83d02a
            pageSize,
            totalCount,
            current: this.currentGrouped
        })
    }

    /**
     * 未分组门店列表显示参数
     */
    getFreeStoresValues = () => {
        const { freeStores } = this.props;
<<<<<<< HEAD
        const { records, pageNo, pageSize, totalCount } = freeStores;
        const { selectedFreeStores } = this.state;
        return ({
            title: '未分组门店',
            records,
            selectedStores: selectedFreeStores,
            pageNo,
=======
        const { data, pageNum, pageSize, totalCount } = freeStores;
        const { selectedFreeStores } = this.state;
        return ({
            title: '未分组门店',
            data,
            selectedStores: selectedFreeStores,
            pageNum,
>>>>>>> 57eba3bbd6776bd362442f9b7d04198c6f83d02a
            pageSize,
            totalCount,
            current: this.currentFree
        })
    }

    /**
     * 同时刷新左右两个页面
     */
    freshData = () => {
<<<<<<< HEAD
        this.props.clearGroupedStores();
        this.props.clearFreeStores();
=======
        // this.props.clearGroupedStores();
        // this.props.clearFreeStores();
>>>>>>> 57eba3bbd6776bd362442f9b7d04198c6f83d02a
        this.queryGrouped();
        this.queryFree();
    }

    /**
     * 查询已有门店列表
     */
    queryGrouped = () => {
        // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/areaGroup/queryStoresFromGroup
        this.props.getGroupedStores({
            ...this.paramsGrouped,
            areaGroupId: this.areaGroupId,
            branchCompanyId: this.branchCompanyId,
        });
    }

    /**
     * 查询未分组门店列表
     */
    queryFree = () => {
        // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/areaGroup/queryStoresFromGroup
        this.props.getFreeStores({
            ...this.paramsFree,
            branchCompanyId: this.branchCompanyId,
        });
    }

    handleGroupedSearch = params => {
        this.handleGroupedReset();
        Object.assign(this.paramsGrouped, {
            ...params
        });
        this.queryGrouped();
    }

    handleFreeSearch = params => {
        this.handleFreeReset();
        Object.assign(this.paramsFree, {
            ...params
        });
        this.queryFree();
    }

    handleGroupedSelected = selectedStores => {
        this.setState({ selectedGroupedStores: selectedStores });
    }

    handleFreeSelected = selectedStores => {
        this.setState({ selectedFreeStores: selectedStores });
    }

    handleGroupedReset = () => {
        this.paramsGrouped = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        };
        this.currentGrouped = 1;
    }

    handleFreeReset = () => {
        this.paramsFree = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        };
        this.currentFree = 1;
    }

    /**
     * 添加所选门店到指定区域组
     */
    handleAddSelected = () => {
        const { areaGroupId, areaGroupName, state } = this;
        const { selectedFreeStores } = state;
        this.props.insertStoreToGroup({
            areaGroupId,
            areaGroupName,
            storeIds: selectedFreeStores.join(',')
        }).then(() => {
            this.setState({ selectedFreeStores: [] });
            this.freshData();
        })
    }

    /**
     * 从当前区域组删除所选门店
     */
    handleDelSelected = () => {
        const { selectedGroupedStores } = this.state;
        this.props.deleteStoreFromArea({
            storeIds: selectedGroupedStores.join(',')
        }).then(() => {
            this.setState({ selectedGroupedStores: [] });
            this.freshData();
        })
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
        this.areaGroupName = areaGroupName;
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
            <Button
                type="primary"
                size="default"
                disabled={this.state.selectedFreeStores.length === 0}
                onClick={this.handleAddSelected}
            >
                &lt;&nbsp; 添加所选门店
            </Button>
            <Button
                type="danger"
                size="default"
                disabled={this.state.selectedGroupedStores.length === 0}
                onClick={this.handleDelSelected}
            >
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
<<<<<<< HEAD
                {this.renderTitle(areaGroup.records[0])}
=======
                {this.renderTitle(areaGroup.data[0])}
>>>>>>> 57eba3bbd6776bd362442f9b7d04198c6f83d02a
                <div className="shuttle-form">
                    <StoresForm
                        value={this.getGroupedStoresValues()}
                        onSearch={this.handleGroupedSearch}
                        onSelect={this.handleGroupedSelected}
                        onReset={this.handleGroupedReset}
                    />
                    {this.renderButtonGroup()}
                    <StoresForm
                        value={this.getFreeStoresValues()}
                        onSearch={this.handleFreeSearch}
                        onSelect={this.handleFreeSelected}
                        onReset={this.handleFreeReset}
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
    clearFreeStores: PropTypes.func,
    getFreeStores: PropTypes.func,
    insertStoreToGroup: PropTypes.func,
    deleteStoreFromArea: PropTypes.func,
    groupedStores: PropTypes.objectOf(PropTypes.any),
    freeStores: PropTypes.objectOf(PropTypes.any),
    areaGroup: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(AreaGroupDetail));
