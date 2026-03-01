# 💕 恋爱时光

一个记录恋爱时光的浪漫网页，展示相爱时间、恋爱里程碑、恋爱券和一起走过的地方。

## 📖 快速导航

- 📚 [完整文档](./docs/README.md) - 详细的功能说明和配置指南
- 🔐 [OSS 配置说明](./docs/OSS_CONFIG_README.md) - 阿里云 OSS 配置详细教程

## ✨ 功能特性

- ⏰ **相爱时间计时器** - 实时显示已经相爱的天数、小时、分钟和秒数
- 🎯 **恋爱里程碑** - 展示从相爱到现在的重大事件
- 💝 **恋爱券管理** - 发放、使用和管理按摩券，支持二维码核销
- 🗺️ **旅行地图** - 在亚洲地图上标记一起去过的城市
- 📱 **响应式设计** - 完美适配手机、平板和电脑
- 🎨 **粉色少女简约风** - 温馨浪漫的视觉设计
- ☁️ **OSS 云存储** - 使用阿里云 OSS 存储配置，支持多端同步

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/love-journey.git
cd love-journey
```

### 2. 配置 OSS

编辑 `js/oss-config.js` 文件，配置阿里云 OSS 信息。详细说明请查看 [OSS 配置说明](./docs/OSS_CONFIG_README.md)。

### 3. 本地预览

```bash
# 使用 Python
python3 -m http.server 8888

# 或使用 Node.js
npx serve
```

然后在浏览器中访问 `http://localhost:8888`

### 4. 部署到 GitHub Pages

1. 将代码推送到 GitHub
2. 在仓库设置中启用 GitHub Pages
3. 选择 `main` 分支和 `/ (root)` 目录
4. 等待部署完成

详细部署说明请查看 [完整文档](./docs/README.md)。

## 📂 项目结构

```
love-journey/
├── index.html           # 主页面
├── admin.html           # 管理端（发放/删除恋爱券）
├── use.html            # 核销页面（扫描二维码使用）
├── css/                 # 样式文件
│   └── style.css      # 主样式文件
├── js/                  # JavaScript 文件
│   ├── app.js          # 主页面逻辑
│   ├── oss-config.js    # OSS 配置（已加密）
│   ├── oss-utils.js     # OSS 工具函数
│   └── crypto-utils.js  # 加密/解密工具
├── assets/              # 资源文件
│   ├── data/           # 数据文件
│   │   └── china-map.json  # 地图数据
│   └── media/          # 媒体文件
│       └── xiaomeiman.mp3  # 背景音乐
├── docs/                # 文档文件
│   └── OSS_CONFIG_README.md  # OSS 配置详细说明
└── .gitignore           # Git 忽略文件
```

## 💡 使用提示

- 首页：访问 `index.html`
- 管理端：访问 `admin.html`
- 核销页面：访问 `use.html?id=券ID`
- 修改 OSS 配置后，在恋爱券页面下拉刷新即可同步
- 所有内容都是静态的，无需后端服务器

## 🔐 安全说明

- OSS 配置文件中的敏感信息已加密处理
- 加密仅用于避免 GitHub 的自动安全扫描
- 不要将加密后的配置分享给他人
- 对于生产环境，建议使用后端代理来处理 OSS 操作

## 📝 许可证

本项目仅供个人使用，请根据需要修改配置文件。

---

💝 用爱记录每一个美好瞬间 💝
