# 模型目录与清单说明

## 目录结构（建议）

```
models/
  manifest.json       # 模型清单（站点下拉列表数据来源）
  beach-cat-001/
    cat.glb           # 主展示/下载格式（glTF 2.0 单文件）
    cat.usdz          # 可选：iOS AR 用
    cover.jpg         # 可选：封面图
```

## 如何新增模型

1. 将你的 `.glb`（可选 `.usdz`）放入 `models/你的文件夹/`。
2. 打开 `models/manifest.json`，在 `models` 数组中追加一个条目，示例：

```json
{
  "id": "beach-cat-001",
  "name": "海边度假猫 001",
  "src": "./models/beach-cat-001/cat.glb",
  "usdz": "./models/beach-cat-001/cat.usdz"
}
```

- 仅有 `.glb` 时可省略 `usdz` 字段。
- 建议 `src` 与 `usdz` 使用相对路径（相对站点根目录）。

## 体积与性能建议
- 单文件建议 ≤ 20MB（尽量 ≤ 50MB）。
- 网格压缩：Draco/Meshopt；纹理压缩：KTX2。
- 三角形数量：移动端建议 ≤ 200k。

## 常见问题
- 本地直接双击 `index.html` 打开（file://）时，浏览器会阻止 `fetch(manifest.json)`：请使用本地服务器（见项目 README）。
- `.usdz` 仅在 iOS Safari 的 Quick Look/AR 可用；Android 用 `.glb` 的 Scene Viewer。
