# 办公室工位图

一个无需后端、可直接部署到 GitHub Pages 的交互式办公室工位图。

## 功能

- 按照原始平面图还原办公室区域、会议室、独立办公室与工位
- 按姓名搜索并高亮工位
- 点击工位查看姓名和区域
- 浏览器内编辑姓名，自动保存在 `localStorage`
- 一键导出当前工位数据为 JSON
- 桌面与手机端均可使用

## 上传到 GitHub

1. 在 GitHub 新建一个空仓库（不要勾选自动生成 README）。
2. 解压本项目 ZIP。
3. 在仓库页面点击 **Add file → Upload files**。
4. 将解压后的所有文件拖入上传区域并提交。
5. 打开 **Settings → Pages**。
6. 在 **Build and deployment** 中选择 **Deploy from a branch**，分支选 `main`，目录选 `/ (root)`，保存。
7. 稍等片刻后即可通过 GitHub Pages 地址访问。

## 本地预览

直接双击 `index.html` 即可；也可在项目目录运行：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 修改工位

- 在网页中点击「编辑工位」，再点击任一工位即可修改姓名。
- 编辑结果默认只保存在当前浏览器。
- 若要永久修改仓库中的默认值，请编辑 `app.js` 内的 `defaultSeats`。

## 文件结构

```text
.
├── index.html
├── styles.css
├── app.js
├── README.md
├── LICENSE
└── reference/
    └── Office Layout Seating Plan.png
```
