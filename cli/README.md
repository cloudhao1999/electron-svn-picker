## svn 变更单处理

### 使用方法

1.需要安装`Node16.7.0`以上版本，版本过低跑不起来

安装地址：[Node.js (nodejs.org)](https://nodejs.org/zh-cn/)

2.下载安装包

```bash
# 全局安装包
npm install -g svn-helper-crm
```

3.使用脚手架工具

```bash
# 使用指令
crm3

# 根据指令提示输入
请输入项目名称：输入你当前的项目
请输入项目全路径：输入项目根目录所在的全路径，不是相对路径
请输入路径前缀：输入你需要添加的路径前缀，比如：/trunk/xxx/xxx，因为svn服务器上的路径不一定与本地相同
```

# 根据指令提示输入

```bash
请输入项目名称：输入你当前的项目
请输入项目全路径：输入项目根目录所在的全路径，不是相对路径
请输入路径前缀：输入你需要添加的路径前缀，比如：/trunk/xxx/xxx，因为svn服务器上的路径不一定与本地相同
```

`projectName`为提取变更单项目名称，`fullPath`为项目根地址全路径，`svnPath`为添加的路径前缀

脚手架将在输入指令的目录下新建`record.json`文件
```javascript
const statusType = {
    // " ": "无修改",
    A: "新增",
    C: "冲突",
    D: "删除",
    I: "忽略",
    M: "修改",
    R: "替换",
    X: "未纳入版本控制的目录,被外部引用的目录所创建",
    "?": "未纳入版本控制",
    "!": "该项目已遗失(被非 svn 命令删除)或不完整",
    "~": "版本控制下的项目与其它类型的项目重名"
  };
```

同时会将变更与新增文件整合成与原工程相同的目录结构，在`new`文件夹内