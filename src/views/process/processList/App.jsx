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
import { Table, Form, Icon, Menu, Dropdown, Upload, Button } from 'antd';
import { Link } from 'react-router-dom';

import {
    queryProcessList,
    clearProcessList
} from '../../../actions/promotion';

import { PAGE_SIZE } from '../../../constant';
import { processOverview, processDetails } from '../columns';

@connect(state => ({
    processList: state.toJS().promotion.processList
}), dispatch => bindActionCreators({
    queryProcessList,
    clearProcessList
}, dispatch))

class processList extends PureComponent {
    constructor(props) {
        super(props);
        this.param = {};
        // this.handlePromotionSearch = this.handlePromotionSearch.bind(this);
        // this.handlePromotionReset = this.handlePromotionReset.bind(this);
        // this.handleSelect = this.handleSelect.bind(this);
        this.renderOperation = this.renderOperation.bind(this);
        this.query = this.query.bind(this);
    }

    componentWillMount() {
        this.props.clearProcessList();
    }

    componentDidMount() {
        // this.handlePromotionReset();
        this.query();
    }

    componentWillUnmount() {
        this.props.clearProcessList();
    }
    
    query() {
        this.props.queryProcessList();
    }
    /**
     * 分页页码改变的回调
     */
    // onPaginate = (pageNum) => {
    //     Object.assign(this.param, { pageNum, current: pageNum });
    //     this.query();
    // }

    // query() {
    //     this.props.queryCouponsList(this.param).then((data) => {
    //         const { pageNum, pageSize } = data.data;
    //         Object.assign(this.param, { pageNum, pageSize });
    //     });
    // }

    // handlePromotionSearch(param) {
    //     this.handlePromotionReset();
    //     this.param = {
    //         current: 1,
    //         ...param
    //     };
    //     this.query();
    // }

    // handlePromotionReset() {
    //     this.param = {
    //         pageNum: 1,
    //         pageSize: PAGE_SIZE
    //     };
    // }

    

    
    /**
     * 表单操作
     * @param {Object} text 当前行的值
     * @param {object} record 单行数据
     */
    renderOperation(text, record) {
        const { id } = record;
        const pathname = window.location.pathname;
        return (
            <Link to={`${pathname}/itemDetail/${id}`}>查看流程图</Link>
        )
    }
    render() {
        if(Object.keys(this.props.processList).length === 0){
            console.log('流程管理');
            console.log(this.props.processList);
            return null;
        }
        const { overviewData, detailData} = this.props.processList;
        processOverview[processOverview.length - 1].render = this.renderOperation;
        processDetails[processDetails.length - 1].render = this.renderOperation;
        const uploadProps = {
            multiple: false,
            action: 'src/commonUploadFile/uploadZip',
            headers: {
                authorization: 'multipart/form-data',
            }
        };
        return (
            <div>
                <Table
                    dataSource={overviewData.data}
                    columns={processOverview}
                    rowKey="id"
                    scroll={{
                        x: 1400
                    }}
                    bordered
                   
                />
                <Table
                    dataSource={detailData.data}
                    columns={processDetails}
                    rowKey="id"
                    scroll={{
                        x: 1400
                    }}
                   
                />
                <Upload {...uploadProps}>
                    <Button>
                    <Icon type="upload" /> Click to Upload
                    </Button>
                </Upload>
            </div>

        );
    }
}

processList.propTypes = {
    queryProcessList: PropTypes.func,
    clearProcessList: PropTypes.func
    // updatePromotionStatus: PropTypes.func,
    // couponsList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    // location: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(processList));
