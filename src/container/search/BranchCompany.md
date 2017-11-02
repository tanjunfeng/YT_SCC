# 选择子公司值清单
# by [taoqiyu](taoqiyu@yatang.cn)

## 导入
```jsx
import { BranchCompany } from '../../../container/search';
```

## 构造器声明

```jsx
class SearchForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            branchCompanyId: ''
        }
        this.handleSubCompanyChoose = this.handleSubCompanyChoose.bind(this);
        this.hanldeSubCompanyClear = this.hanldeSubCompanyClear.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    /**
     * @param {*子公司编号} branchCompanyId
     */
    handleSubCompanyChoose(branchCompanyId) {
        this.setState({ branchCompanyId });
    }

    /**
     * 清空子公司编号
     */
    hanldeSubCompanyClear() {
        this.setState({ branchCompanyId: '' });
    }

    handleReset() {
        this.hanldeSubCompanyClear(); // 清除子公司值清单
        ...
    }

    ...
}
```

## render 方法

```jsx
<BranchCompany
    value={this.state.branchCompanyId}
    onSubCompaniesChooesd={this.handleSubCompanyChoose}
    onSubCompaniesClear={this.hanldeSubCompanyClear}
/>
```

## props 解释

1. value 回传子公司编号，字符串
1. onSubCompaniesChooesd 选择子公司的回调函数，函数
1. onSubCompaniesClear 清空子公司的回调函数，函数
