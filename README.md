# 💕 我们的恋爱之旅

一个记录恋爱时光的浪漫网页，展示相爱时间、恋爱里程碑、新年目标和一起走过的地方。

## ✨ 功能特性

- ⏰ **相爱时间计时器** - 实时显示已经相爱的天数、小时、分钟和秒数，带有动画效果
- 🎯 **恋爱里程碑** - 展示从相爱到现在的重大事件
- ✨ **新年目标** - 记录新的一年想要一起完成的事情
- 🗺️ **旅行地图** - 在亚洲地图上标记一起去过的城市，鼠标悬停显示详细信息
- 📱 **响应式设计** - 完美适配手机、平板和电脑
- 🎨 **粉丝少女简约风** - 温馨浪漫的视觉设计

## 🚀 快速开始

### 本地预览

1. 克隆或下载项目
2. 使用任意静态服务器预览，例如：

```bash
# 使用 Python
python3 -m http.server 8080

# 或使用 Node.js
npx serve

# 或直接在浏览器中打开 index.html
```

3. 在浏览器中访问 `http://localhost:8080`

## ⚙️ 配置说明

所有内容都可以通过修改 `config.json` 文件来配置：

### 相爱时间配置

```json
{
  "loveStory": {
    "startDate": "2023-01-01T00:00:00",
    "title": "我们已经相爱",
    "names": {
      "you": "小美",
      "partner": "小明"
    }
  }
}
```

- `startDate`: 开始相爱的日期和时间
- `title`: 显示的标题
- `names`: 你们的名字

### 恋爱里程碑配置

```json
{
  "milestones": [
    {
      "date": "2023-01-01",
      "title": "第一次相遇",
      "description": "在咖啡店的那个午后，阳光正好，你穿着白色的连衣裙"
    }
  ]
}
```

### 新年目标配置

```json
{
  "goals": [
    {
      "title": "一起去日本看樱花",
      "icon": "🌸"
    }
  ]
}
```

### 去过的城市配置

```json
{
  "visitedCities": [
    {
      "name": "北京",
      "date": "2023-08-15",
      "description": "故宫、长城、天安门"
    }
  ]
}
```

## 🌐 GitHub Pages 部署

### 方法一：通过 GitHub 网页界面部署

1. 创建一个新的 GitHub 仓库
2. 上传所有文件到仓库
3. 进入仓库的 **Settings** 页面
4. 在左侧菜单找到 **Pages**
5. 在 **Source** 下选择 **Deploy from a branch**
6. 选择 **main** 分支和 **/ (root)** 目录
7. 点击 **Save**
8. 等待几分钟，GitHub 会提供访问链接

### 方法二：通过 GitHub CLI 部署

```bash
# 1. 初始化 Git 仓库
git init

# 2. 添加所有文件
git add .

# 3. 提交更改
git commit -m "Initial commit"

# 4. 创建 GitHub 仓库（需要先安装 gh CLI）
gh repo create love-journey --public --source=. --remote=origin --push

# 5. 启用 GitHub Pages
gh api repos/:owner/:repo/pages -X PUT -f source[branch]=main
```

### 方法三：手动推送到 GitHub

```bash
# 1. 初始化 Git 仓库
git init

# 2. 添加所有文件
git add .

# 3. 提交更改
git commit -m "Initial commit"

# 4. 添加远程仓库
git remote add origin https://github.com/your-username/love-journey.git

# 5. 推送到 GitHub
git branch -M main
git push -u origin main
```

然后在 GitHub 网页上按照方法一的步骤启用 GitHub Pages。

## 📱 自定义城市坐标

如果需要添加更多城市，可以在 `app.js` 文件中的 `cityCoordinates` 对象中添加：

```javascript
const cityCoordinates = {
    '城市名': { x: 横坐标, y: 纵坐标 },
    // ...
};
```

坐标是基于 SVG 画布的相对位置，范围大约是：
- x: 0-800
- y: 0-600

## 🎨 自定义样式

如果需要修改颜色或样式，可以编辑 `style.css` 文件。主要颜色变量：

- 主色调：`#ff69b4` (粉色)
- 次要色：`#ffb6c1` (浅粉色)
- 背景色：`#ffeef8` (淡粉色背景)

## 📂 项目结构

```
love-journey/
├── index.html      # 主页面
├── style.css       # 样式文件
├── app.js          # JavaScript 逻辑
├── config.json     # 配置文件
└── README.md       # 说明文档
```

## 💡 提示

- 修改 `config.json` 后刷新页面即可看到更新
- 所有内容都是静态的，无需后端服务器
- 可以直接在浏览器中打开 `index.html` 预览
- 建议使用 GitHub Pages 部署，免费且稳定

## 📝 许可证

本项目仅供个人使用，请根据需要修改配置文件。

---

💝 用爱记录每一个美好瞬间 💝# love-journey
