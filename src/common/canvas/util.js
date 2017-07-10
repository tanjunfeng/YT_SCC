/**
 * @file util.js
 * @author denglb@jingoal.com
 *
 * canvas 工具类
 */

/**
 * 获取当前设备像素比
 */
export const PIXEL_RATIO = (() => {
    const ctx = document.createElement('canvas').getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const bsr = ctx.webkitBackingStorePixelRatio
            || ctx.mozBackingStorePixelRatio
            || ctx.msBackingStorePixelRatio
            || ctx.oBackingStorePixelRatio
            || ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

/**
 * HiDPI 设置画布，避免 canvas 绘制的图出现毛边
 *
 * @param {CanvasElement} canvas, 画布
 * @param {number} w, 画布宽度
 * @param {number} h, 画布高度
 * @param {number} ratio, 设备像素比
 */
export const setHiDPICanvas = (canvas, w, h, ratio = PIXEL_RATIO) => {
    const can = canvas;
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + 'px';
    can.style.height = h + 'px';
    can.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
}
