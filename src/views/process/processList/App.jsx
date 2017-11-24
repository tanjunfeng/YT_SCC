/*
 * @Author: chenghaojie
 * @Description: 流程管理 - 流程列表
 * @CreateDate: 2017-11-17 09:09:43
 * @Last Modified by: chenghaojie
 * @Last Modified time: 2017-09-22 15:18:02
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
    clearProcessData,
    queryChartData,
    clearChartData
}, dispatch))

class processData extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
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
    /**
     * 分页页码改变的回调
     */
    onPaginate = (pageNum) => {
        Object.assign(this.param, { pageNum, current: pageNum });
        this.query();
    }
    queryFlowChart = (id) => {
        this.props.clearChartData();
        this.props.queryChartData(id).then(() => {
            this.showModal();
        });
    }
    query = () => {
        this.props.queryProcessData(this.param).then((data) => {
            const { pageNum, pageSize } = data.data;
            Object.assign(this.param, { pageNum, pageSize });
        });
    }
    handleReset = () => {
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        }
    }
    closeCanvas = () => {
        this.setState({
            data: null,
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
     * 表单操作
     * @param {Object} text 当前行的值
     * @param {object} record 单行数据
     */
    renderOperation = (text, record) => (
        <a
            onClick={() => { this.queryFlowChart(record.id); }}
        >查看流程图</a>
    )

    render() {
        if (Object.keys(this.props.processData).length === 0) {
            return null;
        }
        const { flowName, visible } = this.state;
        const url = `${window.config.apiHost}/bpm/newdeploy`;
        const { overviewData, detailData, total, pageNum, pageSize } = this.props.processData;
        processOverview[processOverview.length - 1].render = this.renderOperation;
        processDetails[processDetails.length - 1].render = this.renderOperation;
        return (
            <div className="processBox">
                <Table
                    dataSource={overviewData.data}
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
                    dataSource={detailData.data}
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
                <UploadZip flowName={flowName} url={url} />
                <FlowChart data={this.props.flowChartData} visible={visible} >
                    <Button type="primary" shape="circle" icon="close" className="closeBtn" onClick={this.closeCanvas} />
                </FlowChart>
            </div>

        );
    }
}

processData.propTypes = {
    queryProcessData: PropTypes.func,
    clearProcessData: PropTypes.func,
    queryChartData: PropTypes.func,
    clearChartData: PropTypes.func,
    processData: PropTypes.objectOf(PropTypes.any),
    flowChartData: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(processData));
