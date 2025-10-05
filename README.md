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

## 集成 Seedream 图生图

本项目已新增后端代理 `api/seedream.js` 与前端最小表单（位于 `admin.html` 下半部分）。用途：上传你的宠物照片，输入提示词，调用 Seedream 进行图生图生成并在页面展示结果。

### 环境变量（Vercel 项目中配置）

- `SEEDREAM_API_URL`：上游图像编辑/生成接口地址（OpenAI 兼容 Images API）。例如：
  - `https://ark.cn-beijing.volces.com/api/v3/images/edits`
  - 或供应方兼容端点：`https://.../v1/images/edits` / `.../images/generations`
- `SEEDREAM_API_KEY`：上游 API Key（作为 `Authorization: Bearer <key>`）
- `SEEDREAM_MODEL`：模型名（默认 `seedream-4.0`）
- `SEEDREAM_DEFAULT_SIZE`：默认 `1024x1024`
- `SEEDREAM_DEFAULT_QUALITY`：默认 `standard`

> 注意：请根据你的上游文档选择正确端点与参数（edits/generations 等）。当前后端以 FormData 方式转发 `image + prompt + model + size + quality + response_format(url|b64_json)`。

### 使用步骤

1. 在 Vercel 项目“Settings > Environment Variables”中配置上述环境变量并重新部署。
2. 访问部署的站点的 `/admin.html`。
3. 在“Seedream 图生图”区域：
   - 选择一张宠物照片
   - 输入提示词（例：把我的宠物变成科幻宇航员）
   - 可选调整尺寸/质量
   - 点击“一键生成”，等待结果图展示

### API 接口（前端→后端）

`POST /api/seedream`

请求 JSON：

```json
{
  "prompt": "把我的宠物变成科幻宇航员",
  "imageBase64": "data:image/png;base64,......",
  "size": "1024x1024",
  "quality": "standard",
  "response_format": "url"
}
```

响应：透传上游结果（通常 `data[0].url` 或 `data[0].b64_json`）。

### 安全与限制

- 后端限制了图片 Base64 长度（约 25MB）。
- 请勿在前端暴露上游 Key，一律通过 `/api/seedream` 代理。

## 图片管理（隐藏/删除）

已新增后端接口 `api/manage.js` 与 `admin.html` 管理面板：

- 认证：同 `api/upload`，需在请求头传 `x-admin-secret`，并在 Vercel 配置 `ADMIN_SECRET`。
- 能力：
  - list：返回 `models/manifest.json` 中的条目
  - hide/unhide：对条目标记 `hidden: true` 或移除 `hidden`
  - delete：删除仓库文件并从 `manifest` 移除对应 id 的所有条目

前端使用（位于 `/admin.html` 最下方“图片管理”）：

1. 在顶部输入 Admin Secret（与 Vercel 一致）
2. 点击“刷新列表”查看条目
3. 对目标项点击“隐藏/取消隐藏”或“删除”

前台展示过滤：

- `index.html` 在渲染时会自动过滤 `hidden: true` 的条目，不会展示。

