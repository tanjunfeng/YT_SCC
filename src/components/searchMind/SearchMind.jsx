/**
 * @file SearchMind.jsx
 * @author denglingbo
 *
 * Des
 */
import React, { Component } from 'react';
import { Icon, Table } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Utils from '../../util/util';
import NoData from './NoData';
import './searchMind.scss';

const TYPE = {
    // 数据加载状态
    LOADING: 'loading',
    // 默认状态
    DEFAULT: 'search',
    // 选中状态
    CHOOSED: 'check',
    // 输入状态
    EDIT: 'ellipsis',
};

class SearchMind extends Component {
    constructor(props) {
        super(props);

        this.state = {
            /**
             * 下拉菜单的状态
             */
            dropHide: true,

            /**
             * 当前 icon 类型
             * @param {TYPE}
             */
            type: TYPE.DEFAULT,

            /**
             * 判断是否在激活下拉菜单的区域内
             */
            inArea: false,

            /**
             * 输入框的值
             */
            value: props.defaultValue,

            /**
             * 是否 input 获取了焦点
             */
            isFocus: false,

            /**
             * 点击下拉菜单，选择好的数据模型
             */
            selectedRawData: props.defaultRaw,

            disabled: props.disabled,

            /**
             * 此处由 state 控制分页
             */
            pagination: {
                pageSize: props.pageSize,
            },

            /**
             * 下拉框的数据源
             */
            data: [],

            /**
             * 是否出现查询错误
             */
            fetchError: 0,

            /**
             * 默认值
             */
            defaultValue: props.defaultValue,
        }

        this.handleFocus = ::this.handleFocus;
        this.handleKeyUp = ::this.handleKeyUp;
        this.handleBlur = ::this.handleBlur;
        this.handleChange = ::this.handleChange;
        this.handleInArea = ::this.handleInArea;
        this.handleOutArea = ::this.handleOutArea;
        this.dropListener = ::this.dropListener;
        this.handleClear = ::this.handleClear;
        this.handleTableChange = ::this.handleTableChange;
        this.handleQueryBtn = ::this.handleQueryBtn;

        this.searchDelayTimerId = null;
    }

    componentWillMount() {
        document.addEventListener('click', this.dropListener);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultValue !== this.props.defaultValue) {
            this.setState({
                value: nextProps.defaultValue,
            });
        }

        // 单独处理一下 disabled
        if (nextProps.disabled !== this.props.disabled) {
            this.setState({
                disabled: nextProps.disabled,
                dropHide: nextProps.disabled,
                isFocus: !nextProps.disabled,
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.dropListener);
        clearTimeout(this.searchDelayTimerId);
    }

    /**
     * 按键搜索入口
     * 实时搜索仅仅在 quickSearch 的情况下启用
     */
    onSearch() {
        clearTimeout(this.searchDelayTimerId);

        const { quickSearch, delaySend } = this.props;
        const pager = { ...this.state.pagination };

        // 搜索发生变化，清空 current
        pager.current = 1;

        this.setState({
            type: TYPE.EDIT,
        });

        if (quickSearch) {
            this.setState({
                pagination: pager,
            });

            // 实际上这个位置如果没有 delaySend 延迟，不建议使用实时搜索
            if (!delaySend) {
                this.query();
                return;
            }

            this.searchDelayTimerId = setTimeout(() => this.query(), delaySend);
        }
    }

    /**
     * 点击清除按钮的回调
     */
    onClearCallback() {
        this.props.onClear(this.getData());
    }

    /**
     * 获取选择的数据
     * @return {{value: *, selected: null}}
     */
    getData() {
        return {
            value: this.state.value,
            selected: this.state.selectedRawData,
        };
    }

    /**
     * 获取下拉框内容节点
     */
    getDrop() {
        const {
            type,
            data,
            pagination,
        } = this.state;

        const {
            columns,
            noDataText,
            loadingText,
            rowKey,
        } = this.props;

        // 有数据列表
        if (data && data.length > 0) {
            return (
                <Table
                    rowKey={rowKey}
                    columns={columns}
                    dataSource={data}
                    pagination={pagination}
                    loading={type === TYPE.LOADING}
                    size="middle"
                    onRowClick={this.handleChoose}
                    onChange={this.handleTableChange}
                />
            )
        }

        if (type === TYPE.EDIT || type === TYPE.LOADING) {
            return (
                <NoData>{loadingText}</NoData>
            );
        }

        return (
            <NoData>{noDataText}</NoData>
        );
    }

    /**
     * 点击搜索按钮
     */
    handleQueryBtn() {
        this.ywcSmindInput.focus();
        this.query();
    }

    /**
     * 输入框获得焦点 设置 isFocus
     */
    handleFocus() {
        this.setState({
            isFocus: true,
        });

        // if (!this.isEmpty() && this.state.dropHide) {
        //     this.query();
        // }
    }

    /**
     * 鼠标进入整个操作容器 设置 inArea
     */
    handleInArea() {
        this.setState({
            inArea: true,
        });
    }

    handleOutArea() {
        this.setState({
            inArea: false,
        });
    }

    handleChange(event) {
        this.setState({
            value: event.currentTarget.value,
        });
    }

    handleBlur() {
        this.setState({
            isFocus: false,
        });
    }

    /**
     * Antd Table change 事件
     * @param pagination
     */
    handleTableChange(pagination) {
        this.setState({
            pagination,
        }, () => {
            this.query();
        });
    }

    /**
     * 发送搜索请求
     */
    query() {
        const { value, pagination, disabled } = this.state;
        const { totalIndex, fetch } = this.props;

        if (disabled || !fetch) {
            return;
        }

        const params = {
            value,
            pagination: { ...pagination }
        };

        this.setState({
            type: TYPE.LOADING,
        });

        // 将原始数据传递给外部回调
        fetch(params)
            .then(res => {
                const pager = { ...pagination };

                // 重新更换数据 total
                if (res[totalIndex] || res.data[totalIndex]) {
                    pager.total = res[totalIndex] || res.data[totalIndex];
                }

                this.setState({
                    type: TYPE.DEFAULT,
                    data: res.data.data,
                    pagination: pager,
                    fetchError: 0,
                });
            })
            .catch(() => {
                this.setState({
                    type: TYPE.DEFAULT,
                    total: 0,
                    data: [],
                    fetchError: 1,
                })
            })
    }

    /**
     * 这里是实际控制下拉框显示隐藏的地方，容器获得焦点状态以及鼠标在容器内部，都不关闭下拉框
     */
    dropListener() {
        const { isFocus, inArea, disabled, selectedRawData } = this.state;

        // 禁用状态，不再进行任何操作反馈
        if (disabled) {
            return;
        }

        if (isFocus || inArea) {
            this.setState({
                dropHide: false,
            });
        } else {
            this.setState({
                type: selectedRawData === null ? TYPE.DEFAULT : TYPE.CHOOSED,
                dropHide: true,
            });
        }
    }

    /**
     * Todo
     * @param event
     */
    handleKeyUp(event) {
        if (event.keyCode === 13) {
            this.query();
        } else {
            this.onSearch();
        }
    }

    /**
     * 触发选择数据
     * @param {Object} record, 选择的数据
     * @param {number} index, 点击的索引值
     * @param {Event} event
     */
    handleChoose = (record, index, event) => {
        const { onChoosed, compKey } = this.props;

        if (onChoosed) {
            onChoosed({
                record,
                index,
                event,
                compKey
            });
        }

        this.setState({
            selectedRawData: record,
            dropHide: true,
            isFocus: false,
            inArea: false,
            selectedValue: this.state.value,
            value: '',
            data: [],
            type: TYPE.CHOOSED,
        });

        this.ywcSmindInput.blur();
    }

    /**
     * 用于选择点击项的展示
     * @return {Node|null}
     */
    inputRawRender() {
        const { selectedRawData } = this.state;
        const { renderChoosedInputRaw } = this.props;

        if (selectedRawData) {
            return renderChoosedInputRaw(selectedRawData);
        }

        return null;
    }

    /**
     * 判断输入框是否为空
     */
    isEmpty() {
        return Utils.trim(this.state.value) === '';
    }

    /**
     * 清空数据按钮
     * 1. 下拉框展示的时候，代表需要清空输入框内容
     * 2. 下拉框关闭的时候，代表需要清空选择的数据
     */
    handleClear() {
        const { dropHide } = this.state;
        const { defaultValue, defaultRaw } = this.props;

        // 有默认值的时候，清除按钮，直接同时清除 两个数据
        if (defaultValue.length > 0 && defaultRaw !== null) {
            this.setState({
                value: '',
                selectedRawData: null,
            }, () => this.ywcSmindInput.focus());

            return;
        }

        if (!dropHide) {
            // 清除输入框
            this.setState({
                value: '',
                data: [],
                type: this.state.selectedRawData === null ? TYPE.DEFAULT : TYPE.CHOOSED
            }, () => {
                this.onClearCallback();
                this.query();
            });

            this.ywcSmindInput.focus();
        } else {
            // 清除选择的数据
            this.setState({
                selectedRawData: null,
                type: TYPE.DEFAULT,
            }, () => this.onClearCallback());
        }
    }

    /**
     * 重置组件
     */
    reset() {
        this.setState({
            value: '',
            data: [],
            selectedRawData: null,
        })
    }

    render() {
        const {
            type,
            dropHide,
            value,
            isFocus,
            selectedRawData,
            data,
            disabled,
        } = this.state;

        const {
            addonBefore,
            className,
            style,
            renderChoosedInputRaw,
            placeholder,
            dropWidth,
        } = this.props;

        const layoutCls = classNames('ywc-smind', {
            'ywc-smind-drop-hide': dropHide || (this.isEmpty() && (data && data.length === 0)),
            'ywc-smind-has-input-view': renderChoosedInputRaw,
            'ywc-smind-disabled': disabled,
        });

        const clearCls = classNames('ywc-smind-clear', {
            'ywc-smind-clear-show':
            // 下拉框显示中，同时输入框内容不为空的情况
            (!dropHide && !this.isEmpty())
            // 输入框无焦点，同时有选择内容展示的情况
            || (!isFocus && selectedRawData)
        });

        const inputProps = {
            ...(disabled && { disabled: 'disabled'})
        };

        const newStyle = Object.assign({
            zIndex: 100,
            position: 'relative',
        }, style);

        return (
            <div
                style={newStyle}
                className={`${layoutCls} ${className}`}
                onMouseOver={this.handleInArea}
                onMouseOut={this.handleOutArea}
            >
                {/* 搜索容器 */}
                <div className="ywc-smind-search-bar">
                    {addonBefore &&
                    <span className="ywc-smind-title">
                            {addonBefore}
                        </span>
                    }
                    <div className="ywc-smind-input-layout">
                        <input
                            ref={ref => { this.ywcSmindInput = ref }}
                            className="ywc-smind-input"
                            onFocus={this.handleFocus}
                            onKeyUp={this.handleKeyUp}
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            value={value}
                            {...inputProps}
                        />

                        {/* 用于被选择的数据展示 */}
                        {(!isFocus && selectedRawData !== null && this.isEmpty()) &&
                        <div className="ywc-smind-input-view">
                            {this.inputRawRender()}
                        </div>
                        }

                        {/* placeholder */}
                        {(!this.isFocus && this.isEmpty() && selectedRawData === null) &&
                        <div className="ywc-smind-input-placeholder">
                            {placeholder}
                        </div>
                        }

                        {/* 清空按钮 */}
                        <div
                            className={clearCls}
                            onClick={this.handleClear}
                        >
                            <Icon type="close-circle-o" />
                        </div>
                    </div>

                    {/* 搜索按键 */}
                    <span
                        className="ywc-smind-icon"
                        onClick={this.handleQueryBtn}
                    >
                        <Icon type={type} />
                    </span>
                </div>

                {/* 搜索结构下拉菜单 默认隐藏 */}
                <div
                    style={{
                        ...(dropWidth && { width: dropWidth })
                    }}
                    className="ywc-smind-drop-layout"
                >
                    {this.getDrop()}
                </div>
            </div>
        )
    }
}

SearchMind.propTypes = {
    /**
     * 表头信息
     * @Antd Table
     */
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,

    /**
     * 每行的 key
     * @Antd Table
     */
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    /**
     * 这里需要返回一个 Promise
     */
    compKey: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,

    /**
     * 这里需要返回一个 Promise
     */
    fetch: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,

    /**
     * 输入框前缀
     */
    addonBefore: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

    className: PropTypes.string,

    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),

    /**
     * 输入内容的时候是否需要延迟发送请求
     */
    delaySend: PropTypes.number,

    /**
     * 输入的时候直接发送请求，不需要使用回车或者点击搜索按键才发送
     */
    quickSearch: PropTypes.bool,

    /**
     * 点击行触发选择功能
     */
    onChoosed: PropTypes.func,

    /**
     * 用户点击 claer 的回调
     */
    onClear: PropTypes.func,

    /**
     * 未输入的提示信息
     */
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

    /**
     * 只用于选择之后的展示功能
     * 如果传递该参数，input 仅在浮层中
     */
    renderChoosedInputRaw: PropTypes.oneOfType([PropTypes.func, PropTypes.func]),

    /**
     * 组件通过什么 key 来查找 total 字段
     */
    totalIndex: PropTypes.string,

    pageSize: PropTypes.number,

    defaultValue: PropTypes.string,

    defaultRaw: PropTypes.object,

    disabled: PropTypes.bool,

    /**
     * 无表格状态下，没有搜索到内容的文字提示
     */
    noDataText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

    /**
     * 无表格状态下，数据加载文字
     */
    loadingText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

    /**
     * 手动指定下拉框的宽度
     */
    dropWidth: PropTypes.oneOfType([PropTypes.objectOf(), PropTypes.number]),
}

SearchMind.defaultProps = {
    compKey: null,
    fetch: null,
    addonBefore: '',
    className: '',
    style: {},
    columns: [],
    defaultValue: '',
    defaultRaw: null,
    totalIndex: 'total',
    pageSize: 10,
    delaySend: 320,
    placeholder: '请输入内容',
    noDataText: '没有匹配的数据',
    loadingText: '数据请求中',
    rowKey: 'id',
    quickSearch: true,
    renderChoosedInputRaw: null,
    disabled: false,
    dropWidth: null,
    onChoosed: () => {},
    onClear: () => {},
}


export default SearchMind;
