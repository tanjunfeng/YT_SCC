import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

function ImageDom(props) {
    const url = props.imgUrl;
    const imgStyle = props.imgStyle;
    const chartStyle = {
        width: `${imgStyle.width}px`,
        height: `${imgStyle.height}px`,
        top: `${imgStyle.top}px`,
        left: `${imgStyle.left}px`,
        position: 'absolute',
        borderWidth: '3px',
        borderStyle: 'solid',
        borderColor: imgStyle.color
    }
    return (
        <div className="canvas">
            <img src={url} alt="流程图" />
            <div style={chartStyle} />
        </div>
    )
}
class FlowImage extends PureComponent {
    render() {
        const data = this.props.data;
        return (
            <div>
                {data ? (
                    <div id="canvasRoot" >
                        {this.props.children}
                        <ImageDom imgUrl={this.props.data} imgStyle={this.props.imgStyle} />
                    </div>
                ) : (
                    null
                )}
            </div>
        )
    }
}
FlowImage.propTypes = {
    data: PropTypes.string,
    children: PropTypes.node,
    imgStyle: PropTypes.objectOf(PropTypes.any)
}
FlowImage.defaultProps = {
    imgStyle: {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        color: 'transparent'
    }
}
export default FlowImage;
