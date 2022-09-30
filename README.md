## Subversion 小助手
### 这是什么❓
使用`Vue.js`、`Vite.js`、`Electron`技术构建的界面化Subversion提取工具 🔧 ，支持选择改动的文件，生成改动列表记录并组织成文件夹，方便查看和提取。
### 如何使用
1. 下载最新版本的`SubversionHelper`，解压后双击`SubversionHelper.exe`运行，MacOS用户请双击`SubversionHelper.app`运行。
2. 点击左侧`设置`按钮，设置`项目名称`、`SVN路径`。
3. 点击左侧`主页`按钮，按照界面提示进行操作。
### 目录结构
```bash
.
├── LICENSE
├── README.md
├── assets
│   ├── appdmg.png
│   └── icon.icns
├── auto-imports.d.ts
├── cli                               配套Cli
│   ├── README.md
│   ├── bin
│   │   └── index.mjs
│   ├── core.mjs
│   ├── file.mjs
│   ├── index.mjs
│   ├── package.json
│   ├── platform.mjs
│   ├── pnpm-lock.yaml
│   ├── rollup.config.js
│   ├── transform.mjs
│   └── utils                         Cli工具库
│       ├── core.mjs
│       ├── file.mjs
│       ├── platform.mjs
│       └── transform.mjs
├── components.d.ts
├── electron
│   ├── electron-env.d.ts
│   ├── main                          Electron主进程
│   │   └── index.ts
│   └── preload
│       └── index.ts
├── electron-builder.json5
├── index.html
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── public
│   ├── favicon.ico
│   └── icon.png
├── src
│   ├── App.vue
│   ├── assets
│   │   └── basic.css
│   ├── components
│   ├── env.d.ts
│   ├── layouts                       布局文件
│   │   ├── common-page.vue
│   │   ├── default
│   │   │   └── menu
│   │   │       └── index.vue
│   │   └── pages
│   │       └── index.vue
│   ├── main.ts
│   ├── router                        路由文件
│   │   └── index.ts
│   └── utils                         工具库
│   │   ├── core.ts
│   │   ├── file.ts
│   │   └── transform.ts
│   └── views                         主界面
│       ├── About.vue
│       ├── HomePage.vue
│       └── Setting.vue
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite
│   └── alias.ts                      vite别名配置
└── vite.config.ts                    vite配置文件
```
### 功能截图
![Subversion](https://cdn.staticaly.com/gh/cloudhao1999/image-hosting@master/20220917/image.6af9dlzfce40.webp)
