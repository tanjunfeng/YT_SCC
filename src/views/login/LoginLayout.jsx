/**
 * @file LoginLayout.jsx
 * @author denglingbo
 */

const LoginLayout = () => {
    /* eslint-disable */
    const redirectTo = `${config.loginLink}?origin=${encodeURIComponent(location.href)}`;
    /* eslint-enable */
    location.href = redirectTo;
    return null;
}

export default LoginLayout;
