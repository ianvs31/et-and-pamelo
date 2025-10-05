// Vercel Serverless Function
// 目的：将前端上传的图片（base64）与提示词转发给 Seedream 4.0 图生图接口（以 OpenAI 兼容 Images API 形式）。
// 配置环境变量（在 Vercel 项目中设置）：
// - SEEDREAM_API_URL   例如：https://ark.cn-beijing.volces.com/api/v3/images/edits （或供应方兼容的 images/edits、images/variations）
// - SEEDREAM_API_KEY   供应方发放的 API Key（Bearer）
// - SEEDREAM_MODEL     模型名，如 seedream-4.0 或官方给定别名
// - SEEDREAM_DEFAULT_SIZE 可选，默认 1024x1024
// - SEEDREAM_DEFAULT_QUALITY 可选，默认 standard（如支持 hd 可改）

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const apiUrl = process.env.SEEDREAM_API_URL;
    const apiKey = process.env.SEEDREAM_API_KEY;
    const model = process.env.SEEDREAM_MODEL || 'seedream-4.0';
    const defaultSize = process.env.SEEDREAM_DEFAULT_SIZE || '1024x1024';
    const defaultQuality = process.env.SEEDREAM_DEFAULT_QUALITY || 'standard';
    if (!apiUrl || !apiKey) return res.status(500).json({ error: 'Server not configured' });

    const isGenerations = /\/images\/generations(?:\b|\/)/i.test(String(apiUrl));

    // 仅支持 JSON 输入，前端以 base64（可为 dataURL 或纯 base64）传图，避免 multipart 解析复杂度
    const { prompt, imageBase64, size, quality, response_format, user } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'Bad Request: prompt required' });
    if (!isGenerations && !imageBase64) return res.status(400).json({ error: 'Bad Request: imageBase64 required for edits endpoint' });

    // 安全与限流（极简）：限制图片大小（base64 长度），避免滥用
    const MAX_BASE64_LENGTH = 25 * 1024 * 1024; // 约 25MB 上限
    if (!isGenerations && typeof imageBase64 === 'string' && imageBase64.length > MAX_BASE64_LENGTH) {
      return res.status(413).json({ error: 'Payload Too Large' });
    }

    if (isGenerations) {
      // 文生图：以 JSON 发送（OpenAI 兼容 images/generations）
      const payload = {
        model: String(model),
        prompt: String(prompt),
        size: String(size || defaultSize),
        quality: String(quality || defaultQuality),
        n: 1,
        response_format: String(response_format || 'url')
      };
      if (user) payload.user = String(user);

      const upstream = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const text = await upstream.text();
      let data = null;
      try { data = JSON.parse(text); } catch {}
      if (!upstream.ok) {
        return res.status(upstream.status).json({ error: data?.error || text || 'Upstream Error' });
      }
      return res.status(200).json(data || { ok: true, raw: text });
    }

    // 否则走 edits：解析 dataURL / 纯 base64 并转为 multipart
    // 解析 dataURL / 纯 base64
    let base64 = imageBase64;
    let mime = 'image/png';
    const m = /^data:(.*?);base64,(.*)$/i.exec(imageBase64);
    if (m) { mime = m[1] || 'image/png'; base64 = m[2] || ''; }
    let binary; try { binary = Buffer.from(base64, 'base64'); } catch { return res.status(400).json({ error: 'Invalid base64' }); }

    // Node 18+ 下全局有 FormData（undici）
    const form = new FormData();
    // OpenAI 兼容 images/edits 通常字段名：image / image[]
    const filename = mime.includes('png') ? 'image.png' : (mime.includes('jpeg') || mime.includes('jpg') ? 'image.jpg' : 'image.bin');
    form.append('image', new Blob([binary], { type: mime }), filename);
    form.append('prompt', String(prompt));
    form.append('model', String(model));
    form.append('size', String(size || defaultSize));
    form.append('quality', String(quality || defaultQuality));
    if (response_format) form.append('response_format', String(response_format)); // e.g. url | b64_json
    if (user) form.append('user', String(user));

    const upstream = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      body: form
    });

    const text = await upstream.text();
    let data = null;
    try { data = JSON.parse(text); } catch { /* upstream 可能返回文本错误 */ }
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data?.error || text || 'Upstream Error' });
    }

    // 透传常见字段（OpenAI 兼容通常返回 data 数组）
    return res.status(200).json(data || { ok: true, raw: text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}


