# time-management — frontend for viewing repository files

This folder contains a small React + Vite + Tailwind frontend that lists files in a GitHub repository and shows file previews.

How to run locally:

1. cd frontend
2. npm install
3. npm run dev

Usage
- The app is pre-filled with owner: `anand1539` repo: `time-management`.
- Click "Load files" to fetch the repository file tree and then click any file to preview its content.
- Optionally paste a Personal Access Token (PAT) to access private repos or increase API rate limits.

Notes
- This is a starting UI designed to look clean and professional; you can extend it (add syntax highlighting languages, file icons, commit metadata, pagination, caching, tests, and deployment config).
