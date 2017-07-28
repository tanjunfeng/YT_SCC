// import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import { withRouter } from 'react-router';
// import { Form, Input, Button, Table } from 'antd';

// import { fetchSaleRegion, modifyAreaVisible } from '../../../actions';
// import { PAGE_SIZE } from '../../../constant';
// import Utils from '../../../util/util';
// import AreaDetail from './areaDetail';
// import { supplierAreaList } from '../../../constant/formColumns';

// const FormItem = Form.Item;

// const columns = supplierAreaList;

// @connect(
//     state => ({
//         areaData: state.toJS().supplier.areaData,
//         areaVisible: state.toJS().supplier.areaVisible,
//     }),
//     dispatch => bindActionCreators({
//         fetchSaleRegion,
//         modifyAreaVisible,
//     }, dispatch)
// )
// class SupplierAreaManagement extends PureComponent {
//     constructor(props) {
//         super(props);

//         this.handleSubmit = ::this.handleSubmit;
//         this.handlePaginationChange = ::this.handlePaginationChange;
//         this.handleRest = ::this.handleRest;

//         columns[columns.length - 1].render = (text, record) => (
//             record.saleRegions && <a onClick={() => this.handleWatch(record)}>查看</a>
//         );

//         this.searchForm = {};
//     }

//     componentDidMount() {
//         this.props.fetchSaleRegion({pageSize: PAGE_SIZE, pageNum: 1, ...this.searchForm});
//     }

//     handleSubmit() {
//         const formData = this.props.form.getFieldsValue();
//         this.searchForm = Utils.removeInvalid(formData);
//         this.props.fetchSaleRegion({pageSize: PAGE_SIZE, pageNum: 1, ...this.searchForm});
//     }

//     handleRest() {
//         this.props.form.resetFields();
//         this.searchForm = {};
//         this.props.fetchSaleRegion({pageSize: PAGE_SIZE, pageNum: 1, ...this.searchForm});
//     }

//     handleWatch(record) {
//         this.props.modifyAreaVisible({isVisible: true, record});
//     }

//     handlePaginationChange(goto) {
//         this.props.fetchSaleRegion({pageSize: PAGE_SIZE, pageNum: goto, ...this.searchForm});
//     }

//     render() {
//         const { getFieldDecorator } = this.props.form;
//         const { list, pageSize, pageNum, total } = this.props.areaData;

//         return (
//             <div className="area">
//                 <div className="area-form">
//                     <Form layout="inline">
//                         {/* 公司名称 */}
//                         <FormItem>
//                             <div>
//                                 <span className="manage-form-label">公司名称</span>
//                                 {getFieldDecorator('companyName', {
//                                 })(
//                                     <Input className="manage-form-companyName" placeholder="公司名称" />
//                                 )}
//                             </div>
//                         </FormItem>
//                         <FormItem>
//                             <div>
//                                 <span className="manage-form-label">供应商编号</span>
//                                 {getFieldDecorator('spNo', {
//                                 })(
//                                     <Input className="manage-form-companyName" placeholder="供应商编号" />
//                                 )}
//                             </div>
//                         </FormItem>
//                         <FormItem>
//                             <Button type="primary" onClick={this.handleSubmit} size="default">
//                                 搜索
//                             </Button>
//                         </FormItem>
//                         <FormItem>
//                             <Button size="default" onClick={this.handleRest}>
//                                 重置
//                             </Button>
//                         </FormItem>
//                     </Form>
//                 </div>
//                 <div className="area-list">
//                     <Table
//                         dataSource={list}
//                         columns={columns}
//                         rowKey="id"
//                         pagination={{
//                             current: pageNum,
//                             total,
//                             pageSize,
//                             showQuickJumper: true,
//                             onChange: this.handlePaginationChange
//                         }}
//                     />
//                 </div>
//                 {
//                     this.props.areaVisible &&
//                     <AreaDetail />
//                 }
//             </div>
//         );
//     }
// }

// SupplierAreaManagement.propTypes = {
//     fetchSaleRegion: PropTypes.func,
//     modifyAreaVisible: PropTypes.func,
//     form: PropTypes.objectOf(PropTypes.any),
//     areaData: PropTypes.objectOf(PropTypes.any),
//     areaVisible: PropTypes.bool
// }

// export default Form.create()(withRouter(SupplierAreaManagement));

<<<<<<< HEAD

import React, { Component } from 'react';
import { Input } from 'antd';
import Align from 'rc-align';
import InlineTree from '../../../components/inlineTree';
import SteppedPrice from '../../commodity/steppedPrice';
import SellPriceModal from '../../commodity/sellPriceModal';
import ProdPurchaseModal from '../../commodity/prodPurchaseModal';


class Demo extends React.Component {
    state = {
        monitor: true,
        align: {
            points: ['cc', 'cc'],
        },
    }

    getTarget = () => {
        let ref = this.refs.container;
        if (!ref) {
            // parent ref not attached
            ref = document.getElementById('container');
        }
        return ref;
    }

    toggleMonitor = () => {
        // this.setState({
        //     monitor: !this.state.monitor,
        // });
    }

    forceAlign = () => {
        this.setState({
            align: assign({}, this.state.align),
        });
    }

    render() {
        return (
            <div
                style={{
                    margin: 50,
                }}
            >
                <p>
                    <button onClick={this.forceAlign}>force align</button>
                    &nbsp;&nbsp;&nbsp;
          <button onClick={this.toggleMonitor}>toggle monitor</button>
                </p>
                <div
                    ref="container"
                    id="container"
                    style={{
                        width: '80%',
                        height: 500,
                        border: '1px solid red',
                    }}
                >
                    <Align
                        target={this.getTarget}
                        monitorWindowResize={this.state.monitor}
                        align={this.state.align}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                width: 50,
                                height: 50,
                                background: 'yellow',
                            }}
                        >
                            source
            </div>
                    </Align>
                </div>
            </div>
        );
    }
}

export default Demo;
=======
import React, { Component } from 'react';
import { Input } from 'antd';
import Align from 'rc-align';
import InlineTree from '../../../components/inlineTree';
import SteppedPrice from '../../commodity/steppedPrice';
import SellPriceModal from '../../commodity/sellPriceModal';
import ProdPurchaseModal from '../../commodity/prodPurchaseModal';


class Demo extends React.Component {
    state = {
        monitor: true,
        align: {
            points: ['cc', 'cc'],
        },
    }

    getTarget = () => {
        let ref = this.refs.container;
        if (!ref) {
            // parent ref not attached
            ref = document.getElementById('container');
        }
        return ref;
    }

    toggleMonitor = () => {
        // this.setState({
        //     monitor: !this.state.monitor,
        // });
    }

    forceAlign = () => {
        this.setState({
            align: assign({}, this.state.align),
        });
    }

    render() {
        return (
            <div
                style={{
                    margin: 50,
                }}
            >
                <p>
                    <button onClick={this.forceAlign}>force align</button>
                    &nbsp;&nbsp;&nbsp;
          <button onClick={this.toggleMonitor}>toggle monitor</button>
                </p>
                <div
                    ref="container"
                    id="container"
                    style={{
                        width: '80%',
                        height: 500,
                        border: '1px solid red',
                    }}
                >
                    <Align
                        target={this.getTarget}
                        monitorWindowResize={this.state.monitor}
                        align={this.state.align}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                width: 50,
                                height: 50,
                                background: 'yellow',
                            }}
                        >
                            source
            </div>
                    </Align>
                </div>
            </div>
        );
    }
}

export default Demo;

>>>>>>> e4734c845987fe14682b1a89a08c85ad302cb467
