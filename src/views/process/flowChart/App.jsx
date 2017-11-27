import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

function ImageDom(props) {
    const url = props.imgUrl;
    // const chartStyle = {
    //     width: `${chartData.width}px`,
    //     height: `${chartData.height}px`,
    //     top: `${chartData.top}px`,
    //     left: `${chartData.left}px`
    // }
    return (
        <div className="canvas">
            <img src={url} alt="流程图" />
            {/* <div className="hightLight" style={chartStyle} /> */}
        </div>
    )
}
class FlowChart extends PureComponent {
    render() {
        const data = this.props.data;
        return (
            <div>
                {data ? (
                    <div id="canvasRoot" >
                        {this.props.children}
                        <ImageDom imgUrl={this.props.data} />
                    </div>
                ) : (
                    null
                )}
            </div>
        )
    }
}
FlowChart.propTypes = {
    data: PropTypes.string,
    children: PropTypes.node,
}

export default FlowChart;
