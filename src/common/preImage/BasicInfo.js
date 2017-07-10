/**
 * @file BasicInfo.js
 * @author denglingbo
 *
 */
class BasicInfo {
    constructor() {
        // 每次点击开始的坐标
        this.click = BasicInfo.defaultValue;

        // 开始坐标
        this.start = BasicInfo.defaultValue;

        // 相对移动的值
        this.pos = BasicInfo.defaultValue;
    }

    static set defaultValue(val) {
        this._default = val;
    }

    static get defaultValue() {
        return this._default || {
            x: 0,
            y: 0,
        };
    }

    set click(value) {
        this._click = value;
    }

    set start(value) {
        this._start = value;
    }

    set pos(value) {
        this._pos = value;
    }

    get click() {
        return this._click;
    }

    get start() {
        return this._start;
    }

    get pos() {
        return this._pos;
    }

    reset() {
        this.click = BasicInfo.defaultValue;
        this.start = BasicInfo.defaultValue;
        this.pos = BasicInfo.defaultValue;
    }
}

export default BasicInfo;
