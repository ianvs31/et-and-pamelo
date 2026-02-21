# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static web application serving as a media gallery for images, videos, and 3D models (`.glb`, `.gltf`, `.vrm`). Uses Vercel serverless functions for backend operations. Features include grid/stack/lightbox view modes, AI image generation via Seedream API, and admin panel for content management.

## Development Commands

```bash
# Local preview (static files only)
python3 -m http.server 5173
npx serve -l 5173 --single

# Local development with serverless functions
vercel dev
```

## Architecture

This project uses a **CMS-less architecture**: GitHub acts as both file storage and database via the GitHub API. The `models/manifest.json` file serves as a central content registry. Git commits to the repository trigger automatic Vercel redeployment. No separate database is required.

### Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main gallery (487 lines) with grid/stack/lightbox modes, FLIP animations |
| `admin.html` | Admin panel (471 lines) for uploads/management/Seedream AI |
| `api/upload.js` | Upload to GitHub and update manifest |
| `api/manage.js` | Content management (list/hide/delete) |
| `api/seedream.js` | AI image generation proxy |
| `models/manifest.json` | Media registry with `models` array |

### Manifest Schema (`models/manifest.json`)

```json
{
  "models": [
    {
      "id": "unique-id",
      "type": "image|video|model",
      "src": "./models/{type}/{filename}",
      "processedSrc": "./models/{type}/{filename}",
      "title": "Display title",
      "catName": "Category name",
      "description": "Description",
      "prompt": "AI prompt used",
      "uploadDate": "ISO timestamp",
      "hidden": true  // Optional: filters from gallery
    }
  ]
}
```

### Directory Structure

```
models/
├── pictures/    # .jpg, .png, .webp, .gif
├── videos/      # .mp4, .webm, .ogg
├── models/      # .glb, .gltf, .vrm
├── tmp/         # Temporary uploads for Seedream
└── manifest.json
```

## Important Patterns

- **Header-based authentication**: All admin routes use `x-admin-secret` header
- **Base64 file handling**: Uploads use base64 encoding to avoid multipart complexity
- **Hidden items**: Set `hidden: true` to filter items from the gallery display
- **Reverse chronological**: Gallery displays newest first (`.reverse()` on manifest array)
- **Type inference**: Media type inferred from file extension (`nameToId()` helper in `api/upload.js`)

## Environment Variables (Vercel)

| Variable | Purpose |
|----------|---------|
| `ADMIN_SECRET` | Admin authentication header value |
| `GITHUB_TOKEN` | GitHub API personal access token |
| `GITHUB_REPO` | Repository name (e.g., ianvs31/et-and-pamelo) |
| `GITHUB_BRANCH` | Branch name (default: main) |
| `SEEDREAM_API_URL` | AI service endpoint |
| `SEEDREAM_API_KEY` | AI service authentication key |
| `SEEDREAM_MODEL` | Optional model name |
| `SEEDREAM_ENDPOINT_ID` | Optional Endpoint ID header |
| `SEEDREAM_DEFAULT_SIZE` | Default image size (1024x1024) |
| `SEEDREAM_DEFAULT_QUALITY` | Default quality (standard) |

## API Endpoints

### POST /api/upload
Upload media to GitHub and update manifest. Requires `x-admin-secret` header.

### POST /api/manage
Content management operations. Requires `x-admin-secret` header.
- Action `list`: Return all manifest entries
- Action `hide`: Set `hidden: true` on entry
- Action `unhide`: Remove `hidden` property
- Action `delete`: Delete GitHub file and remove manifest entry

### POST /api/seedream
AI image generation/editing via Seedream API. Supports both `images/edits` (multipart) and `images/generations` (JSON). Base64 image limit: ~25MB.

### POST /api/temp-upload
Temporary upload for Seedream input images (stores in `models/tmp/`).
