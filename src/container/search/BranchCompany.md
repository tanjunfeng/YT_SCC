# 选择子公司值清单
# by [taoqiyu](taoqiyu@yatang.cn)

## 导入
```jsx
import { BranchCompany } from '../../../container/search';
```

## render 方法

```jsx

<FormItem label="分公司">
    {getFieldDecorator('branchCompany', {
        initialValue: { id: '10003', name: '成都子公司' }
    })(<BranchCompany />)}
</FormItem>

```

## props 解释

1. value 子公司对象 { id: '10003', name: '成都子公司' } || { id: '', name: '' }
1. onChange 回调函数,返回分公司对象 { id: '10003', name: '成都子公司' } || { id: '', name: '' }
