import {PureComponent } from 'react';
import '../../../../lib/qunee-min';

class FlowChart extends PureComponent {
    constructor(props) {
        super(props);
        this.createText = this.createText.bind(this);
        this.createNode = this.createNode.bind(this);
        this.createRect = this.createRect.bind(this);
        this.createEdge = this.createEdge.bind(this);
        // this.closeCanvas = this.closeCanvas.bind(this);
    }
    createText(text, x, y) {
        const node = this.graph.createText(text, x, y);
        node.anchorPosition = Q.Position.LEFT_BOTTOM;
        return node;
    }
    createNode(host, name, x, y, highlight, isDiamond) {
        const node = this.graph.createNode(name, x, y);
        node.setStyle(Q.Styles.SHAPE_FILL_COLOR, highlight ? '#2898E0' : '#DDD');
        node.setStyle(Q.Styles.SHAPE_FILL_GRADIENT, this.GRADIENT);
        node.setStyle(Q.Styles.SHAPE_STROKE, 1);
        node.setStyle(Q.Styles.SHAPE_STROKE_STYLE, '#888888');
        node.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
        node.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
        node.image = isDiamond ? this.DIAMOND : this.RECT;
        if (host) {
            node.parent = host;
            node.host = host;
        }
        return node;
    }
    createRect(name, left, top, width, height, fillColor) {
        const rect = this.graph.createNode(name, left, top);
        rect.anchorPosition = Q.Position.LEFT_TOP;
        rect.image = Q.Shapes.getRect(0, 0, width, height);
        rect.setStyle(Q.Styles.SHAPE_STROKE, 0.3);
        rect.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_TOP);
        rect.setStyle(Q.Styles.LABEL_POSITION, Q.Position.LEFT_MIDDLE);
        rect.setStyle(Q.Styles.LABEL_ROTATE, -Math.PI / 2);
        rect.setStyle(Q.Styles.LABEL_PADDING, 5);
        if (fillColor) {
            rect.setStyle(Q.Styles.SHAPE_FILL_COLOR, fillColor);
        }
        return rect;
    }
    createEdge(name, from, to, edgeColor, edgeType) {
        const edge = this.graph.createEdge(name, from, to);
        edge.setStyle(Q.Styles.LABEL_RADIUS, 0);
        edge.setStyle(Q.Styles.LABEL_ROTATABLE, false);
        edge.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, '#FFFFFF');
        edge.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
        edge.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, '#FFFFFF');
        //    edge.setStyle(Q.Styles.ARROW_TO, false);
        if (edgeColor) {
            edge.setStyle(Q.Styles.EDGE_COLOR, edgeColor);
        }
        if (edgeType) {
            edge.edgeType = edgeType;
        }
        return edge;
    }
    // closeCanvas(){
    //     console.log('in');
    //     document.getElementById('canvasRoot').removeChild(this.canvasDom);
    // }
    render() {
        if (!this.props.data) {
            return null
        }
        if (!document.getElementById('canvas')) {
            this.canvasDom = document.createElement('div');
            this.canvasDom.setAttribute('id','canvas');
            this.canvasDom.style.height = '500px';
            this.canvasDom.style.width = '1000px';
            document.getElementById('canvasRoot').appendChild(this.canvasDom);
        }
        this.graph = new Q.Graph(canvas);
        this.GRADIENT = new Q.Gradient(Q.Consts.GRADIENT_TYPE_RADIAL,
            [Q.toColor(0xAAFFFFFF), Q.toColor(0x11FFFFFF)], [0.1, 0.9]
        );
        this.GRADIENT.position = Q.Position.RIGHT_TOP;
        this.GRADIENT.tx = -10;
        this.graph.moveToCenter();
        this.RECT = Q.Shapes.getRect(0, 0, 90, 50, 10);
        this.DIAMOND = Q.Shapes.getShape(Q.Consts.SHAPE_DIAMOND, 0, 0, 100, 80);
        const datas = {
            "node1":{
                "name":"Customer\nProvides\nAccount Info",
                "x":78,
                "y":73,
                "highlight":false,
                "isDiamond":false,
                "to":["node3"],
                "isYes":null
            },
            "node2":{
                "name":"Request to\nMake\nPayment",
                "x":184,
                "y":73,
                "highlight":false,
                "isDiamond":false,
                "to":["node4"],
                "isYes":null
            },
            "node3":{
                "name":"Search\nCustomer",
                "x":78,
                "y":173,
                "highlight":false,
                "isDiamond":false,
                "to":[],
                "isYes":null
            },
            "node4":{
                "name":"View Account\nBalance",
                "x":184,
                "y":173,
                "highlight":true,
                "isDiamond":false,
                "to":["node5","node6"],
                "isYes":null
            },
            "node5":{
                "name":"Send Account\nBalances",
                "x":184,
                "y":350,
                "highlight":true,
                "isDiamond":false,
                "to":[],
                "isYes":null
            },
            "node6":{
                "name":"One\nTime\nPayment",
                "x":311,
                "y":173,
                "highlight":false,
                "isDiamond":true,
                "to":["node7"],
                "isYes":"yes"
            },
            "node7":{
                "name":"Capture\nPayment\nMethod",
                "x":460,
                "y":173,
                "highlight":false,
                "isDiamond":false,
                "to":["node8","node12"],
                "isYes":null
            },
            "node8":{
                "name":"Submit\nPayment",
                "x":460,
                "y":240,
                "highlight":true,
                "isDiamond":false,
                "to":["node9"],
                "isYes":null
            },
            "node9":{
                "name":"Process\nPayment",
                "x":460,
                "y":350,
                "highlight":true,
                "isDiamond":false,
                "to":["node10","node11"],
                "isYes":null
            },
            "node10":{
                "name":"Receive Pmt\nConfirmation\nNumber",
                "x":250,
                "y":273,
                "highlight":true,
                "isDiamond":false,
                "to":[],
                "isYes":null
            },
            "node11":{
                "name":"Provide\nConfirmation\nNumber",
                "x":460,
                "y":437,
                "highlight":false,
                "isDiamond":false,
                "to":[],
                "isYes":null
            },
            "node12":{
                "name":"Validate\nPayment\nInformation",
                "x":565,
                "y":437,
                "highlight":false,
                "isDiamond":false,
                "to":[],
                "isYes":null
            }
        };
        const keys = Object.keys(datas);
        const nodes = {};
        const self = this;
        keys.map(function(key){
            var data = datas[key];
            var node = self.createNode(null, data.name, data.x,data.y,data.highlight,data.isDiamond);
            nodes[key] = [node,data.to,data.isYes];
        });
        keys.map(function(key){
            let from = nodes[key];
            for(let i=0;i<from[1].length;i++){
                self.createEdge(from[2], from[0], nodes[from[1][i]][0],false,Q.Consts.EDGE_TYPE_HORIZONTAL_VERTICAL);
            }
        })
        return (
            this.props.children
        )
    }
}

export default  FlowChart;