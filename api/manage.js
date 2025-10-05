// Vercel Serverless Function
// 管理能力：list / hide / unhide / delete
// 认证与仓库配置复用：ADMIN_SECRET, GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH

async function readManifest(headers, repo, branch) {
  const manifestPath = 'models/manifest.json';
  const getMan = await fetch(`https://api.github.com/repos/${repo}/contents/${manifestPath}?ref=${branch}`, { headers });
  if (!getMan.ok) {
    const t = await getMan.text();
    throw new Error(`read manifest failed: ${t}`);
  }
  const manJson = await getMan.json();
  const sha = manJson.sha;
  const content = Buffer.from(manJson.content || '', 'base64').toString('utf-8');
  const json = JSON.parse(content || '{"models":[]}');
  if (!Array.isArray(json.models)) json.models = [];
  return { json, sha, path: manifestPath };
}

async function writeManifest(headers, repo, branch, path, sha, json, message) {
  const newContentB64 = Buffer.from(JSON.stringify(json, null, 2)).toString('base64');
  const putMan = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ message, content: newContentB64, sha, branch })
  });
  if (!putMan.ok) {
    const t = await putMan.text();
    throw new Error(`write manifest failed: ${t}`);
  }
  return putMan.json();
}

function srcToRepoPath(src) {
  // src: './models/pictures/xxx.jpg' → 'models/pictures/xxx.jpg'
  if (typeof src !== 'string') return null;
  const cleaned = src.replace(/^\.\//, '');
  return cleaned;
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    const adminSecret = req.headers['x-admin-secret'] || '';
    if (adminSecret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });

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

    const { action, id } = req.body || {};
    if (!action) return res.status(400).json({ error: 'Bad Request: action required' });

    if (action === 'list') {
      const { json } = await readManifest(headers, repo, branch);
      return res.status(200).json({ ok: true, models: json.models });
    }

    if (!id) return res.status(400).json({ error: 'Bad Request: id required' });

    if (action === 'hide' || action === 'unhide') {
      const { json, sha, path } = await readManifest(headers, repo, branch);
      let changed = 0;
      for (const item of json.models) {
        if (item && item.id === id) {
          if (action === 'hide') { item.hidden = true; }
          else { if (item.hidden) delete item.hidden; }
          changed++;
        }
      }
      if (!changed) return res.status(404).json({ error: 'Not Found: id not in manifest' });
      await writeManifest(headers, repo, branch, path, sha, json, `${action} ${id}`);
      return res.status(200).json({ ok: true, affected: changed });
    }

    if (action === 'delete') {
      const { json, sha, path } = await readManifest(headers, repo, branch);
      const toDelete = json.models.filter(m => m && m.id === id);
      if (!toDelete.length) return res.status(404).json({ error: 'Not Found: id not in manifest' });

      let deletedFiles = 0; const errors = [];
      for (const item of toDelete) {
        const repoPath = srcToRepoPath(item.src);
        if (!repoPath) continue;
        try {
          // 获取文件 sha
          const getFile = await fetch(`https://api.github.com/repos/${repo}/contents/${encodeURIComponent(repoPath)}?ref=${branch}`, { headers });
          if (!getFile.ok) {
            const t = await getFile.text();
            errors.push(`get ${repoPath} failed: ${t}`);
            continue;
          }
          const fJson = await getFile.json();
          const fSha = fJson.sha;
          // 删除文件
          const del = await fetch(`https://api.github.com/repos/${repo}/contents/${encodeURIComponent(repoPath)}`, {
            method: 'DELETE',
            headers,
            body: JSON.stringify({ message: `delete ${repoPath}`, sha: fSha, branch })
          });
          if (!del.ok) {
            const t = await del.text();
            errors.push(`delete ${repoPath} failed: ${t}`);
          } else {
            deletedFiles++;
          }
        } catch (e) {
          errors.push(String(e?.message || e));
        }
      }

      // 从 manifest 中移除对应项（移除所有同 id）
      json.models = json.models.filter(m => !(m && m.id === id));
      await writeManifest(headers, repo, branch, path, sha, json, `manifest: delete ${id}`);
      return res.status(200).json({ ok: true, deletedFiles, errors });
    }

    return res.status(400).json({ error: 'Bad Request: unsupported action' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}


