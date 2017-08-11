// import deepmerge from 'deepmerge';

const codeInObject = (source, targetCode) => {
    for (let i = 0; i < source.length; i++) {
        const { code, regions } = source[i]
        if (code === targetCode) {
            return {regions, i};
        }
    }
    return null;
}

class Tools {
    static checkAddress(data, name, that) {
        const {firstValue, secondValue, thirdValue} = data;
        if (firstValue === '-1' || secondValue === '-1' || thirdValue === '-1') {
            const err = {};
            err[name] = {
                errors: [new Error('请选择正确的地区')],
            }
            that.props.form.setFields({...err});
        } else {
            const err = {};
            err[name] = {
                errors: null,
            }
            that.props.form.setFields({...err});
        }
    }

    static areaData = [];

    static encodeArea(datas) {
        for (let i = 0; i < datas.length; i++) {
            this.parseItem(datas[i]);
        }
        return this.areaData;
    }

    static decodeArea(data) {
        const checked = [];
        const loop = (item, parentCode) => item.map((item) => {
            let code = item.code;
            if (parentCode) {
                code = `${parentCode}-${code}`
            }
            if (item.regions) {
                loop(item.regions, code);
            }
            if (code.split('-').length === 3) {
                checked.push(code);
            }
        })
        loop(data);
        return checked;
    }

    static parseItem(item) {
        const keys = item.key.split('-');
        const titles = item.props.hideTitle.split('-');
        const len = keys.length;
        let current = this.areaData;
        if (len === 3) {
            const parseData = {
                "code": keys[0],
                "regionName": titles[0],
                "regions": [
                    {
                        "code": keys[1],
                        "regionName": titles[1],
                        "regions": [
                            {
                                "code": keys[2],
                                "regionName": titles[2],
                            }
                        ]
                    }
                ]
            }
            current = codeInObject(current, keys[0]);

            const parentC1 = {};
            Object.assign(parentC1, current);
            if (!current) {
                this.areaData.push(parseData);
                return null;
            }
            else {
                current = codeInObject(parentC1.regions, keys[1])
                const parentC2 = {};
                Object.assign(parentC2, current);
                if (!current) {
                    this.areaData[parentC1.i].regions.push(parseData.regions[0]);
                    return null;
                }
                else {
                    current = codeInObject(parentC2.regions, keys[2]);
                    if (!current) {
                        this.areaData[parentC1.i].regions[parentC2.i].regions.push(parseData.regions[0].regions[0]);
                        return null;
                    }
                }
            }
        }
    }
}

export default Tools;
