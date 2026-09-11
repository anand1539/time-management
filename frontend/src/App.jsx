import React, { useState } from 'react'
import FileList from './components/FileList'
import FilePreview from './components/FilePreview'

export default function App(){
  const [owner, setOwner] = useState('anand1539')
  const [repo, setRepo] = useState('time-management')
  const [token, setToken] = useState('')
  const [files, setFiles] = useState([])
  const [branch, setBranch] = useState('')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadFiles(){
    setError('')
    setFiles([])
    setSelected(null)
    setLoading(true)
    try{
      const headers = token ? { Authorization: `token ${token}` } : {}
      // get default branch
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers })
      if(!repoRes.ok) throw new Error('Could not fetch repo (check owner/repo or token).')
      const repoJson = await repoRes.json()
      const defaultBranch = repoJson.default_branch || 'main'
      setBranch(defaultBranch)

      // fetch tree recursively
      const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, { headers })
      if(!treeRes.ok) throw new Error('Could not fetch file tree.')
      const treeJson = await treeRes.json()
      const treeFiles = (treeJson.tree || []).filter(f => f.type === 'blob')
        .map(f => ({ path: f.path, sha: f.sha }))
      setFiles(treeFiles.sort((a,b)=> a.path.localeCompare(b.path)))
    }catch(e){
      setError(e.message)
    }finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen p-6">
      <header className="max-w-6xl mx-auto mb-6">
        <h1 className="text-2xl font-semibold">Repository File Viewer</h1>
        <p className="text-sm text-gray-600">Browse files in a repository with preview. Repository pre-filled: anand1539/time-management</p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        <section className="col-span-12 md:col-span-4 lg:col-span-3 bg-white p-4 rounded-md shadow-sm">
          <div className="space-y-2">
            <label className="block text-xs text-gray-600">Owner</label>
            <input className="w-full p-2 border rounded" value={owner} onChange={e=>setOwner(e.target.value)} />

            <label className="block text-xs text-gray-600">Repository</label>
            <input className="w-full p-2 border rounded" value={repo} onChange={e=>setRepo(e.target.value)} />

            <label className="block text-xs text-gray-600">Personal Access Token (optional)</label>
            <input className="w-full p-2 border rounded" value={token} onChange={e=>setToken(e.target.value)} placeholder="Use to access private repos / increase rate limit" />

            <div className="flex gap-2">
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" onClick={loadFiles} disabled={loading}>{loading? 'Loading...':'Load files'}</button>
              <button className="mt-2 px-4 py-2 bg-gray-100 rounded" onClick={()=>{ setFiles([]); setSelected(null); setError('') }}>Clear</button>
            </div>

            {branch && <div className="text-xs text-gray-500">Default branch: {branch}</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>
        </section>

        <section className="col-span-12 md:col-span-8 lg:col-span-9">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-4 bg-white p-4 rounded-md shadow-sm">
              <h2 className="font-medium mb-2">Files ({files.length})</h2>
              <FileList files={files} onSelect={setSelected} selected={selected} />
            </div>
            <div className="col-span-12 lg:col-span-8 bg-white p-4 rounded-md shadow-sm">
              <h2 className="font-medium mb-2">Preview</h2>
              <FilePreview owner={owner} repo={repo} branch={branch} file={selected} token={token} />
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto mt-8 text-xs text-gray-500">Built for the time-management repo — quick frontend to view repository files. You can run locally with npm install && npm run dev</footer>
    </div>
  )
}
