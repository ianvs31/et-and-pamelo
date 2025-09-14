# et-and-pamelo（MVP）

使用 `<model-viewer>` 的静态网页，在线预览与下载 `.glb` 模型，支持可选 iOS AR（`.usdz`）。

## 本地预览

确保当前目录为本项目根目录：

```bash
cd "/Users/ryan/Documents/Ryan‘s wiki/3_Project/cat3d-site"
```

启动本地静态服务器（任选其一）：

```bash
# 方案A：Python 3 内置
python3 -m http.server 5173

# 方案B：Node（如已安装）
npx serve -l 5173 --single
```

然后访问：`http://localhost:5173/`。

> 直接双击 `index.html`（file://）会导致 `manifest.json` 无法加载。

## 添加模型到站点

1. 将 `.glb`（可选 `.usdz`）放入 `models/你的文件夹/`。
2. 编辑 `models/manifest.json`，在 `models` 数组中追加条目：

```json
{
  "id": "beach-cat-001",
  "name": "海边度假猫 001",
  "src": "./models/beach-cat-001/cat.glb",
  "usdz": "./models/beach-cat-001/cat.usdz"
}
```

- 只有 `.glb` 时可省略 `usdz` 字段。
- 也可使用页面的“本地预览”按钮选择单个文件测试（不上传）。

## 部署到 Vercel（推荐）

1. 将本目录作为一个 Git 仓库推送到 GitHub。
2. 在 Vercel 导入该仓库，构建命令留空，框架选择“Other / 静态站点”，输出目录为项目根目录。
3. 部署完成后即可通过分配的域名访问。

## 规范建议
- 主格式：`.glb`（glTF 2.0）。
- 可选 AR：`.usdz`（iOS Safari Quick Look）。
- 体积目标：≤ 20MB；尽量压缩网格（Draco/Meshopt）与贴图（KTX2）。
