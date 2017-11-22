# 选择加盟商值清单
# by [taoqiyu](taoqiyu@yatang.cn)

## 导入
```jsx
import { Franchisee } from '../../../container/search';
```

## render 方法

```jsx

<FormItem label="加盟商">
    {getFieldDecorator('franchisee', {
        initialValue: { franchiseeId: '111004005', franchiseeName: '小超直营店加盟商' }
    })(<Franchisee />)}
</FormItem>

```

## props 解释

1. value 子公司对象 { franchiseeId: '111004005', franchiseeName: '加盟商名称' } || { franchiseeId: '', franchiseeName: '' }
1. onChange 回调函数,返回分公司对象 { franchiseeId: '111004005', franchiseeName: '加盟商名称' } || { franchiseeId: '', franchiseeName: '' }
