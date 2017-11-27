/*
 * @Author: chenghaojie
 * @Description: 流程管理 - 流程列表
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Form, Button, Input } from 'antd';
import FlowChart from '../flowChart';
import UploadZip from './uploadZip';

import {
    queryProcessData,
    delectProcessData,
    clearProcessData,
    queryChartData,
    clearChartData
} from '../../../actions/process';

import { PAGE_SIZE } from '../../../constant';
import { processOverview, processDetails } from '../columns';

@connect(state => ({
    processData: state.toJS().process.processData,
    flowChartData: state.toJS().process.flowChartData
}), dispatch => bindActionCreators({
    queryProcessData,
    delectProcessData,
    clearProcessData,
    queryChartData,
    clearChartData
}, dispatch))

class processData extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            flowName: ''
        }
        this.param = {};
    }
    componentWillMount() {
        this.props.clearProcessData();
    }

    componentDidMount() {
        this.handleReset();
        this.query();
    }
    componentWillReceiveProps(nextProps) {


    }
    /**
     * 分页页码改变的回调
     */
    onPaginate = (pageNum) => {
        Object.assign(this.param, { pageNum, current: pageNum });
        this.query();
    }
    queryFlowChart = (id, imageName) => {
        this.props.clearChartData();
        this.props.queryChartData({deploymentId: id, imageName}).then(() => {
            this.showModal();
        });
    }
    delect = (id) => {
        this.props.delectProcessData({deploymentId: id}).then(() => {
            this.query();
        });
    }
    query = () => {
        this.props.queryProcessData(this.param)
    }
    handleReset = () => {
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        }
    }
    closeCanvas = () => {
        this.props.clearChartData();
        this.setState({
            visible: false
        });
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleChange = (e) => {
        this.setState({
            flowName: e.target.value
        })
    }
    /**
     * 表单操作删除表单
     * @param {Object} text 当前行的值
     * @param {object} record 单行数据
     */
    delectOperation = (text, record) => (
        <a
            onClick={() => { this.delect(record.id); }}
        >删除</a>
    )
    /**
     * 表单操作查看流程图
     * @param {Object} text 当前行的值
     * @param {object} record 单行数据
     */
    renderOperation = (text, record) => (
        <a
            onClick={() => { this.queryFlowChart(record.id, record.diagramResourceName); }}
        >查看流程图</a>
    )
    render() {
        const { flowName} = this.state;
        const deployProcessUrl = `${window.config.apiHost}/bpm/newdeploy`;
        const { deps, pros, total, pageNum, pageSize } = this.props.processData;
        processOverview[processOverview.length - 1].render = this.delectOperation;
        processDetails[processDetails.length - 1].render = this.renderOperation;
        return (
            <div className="processBox">
                <Table
                    dataSource={deps}
                    columns={processOverview}
                    rowKey="id"
                    scroll={{
                        x: 1400
                    }}
                    bordered
                    pagination={{
                        current: this.param.current,
                        pageNum,
                        pageSize,
                        total,
                        showQuickJumper: true,
                        onChange: this.onPaginate
                    }}
                />
                <Table
                    dataSource={pros}
                    columns={processDetails}
                    rowKey="id"
                    scroll={{
                        x: 1400
                    }}
                    pagination={{
                        current: this.param.current,
                        pageNum,
                        pageSize,
                        total,
                        showQuickJumper: true,
                        onChange: this.onPaginate
                    }}
                />
                <Input size="small" placeholder="流程名称" onChange={this.handleChange} />
                <UploadZip flowName={flowName} url={deployProcessUrl} />
                <FlowChart data={this.props.flowChartData} >
                    <Button type="primary" shape="circle" icon="close" className="closeBtn" onClick={this.closeCanvas} />
                </FlowChart>
            </div>
        );
    }
}

processData.propTypes = {
    queryProcessData: PropTypes.func,
    delectProcessData: PropTypes.func,
    clearProcessData: PropTypes.func,
    queryChartData: PropTypes.func,
    clearChartData: PropTypes.func,
    processData: PropTypes.objectOf(PropTypes.any),
    flowChartData: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(processData));
