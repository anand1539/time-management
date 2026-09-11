import React, { useEffect, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

export default function FilePreview({ owner, repo, branch, file, token }){
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(()=>{ Prism.highlightAll() }, [content])

  useEffect(()=>{
    if(!file) return setContent('')
    async function load(){
      setError('')
      setLoading(true)
      try{
        const headers = token ? { Authorization: `token ${token}` } : {}
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(file.path)}?ref=${branch}`, { headers })
        if(!res.ok) throw new Error('Could not fetch file content')
        const json = await res.json()
        if(json.encoding === 'base64'){
          const decoded = atob(json.content.replace(/\n/g, ''))
          setContent(decoded)
        } else {
          setContent(json.content || '')
        }
      }catch(e){ setError(e.message) }
      finally{ setLoading(false) }
    }
    load()
  }, [file, owner, repo, branch, token])

  if(!file) return <div className="text-sm text-gray-500">Select a file to preview.</div>
  if(loading) return <div className="text-sm text-gray-500">Loading...</div>
  if(error) return <div className="text-sm text-red-600">{error}</div>

  // try to pick a language for prism
  const ext = file.path.split('.').pop()
  const langClass = ext ? `language-${ext}` : 'language-markup'

  return (
    <div>
      <div className="text-xs text-gray-500 mb-2">{file.path}</div>
      <pre className={`rounded p-3 overflow-auto text-sm bg-black text-white`}>
        <code className={langClass}>{content}</code>
      </pre>
    </div>
  )
}
