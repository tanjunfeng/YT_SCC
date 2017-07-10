export const format = (data = {}) => {
    const { itemAds } = data;
    const item = {};

    for (let i of itemAds) {
        item[i.id] = i;
    }

    return item;
}