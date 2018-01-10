import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
    Form,
    // Table,
    // message
} from 'antd';
// @connect(state => ({
//     priceImportlist: state.toJS().priceImport.priceImportlist,
// }), dispatch => bindActionCreators({
//     getPriceImportList,
//     getCreateSell
// }, dispatch))
class RegionManage extends PureComponent {
    componentDidMount() {}
    render() {
        return <div className="test">Region Manage</div>;
    }
}

RegionManage.propTypes = {

};

export default withRouter(Form.create()(RegionManage));
