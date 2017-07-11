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

import React, {Component} from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

const x = 2;
const y = 1;
const z = 1;
const gData = [{
    title: 1,
    key: 1,
    children: [
        {
            title: '1-1',
            key: '1-1'
        },
        {
            title: '1-1',
            key: '1-2'
        },
        {
            title: '1-1',
            key: '1-3'
        },
        {
            title: '1-1',
            key: '1-4'
        },
        {
            title: '1-1',
            key: '1-5'
        },
        {
            title: '1-1',
            key: '1-6'
        },
        {
            title: '1-1',
            key: '1-7'
        },
    ]
},
{
    title: 1,
    key: 2,
    children: [
        {
            title: '1-1',
            key: '2-1'
        },
        {
            title: '1-1',
            key: '2-2'
        },
        {
            title: '1-1',
            key: '2-3'
        },
        {
            title: '1-1',
            key: '2-4'
        },
        {
            title: '1-1',
            key: '2-5'
        },
        {
            title: '1-1',
            key: '2-6'
        },
        {
            title: '1-1',
            key: '2-7'
        },
    ]
}];

// const generateData = (_level, _preKey, _tns) => {
//   const preKey = _preKey || '0';
//   const tns = _tns || gData;

//   const children = [];
//   for (let i = 0; i < x; i++) {
//       console.log(i);
//     const key = `${preKey}-${i}`;
//     tns.push({ title: key, key });
//     if (i < y) {
//       children.push(key);
//     }
//   }
//   if (_level < 0) {
//     return tns;
//   }
//   const level = _level - 1;
//   children.forEach((key, index) => {
//     tns[index].children = [];
//     return generateData(level, key, tns[index].children);
//   });
// };
// generateData(z);

class Demo extends React.Component {
  state = {
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: ['0-0-0'],
    selectedKeys: [],
  }
  onExpand = (expandedKeys) => {
      const len = expandedKeys.length;
      console.log(len)
    const key = expandedKeys.splice(len - 1, len);
    this.setState({
      expandedKeys: key,
      autoExpandParent: false,
    });
  }
  onCheck = (checkedKeys) => {
    this.setState({
      checkedKeys,
      selectedKeys: ['0-3', '0-4'],
    });
  }
  onSelect = (selectedKeys, info) => {
      console.log(selectedKeys)
    console.log('onSelect', info);
    this.setState({ selectedKeys, expandedKeys: selectedKeys });
  }
  render() {
    const loop = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode key={item.key} title={item.key}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={item.key} />;
    });
    return (
      <Tree
        checkable
        className="space-choose-space"
        onExpand={this.onExpand}
        expandedKeys={['1']}
        expandedKeys={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
        onCheck={this.onCheck}
        checkedKeys={this.state.checkedKeys}
        onSelect={this.onSelect}
      >
        {loop(gData)}
      </Tree>
    );
  }
}

export default Demo;
