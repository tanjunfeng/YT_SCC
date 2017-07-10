/**
 * @file login.js
 * @author shijh
 *
 * 登录数据模型
 */

class ViewModel {
    /**
     * memu id
     */
    id = '';

    /**
     * menu code
     */
    code = '';

    /**
     * menu name
     */
    name = '';

    /**
     * menu submenu
     */
    submenu = null;

    constructor(data) {
        this.id = data.authorityId;
        this.code = data.authorityCode;
        this.name = data.displayName;
        this.submenu = data.menuList;
    }

    toJSON() {
        return {
            id: this.id,
            code: this.code,
            name: this.name,
            submenu: this.submenu
        }
    }
}

/**
 * 遍历处理数据
 * @param data
 */
const loop = data => data.map(d => {
    const model = new ViewModel(d).toJSON();

    if (model.submenu) {
        model.submenu = loop(model.submenu);
    }

    return model;
});

class DataModel {

    constructor(data) {
        this.menu = loop(data);
    }

    toJSON() {
        return {
            menu: this.menu,
        }
    }
}

export default (data) => new DataModel(data);
