/**
 * @file util.js
 * @author shijh, denglingbo, taoqiyu
 *
 * 工具类
 */
import * as util from 'freed-spa/src/util/util';
import moment from 'moment';
import { DATE_FORMAT, TIME_FORMAT } from '../constant/index';

/**
 * 格式化地区字符串
 */
const array2string = (reg) => {
    const re = reg;
    let str = '';
    for (let i = 0; i < re.length; i++) {
        const { regionName, regions } = re[i];
        str += `${regionName}（${regions.length}）：`
        for (let j = 0; j < regions.length; j++) {
            if (j === regions.length - 1) {
                str += `${regions[j].regionName} `;
            } else {
                str += `${regions[j].regionName}、`;
            }
        }
    }
    return str;
}

class Utils {

    /**
     * 清除所有空格
     *
     * @param {string | number} 目标值
     */
    static trimAll(str = '') {
        return str.toString().replace(/\s/g, '');
    }

    /**
     * 清除左右空格
     *
     * @param {string} str 目标字符串
     */
    static trim(str = '') {
        return str.toString().replace(/(^\s*)|(\s*$)/g, '');
    }

    /**
     * 清除左空格
     *
     * @param {string} str 目标字符串
     */
    static ltrim(str = '') {
        return str.toString().replace(/(^\s*)/g, '');
    }

    /**
     * 清除右空格
     *
     * @param {string} str 目标字符串
     */
    static rtrim(str = '') {
        return str.toString().replace(/(\s*$)/g, '');
    }

    /**
     * 修改数组中指定数据的索引位置
     *
     * @param $arr Immutable Array
     * @param fromIndex
     * @param toIndex
     * @returns {List<T>|List.<T|U>}
     */
    static takeTo($arr, fromIndex, toIndex) {
        const $newArr = $arr;
        const $take = $arr.get(fromIndex);

        return $newArr
            // 从数组中取出指定位置的数据
            .delete(fromIndex)
            // 放入指定的索引位置
            .insert(toIndex, $take);
    }

    /**
     * 通过 val 通过父节点对应的 key 的value 进行查找
     *
     * @param $arr Immutable Array
     * @param val 要匹配的值
     * @param callback 回调函数
     *  1. finder
     *  2. deep 查找的深度
     *  3. child
     *  4. items 匹配到 options.findBy 的时候其他节点的数据
     * @param options
     *  options.childKey, 子节点 key
     *  options.findBy, 通过父节点某 key 与 val 进行匹配
     *  options.deepItemKey, 返回匹配到 findBy 的条件的要返回到 itemsDeep 中的其他匹配的数据
     * @param findDeep 查找深度
     * @param itemsDeep 匹配的节点
     * @return Callback Function
     */
    static find(
        $arr,
        val,
        callback,
        options = {},
        findDeep = [],
        itemsDeep = []
    ) {
        const opts = {
            childKey: 'children',
            findBy: 'key',
            deepItemKey: null,
        };

        Object.assign(opts, options);

        if (val == null) {
            return callback(null);
        }

        $arr.forEach((item, i) => {
            const $child = item.get(opts.childKey);
            let v = '';

            if (opts.deepItemKey != null) {
                v = item.get(opts.deepItemKey);
            }

            if (item.get(opts.findBy) === val) {
                // 储存匹配到的深度, 返回匹配值
                return callback(item, findDeep.concat(i), $child, itemsDeep.concat(v));
            }

            // 如果存在子节点则继续查找
            if ($child) {
                // 储存匹配到的深度
                return this.find(
                    $child,
                    val,
                    callback,
                    opts,
                    findDeep.concat([i, opts.childKey]),
                    itemsDeep.concat(v)
                );
            }

            return null;
        });
        return null;
    }

    /**
     * 清除对象中value值为null， undefined的数据
     *
     * @param {Object} obj 需要去除无效数据的对象
     */
    static removeInvalid(obj) {
        const result = {};
        const keys = Object.keys(obj);
        keys.forEach((key) => {
            const value = obj[key];
            if (value || value === 0) {
                result[key] = value;
            }
        });
        return result;
    }

    /**
     * 供应地区数组
     *
     * @param {Array} arr 供应地区数组
     */
    static array2string(arr) {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            const { regionName, regions } = arr[i];
            const item = {};
            item.regionName = regionName;
            item.province = array2string(regions);
            result.push(item);
        }
        return result;
    }

    /**
     * 导出excel
     */
    static exportExcel(url, query) {
        /* eslint-disable */
        window.open(`${config.apiHost}${url}?${util.parseQuerystring(query)}`)
        /* eslint-enable */
    }

    /**
     * 筛选出数组中不通项
     *
     * @param {Array[*]} arr 目标数组
     * @param {Array[*]} arrays 被检测数组
     * @return {Array[*]} res 新的数组
     */
    static diff(arr, arrays) {
        const argsLen = arguments.length;
        const len = arr.length;
        const res = [];
        let i = -1;

        if (argsLen === 1) {
            return arr;
        }

        while (++i < len) {
            if (arrays.indexOf(arr[i]) === -1) {
                res.push(arr[i]);
            }
        }
        return res;
    }

    /**
     * 价格区间是否连续
     *
     * @param {Array[number]} arr 价格区间数组
     * @return {boolean} 是否连续
     */
    static isContinuity(arr) {
        let i = 0;
        while (arr[i + 1]) {
            if (arr[i].endNumber + 1 !== arr[i + 1].startNumber) {
                return false;
            }
            i++;
        }
        return true;
    }

    static isWindow(obj) {
        return obj != null && obj === obj.window;
    }

    static isObject(obj) {
        const type = typeof obj;
        return obj != null && (type === 'object' || type === 'function');
    }

    static isPlainObject(obj) {
        return this.isObject(obj)
            && !this.isWindow(obj)
            && Object.getPrototypeOf(obj) === Object.prototype;
    }

    /**
     * 简易版本 对比两个 Object 是否一样
     *
     * @param {Object}
     * @param {Object}
     */
    static isEqual(a, b) {
        // Of course, we can do it use for in
        // Create arrays of property names
        const aProps = Object.getOwnPropertyNames(a);
        const bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length !== bProps.length) {
            return false;
        }

        for (let i = 0; i < aProps.length; i++) {
            const propName = aProps[i];
            const aChild = a[propName];
            const bChild = b[propName];

            if (this.isPlainObject(aChild) && !this.isEqual(aChild, bChild)) {
                return false;
            }

            if (!this.isObject(aChild) && aChild !== bChild) {
                // If values of same property are not equal,
                // objects are not equivalent
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    }

    static getDate(timestamp) {
        if (!timestamp) {
            return '-';
        }
        return moment(parseInt(timestamp, 10)).format(DATE_FORMAT);
    }

    static getTime(timestamp) {
        if (!timestamp) {
            return '-';
        }
        return moment(parseInt(timestamp, 10)).format(TIME_FORMAT);
    }

    /**
     * 限制输入两位小数校验
     */
    static limitTwoDecimalPlaces = (rule, value, callback) => {
        if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
            callback('仅允许两位小数');
        }
        callback();
    }
}

export default Utils;
