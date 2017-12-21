/**
 * @file App.jsx
 * @author shijh,liujinyu
 *
 * 手机端配置，链接配置
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Input, Row, Col } from 'antd';

import {
    querySecondCategoriesOfApp
} from '../../../../service';

const Option = Select.Option;

const optionData = {
    1: { text: '详情链接', placeholder: '请输入商品id' },
    2: { text: '分类链接', placeholder: '请选择分类id' },
    3: { text: '列表链接', placeholder: '请输入查询关键字' },
    4: { text: '页面链接', placeholder: '输入页面连接' },
    5: { text: '外部链接', placeholder: '请输入外部链接' },
    6: { text: '活动链接', placeholder: '请输入活动id' }
}

class LinkType extends Component {
    static propTypes = {
        value: PropTypes.objectOf(PropTypes.any),
        onChange: PropTypes.func,
    }

    constructor(props) {
        super(props)
        const { selected, linkAddress = '', goodsId = '', linkId = undefined, linkKeyword = '' } = this.props.value || {}
        // 如果为列表链接时，判断类型和关键字哪一个该显示
        let isClassification = true;
        let isKeyWords = true;
        if (String(selected) === '3') {
            if (linkId) {
                isKeyWords = false
            } else {
                isClassification = false
            }
        }
        this.state = {
            selected: selected ? String(selected) : '1',
            linkAddress,
            goodsId,
            linkId: linkId || undefined,
            linkKeyword,
            categories: [],
            isClassification,
            isKeyWords,

        }
    }

    componentDidMount() {
        querySecondCategoriesOfApp({}).then((res) => {
            this.setState({
                categories: res.data
            })
        })
    }

    /**
     * 链接类型改变
     * @param {string} value 链接类型id
     */
    handleLinkStyleChange = (value) => {
        this.setState({
            selected: value,
            linkAddress: '',
            goodsId: '',
            linkId: undefined,
            linkKeyword: '',
            isKeyWords: true,
            isClassification: true
        }, () => {
            this.triggerChange({
                selected: value
            })
        })
        this.forceUpdate()
    }

    /**
     * linkAddress || goodsId input框值改变
     * @param {object} e 事件对象
     */
    handleLinkChange = (e) => {
        const { selected } = this.state;
        const { value } = e.target;
        const keyWord = selected === '1' ? 'goodsId' : 'linkAddress'
        this.setState({
            [keyWord]: value
        }, () => {
            this.triggerChange({
                [keyWord]: value
            })
        })
    }

    /**
     * 列表链接类型下的关键字改变
     * @param {object} e 时间对象
     */
    handleKeyWordsChange = (e) => {
        const { value } = e.target;
        // 根据关键字input框是否有值,分类select显示隐藏
        this.setState({
            isClassification: value === '',
            linkKeyword: value,
        }, () => {
            this.triggerChange({
                linkKeyword: value
            })
        })
    }

    /**
     * 链接类型下的分类改变
     * @param {string} value 分类id
     */
    handleCategoriesChange = (value) => {
        // 根据分类select是否有值，关键字input框显示隐藏
        this.setState({
            isKeyWords: value === undefined,
            linkId: value
        })
        this.triggerChange({
            linkId: value
        })
    }

    /**
     * input框标题判断
     */
    forTitle = () => {
        const { selected } = this.state;
        const title = optionData[selected].text;
        if (title === '详情链接') {
            return '商品编号'
        } else if (title === '活动链接') {
            return '活动id'
        }
        return title
    }

    /**
     * 通知父组件
     */
    triggerChange = (changedValue) => {
        const { onChange } = this.props;
        const { selected, linkAddress, goodsId, linkId, linkKeyword } = this.state;
        if (onChange) {
            onChange(Object.assign({
                selected,
                linkAddress,
                goodsId,
                linkId,
                linkKeyword
            }, changedValue));
        }
    }

    /**
     * 判断是否该显示goodsId
     */
    isGoodsId = () => {
        const { selected, linkAddress, goodsId } = this.state;
        if (selected === '1') {
            return goodsId;
        } else if (selected === '4' || selected === '5' || selected === '6') {
            return linkAddress;
        }
        return null;
    }

    render() {
        const { selected, linkId, linkKeyword, categories } = this.state;
        const link = this.isGoodsId()
        return (
            <div>
                <Row>
                    <Col span={4}>
                        *链接类型
                    </Col>
                    <Col span={14}>
                        <Select
                            style={{ width: 240 }}
                            defaultValue={selected}
                            onChange={this.handleLinkStyleChange}
                        >
                            {
                                Object.keys(optionData).map((item) => {
                                    const text = optionData[item].text;
                                    return <Option key={item} value={item}>{text}</Option>
                                })
                            }
                        </Select>
                    </Col>
                </Row>


                {
                    (selected === '2' || selected === '3') && categories.length
                        ? <div>
                            <Row>
                                <Col span={4}>
                                    *分类
                                </Col>
                                <Col span={14}>
                                    <Select
                                        allowClear
                                        showSearch
                                        style={{ width: 200 }}
                                        placeholder="选择分类"
                                        optionFilterProp="children"
                                        value={linkId}
                                        onChange={this.handleCategoriesChange}
                                        disabled={!this.state.isClassification}
                                    >
                                        {
                                            categories.map((item) => (
                                                <Option
                                                    key={item.dimValId}
                                                    value={item.dimValId}
                                                >{item.name}</Option>
                                            ))
                                        }
                                    </Select>
                                </Col>
                            </Row>
                            {
                                selected === '3'
                                    ? <Row>
                                        <Col span={4}>
                                            *关键字
                                        </Col>
                                        <Col span={14}>
                                            <Input
                                                rows={2}
                                                value={linkKeyword}
                                                onChange={this.handleKeyWordsChange}
                                                placeholder={optionData[selected].placeholder}
                                                disabled={!this.state.isKeyWords}
                                            />
                                        </Col>
                                    </Row>
                                    : null
                            }
                        </div>
                        : <Row>
                            <Col span={4}>
                                *{this.forTitle()}
                            </Col>
                            <Col span={14}>
                                <Input
                                    rows={2}
                                    value={link}
                                    onChange={this.handleLinkChange}
                                    placeholder={optionData[selected].placeholder}
                                />
                            </Col>
                        </Row>
                }
            </div >
        )
    }
}

export default LinkType;
