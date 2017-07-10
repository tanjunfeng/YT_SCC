/**
 * @file App.jsx
 *
 * @author caoyanxuan
 *
 * 分类图标管理
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Col, Row, Icon } from 'antd';
import classnames from 'classnames';
import CategoryIconTable from './categoryIconTable';
import { fetchCategorys } from '../../../actions/pub';
import { fetchCategoryId } from '../../../actions/wap';

@connect(
    state => ({
        categorys: state.toJS().pub.categorys,
        ciData: state.toJS().wap.ciData,
    }),
    dispatch => bindActionCreators({
        fetchCategorys,
        fetchCategoryId,
    }, dispatch)
)
class CategoryIconManagement extends Component {
    constructor(props) {
        super(props);
        this.clickLV1 = this.clickLV1.bind(this);
        this.clickLV2 = this.clickLV2.bind(this);
        this.state = {
            secondDate: [],
            lv1Id: -1,
            lv1Name: '',
            lv2Id: -2,
            lv2Name: '',
            expand1: {
                display: 'none'
            },
            expand2: {
                display: 'none'
            }
        }
    }

    componentDidMount() {
        this.props.fetchCategorys();
    }

    clickLV1(cId, cName) {
        const { categorys } = this.props;
        const current = categorys.filter(item => {
            if (item.id === cId) {
                return item;
            }
            return null;
        })
        this.setState({
            secondDate: current.length > 0 ? current[0].childCategories : [],
            lv1Id: cId,
            lv1Name: cName,
            expand1: {
                display: 'inline-block'
            },
            expand2: {
                display: 'none'
            }
        })
    }
    clickLV2(cId, cName) {
        this.setState({
            lv2Id: cId,
            lv2Name: cName,
            expand2: {
                display: 'none'
            }
        }, () => {
            const categoryId = cId;
            this.props.fetchCategoryId({ categoryId }).then(() => {
                this.setState({
                    expand2: {
                        display: 'inline-block'
                    }
                })
            }).catch(() => {
            });
        })
    }

    render() {
        const { categorys } = this.props;
        const { secondDate } = this.state;
        const firstLists = categorys.map(item =>
            (<li><a
                key={item.id}
                className={
                    classnames('category-li', {
                        'active-li': this.state.lv1Id === item.id,
                        'primary-li': this.state.lv1Id !== item.id
                    })
                }
                onClick={() => {
                    this.clickLV1(item.id, item.categoryName)
                }}
            >
                {item.categoryName}
                <Icon type="right" />
            </a></li>)
        );
        const SecondLists = secondDate.map(item =>
            (<li><a
                key={item.id}
                className={
                    classnames('category-li', {
                        'active-li': this.state.lv2Id === item.id,
                        'primary-li': this.state.lv2Id !== item.id
                    })
                }
                onClick={() => {
                    this.clickLV2(item.id, item.categoryName)
                }}
            >
                {item.categoryName}
                <Icon type="right" />
            </a></li>)
        );

        return (
            <div className="category-icon-management carousel-management wap-management">
                <div className="carousel-management-tip wap-management-tip">
                     说明：移动端分类图标管理模块管理移动端分类中二目录的图标。
                </div>
                <div>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Card title="一级分类" >
                                <ul>{firstLists}</ul>
                            </Card>
                        </Col>
                        <Col
                            span={6}
                            style={this.state.expand1}
                        >
                            <Card title="二级分类" >
                                <ul>{SecondLists}</ul>
                            </Card>
                        </Col>
                        <Col
                            span={10}
                            className="category-lv3-card"
                            style={this.state.expand2}
                        >
                            <Card title="三级分类" >
                                <CategoryIconTable
                                    categoryInfos={{
                                        lv1Name: this.state.lv1Name,
                                        lv2Name: this.state.lv2Name,
                                        lv1Id: this.state.lv1Id,
                                        lv2Id: this.state.lv2Id,
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

CategoryIconManagement.propTypes = {
    categorys: PropTypes.arrayOf(PropTypes.any),
    fetchCategorys: PropTypes.func,
    fetchCategoryId: PropTypes.func,
};
CategoryIconManagement.defaultProps = {
}
export default CategoryIconManagement;

