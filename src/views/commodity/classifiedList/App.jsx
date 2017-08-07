/**
 * @file App.jsx
 * @author shijh
 *
 * 在售商品列表
 */

import { fromJS } from 'immutable';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { message } from 'antd';
import Utils from '../../../util/util';
import LevelTree from '../../../common/levelTree';
import {
    fetchAction,
    receiveData,
    updateShowStatusAction,
    updateSortNumAction,
} from '../../../actions/classifiedList';

@connect(
    state => ({
        user: state.toJS().user.data,
        rights: state.toJS().user.rights,
        data: state.toJS().commodity.classifiedList,
    }),
    dispatch => bindActionCreators({ fetchAction, receiveData }, dispatch)
)
class ClassifiedList extends Component {
    constructor(props) {
        super(props);

        this.handleDrop = ::this.handleDrop;
        this.handleChangeSort = ::this.handleChangeSort;
        this.handleChangeStatus = ::this.handleChangeStatus;
    }

    componentWillMount() {}

    componentDidMount() {
        this.props.fetchAction();
    }

    /**
     * 通过输入框排序
     * @param event
     */
    handleChangeSort(event) {
        const el = event.currentTarget;
        // 当前排序序号
        const sort = el.getAttribute('data-sort');
        // 当前节点的 key
        const key = el.getAttribute('data-key');
        // 当前节点的父级 key
        const parentKey = el.getAttribute('data-parentKey');

        // 转换为索引值
        const fromIndex = sort - 1;
        const toIndex = el.value - 1;

        this.sortData(parentKey, key, fromIndex, toIndex);
    }

    /**
     * 修改展示状态
     * @param value
     * @param mkey, categoryId
     */
    handleChangeStatus(value, mkey) {
        const $data = fromJS(this.props.data);

        updateShowStatusAction({
            id: mkey,
            displayStatus: value,
        }).then(() => {
            // 本地修改
            Utils.find($data, mkey, ($finder, deep) => {
                const $dealData = $data.setIn(
                    deep.concat('status'),
                    parseInt(value, 10)
                );

                this.props.receiveData($dealData);
            });
        }).catch(() => {
            message.error('操作失败');
        });
    }

    /**
     * Drop 事件
     * @param info
     */
    handleDrop(info) {
        const dropEl = info.node;
        const dragEl = info.dragNode;
        const { parentKey, eventKey } = dragEl.props;
        const dropIndex = info.dropPosition;
        const dragIndex = dragEl.props.index;

        // 同层级可拖放
        if (dropEl.props.parentKey === parentKey) {
            this.sortData(parentKey, eventKey, dragIndex, dropIndex);
        } else {
            message.warning('只能同级操作');
        }
    }

    /**
     * 重新根据参数排序
     * @param parentKey
     * @param currentKey 当前操作项的 key
     * @param fromIndex 当前的索引值
     * @param toIndex 更到到数据数组的索引值位置
     */
    sortData(parentKey, currentKey, fromIndex, toIndex) {
        // let $dealData = fromJS([]);
        // 格式化数据
        // const $data = fromJS(this.props.data);
        const toSort = toIndex + 1;

        updateSortNumAction({
            id: currentKey,
            newSortOrder: toSort,
        }).then(() => {

            /* TODO -- 切勿删除 */
            /* 这里暂时不再进行前端排序，请求数据之后，重新发送请求获新数据 */
            // Utils.find($data, parentKey, ($finder, deep, $child) => {
            //     // 操作跟节点
            //     if ($finder === null) {
            //         $dealData = Utils.takeTo($data, fromIndex, toIndex);
            //     } else {
            //         $dealData = $data.setIn(
            //             deep.concat('children'),
            //             Utils.takeTo($child, fromIndex, toIndex)
            //         );
            //     }
            // });
            // Utils.find($data, currentKey, ($finder, deep, $child) => {
            //     $dealData = $data.setIn(
            //         deep.concat('sort'),
            //         toSort
            //     );
            // })
            // this.props.receiveData($dealData.toJS());
            // if ($dealData) {
            //     message.success('操作成功');
            // }

            this.props.fetchAction();
            message.success('操作成功');
        }).catch(() => {
            message.error('操作失败');
        })
    }

    render() {
        return (
            <div>
                <LevelTree
                    data={this.props.data}
                    handleDrop={this.handleDrop}
                    handleChangeSort={this.handleChangeSort}
                    handleChangeStatus={this.handleChangeStatus}
                />
            </div>
        )
    }
}

export default withRouter(ClassifiedList);
