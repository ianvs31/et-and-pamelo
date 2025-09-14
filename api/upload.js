// Vercel Serverless Function
// 环境变量：GITHUB_TOKEN, ADMIN_SECRET, GITHUB_REPO(如 ianvs31/et-and-pamelo), GITHUB_BRANCH(main)

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    const adminSecret = req.headers['x-admin-secret'] || '';
    if (adminSecret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });

    const { id, type, filename, ext, contentBase64 } = req.body || {};
    if (!id || !type || !filename || !contentBase64) return res.status(400).json({ error: 'Bad Request' });

    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';
    const token = process.env.GITHUB_TOKEN;
    if (!repo || !token) return res.status(500).json({ error: 'Server not configured' });

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    // 1) 写入媒体文件到 models 目录
    const subdir = type === 'model' ? 'models' : (type === 'video' ? 'videos' : 'pictures');
    const path = `models/${subdir}/${filename}`;
    const putFile = await fetch(`https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ message: `upload: ${filename}`, content: contentBase64, branch }),
    });
    if (!putFile.ok) {
      const t = await putFile.text();
      return res.status(500).json({ error: `upload failed: ${t}` });
    }

    const fileUrl = `./models/${subdir}/${filename}`;

    // 2) 读取 manifest.json，追加条目并提交
    const manifestPath = 'models/manifest.json';
    const getMan = await fetch(`https://api.github.com/repos/${repo}/contents/${manifestPath}?ref=${branch}`, { headers });
    if (!getMan.ok) {
      const t = await getMan.text();
      return res.status(500).json({ error: `read manifest failed: ${t}` });
    }
    const manJson = await getMan.json();
    const sha = manJson.sha;
    const content = Buffer.from(manJson.content, 'base64').toString('utf-8');
    const json = JSON.parse(content);
    const entry = { id, type, src: fileUrl };
    json.models.push(entry); // 末尾追加，前端倒序显示
    const newContentB64 = Buffer.from(JSON.stringify(json, null, 2)).toString('base64');

    const putMan = await fetch(`https://api.github.com/repos/${repo}/contents/${manifestPath}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ message: `manifest: add ${id}`, content: newContentB64, sha, branch }),
    });
    if (!putMan.ok) {
      const t = await putMan.text();
      return res.status(500).json({ error: `write manifest failed: ${t}` });
    }
    const commit = await putMan.json();

    return res.status(200).json({ ok: true, src: fileUrl, commitUrl: commit.commit?.html_url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}


