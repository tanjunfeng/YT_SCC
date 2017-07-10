class Utils {
    static getItem(items, key, current, select, index) {
        if (select + 2 === index && current === '-1') {
            return '-1';
        }
        return items.filter(item => item.code === key)[0]
    }
}

export default Utils;
