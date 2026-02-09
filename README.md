# 🚀 抛物线计划 (Project Parabola)

> "当引力失效，唯有数学能指引归途。"
> "When gravity fails, only math can guide us home."

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

**抛物线计划 (Project Parabola)** 是一款结合了硬科幻叙事与高中数学教育（二次函数）的交互式 Web 游戏。玩家将扮演一名“常数调律师”，通过调整二次函数参数 ($a, h, k$) 来操控飞船“方舟号”的曲率引擎，逃离黑洞视界。

## 🌌 故事背景 (Story)

**公元 2098 年**，地球资源枯竭。人类最后的希望——“方舟号”，在柯伊伯带边缘遭遇引力异常，陷入黑洞引力井。
飞船系统全面离线，300 年前的领航员们处于低温休眠状态。
作为唯一的远程 **“领航员”**，你接入了飞船的控制终端。你需要与船载 AI **小鹿 (Deer)** 和全息向导 **小鹿 (Photon)** 合作，通过重建数学模型，修复杂乱的时空曲率，带领人类文明驶向新家园。

## 🎮 核心玩法 (Gameplay)

游戏的核心机制是将**二次函数 (Quadratic Function)** 的数学性质与飞船驾驶直观结合：

*   **开口方向与宽度 ($a$)**：控制引力波的聚散。$a > 0$ 开口向上，$a < 0$ 开口向下；绝对值越大，开口越窄（能量越集中）。
*   **水平位移 ($h$)**：控制飞船的左右横移导航。
*   **垂直位移 ($k$)**：控制飞船的轨道高度修正。

### 🌟 特色功能 (Features)

1.  **沉浸式叙事 (Cinematic Narrative)**：
    *   黑洞边缘的视听体验。
    *   完整的开场动画与系统启动序列。
    *   多角色对话系统（舰长、AI、向导）。

2.  **智能辅导系统 (ITS - Intelligent Tutoring System)**：
    *   **认知追踪**：系统会监测你的犹豫时间与错误模式。
    *   **自适应提示**：在你卡关时，AI 会以符合剧情的方式提供渐进式提示（从含蓄的隐喻到具体的数学指导）。
    *   **思维殿堂 (Mind Palace)**：通过互动问答巩固数学概念。

3.  **数据日志 (Data Logs)**：
    *   随着关卡推进，解锁飞船的黑匣子记录。
    *   补充世界观背景与深层数学原理。

4.  **身份系统 (Identity)**：
    *   支持自定义领航员代号，并贯穿整个游戏对话与终端显示。

## 🛠️ 技术栈 (Tech Stack)

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **State Management**: Zustand (with Persistence)
*   **Animation**: Framer Motion
*   **Math Rendering**: KaTeX
*   **Logic**: Custom Evaluation Engine

## 🚀 快速开始 (Getting Started)

### 环境要求
*   Node.js 18+
*   npm / yarn / pnpm

### 安装与运行

```bash
# 1. 克隆仓库
git clone https://github.com/l20/star_navigator.git

# 2. 进入目录
cd star_navigator

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可开始冒险。

## 🤝 贡献 (Contribution)

欢迎提交 Issue 或 Pull Request 来改进游戏体验或数学内容的准确性。

## 📄 许可证 (License)

MIT License
