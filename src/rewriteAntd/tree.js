/**
 * @file tree.js
 * @author denglingbo
 *
 * 禁用 Tree 组件的不限制层级拖拽
 */
import Tree from 'antd/node_modules/rc-tree/lib/Tree';

Tree.prototype.onDragEnter = function onDragEnter(e, treeNode) {
    const enterGap = this.onDragEnterGap(e, treeNode);

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
