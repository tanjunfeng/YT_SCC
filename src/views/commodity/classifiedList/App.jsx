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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message } from 'antd';
import Utils from '../../../util/util';
import LevelTree from '../../../common/levelTree';
import SearchMind from '../../../components/searchMind';
import {
    fetchAction,
    receiveData,
    fetchTest,
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

        // Test
        this.handleSave = ::this.handleSave;
        this.state = {
            img: null,
            chooseMe: {}
        }
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
        // 当前节点的父级 key
        const parentKey = el.getAttribute('data-parentKey');

        // 转换为索引值
        const fromIndex = sort - 1;
        const toIndex = el.value - 1;

        this.sortData(parentKey, fromIndex, toIndex);
    }

    /**
     * 修改展示状态
     * @param value
     * @param mkey
     */
    handleChangeStatus(value, mkey) {
        const $data = fromJS(this.props.data);

        Utils.find($data, mkey, ($finder, deep) => {
            const $dealData = $data.setIn(
                deep.concat('status'),
                parseInt(value, 10)
            );

            this.props.receiveData($dealData);
        });
    }

    /**
     * Drop 事件
     * @param info
     */
    handleDrop(info) {
        const dropEl = info.node;
        const dragEl = info.dragNode;
        const { parentKey } = dragEl.props;
        const dropIndex = info.dropPosition;
        const dragIndex = dragEl.props.index;

        // 同层级可拖放
        if (dropEl.props.parentKey === parentKey) {
            this.sortData(parentKey, dragIndex, dropIndex);
        } else {
            message.warning('只能同级操作');
        }
    }

    /**
     * 重新根据参数排序
     * @param parentKey
     * @param fromIndex 当前的索引值
     * @param toIndex 更到到数据数组的索引值位置
     */
    sortData(parentKey, fromIndex, toIndex) {
        let $dealData = fromJS([]);
        // 格式化数据
        const $data = fromJS(this.props.data);

        Utils.find($data, parentKey, ($finder, deep, $child) => {
            // 操作跟节点
            if ($finder === null) {
                $dealData = Utils.takeTo($data, fromIndex, toIndex);
            } else {
                $dealData = $data.setIn(
                    deep.concat('children'),
                    Utils.takeTo($child, fromIndex, toIndex)
                );
            }
        });

        this.props.receiveData($dealData.toJS());

        if ($dealData) {
            message.success('操作成功');
        }
    }

    /**
     * TEST
     */
    handleSave(event) {
        this.setState({
            img: this.imageUploader.getImageByBase64(),
        })
    }

    handleTestFetch = ({ value, pagination }) => {
        console.log(value, pagination);

        return fetchTest({
            value,
        });
    }

    handleTestChoose = ({ record, compKey, index, event }) => {
        console.log(compKey, record)
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
                <div>{this.state.chooseMe.key} - {this.state.chooseMe.name}</div>

                {/* Demo 1 */}
                <SearchMind
                    compKey="search-mind-key1"
                    ref={ref => { this.searchMind = ref }}
                    fetch={(value, pager) => this.handleTestFetch(value, pager)}
                    addonBefore="供应商 asfsafsafa"
                    onChoosed={this.handleTestChoose}
                    renderChoosedInputRaw={(data) => (
                        <div>{data.id} - {data.name}</div>
                    )}
                    pageSize={2}
                    columns={[
                        {
                            title: 'Name',
                            dataIndex: 'name',
                            width: 150,
                        }, {
                            title: 'Address',
                            dataIndex: 'address',
                            width: 200,
                        }
                    ]}
                />

                {/* Demo 2 */}
                <SearchMind
                    style={{ marginLeft: 10 }}
                    compKey="search-mind-key2"
                    fetch={(value, pager) => this.handleTestFetch(value, pager)}
                    addonBefore="仓库"
                    onChoosed={this.handleTestChoose}
                    renderChoosedInputRaw={(data) => (
                        <div>{data.id} - {data.name}</div>
                    )}
                    pageSize={1}
                    columns={[
                        {
                            title: 'Name',
                            dataIndex: 'name',
                            width: 150,
                        }, {
                            title: 'Address',
                            dataIndex: 'address',
                            width: 200,
                        }
                    ]}
                />

                {/* Demo 3 */}
                <SearchMind
                    style={{ marginLeft: 10 }}
                    compKey="search-mind-key3"
                    fetch={(value, pager) => this.handleTestFetch(value, pager)}
                    addonBefore="商品"
                    onChoosed={this.handleTestChoose}
                    renderChoosedInputRaw={(data) => (
                        <div>{data.id} - {data.name}</div>
                    )}
                    defaultValue="Hello"
                    columns={[
                        {
                            title: 'Name',
                            dataIndex: 'name',
                            width: 150,
                        }, {
                            title: 'Address',
                            dataIndex: 'address',
                            width: 200,
                        }
                    ]}
                />
            </div>
        )
    }
}

ClassifiedList.propTypes = {
    user: PropTypes.objectOf(PropTypes.string),
}

ClassifiedList.defaultProps = {
    user: {
        name: 'Who?'
    }
}

export default withRouter(ClassifiedList);
