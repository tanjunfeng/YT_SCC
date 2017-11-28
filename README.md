本地eslint 验证
<code>
    npm i -g eslint-config-airbnb eslint babel-eslint eslint-plugin-import eslint-plugin-jsx-a11y
</code>

切记 子组件一定要用 PureComponent 避免父组件改变了state 的时候子组件在不需要 render 的时候也会调用 render() 类似: import pureRender from 'pure-render-decorator';

**transform-runtime**
https://segmentfault.com/q/1010000005596587?from=singlemessage&isappinstalled=1

transform-decorators-legacy
ES7

transform-async-to-generator
用于支持async/await书写方式

transform-do-expressions
用于支持JSX书写 if else 语句

<code>
    render() {
        return (
            <div className='myComponent'>
            {do {
                if(color === 'blue') { <BlueComponent/>; }
                if(color === 'red') { <RedComponent/>; }
                if(color === 'green') { <GreenComponent/>; }
            }}
        </div>
        )
    }
</code>

## 分支使用说明

### 各分支使用场景描述
1. dev 新开发功能的分支
1. sit 根据迭代任务修改现有代码，联调、初步测试的分支应从此分支拉取子分支
1. uat 准备上线的分支 debug 阶段，插队需求和线上 bug 修复应在此分支拉取子分支
1. master 受保护分支，除了管理者用于发版不应当被操作

### Developer 手册
1. 假设你叫张三，需开发一个新模块，切换到 dev 分支，执行

```shell
    git checkout dev
    git checkout -b dev-zhangsan
```

2. 开发并完成本地调试后，进入等待与后端联调阶段，在网页上提起合并到 dev 分支的 [merge request](http://gitlab.yatang.net/yt-fe/web/sc/merge_requests/new#)，source branch 选择 dev-zhangsan，target branch 选择 dev。由 Master 处理 merge request，并决定何时合并到 sit，假设代码已经经过审核，已合并到 sit 环境，则在本地执行如下命令

```shell
    # 你的代码审核通过之后，由管理员合并到了 sit 分支
    git checkout sit

    # 等待 master 处理合并到 sit 后拉取代码
    git pull origin sit

    # 从远程仓库同步最新分支，会发现远程的 dev-zhangsan 分支被删除
    git pull origin -p

    # 删除开发分支，你的代码应该在 sit 和 dev 两个分支上
    git branch -D dev-zhangsan
```

3. 在联调阶段发现接口参数设置有误，则从 sit 新建自己的分支修复，修复完成后发起 merge request 合并到 sit 分支

```shell
    git checkout sit
    git pull origin sit
    git checkout -b sit-zhangsan
```

4. 测试在 sit 环境发现 bug，并在 jira 新建了一个“缺陷”，jira 号为 GA-1101，则运行如下命令开始修复，修复完成后提起 merge request 合并回 sit 分支

```shell
    git checkout sit
    git pull origin sit
    git checkout -b sit-GA-1101
```

5. 测试在 uat 环境发现 bug，并在 jira 新建了一个“缺陷”，jira 号为 GA-1201，则运行如下命令开始修复，修复完成后提起 merge request 合并回 uat 分支

```shell
    git checkout uat
    git pull origin uat
    git checkout -b uat-GA-1201
```

6. 产品发起了一个紧急需求任务，并在 jira 新建了一个“任务”，jira 号为 GA-1301，则从 uat 分支拉取子分支，开发完成之后提起 merge request 合并到 sit 分支，sit 分支测试通过之后再合并回 uat 分支，并进行 uat 环境测试，然后重复步骤5

```shell
    git checkout uat
    git pull origin uat
    git checkout -b uat-GA-1301
```

### Master 使用手册

原则上需审阅代码

1. 处理 dev-xxx 到 dev 的 merge request
1. 处理 sit-xxx 到 sit 的 merge request，并合并 sit 到 dev
1. 处理 uat-xxx 到 uat 的 merge request，并合并 uat 到 sit，再合并 sit 到 dev
1. 紧急 bug 修复或紧急需求应从 uat 分支拉取子分支
1. sit 提交 uat 测试。这一步操作应当事先由测试人员联合评估允许执行，sit 分支的代码质量需要达到一定的稳定程度才可以合并到 uat。在此过程之后的 dev 合并到 sit 请求都是安全的，进入下一个迭代的联调内容可以安全进入 sit 分支而不影响 uat 的稳定性
1. 直到有发版计划时，应先记录 master 的 sha，将稳定版本的 uat 分支合并到 master

### 其他说明

本流程管理主要采用 gitlab flow 的管理方式，并尽可能避免了容易出错的 cherry-pick 操作，以适应快速迭代的需求和应对各种插队需求的存在，严格区分分支是代码管理的必然需求。

此方法会造成众多分支并存的情况。管理者需要及时清理多余的分支，并指导开发者定期删除本地过期的分支