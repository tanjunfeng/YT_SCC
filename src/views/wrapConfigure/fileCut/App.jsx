import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button } from 'antd';
import ImageUploader from '../../../common/preImage';

class FileCut extends Component {
    constructor(props) {
        super(props);
        this.handleCut = ::this.handleCut;
        this.handleEdit = ::this.handleEdit;
        this.state = {
            isEdit: !props.defaultImge,
            img: props.defaultImge
        }
    }

    getValue() {
        const { isEdit } = this.state;
        const { defaultImge } = this.props;
        return {
            isBase64: isEdit,
            image: isEdit ? this.imageUploader.getImageByBase64() : defaultImge
        }
    }

    handleCut() {
        this.setState({
            isEdit: false,
        })
    }

    handleEdit() {
        this.setState({
            isEdit: true,
        })
    }

    renderBtns() {
        const { defaultImge } = this.props;
        const { isEdit } = this.state;
        if (defaultImge) {
            return (
                <div>
                    {
                        isEdit
                        ? <Button onClick={this.handleCut}>返回</Button>
                        : <Button onClick={this.handleEdit}>重新选取</Button>
                    }
                </div>
            )
        }
        return null;
    }

    render() {
        const { width, height, defaultImge, dpr, accept, ...props } = this.props;
        return (
            <div className={classnames('upload-cut-wrap', {
                'upload-cut-wrap-pre': this.state.isEdit
            })}
            >
                <ImageUploader
                    {...props}
                    ref={ref => { this.imageUploader = ref }}
                    width={width}
                    height={height}
                    dpr={dpr}
                    accept={accept}
                />
                <img
                    src={defaultImge}
                    className="upload-cut-pre-img"
                    alt="icon"
                    width={`${width / dpr}px`}
                    height={`${height / dpr}px`}
                />

                { this.renderBtns() }
            </div>
        );
    }
}

FileCut.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    defaultImge: PropTypes.string,
    handleChange: PropTypes.func,
    accept: PropTypes.array,
};

FileCut.defaultTypes = {
    width: 200,
    height: 200,
    accept: ['jpg', 'jpeg', 'png']
}

export default FileCut;
