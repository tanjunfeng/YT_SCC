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
    }),
    dispatch => bindActionCreators({
        fetchCategorys,
    }, dispatch)
)
class CategoryIconManagement extends Component {
    constructor(props) {
        super(props);
        this.fetchCategory = ::this.fetchCategory;
        this.fetchFourthCategory = ::this.fetchFourthCategory;
        this.categoryArrs = []
        this.state = {
        }
    }

    componentDidMount() {
        this.fetchCategory('');
    }

    componentWillReceiveProps(nextProps) {
        const { categorys } = nextProps;
        if (categorys !== this.props.categorys) {
            this.categoryArrs.splice(categorys[0].level - 1)
            this.categoryArrs.push(categorys);
        }
    }

    fetchCategory(pId) {
        this.props.fetchCategorys({parentId: pId});
    }
    fetchFourthCategory(id) {
        console.log(id)
    }

    render() {
        const firstArr = this.categoryArrs[0] ? this.categoryArrs[0] : [];
        const secondArr = this.categoryArrs[1] ? this.categoryArrs[1] : [];
        const thirdArr = this.categoryArrs[2] ? this.categoryArrs[2] : [];
        const firstLists = firstArr.map(item =>
            (<li><a
                key={item.id}
                onClick={() => {
                    this.fetchCategory(item.id)
                }}
            >
                {item.categoryName}
            </a></li>)
        );
        const secondLists = secondArr.map(item =>
            (<li><a
                key={item.id}
                onClick={() => {
                    this.fetchCategory(item.id)
                }}
            >
                {item.categoryName}
            </a></li>)
        );
        const thirdLists = thirdArr.map(item =>
            (<li><a
                key={item.id}
                onClick={() => {
                    this.fetchCategory(item.id)
                }}
            >
                {item.categoryName}
            </a></li>)
        );
        // const categoryListFn = (arr, categoryFn) => {
        //     arr.map(item =>
        //         (<li><a
        //             key={item.id}
        //             onClick={() => {
        //                 categoryFn(item.id)
        //             }}
        //         >
        //             {item.categoryName}
        //         </a></li>)
        //     );
        // }
        // const firstLists = categoryListFn(firstArr, this.fetchCategory)
        // const secondLists = categoryListFn(secondArr, this.fetchCategory)
        // const thirdLists = categoryListFn(thirdArr, this.fetchFourthCategory)
        return (
            <div className="category-icon-management carousel-management wap-management">
                <div className="carousel-management-tip wap-management-tip">
                     说明：移动端分类图标管理模块管理移动端分类中二目录的图标。5644654
                </div>
                <div>
                    <Row gutter={16}>
                        <Col span={5}>
                            <Card title="一级分类" >
                                <ul>{firstLists}</ul>
                            </Card>
                        </Col>
                        <Col
                            span={5}
                            style={this.state.expand1}
                        >
                            {
                                secondLists
                                && <Card title="二级分类" >
                                    <ul>{secondLists}</ul>
                                </Card>

                            }
                        </Col>
                        <Col
                            span={5}
                            style={this.state.expand1}
                        >
                            {
                                thirdLists
                                && <Card title="三级分类" >
                                    <ul>{thirdLists}</ul>
                                </Card>
                            }
                            
                        </Col>
                        <Col
                            span={8}
                            className="category-lv3-card"
                            style={this.state.expand2}
                        >
                            <Card title="四级分类" >
                                {/* <CategoryIconTable
                                    categoryInfos={{
                                        lv1Name: this.state.lv1Name,
                                        lv2Name: this.state.lv2Name,
                                        lv1Id: this.state.lv1Id,
                                        lv2Id: this.state.lv2Id,
                                    }}
                                /> */}
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

