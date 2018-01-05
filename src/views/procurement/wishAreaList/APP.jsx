/*
 * @Author: tanjf
 * @Description: 心愿专区
 * @CreateDate: 2018-01-05 17:09:59
 * @Last Modified by: tanjf
 * @Last Modified time: 2018-01-05 17:27:02
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionsCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

@connect(state => ({

}), dispatch => bindActionsCreators({

}, dispatch))

class WishAreaList extends PureComponent {
    constructor(prosp) {
        super(props);
    }
}

render() {
    return (
        <div>
            123123
        </div>
    )
}

WishAreaList.PropTypes = {

}

export default withRouter(Form.creat()(WishAreaList));
