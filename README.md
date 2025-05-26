# HiCampus

## 前端

```
hicampus-frontend/
├── node_modules/            # 存储所有项目依赖包
├── public/                  # 存放静态资源，会被直接复制到构建输出目录
│   ├── index.html           # 应用的HTML主入口文件
│   ├── favicon.ico          # 网站图标
│   └── manifest.json        # PWA配置文件
├── src/                     # 存放项目核心源代码
│   ├── api/                 # (或 services/) 存放与后端API交互的函数
│   │   ├── authApi.js
│   │   ├── userApi.js
│   │   └── postApi.js
│   ├── assets/              # 存放会被Webpack/Vite处理的静态资源
│   │   ├── images/
│   │   ├── fonts/
│   │   └── styles/          # (或 scss/, css/) 全局样式、变量等
│   ├── components/          # 可复用的UI组件
│   │   ├── common/          # 通用基础组件 (Button, Modal, Input等)
│   │   ├── layout/          # 布局组件 (Navbar, Sidebar, Footer等)
│   │   └── features/        # 特定功能的组件 (PostCard, CommentList等)
│   ├── contexts/            # (React) 存放Context API相关代码
│   ├── hooks/               # (React) 存放自定义Hooks
│   ├── pages/               # (或 views/) 页面级组件，对应各个路由
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── PostDetailPage.jsx
│   ├── router/              # 前端路由配置 (如使用React Router, Vue Router)
│   │   └── index.js
│   ├── store/               # (或 app/, features/) 全局状态管理 (Redux, Zustand, Pinia, Vuex)
│   │   ├── index.js         # Store主配置文件
│   │   └── slices/          # (或 modules/) 按功能划分的状态模块
│   ├── utils/               # 工具函数模块
│   │   └── helpers.js
│   ├── App.jsx              # (或 App.vue) 应用的根组件
│   ├── index.jsx            # (或 main.js) 应用的JavaScript主入口文件
│   └── setupTests.js        # 测试环境配置文件
├── .env                     # (或 .env.local) 存放前端环境变量 (如API基础URL)
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── package.json
├── package-lock.json        # (或 yarn.lock)
└── README.md                # 项目说明文档
```

## 后端

```
hicampus-backend/
├── node_modules/            # 存储所有项目依赖包
├── config/                  # 存放配置文件
│   ├── db.js                # 数据库连接配置 (MongoDB - Mongoose)
│   ├── index.js             # 统一导出配置模块
│   └── jwt.js               # JWT密钥等安全配置
├── controllers/             # 控制器层：处理路由的业务逻辑，调用服务
│   ├── authController.js    # 认证相关的控制器
│   ├── userController.js    # 用户相关的控制器
│   └── postController.js    # 帖子相关的控制器
├── middleware/              # 中间件：处理请求的辅助函数
│   ├── authMiddleware.js    # 用户认证中间件
│   ├── errorMiddleware.js   # 统一错误处理中间件
│   └── validationMiddleware.js # 请求数据校验中间件
├── models/                  # 数据模型层：定义数据库结构 (Mongoose Schemas)
│   ├── User.js              # 用户数据模型
│   ├── Post.js              # 帖子数据模型
│   └── Comment.js           # 评论数据模型
├── routes/                  # 路由层：定义API端点
│   ├── index.js             # 主路由文件，聚合所有模块路由
│   ├── authRoutes.js        # 认证相关路由
│   ├── userRoutes.js        # 用户相关路由
│   └── postRoutes.js        # 帖子相关路由
├── services/                # 服务层 (可选，但推荐)：封装核心业务逻辑
│   ├── authService.js
│   ├── userService.js
│   └── postService.js
├── public/                  # 存放静态文件 (如果后端也托管静态资源)
├── tests/                   # 存放测试文件 (单元测试、集成测试)
│   ├── unit/
│   └── integration/
├── utils/                   # 工具函数模块
│   └── helper.js
├── .env                     # 环境变量文件 (例如：数据库URI, 端口, JWT密钥) - 不提交到Git
├── .eslintignore            # ESLint忽略配置
├── .eslintrc.js             # ESLint配置文件
├── .gitignore               # Git忽略配置文件
├── app.js                   # Express应用主文件：初始化Express, 加载中间件和路由
├── server.js                # 服务器启动文件
├── package.json             # 项目元数据和依赖管理
└── package-lock.json        # 锁定依赖版本
```

