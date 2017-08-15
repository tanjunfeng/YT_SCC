/**
 * @file tree.js
 * @author denglingbo
 *
 * 禁用 Tree 组件的不限制层级拖拽
 */
import Tree from 'antd/node_modules/rc-tree/lib/Tree';
/* eslint-disable */


/*
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Tree.prototype.onDrop = function onDrop(e, treeNode) {
    var key = treeNode.props.eventKey;
    this.setState({
        dragOverNodeKey: '',
        dropNodeKey: key
    });
    if (this.dragNodesKeys.indexOf(key) > -1) {
        if (console.warn) {
            console.warn('can not drop to dragNode(include it\'s children node)');
        }
        return false;
    }

    var posArr = treeNode.props.pos.split('-');
    var res = {
        event: e,
        node: treeNode,
        dragNode: this.dragNode,
        dragNodesKeys: [].concat(_toConsumableArray(this.dragNodesKeys)),
        dropPosition: this.dropPosition + Number(posArr[posArr.length - 1])
    };
    if (this.dropPosition !== 0) {
        res.dropToGap = true;
    }
    if ('expandedKeys' in this.props) {
        // `this._rawExpandedKeys` change to `this._rawExpandedKeys || []`
        res.rawExpandedKeys = [].concat(_toConsumableArray(this._rawExpandedKeys || [])) || [].concat(_toConsumableArray(this.state.expandedKeys));
    }
    this.props.onDrop(res);
    this._dropTrigger = true;
};

Tree.prototype.onDragEnter = function onDragEnter(e, treeNode) {
    const enterGap = this.onDragEnterGap(e, treeNode);
    console.log(1)
    if (this.dragNode.props.eventKey === treeNode.props.eventKey && enterGap === 0) {
        this.setState({
            dragOverNodeKey: ''
        });

        return;
    }

    const st = {
        dragOverNodeKey: treeNode.props.eventKey
    };

    // 这里进行一次重写判断，不自动展开
    // const expandedKeys = this.getExpandedKeys(treeNode, true);
    const expandedKeys = this.getExpandedKeys(treeNode, false);

    if (expandedKeys) {
        this.getRawExpandedKeys();
        st.expandedKeys = expandedKeys;
    }

    this.setState(st);

    this.props.onDragEnter({
        event: e,
        node: treeNode
    });
};
*/
