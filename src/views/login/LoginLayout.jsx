/**
 * @file LoginLayout.jsx
 * @author denglingbo, shijh
 */

import { Modal } from 'antd';

const confirm = Modal.confirm;

let index = 0;

const LoginLayout = () => {
    if (!index) {
        index++;
        confirm({
            title: '登录过期',
            content: '您的登录已过期，是否重新登录?',
            okText: '是',
            cancelText: '否',
            closable: true,
            maskClosable: true,
            onOk() {
                index = 0;
                /* eslint-disable */
                location.href = `${config.loginLink}?origin=${encodeURIComponent(location.href)}`;
                /* eslint-enable */
            },
            onCancel() { index = 0; },
            afterClose() {
                index = 0;
            }
        })
        return null;
    }
    return null;
}

export default LoginLayout;
