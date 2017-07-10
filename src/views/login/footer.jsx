import React, { Component, PureComponent } from 'react';


class Footer extends PureComponent {

    render() {

        return (
            <div className="yt-foot-inner">
                <p className="yt-foot-tittle">
                    © 2015 www.yatang.cn All rights reserved.
                    <a href="https://static.yatang.cn/ytdocroot/content/images/f6f0fe195cef25603d788322c8fff6aa.png" type="url" title="EDI证书" target="_blank" rel="nofollow">&nbsp;粤B1-20150480</a>
                </p>
                <p>
                    深圳市雅堂家居电子商务股份有限公司&nbsp;
                    <a href="http://www.miitbeian.gov.cn" type="url" target="_blank" rel="nofollow">粤ICP备13072520号</a>
                </p>
                <p>
                    <a id="___szfw_logo___" className="yt-foot-szfw-logo" target="_blank" href="https://search.szfw.org/cert/l/CX20150424007550007672" rel="nofollow">
                        <img src="https://static.yatang.cn/ytdocroot/content/images/entry.png" />
                    </a>
                </p>
            </div>
        )
    }
}

export default Footer;