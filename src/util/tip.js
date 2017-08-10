/**
 * @file tip.js
 * @author shijh
 *
 * 提示错误
 */

import { message } from 'antd';

/**
 * 提示错误
 *
 * @param {Boolean} 判断条件
 * @param {string} 提示文字
 * @param {string} 提示类型
 */
export default (bool, text, type = 'error') => {
    if (bool) {
        message[type](text);
    }
    return false;
}