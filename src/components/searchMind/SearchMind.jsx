/**
 * @file SearchMind.jsx
 * @author denglingbo
 *
 * Des
 */
import React, { PureComponent } from 'react';
import { Icon, Table } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Utils from '../../util/util';
import './searchMind.scss';

const TYPE = {
    LOADING: 'loading',
    DEFAULT: 'search',
};

class SearchMind extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            /**
             * 下拉菜单的状态
             */
            dropHide: true,

            /**
             * 当前 icon 类型
             * @param search, loading
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
            selectedRawData: null,

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
        this.onPressEnter = ::this.onPressEnter;

        this.searchDelayTimerId = null;
    }

    componentWillMount() {
        document.addEventListener('click', this.dropListener);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.dropListener);
        clearTimeout(this.searchDelayTimerId);
    }

    /**
     * 获取选择的源数据
     * @return {null}
     */
    getChooseData() {
        return this.state.selectedRawData;
    }

    /**
     * 按下回车键 or 由点击搜索按钮触发（!quickSearch）
     */
    onPressEnter() {
        this.query();
    }

    /**
     * 输入框获得焦点 设置 isFocus
     */
    handleFocus() {
        this.setState({
            isFocus: true,
        });

        if (!this.isEmpty()) {
            this.query();
        }
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
     * 按键搜索入口
     * 实时搜索仅仅在 quickSearch 的情况下启用
     */
    onSearch() {
        clearTimeout(this.searchDelayTimerId);

        const { quickSearch, delaySend } = this.props;
        const pager = { ...this.state.pagination };

        // 搜索发生变化，清空 current
        pager.current = 1;

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
        const { value, pagination } = this.state;
        const { totalIndex } = this.props;

        const params = {
            value,
            pagination: { ...pagination }
        };

        this.setState({
            type: TYPE.LOADING,
        });

        // 将原始数据传递给外部回调
        this.props.fetch(params)
            .then(res => {
                const pager = { ...pagination };

                // 重新更换数据 total
                if (res[totalIndex]) {
                    pager.total = res[totalIndex];
                }

                this.setState({
                    type: TYPE.DEFAULT,
                    data: res.data,
                    pagination: pager,
                });
            })
    }

    /**
     * 这里是实际控制下拉框显示隐藏的地方，容器获得焦点状态以及鼠标在容器内部，都不关闭下拉框
     */
    dropListener() {
        const { isFocus, inArea } = this.state;

        if (isFocus || inArea) {
            this.setState({
                dropHide: false,
            });
        } else {
            this.setState({
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
            this.onPressEnter();
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
            // 清空下列所有数据
            dropHide: true,
            isFocus: false,
            inArea: false,
            value: '',
            data: [],
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

        if (!dropHide) {
            this.setState({
                value: '',
                data: [],
            });

            this.ywcSmindInput.focus();
        } else {
            this.setState({
                selectedRawData: null,
            });
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
            data,
            value,
            isFocus,
            selectedRawData,
            pagination,
        } = this.state;

        const {
            addonBefore,
            className,
            style,
            columns,
            renderChoosedInputRaw,
            rowKey,
            placeholder,
        } = this.props;

        const layoutCls = classNames('ywc-smind', {
            'ywc-smind-drop-hide': dropHide || data.length === 0,
            'ywc-smind-has-input-view': renderChoosedInputRaw,
        });

        const clearCls = classNames('ywc-smind-clear', {
            'ywc-smind-clear-show':
                // 下拉框显示中，同时输入框内容不为空的情况
                (!dropHide && !this.isEmpty())
                // 输入框无焦点，同时有选择内容展示的情况
                || (!isFocus && selectedRawData)
        });

        return (
            <div
                style={style}
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
                        />
                        {(!isFocus && this.isEmpty()) &&
                            <div className="ywc-smind-input-view">
                                {this.inputRawRender()}
                            </div>
                        }
                        {this.isEmpty() && !selectedRawData &&
                            <div className="ywc-smind-input-placeholder">
                                {placeholder}
                            </div>
                        }
                        <div
                            className={clearCls}
                            onClick={this.handleClear}
                        >
                            <Icon type="close-circle-o" />
                        </div>
                    </div>
                    <span
                        className="ywc-smind-icon"
                        onClick={this.onPressEnter}
                    >
                        <Icon type={type} />
                    </span>
                </div>
                {/* 默认隐藏 */}
                <div className="ywc-smind-drop-layout">
                    {data && data.length > 0 &&
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
                    }
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
     * 未输入的提示信息
     */
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

    /**
     * 只用于选择之后的展示功能
     * 如果传递该参数，input 仅在浮层中
     */
    renderChoosedInputRaw: PropTypes.oneOfType([PropTypes.func, PropTypes.func]),

    totalIndex: PropTypes.string,

    pageSize: PropTypes.number,

    defaultValue: PropTypes.string,
}

SearchMind.defaultProps = {
    compKey: null,
    fetch: null,
    addonBefore: '',
    className: '',
    style: {},
    columns: [],
    defaultValue: '',
    totalIndex: 'total',
    pageSize: 10,
    delaySend: 320,
    placeholder: '请输入内容',
    rowKey: 'id',
    quickSearch: true,
    onChoosed: () => {},
    renderChoosedInputRaw: null,
}


export default SearchMind;
