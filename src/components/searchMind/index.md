
## 介绍

基于 ReactJS 的联想搜索组件

## 使用

```js
/**
 * 这里是一个模拟的请求
 * @param {string} value, 输入框返回的值
 * @return {Promise}
 */
handleTestFetch = (value) => {
    return new Promise(resolve => {
        switch (value) {
            case 'd': {
                resolve({data: [
                    {
                        key: '1',
                        name: 'John Brown',
                        age: 32,
                        address: 'New York No. 1 Lake Park',
                    }
                ]});
                break;
            }
            case 'dd': {
                resolve({data: [
                    {
                        key: '1',
                        name: 'John Brown',
                        age: 32,
                        address: 'New York No. 1 Lake Park',
                    }, {
                        key: '2',
                        name: 'Jim Green',
                        age: 42,
                        address: 'London No. 1 Lake Park',
                    }
                ]});
                break;
            }
            case 'ddd': {
                resolve({data: [
                    {
                        key: '1',
                        name: 'John Brown',
                        age: 32,
                        address: 'New York No. 1 Lake Park',
                    }, {
                        key: '2',
                        name: 'Jim Green',
                        age: 42,
                        address: 'London No. 1 Lake Park',
                    }, {
                        key: '3',
                        name: 'Joe Black',
                        age: 32,
                        address: 'Sidney No. 1 Lake Park',
                    }
                ]});
                break;
            }
            default: resolve({data:[]});
        }
    });
}

render() {
    return(
        <SearchMind
            ref={ref => { this.searchMind = ref }}
            fetch={(value) => this.handleTestFetch(value)}
            addonBefore="供应商"
            onChoose={this.handleTestChoose}
            onChooseForInput={(data) => (
                <div>{data.key} - {data.name}</div>
            )}
            columns={[
                {
                    title: 'Name',
                    dataIndex: 'name',
                    width: 150,
                }, {
                    title: 'Address',
                    dataIndex: 'address',
                    width: 200,
                }
            ]}
        />
    )
}
```

#API

`this.searchMind.getChooseData()` 可以通过 ref 获取被选择的数据


#Options

| Property             | Description           | Type       |  Default  |
|---------------- |----------------|----------|----------|
| fetch | Fetch Promise | Promise | null  |
| addonBefore | 输入框前缀 | String, Node |  |
| columns | 下拉框表头 | Array | null |
| delaySend | 延迟发送请求(quickSearch=true) | number | 320(ms) |
| placeholder | Input placeholder | String, Node | '请输入内容' |
| quickSearch | 是否启用快速搜索(keyup 即搜索) | boolean | true |
| onChoosed | 点击下拉菜单的搜索内容的回调 | function({ record, index, event }) |  |
| renderChoosedInputRaw | 点击下拉菜单的搜索内容的回调，渲染指定元素作为选择的数据显示 | function(data) |  |



#END