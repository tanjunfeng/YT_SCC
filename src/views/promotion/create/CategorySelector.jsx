/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 品类选择级联查询
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Form, Modal } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CheckedTree from '../../../container/tree';
import { getAllCompanies, clearCompaniesList } from '../../../actions/promotion';

@connect(state => ({
    companies: state.toJS().promotion.companies
}), dispatch => bindActionCreators({
    getAllCompanies,
    clearCompaniesList
}, dispatch))

class CategorySelector extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checkedCompanies: []
        }
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
    }

    componentWillMount() {
        this.props.clearCompaniesList();
    }

    componentDidMount() {
        this.props.getAllCompanies();
    }

    handleChecked(checkedIds) {
        // 根据选中的区域编号，拼接所选区域列表
        const checkedCompanies = [];
        this.props.companies.forEach((company) => {
            checkedIds.forEach((id) => {
                if (company.id === +(id)) {
                    checkedCompanies.push({
                        companyId: id,
                        companyName: company.name
                    });
                }
            });
        });
        this.setState({ checkedCompanies });
    }

    handleOk() {
        this.props.onSelectorOk(this.state.checkedCompanies);
    }

    handleCancel() {
        this.props.onSelectorCancel();
    }

    render() {
        return (
            <div>
                <Modal
                    title="选择品类"
                    visible={this.props.isSelectorVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <CheckedTree
                        list={this.props.companies}
                        onCheckTreeOk={this.handleChecked}
                    />
                </Modal>
            </div>
        );
    }
}

CategorySelector.propTypes = {
    isSelectorVisible: PropTypes.bool,
    onSelectorOk: PropTypes.func,
    onSelectorCancel: PropTypes.func,
    getAllCompanies: PropTypes.func,
    clearCompaniesList: PropTypes.func,
    companies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
}

export default withRouter(Form.create()(CategorySelector));
