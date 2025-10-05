// 简易临时上传：将前端传来的 base64 图片写入 GitHub 仓库的 models/tmp/ 下，并返回可访问 URL
// 认证：x-admin-secret == ADMIN_SECRET
// 注意：这是简化方案，若你有对象存储/图床，建议改为直传 OSS/CDN

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    const adminSecret = req.headers['x-admin-secret'] || '';
    if (adminSecret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });

    const { filename, contentBase64 } = req.body || {};
    if (!filename || !contentBase64) return res.status(400).json({ error: 'Bad Request' });

    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';
    const token = process.env.GITHUB_TOKEN;
    if (!repo || !token) return res.status(500).json({ error: 'Server not configured' });

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    const path = `models/tmp/${filename}`;
    const putFile = await fetch(`https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}`, {
      method: 'PUT', headers, body: JSON.stringify({ message: `temp upload: ${filename}`, content: contentBase64, branch })
    });
    if (!putFile.ok) {
      const t = await putFile.text();
      return res.status(500).json({ error: `upload failed: ${t}` });
    }
    const fileUrl = `./models/tmp/${filename}`;
    return res.status(200).json({ ok: true, url: fileUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}


