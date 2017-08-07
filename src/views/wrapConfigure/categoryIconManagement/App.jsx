/**
 * @file App.jsx
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
import { fetchCategorysById } from '../../../actions/pub';

@connect(
    state => ({
        categorysById: state.toJS().pub.categorysById,
    }),
    dispatch => bindActionCreators({
        fetchCategorysById,
    }, dispatch)
)
class CategoryIconManagement extends Component {
    constructor(props) {
        super(props);
        this.fetchCategory = ::this.fetchCategory;
        this.categoryArrs = []
        this.state = {
            lv1Id: -1,
            lv1Name: '',
            lv2Id: -2,
            lv2Name: '',
            lv3Id: -3,
            lv3Name: '',
        }
    }

    componentDidMount() {
        this.fetchCategory('');
    }

    /**
     * 将刷新后的categorysById值，push到数组中
     * @param {Object} nextProps 刷新后的属性
     */
    componentWillReceiveProps(nextProps) {
        const { categorysById } = nextProps;
        if (categorysById !== this.props.categorysById) {
            this.categoryArrs.splice(categorysById[0].level - 1)
            this.categoryArrs.push(categorysById);
        }
    }

    /**
     * 根据父id查询下一级分类信息
     * @param {string} pId 父id
     */
    fetchCategory(pId) {
        this.props.fetchCategorysById({parentId: pId});
    }

    render() {
        console.log(this.categoryArrs)
        const firstArr = this.categoryArrs[0] ? this.categoryArrs[0] : [];
        const secondArr = this.categoryArrs[1] ? this.categoryArrs[1] : [];
        const thirdArr = this.categoryArrs[2] ? this.categoryArrs[2] : [];
        const fourthArr = this.categoryArrs[3] ? this.categoryArrs[3] : [];
        const { lv1Name, lv2Name, lv3Name, lv3Id } = this.state;
        const firstLists = firstArr.map(item =>
            (<li
                key={item.id}
            >
                <a
                    className={
                        classnames('category-li', {
                            'active-li': this.state.lv1Id === item.id,
                            'primary-li': this.state.lv1Id !== item.id
                        })
                    }
                    onClick={() => {
                        this.fetchCategory(item.id);
                        this.setState({
                            lv1Id: item.id,
                            lv1Name: item.categoryName
                        })
                    }}
                >
                    {item.categoryName}
                    <Icon type="right" />
                </a>
            </li>)
        );
        const secondLists = secondArr.map(item =>
            (<li
                key={item.id}
            >
                <a
                    className={
                        classnames('category-li', {
                            'active-li': this.state.lv2Id === item.id,
                            'primary-li': this.state.lv2Id !== item.id
                        })
                    }
                    onClick={() => {
                        this.fetchCategory(item.id);
                        this.setState({
                            lv2Id: item.id,
                            lv2Name: item.categoryName
                        })
                    }}
                >
                    {item.categoryName}
                    <Icon type="right" />
                </a>
            </li>)
        );
        const thirdLists = thirdArr.map(item =>
            (<li
                key={item.id}
            >
                <a
                    className={
                        classnames('category-li', {
                            'active-li': this.state.lv3Id === item.id,
                            'primary-li': this.state.lv3Id !== item.id
                        })
                    }
                    onClick={() => {
                        this.fetchCategory(item.id);
                        this.setState({
                            lv3Id: item.id,
                            lv3Name: item.categoryName
                        })
                    }}
                >
                    {item.categoryName}
                    <Icon type="right" />
                </a>
            </li>)
        );
        return (
            <div className="category-icon-management carousel-management wap-management">
                <div className="carousel-management-tip wap-management-tip">
                     说明：移动端分类图标管理模块管理移动端分类中二目录的图标。
                </div>
                <div>
                    <Row gutter={16}>
                        <Col span={5}>
                            <Card title="一级分类" >
                                <ul className="category-card-ul">{firstLists}</ul>
                            </Card>
                        </Col>
                        <Col span={5}>
                            {
                                secondArr.length > 0
                                && <Card title="二级分类" >
                                    <ul className="category-card-ul">{secondLists}</ul>
                                </Card>

                            }
                        </Col>
                        <Col span={5}>
                            {
                                thirdArr.length > 0
                                && <Card title="三级分类" >
                                    <ul className="category-card-ul">{thirdLists}</ul>
                                </Card>
                            }
                        </Col>
                        <Col
                            span={8}
                            className="category-lv4-card"
                        >
                            {
                                fourthArr.length > 0
                                && <Card title="四级分类" >
                                    <CategoryIconTable
                                        categoryInfos={{
                                            fourthArr,
                                            lv1Name,
                                            lv2Name,
                                            lv3Name,
                                            lv3Id,
                                        }}
                                    />
                                </Card>
                            }
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

CategoryIconManagement.propTypes = {
    categorysById: PropTypes.arrayOf(PropTypes.any),
    fetchCategorysById: PropTypes.func,
};
CategoryIconManagement.defaultProps = {
}
export default CategoryIconManagement;
