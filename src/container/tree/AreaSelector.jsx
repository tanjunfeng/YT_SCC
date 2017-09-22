/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 子公司区域选择模态框
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Form, Modal, message } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CheckedTree } from './index';
import { getAllCompanies, clearCompaniesList } from '../../actions/pub';

@connect(state => ({
    companies: state.toJS().pub.companies
}), dispatch => bindActionCreators({
    getAllCompanies,
    clearCompaniesList
}, dispatch))

class AreaSelector extends PureComponent {
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

    // 当弹框隐藏时，通知本组件
    componentWillReceiveProps(nextProps) {
        if (!nextProps.isSelectorVisible) {
            this.setState({
                checkedCompanies: []
            });
        }
    }

    componentWillUnmount() {
        this.props.clearCompaniesList();
    }

    handleChecked(checkedIds) {
        // 根据选中的区域编号，拼接所选区域列表
        const checkedCompanies = [];
        this.props.companies.forEach((company) => {
            checkedIds.forEach((id) => {
                if (+(company.id) === +(id)) {
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
        if (this.state.checkedCompanies.length === 0) {
            message.error('请至少选择一个子公司');
            return;
        }
        this.props.onSelectorOk(this.state.checkedCompanies);
    }

    handleCancel() {
        this.props.onSelectorCancel();
    }

    render() {
        return (
            <div>
                <Modal
                    title="选择区域"
                    visible={this.props.isSelectorVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <CheckedTree
                        list={this.props.companies}
                        isEmpty={!this.props.isSelectorVisible}
                        onCheckTreeOk={this.handleChecked}
                    />
                </Modal>
            </div>
        );
    }
}

AreaSelector.propTypes = {
    isSelectorVisible: PropTypes.bool,
    onSelectorOk: PropTypes.func,
    onSelectorCancel: PropTypes.func,
    getAllCompanies: PropTypes.func,
    clearCompaniesList: PropTypes.func,
    companies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
}

export default withRouter(Form.create()(AreaSelector));
