import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class FlowImage extends PureComponent {
    componentWillUnmount() {
        this.props.closeCanvas();
    }
    render() {
        const data = this.props.data;
        return (
            <div>
                {data ? (
                    <div id="canvasRoot" >
                        {this.props.children}
                        <img src={`data:img/jpg;base64,${data}`} alt="流程图" />
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
    closeCanvas: PropTypes.func
}
export default FlowImage;
