import deepmerge from 'deepmerge';

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
            
            const parseResult = this.parseItem(datas[i]);
            this.areaData = deepmerge(this.areaData, parseResult);
            // this.areaData.push(parseResult);
        }
        console.log(this.areaData)
        
    }
    static parseItem(item) {
        const keys = item.key.split('-');
        const titles = item.props.hideTitle.split('-');
        const len = keys.length;
        if (len === 1) {
            return [{
                code: keys[0],
                regionName: titles[0]
            }]
        }
        else if (len === 2) {
            return [{
                code: keys[0],
                regionName: titles[0],
                regions: [
                    {
                        code: keys[1],
                        regionName: titles[1],
                    }
                ]
            }]
        }
        else if (len === 3) {
            return [{
                code: keys[0],
                regionName: titles[0],
                regions: [
                    {
                        code: keys[1],
                        regionName: titles[1],
                        regions: [
                            {
                                code: keys[2],
                                regionName: titles[2],
                            }
                        ]
                    }
                ]
            }]
        }
        console.log(keys);
        console.log(titles);
    }
}

export default Tools;
