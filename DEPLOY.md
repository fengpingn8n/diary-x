# Diary-X iPhone 部署指南

要在 iPhone 上使用 Diary-X，并分享给朋友，最简单的方法是将其作为 PWA (Progressive Web App) 部署。

## 1. 部署到 Vercel (推荐)
Vercel 是免费且快速的静态网站托管服务，通过 GitHub 自动部署。

1.  将代码提交到 GitHub。
2.  登录 [Vercel](https://vercel.com/) (可用 GitHub 账号登录)。
3.  点击 **"Add New..."** -> **"Project"**。
4.  选择 `diary-x` 仓库并点击 **Import**。
5.  **Build Command** 默认应该是 `npm run build`，**Output Directory** 是 `dist`。无需修改。
6.  点击 **Deploy**。等待几十秒。
7.  部署完成后，你会获得一个 `https://your-project.vercel.app` 的链接。

## 2. 在 iPhone 上安装 (朋友操作)
将链接发送给朋友，让他们在 iPhone 上执行以下步骤：

1.  在 **Safari** 中打开链接 (必须使用 Safari)。
2.  点击底部的 **分享按钮** (带有向上箭头的方框图标)。
3.  向下滑动菜单，点击 **"添加到主屏幕" (Add to Home Screen)**。
4.  确认名称为 "Diary-X"，点击右上角的 **添加**。

## 3. 完成
现在 Diary-X 就像一个原生 App 一样主要屏幕上了！
- 无地址栏，全屏体验。
- 独立的图标。
- 甚至离线也可以打开 (PWA 特性)。
