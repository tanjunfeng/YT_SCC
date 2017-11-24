import React, {PureComponent } from 'react';
import PropTypes from 'prop-types';
import '../../../../lib/qunee-min';

const qunee = window.Q;
class FlowChart extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            parentId: ''
        }
    }
    componentWillMount() {
        this.setState({
            parentId: this.props.parentId
        })
    }
    componentDidMount() {
        this.graph = new qunee.Graph('canvas');
        this.GRADIENT = new qunee.Gradient(qunee.Consts.GRADIENT_TYPE_RADIAL,
            [qunee.toColor(0xAAFFFFFF), qunee.toColor(0x11FFFFFF)], [0.1, 0.9]
        );
        this.GRADIENT.position = qunee.Position.RIGHT_TOP;
        this.GRADIENT.tx = -10;
        this.graph.moveToCenter();
        this.RECT = qunee.Shapes.getRect(0, 0, 90, 50, 10);
        this.DIAMOND = qunee.Shapes.getShape(qunee.Consts.SHAPE_DIAMOND, 0, 0, 100, 80);
    }
    componentWillReceiveProps(nextProps) {

    }
    createNode= (host, name, x, y, highlight, isDiamond) => {
        const node = this.graph.createNode(name, x, y);
        node.setStyle(qunee.Styles.SHAPE_FILL_COLOR, highlight ? '#2898E0' : '#DDD');
        node.setStyle(qunee.Styles.SHAPE_FILL_GRADIENT, this.GRADIENT);
        node.setStyle(qunee.Styles.SHAPE_STROKE, 1);
        node.setStyle(qunee.Styles.SHAPE_STROKE_STYLE, '#888888');
        node.setStyle(qunee.Styles.LABEL_ANCHOR_POSITION, qunee.Position.CENTER_MIDDLE);
        node.setStyle(qunee.Styles.LABEL_POSITION, qunee.Position.CENTER_MIDDLE);
        node.image = isDiamond ? this.DIAMOND : this.RECT;
        if (host) {
            node.parent = host;
            node.host = host;
        }
        return node;
    }
    createEdge= (name, from, to, edgeColor, edgeType) => {
        const edge = this.graph.createEdge(name, from, to);
        edge.setStyle(qunee.Styles.LABEL_RADIUS, 0);
        edge.setStyle(qunee.Styles.LABEL_ROTATABLE, false);
        edge.setStyle(qunee.Styles.LABEL_BACKGROUND_COLOR, '#FFFFFF');
        edge.setStyle(qunee.Styles.LABEL_ANCHOR_POSITION, qunee.Position.CENTER_MIDDLE);
        edge.setStyle(qunee.Styles.LABEL_BACKGROUND_COLOR, '#FFFFFF');
        //    edge.setStyle(qunee.Styles.ARROW_TO, false);
        if (edgeColor) {
            edge.setStyle(qunee.Styles.EDGE_COLOR, edgeColor);
        }
        if (edgeType) {
            edge.edgeType = edgeType;
        }
        return edge;
    }
    clearFlowChart= () => {
        const canvas = document.getElementById('canvas');
        while (canvas && canvas.hasChildNodes()) {
            canvas.removeChild(canvas.firstChild)
        }
    }
    isShow= (flag) => {
        const canvas = document.getElementById('canvas');
        if (canvas) {
            if (flag) {
                canvas.style.display = 'block'
            } else {
                canvas.style.display = 'none'
            }
        }
    }
    render() {
        this.clearFlowChart();
        if (!this.props.data) {
            return null
        }
        const {parentId} = this.state;
        if (!this.props.visible) {
            this.isShow(false)
        } else {
            this.isShow(true)
        }
        const datas = this.props.data;
        const keys = Object.keys(datas);
        const nodes = {};
        keys.map((key) => {
            const data = datas[key];
            const node = this.createNode(null, data.name, data.x, data.y, data.highlight, data.isDiamond);
            nodes[key] = [node, data.to, data.isYes];
            return nodes;
        });
        keys.map((key) => {
            const from = nodes[key];
            for (let i = 0; i < from[1].length; i++) {
                this.createEdge(from[2], from[0], nodes[from[1][i]][0], false, qunee.Consts.EDGE_TYPE_HORIZONTAL_VERTICAL);
            }
            return false
        })
        return (
            <div id={parentId}>
                <div id="canvas"></div>
            </div>
        )
    }
}
FlowChart.propTypes = {
    data: PropTypes.objectOf(PropTypes.objectOf(PropTypes.any))
}

export default FlowChart;
