
# 一定喝水 💧

> 喝水不要下次一定，要一定喝水！

一个简洁实用的Chrome浏览器扩展，帮助您养成良好的饮水习惯，保持身体健康。

## 🖼️ UI示例

![wechat_2025-06-18_174801_208](https://github.com/user-attachments/assets/5b60020d-98a2-4dc6-9862-d69ce35cfdd4)
![wechat_2025-06-18_174811_444](https://github.com/user-attachments/assets/d6da40b4-f549-4e1d-8df4-d40228143044)
![wechat_2025-06-18_174753_773](https://github.com/user-attachments/assets/6bf9b76a-31a8-434e-b398-309bab6f5aba)


## ✨ 功能特性

### 📊 饮水追踪
- **实时进度条**：直观显示今日饮水进度
- **快速记录**：一键添加100ml、200ml、300ml饮水量
- **自定义水量**：支持设置个人常用的饮水量按钮
- **7天历史**：可视化图表展示最近7天的饮水记录

### ⏰ 智能提醒
- **定时提醒**：可自定义提醒间隔（15-240分钟）
- **桌面通知**：系统级通知提醒，不会错过
- **快速记录**：通知中直接添加250ml饮水记录
- **开关控制**：可随时启用/禁用提醒功能

### 🎯 个性化设置
- **目标设定**：自定义每日饮水目标（500-5000ml）
- **提醒间隔**：灵活调整提醒频率
- **数据管理**：支持清除今日或全部饮水记录

### 🎉 互动体验
- **达成庆祝**：完成每日目标时的礼花效果
- **健康知识**：内置喝水益处和小贴士
- **美观界面**：现代化设计，操作简单直观

## 🚀 安装使用

### 开发者模式安装

1. **下载源码**
   ```bash
   git clone https://github.com/liutingfenga/WaterWake-Extend.git
   cd WaterWake-Extend
   ```

2. **打开Chrome扩展管理页面**
   - 在Chrome地址栏输入：`chrome://extensions/`
   - 或者：菜单 → 更多工具 → 扩展程序

3. **启用开发者模式**
   - 点击右上角的"开发者模式"开关

4. **加载扩展**
   - 点击"加载已解压的扩展程序"
   - 选择项目文件夹

5. **开始使用**
   - 扩展图标会出现在Chrome工具栏
   - 点击图标打开饮水记录面板

## 📱 使用指南

### 基本操作

1. **记录饮水**
   - 点击扩展图标打开面板
   - 选择对应的饮水量按钮（100ml/200ml/300ml）
   - 进度条会实时更新

2. **查看历史**
   - 点击"最近7天饮水记录"的展开按钮
   - 查看可视化图表和详细数据

3. **个性化设置**
   - 点击"设置"按钮进入设置页面
   - 调整每日目标、提醒间隔等参数
   - 设置自定义饮水量按钮

### 高级功能

- **自定义水量**：在设置中配置常用的饮水量，会自动添加到主界面
- **数据清理**：可以清除今日记录或全部历史记录
- **健康知识**：点击"喝水有益"了解饮水的健康益处

## 🛠️ 技术栈

- **前端框架**：原生JavaScript + HTML5 + CSS3
- **图表库**：ECharts
- **数据存储**：Chrome Storage API
- **通知系统**：Chrome Notifications API
- **定时任务**：Chrome Alarms API
- **特效动画**：CSS3 + Canvas（礼花效果）

## 📁 项目结构

```
heshui/
├── css/                    # 样式文件
│   ├── confetti.css        # 礼花效果样式
│   ├── options.css         # 设置页面样式
│   └── popup.css           # 主界面样式
├── icons/                  # 图标文件
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── js/                     # JavaScript文件
│   ├── background.js       # 后台服务
│   ├── calendar.js         # 图表功能
│   ├── confetti.js         # 礼花效果
│   ├── db.js              # 数据存储
│   ├── echarts.min.js     # 图表库
│   ├── options.js         # 设置页面逻辑
│   └── popup.js           # 主界面逻辑
├── index.html             # 欢迎页面
├── manifest.json          # 扩展配置文件
├── options.html           # 设置页面
├── popup.html             # 主界面
└── README.md              # 项目说明
```

## 🔧 开发说明

### 本地开发

1. **修改代码**：直接编辑源文件
2. **重新加载**：在Chrome扩展管理页面点击刷新按钮
3. **调试**：使用Chrome开发者工具调试

### 核心模块

- **数据存储**（`db.js`）：封装了Chrome Storage API，提供数据的增删改查
- **图表展示**（`calendar.js`）：使用ECharts展示7天饮水数据
- **通知提醒**（`background.js`）：后台定时任务和通知管理
- **界面交互**（`popup.js`）：主界面的所有交互逻辑

## 🤝 贡献指南

欢迎提交Issue和Pull Request！


## 📄 许可证

本项目采用MIT许可证 - 查看[LICENSE](LICENSE)文件了解详情

## 💡 反馈建议

如果您有任何问题或建议，请：

- 提交[Issue](https://github.com/liutingfenga/WaterWake-Extend/issues)

---

**记住：喝水不要下次一定，要一定喝水！** 💧✨
