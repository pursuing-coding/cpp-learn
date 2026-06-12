# 🚀 cpp-learn | C++ Interactive Code Laboratory

[![Version](https://img.shields.io/badge/version-1.0.0-indigo.svg?style=flat-square)](https://github.com/pursuing-coding/cpp-learn/releases/tag/v1.0.0)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Mobile-cyan.svg?style=flat-square)](#)
[![Tests Status](https://img.shields.io/badge/tests-12%2F12%20passed-emerald.svg?style=flat-square)](#)

面向 C++ 从入门到进阶学习的**现代化浏览器课程实验室**。界面采用极具质感的 **Slate-Indigo（板岩蓝靛）** 专业色调与响应式玻璃摩登设计，集成了课程阅读、代码编辑、实时编译运行、测试用例验证以及进度追踪于一体的轻量级实验室系统。

🔗 **[在线立即体验实验室 🚀](https://pursuing-coding.github.io/cpp-learn/)**  
🔗 **[GitHub 仓库源码](https://github.com/pursuing-coding/cpp-learn)**

---

## ✨ 核心亮点

* 🎨 **Slate-Indigo 摩登美学**
  * 专为开发者调配的 Slate-Indigo 色系，支持全局一键日夜模式平滑切换。
  * 优雅的微交互效果（如卡片滑动浮起、按钮渐变缩放及加载态发光过渡）。
  * 极致响应式视口布局（支持桌面端三栏、移动端紧凑布局，无任何水平溢出滚动条）。
* 📝 **实时学习目标清单**
  * 引入交互式打勾机制，系统自动根据代码状态（修改初始代码、通过首个用例、通过本章全部测试）实时判定目标进度，提升学习成就感。
* 🔍 **零依赖 C++ 语法高亮引擎**
  * 使用自主设计的正则词法解析引擎，无需加载庞大的外部库，在极小开销下实现 C++ 关键字、预处理指令、字符串、注释等元素的精准词法着色。
* ⚙️ **双轨编译执行通道**
  * **本地模式**：首选由本地的 `g++` / `clang++` 完成极速物理编译与沙箱执行（支持标准输入输出）。
  * **云端模式**：当本地未部署编译器或发布为静态 Pages 时，自动无缝回退到公开 Judge0 API 完成远程安全容器化编译与运行。
* 💾 **草稿与进度安全隔离**
  * 代码草稿在本地自动持久化保存；同时标准输入（`stdin`）仅存在于内存，不污染本地缓存，保护隐私与代码干净度。

---

## 🗂️ 课程大纲 (13 个精选章节)

项目移除了学术教条中的拟人化比喻，直击底层物理架构与 C++ 系统设计哲学：

| 章节 | 课题 | 核心学习目标与硬核技术点 |
| :--- | :--- | :--- |
| **01** | C++ 编译模型与入口函数 | 了解预处理、编译、汇编、链接四个阶段，定义 `main` 程序入口 |
| **02** | 变量、内存与类型系统 | 理解强类型系统在编译期的作用，使用 `sizeof` 检测多级内存占用 |
| **03** | 流程控制与函数深度剖析 | 掌握循环、分支控制以及函数签名定义与返回值传递机制 |
| **04** | 指针与连续内存（数组） | 深度剖析指针寻址、物理地址偏移、多维数组与数组名降级指针 |
| **05** | 引用与函数传参机制 | 探索引用的别名本质，对比值传递、指针传递与常量引用传递的性能与安全 |
| **06** | 面向对象（OOP）与内存布局 | 探究类成员布局、构造/析构函数调用链、构造函数初始化列表 |
| **07** | 多态与动态绑定底源码机制 | 揭秘虚函数表指针（`vptr`）与虚函数表（`vtable`）的动态派发机制 |
| **08** | 右值引用与移动语义 | 深入 `std::move` 原理，掌握所有权接管以规避大量深拷贝开销 |
| **09** | 智能指针与 RAII 资源安全 | 通过 `unique_ptr` 和 `shared_ptr` 管理堆内存生命周期，防止内存泄漏 |
| **10** | 泛型编程与 C++ 模板 | 理解模板具现化（Instantiation）过程，掌握泛型函数与类模板 |
| **11** | C++ 标准模板库（STL） | 熟悉 Sequence 容器（Vector）与 Associative 容器（Map）底层的物理结构 |
| **12** | 并发编程与多线程 | 学习 `std::thread` 的创建、资源竞争防护、互斥锁 `std::mutex` 的运用 |
| **13** | 综合实战：哈希表与现代语法 | 手写哈希链表冲突消解算法，结合使用 C++17 结构化绑定与迭代器 |

---

## 🛠️ 本地开发与部署

### 1. 克隆并安装依赖
```bash
git clone https://github.com/pursuing-coding/cpp-learn.git
cd cpp-learn
npm install
```

### 2. 启动本地开发服务
```bash
npm start
```
* 服务启动后将运行在：`http://localhost:4173`
* 本地运行需要您具备 `g++` 或 `clang++` 环境变量以启用极速本地编译。若无编译器，服务将以“有限教学预览模式”运行（允许查阅全部教程和编辑代码，不支持本地编译运行）。

---

## 🚦 单元与 E2E 冒烟测试

项目集成了完整的前端结构完整性校验与多视口浏览器自动化测试，以保证渲染性能和零布局缺陷。

### 运行一键校验：
```bash
npm run verify
```

该校验工具将自动执行以下任务：
1. **课程配置校验** (`scripts/validate-lessons.js`)：检测静态资源链接、初始代码、参考实现与测试用例的逻辑完整性。
2. **多终端 UI 冒烟测试** (`tests/ui-smoke.spec.js`)：通过 Playwright 启动 Headless Chromium 模拟器，全面覆盖**桌面端和移动端**，测试包含进度存储、草稿恢复、专注模式、测试用例切换、面板溢出等在内的 12 个关键交互场景。

---

## 📂 项目结构指南

```text
├── .github/workflows/   # GitHub Actions (测试校验与 Pages 自动化发布)
├── public/
│   ├── index.html       # 实验室静态页面主入口
│   ├── app.js           # 页面 UI 逻辑、高亮分词引擎、测试执行器、进度管理器
│   ├── course-data.js   # 13 章核心课程数据
│   ├── styles.css       # 响应式 UI 样式与 Slate-Indigo 视觉系统
│   └── favicon.svg      # 项目徽标
├── scripts/
│   └── validate-lessons.js # 自动化关卡校验脚本
├── tests/
│   └── ui-smoke.spec.js # Playwright UI 冒烟测试脚本
├── server.js            # 本地 C++ 编译 API 与静态服务器
├── package.json         # 项目元数据与脚本配置
└── playwright.config.js # Playwright 测试框架配置
```

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 协议开源。
