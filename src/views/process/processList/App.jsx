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
import { Table, Form, Button, Input, Modal} from 'antd';
import FlowChart from '../flowChart';
import UploadZip from './uploadZip';

import {
    queryProcessList,
    clearProcessList,
    queryChartData
} from '../../../actions/promotion';

import { PAGE_SIZE } from '../../../constant';
import { processOverview, processDetails } from '../columns';

@connect(state => ({
    processList: state.toJS().promotion.processList
}), dispatch => bindActionCreators({
    queryProcessList,
    clearProcessList,
    queryChartData
}, dispatch))

class ProcessList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            visible: false,
            flowName: ''
        }
        this.param = {};
        this.queryFlowChart = this.queryFlowChart.bind(this);
    }

    componentWillMount() {
        this.props.clearProcessList();
    }

    componentDidMount() {
        this.handlePromotionReset();
        this.query();
    }

    componentWillUnmount() {
        this.props.clearProcessList();
    }
    /**
     * 分页页码改变的回调
     */
    onPaginate = (pageNum) => {
        Object.assign(this.param, { pageNum, current: pageNum });
        this.query();
    }
    queryFlowChart = (id) => {
        this.props.queryChartData(id).then((data) => {
            this.setState({data: data.data});
            this.showModal();
        });
    }
    query = () => {
        this.props.queryProcessList(this.param).then((data) => {
            const { pageNum, pageSize } = data.data;
            Object.assign(this.param, { pageNum, pageSize });
        });
    }
    handlePromotionReset = () => {
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
    renderOperation = (text, record) => {
        return (<a onClick={() => { this.queryFlowChart(record.id); this.showModal() }}>查看流程图</a>)
    }
    render() {
        if (Object.keys(this.props.processList).length === 0) {
            return null;
        }
        const {flowName, visible} = this.state;
        const url = `${window.config.apiHost}/bpm/newdeploy`;
        const { overviewData, detailData, total, pageNum, pageSize} = this.props.processList;
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
                <div id="canvasRoot">
                    <FlowChart data={this.state.data} parentId={'canvasRoot'} visible={visible} >
                        <Button type="primary" shape="circle" icon="close" className="closeBtn" onClick={this.closeCanvas} />
                    </FlowChart>
                </div>
            </div>

        );
    }
}

ProcessList.propTypes = {
    queryProcessList: PropTypes.func,
    clearProcessList: PropTypes.func,
    queryChartData: PropTypes.func,
    processList: PropTypes.objectOf(PropTypes.objectOf(PropTypes.any))
}

export default withRouter(Form.create()(ProcessList));
