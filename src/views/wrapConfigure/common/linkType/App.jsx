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
    1: { text: '详情链接', placeholder: '请输入商品id', link: '' },
    2: { text: '分类链接', placeholder: '请选择分类', link: '' },
    3: { text: '列表链接', placeholder: '请输入查询关键字', link: '' },
    4: { text: '页面链接', placeholder: '输入页面连接', link: '' },
    5: { text: '外部链接', placeholder: '请输入外部连接', link: '' }
}

class LinkType extends Component {
    static propTypes = {
        value: PropTypes.objectOf(PropTypes.any),
        onChange: PropTypes.func,
    }

    constructor(props) {
        super(props)
        const { selected = '1', link = '' } = this.props.value || {};
        const value = {
            selected,
            link
        }
        optionData[value.selected || '1'].link = value.link || '';

        this.state = {
            selected: String(value.selected) || '1',
            link: value.link || '',
            categories: []
        }
    }

    componentDidMount() {
        querySecondCategoriesOfApp({}).then((res) => {
            this.setState({
                categories: res.data
            })
        })
    }

    handleLinkStyleChange = (value) => {
        this.setState({
            selected: value,
            link: optionData[value].link
        }, () => {
            this.triggerChange({
                selected: value,
                link: value
            })
        })
    }

    handleLinkChange = (e) => {
        const { selected } = this.state;
        const { value } = e.target;

        this.setState({
            link: value,
        }, () => {
            optionData[selected].link = value;
            this.triggerChange({
                link: value
            })
        })
    }

    handleCategoriesChange = (value) => {
        this.triggerChange({
            link: value
        })
    }

    triggerChange = (changedValue) => {
        const { onChange } = this.props;
        const { selected, link } = this.state;
        if (onChange) {
            onChange(Object.assign({ selected, link }, changedValue));
        }
    }

    render() {
        const { selected, link, categories } = this.state;

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

                <Row>
                    <Col span={4}>
                        *{optionData[selected].text}
                    </Col>
                    <Col span={14}>
                        {
                            selected === '2' && categories.length
                                ? <Select
                                    showSearch
                                    style={{ width: 200 }}
                                    placeholder="选择分类"
                                    optionFilterProp="children"
                                    defaultValue={link}
                                    onChange={this.handleCategoriesChange}
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
                                : <Input
                                    rows={2}
                                    value={link}
                                    onChange={this.handleLinkChange}
                                    placeholder={optionData[selected].placeholder}
                                />
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}

export default LinkType;
