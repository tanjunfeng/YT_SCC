/**
 * @file App.jsx
 * @author shijh
 *
 * 手机端配置，链接配置
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Input, Row, Col } from 'antd';

import {
    querycategories
} from '../../../../service';

const Option = Select.Option;

const optionData = {
    1: { text: '详情链接', placeholder: '请输入商品id', link: '' },
    // 21: { text: '详情链接', placeholder: '请输入商品id', link: '' },
    22: { text: '分类链接', placeholder: '请选择分类', link: '' },
    23: { text: '列表链接', placeholder: '请输入查询关键字', link: '' },
    24: { text: '页面链接', placeholder: '输入页面连接', link: '' },
    4: { text: '外部链接', placeholder: '请输入外部连接', link: '' }
}

function parseValue(value) {
    const { selected = '1', link = '' } = value;

    const result = {
        selected,
        link
    }

    if (parseInt(selected, 10) === 2) {
        const isClassify = /tab=classify/.test(link);
        const isList = /list\/index.html/.test(link);
        const isDetail = /detail\/index.html/.test(link);
        // 分类列表
        if (isClassify) {
            const res = link.match(/id=(.*)/);
            result.selected = '22';
            if (res) {
                result.link = res[1];
            }
        }
        // 列表链接
        else if (isList) {
            const res = link.match(/text=(.*)/);
            result.selected = '23';
            if (res) {
                result.link = decodeURI(res[1]);
            }
        }
        // 详情连接
        else if (isDetail) {
            const res = link.match(/id=(.*)/);
            result.selected = '21';
            if (res) {
                result.link = res[1];
            }
        }
        // 页面连接
        else {
            result.selected = '24';
        }
    }

    return result;
}

function enParse(selected, value) {
    let res = value;
    if (!value) {
        return '';
    }

    if (selected === '22') {
        res = `index.html?tab=classify&id=${value}`;
    }
    else if (selected === '21') {
        res = `detail/index.html?id=${value}`;
    }
    else if (selected === '23') {
        res = `list/index.html?text=${encodeURI(value)}`;
    }

    return res;
}

class LinkType extends Component {
    static propTypes = {
        value: PropTypes.objectOf(PropTypes.any),
        onChange: PropTypes.func,
    }

    constructor(props) {
        super(props)

        const value = parseValue(this.props.value || {});

        optionData[value.selected || '1'].link = value.link || '';

        this.state = {
            selected: String(value.selected) || '1',
            link: value.link || '',
            categories: []
        }
    }

    componentDidMount() {
        querycategories({level: 2}).then((res) => {
            this.setState({
                categories: res.data
            })
        })
    }

    componentWillReceiveProps(nextProps) {
        // Should be a controlled component.
        // if ('value' in nextProps) {
        //     const value = parseValue(nextProps.value);
        //     this.setState(value, () => {
        //         optionData[value.selected || '1'].link = value.link || '';
        //     });
        // }
    }

    handleLinkStyleChange = (value) => {
        this.setState({
            selected: value,
            link: optionData[value].link
        }, () => {
            this.triggerChange({
                selected: value.split('')[0],
                link: enParse(value, optionData[value].link)
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
                link: enParse(selected, value)
            })
        })
    }

    handleCategoriesChange = (value) => {
        const url = `index.html?tab=classify&id=${value}`;

        this.triggerChange({
            link: url
        })
    }

    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const { onChange } = this.props;
        const { selected, link } = this.state;

        if (onChange) {
            onChange(Object.assign({selected: selected.split('')[0], link}, changedValue));
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
                            selected === '22' && categories.length
                                ? <Select
                                    showSearch
                                    style={{ width: 200 }}
                                    placeholder="选择分类"
                                    optionFilterProp="children"
                                    defaultValue={link}
                                    onChange={this.handleCategoriesChange}
                                >
                                    { 
                                        categories.map((item) => {
                                            return <Option key={item.id} value={item.id}>{item.categoryName}</Option>
                                        })
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
