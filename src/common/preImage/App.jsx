/**
 * @file App.jsx
 * @author denglingbo
 *
 * Des
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Slider, Popover, Icon, message } from 'antd';
import BasicInfo from './BasicInfo';

class PreImage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            /**
             * 组件状态
             * 0: 未添加图片
             * 1: 已经添加图片
             */
            status: 0,

            /**
             * 默认缩放比例
             */
            scale: props.scale,

            /**
             * 当前的画布宽度
             */
            canvasWidth: 0,

            /**
             * 当前的画布高度
             */
            canvasHeight: 0,
        };

        // 是否可以位移
        this.allowMove = false;
        // 图片
        this.image = null;
        // File Type
        this.fileType = null;

        // 移动的基本信息
        this.basicInfo = new BasicInfo();

        this.handleFile = ::this.handleFile;
        this.handleGetFile = ::this.handleGetFile;
        this.handleControl = ::this.handleControl;

        this.handleDragStart = ::this.handleDragStart;
        this.handleDragEnd = ::this.handleDragEnd;
        this.handleDraging = ::this.handleDraging;
        this.handleChangeScale = ::this.handleChangeScale;
    }

    componentWillMount() {
        window.addEventListener('mousemove', this.handleDraging);
        window.addEventListener('mouseup', this.handleDragEnd);
    }

    componentDidMount() {
        this.controllerCtx = this.controller.getContext('2d');
        this.referenceCtx = this.reference.getContext('2d');
        this.storeCtx = this.store.getContext('2d');

        this.getDefaultImage();
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.handleDragEnd);
        window.removeEventListener('mousemove', this.handleDraging);
    }

    /**
     * 获取相应位置缩放的数据
     * @param dir, x or y
     * @return {number}
     */
    getScaleValue(dir) {
        const { scale } = this.state;
        const { dpr } = this.props;

        const value = this.state[dir === 'x' ? 'canvasWidth' : 'canvasHeight'];
        const pos = this.basicInfo.pos[dir === 'x' ? 'x' : 'y'];

        return ((value - (value * scale)) * 0.5) + (pos * scale);
    }

    /**
     * 获取图片的 base64
     * @return {string}
     */
    getImageByBase64() {
        if (this.state.status === 0) {
            return null;
        }

        const { width, height, dpr, quality } = this.props;
        const { scale, canvasWidth, canvasHeight } = this.state;
        const { x, y } = this.basicInfo.pos;
        const fileType = this.getImageType();

        this.referenceCtx.clearRect(0, 0, canvasWidth * dpr, canvasHeight * dpr);
        this.storeCtx.clearRect(0, 0, width * dpr, height * dpr);

        // 在 canvas 绘制前填充白色背景, 解决被截取的图片背景是黑色
        if (fileType === 'image/jpeg') {
            this.referenceCtx.fillStyle = '#fff';
            this.referenceCtx.fillRect(0, 0, width * dpr, height * dpr);
        }

        // 从画布剪切的开始坐标系（画布的左上角为 0, 0）
        const cutStartX = (canvasWidth * scale * dpr - width) * 0.5;
        const cutStartY = (canvasHeight * scale * dpr - height) * 0.5;

        // 这个画布中的内容作为裁剪图片的源
        this.referenceCtx.drawImage(
            this.image,
            0,
            0,
            canvasWidth * dpr,
            canvasHeight * dpr,
            x * dpr * scale,
            y * dpr * scale,
            canvasWidth * dpr * scale,
            canvasHeight * dpr * scale,
        );

        this.storeCtx.drawImage(
            // 这里直接从 reference canvas 中获取图片
            this.reference,
            // 从 canvas x, y 坐标获取图像
            cutStartX, cutStartY,
            // 截多少尺寸的图像
            width, height,
            // 放置在画布的位置
            0, 0,
            // 使用的图像尺寸
            width, height
        )

        // quality 经过测试 95% 与原图最为接近，超过98% size远大于原图
        return this.store.toDataURL(fileType, quality / 100 * 0.95);
    }

    /**
     * 获取图片类型
     * @return {string}
     */
    getImageType() {
        return this.fileType || 'image/jpeg';
    }

    /**
     * 重置画布
     */
    resetImage() {
        this.setState({
            scale: 1,
        }, () => {
            this.basicInfo.reset();
            this.toDraw();
        });
    }

    /**
     * 删除图片
     */
    deleteImage() {
        // 该代码，只是为了下次如果还选了同样的图片不会触发 file onchange
        this.fileButton.value = '';

        this.allowMove = false;
        this.image = null;
        this.fileType = null;
        this.basicInfo.reset();

        this.setState({
            status: 0,
            scale: 1,
        });
    }

    /**
     * 操作容器
     * @param event
     */
    handleControl(event) {
        const type = event.currentTarget.getAttribute('data-type');

        if (type === 'reset') {
            this.resetImage();
        }

        if (type === 'delete') {
            this.deleteImage();
        }
    }

    /**
     * 判断是否在可上传类型范围中
     *
     * @param {string} type, eg: image/jpeg
     * @return {boolean}
     */
    isAccept(type) {
        let match = false;
        this.props.accept.forEach(t => {
            if (new RegExp(`${t}$`).test(type)) {
                match = true;
            }
        });

        return match;
    }

    /**
     * 拖拽准备开始
     * @param event
     */
    handleDragStart(event) {
        if (event.button === 2) {
            return;
        }

        const { pos } = this.basicInfo;
        this.allowMove = true;

        this.basicInfo.start = {
            x: pos.x,
            y: pos.y,
        };

        this.basicInfo.click = {
            x: event.screenX,
            y: event.screenY,
        };
    }

    /**
     * 拖拽结束
     */
    handleDragEnd() {
        this.allowMove = false;
    }

    /**
     * 拖拽移动位置
     * @param event
     */
    handleDraging(event) {
        if (this.allowMove) {
            const { start, click } = this.basicInfo;

            // 这里是当前的相对位移
            this.basicInfo.pos = {
                x: (event.screenX - click.x) + start.x,
                y: (event.screenY - click.y) + start.y,
            };

            this.toDraw();
        }
    }

    /**
     * 缩放画布
     * @param scale
     */
    handleChangeScale(scale) {
        const { canvasWidth, canvasHeight } = this.state;
        const { dpr } = this.props;

        this.setState({
            scale,
        }, () => {
            this.controllerCtx.clearRect(0, 0, canvasWidth, canvasHeight);
            this.controllerCtx.save();
            this.controllerCtx.drawImage(
                this.image,
                0,
                0,
                // 这里截取图像的宽高，需要乘以 dpr ，这样才能获得当前 dpr 的图片正确尺寸
                canvasWidth * dpr,
                canvasHeight * dpr,
                this.getScaleValue('x'),
                this.getScaleValue('y'),
                canvasWidth * scale,
                canvasHeight * scale
            );
            this.controllerCtx.restore();
        });
    }

    /**
     * 绘制图片
     */
    toDraw() {
        const { canvasWidth, canvasHeight, scale } = this.state;
        const { width, height, dpr } = this.props;

        if (this.image == null) {
            return;
        }

        this.controllerCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.controllerCtx.save();
        this.controllerCtx.drawImage(
            this.image,
            this.getScaleValue('x'),
            this.getScaleValue('y'),
            canvasWidth * scale,
            canvasHeight * scale
        );

        this.controllerCtx.restore();
    }

    handleFile() {
        this.fileButton.click();
    }

    /**
     * 判断图片地址是否跨域
     * @param url
     * @return {boolean}
     */
    isCrossOriginImage(url) {
        const localOrigin = window.location.origin;
        const expr = new RegExp(localOrigin);

        return expr.test(url);
    }

    /**
     * 加载图片
     * @param url
     */
    loadImage(url) {
        const { dpr } = this.props;
        this.image = new Image();
        this.image.src = url;

        if (this.isCrossOriginImage(url)) {
            this.image.crossOrigin = 'Anonymous';
        }

        this.image.addEventListener('load', () => {
            this.setState({
                status: 1,
                canvasWidth: this.image.width / dpr,
                canvasHeight: this.image.height / dpr,
            }, () => this.toDraw());
        });
    }

    /**
     * 显示默认图片
     */
    getDefaultImage() {
        const { url } = this.props;

        if (!url) {
            return;
        }

        const expr = /\.(\w+)$/.exec(url);

        if (expr && expr[1]) {
            this.fileType = `image/${expr[1]}`;
        } else {
            message.error('图片类型错误');
            return;
        }

        this.loadImage(url);
    }

    /**
     * 本地获取图片并展示
     * @param event
     */
    handleGetFile(event) {
        if (event.button === 2) {
            return;
        }

        const { error } = this.props;
        const file = event.target.files[0];
        const fileReader = new FileReader();

        if (!this.isAccept(file.type)) {
            const accept = this.props.accept.join(', ');
            message.error(error.accept.replace('{accept}', accept));
            return;
        }

        if (file.size > this.props.maxsize) {
            const kb = (this.props.maxsize / 1024 / 1024).toFixed(2);
            message.error(error.size.replace('{size}', kb));
            return;
        }

        this.fileType = file.type;

        fileReader.readAsDataURL(file);

        fileReader.addEventListener('load', (e) => {
            this.loadImage(e.target.result);
        });
    }

    renderBarTitle() {
        if (this.state.status === 0) {
            return null;
        }

        return (
            <div className="pre-image-bar-title">
                <span
                    data-type="reset"
                    onClick={this.handleControl}
                >
                    <Icon type="reload" />
                </span>
                <span
                    data-type="delete"
                    onClick={this.handleControl}
                >
                    <Icon type="delete" />
                </span>
            </div>
        );
    }

    renderBarContent() {
        if (this.state.status === 0) {
            return null;
        }

        return (
            <div className="pre-image-bar-content">
                <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={this.handleChangeScale}
                    value={this.state.scale}
                />
            </div>
        );
    }

    render() {
        const { width, height, dpr } = this.props;
        const { canvasWidth, canvasHeight, status, scale } = this.state;

        const preImageClass = classNames('pre-image', {
            'pre-image-default': status === 0,
            'pre-image-uploaded': status === 1,
        });

        const viewWidth = width / dpr;
        const viewHeight = height / dpr;

        return (
            <Popover
                title={this.renderBarTitle()}
                content={this.renderBarContent()}
                getPopupContainer={() => this.preImage}
                mouseLeaveDelay={0.5}
                trigger="hover"
            >
                <div
                    className={preImageClass}
                    ref={ref => { this.preImage = ref }}
                    onMouseDown={this.handleDragStart}
                >
                    {/* 实际存储图片的画布 */}
                    <canvas
                        style={{ display: 'none' }}
                        ref={ref => { this.store = ref }}
                        width={width}
                        height={height}
                    />
                    {/* 截取图片的参照容器 */}
                    <canvas
                        style={{ display: 'none' }}
                        ref={ref => { this.reference = ref }}
                        width={canvasWidth * dpr}
                        height={canvasHeight * dpr}
                    />

                    {/* 图片操作容器 */}
                    <div
                        className="pre-image-wrapper"
                        style={{
                            width: viewWidth,
                            height: viewHeight,
                            overflow: 'hidden'
                        }}
                    >
                        {/* 用于操作的画布, 这里直接把画布移动到 可视操作区域的中心 */}
                        <canvas
                            style={{
                                position: 'absolute',
                                left: (viewWidth - canvasWidth) * 0.5,
                                top: (viewHeight - canvasHeight) * 0.5,
                            }}
                            width={canvasWidth}
                            height={canvasHeight}
                            ref={ref => { this.controller = ref }}
                        />
                        {/* 用这个 div 来触发 file 按钮，file 按钮真的太丑 */}
                        <div
                            className="pre-image-file-choose"
                            onClick={this.handleFile}
                        >
                            <Icon type="plus" />
                        </div>
                    </div>
                    <input
                        style={{ display: 'none' }}
                        className="pre-image-file-button"
                        ref={ref => { this.fileButton = ref }}
                        type="file"
                        onChange={this.handleGetFile}
                    />
                </div>
            </Popover>
        )
    }
}

PreImage.defaultProps = {
    /**
     * 容器宽度
     */
    width: 200,

    /**
     * 容器高度
     */
    height: 200,

    /**
     * 默认图片地址
     * 注意：此处不要涉及到跨域，否则需要服务端支持
     */
    url: '',

    /**
     * 如果是用于移动端头片or 其他场景，这里需要修改这个 dpr
     * 例如你要处理1张 400*400的图片，这可能占用了很大的操作空间
     * 那么这个值可以控制我们的操作容器和被操作的图片尺寸
     * 如果 dpr=2 -> ${width|height}/dpr, 这样操作容器的宽高都会缩小一半，但是实际保存的图片依旧是 width * height
     */
    dpr: 1,

    /**
     * 默认缩放比例
     */
    scale: 1,

    /**
     * 默认最大 N kb
     */
    maxsize: 10 * 1024 * 1024,

    /**
     * 图片质量
     */
    quality: 100,

    /**
     * 允许的文件类型
     */
    accept: ['jpg', 'jpeg', 'png', 'gif'],

    error: {
        accept: '文件类型错误，只支持: {accept}',
        size: '超过最大尺寸: {size}MB.'
    },
};

PreImage.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    url: PropTypes.string,
    dpr: PropTypes.number,
    scale: PropTypes.number,
    maxsize: PropTypes.number,
    accept: PropTypes.arrayOf(PropTypes.string),
    error: PropTypes.objectOf(PropTypes.string),
};

export default PreImage;
