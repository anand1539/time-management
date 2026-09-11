import React from 'react'

export default function FileList({ files, onSelect, selected }){
  if(!files.length) return <div className="text-sm text-gray-500">No files loaded. Click "Load files".</div>
  return (
    <div className="divide-y">
      {files.map(f=> (
        <div key={f.path} className={`file-item ${selected && selected.path===f.path? 'active':''}`} onClick={()=>onSelect(f)}>
          <div className="flex-1">
            <div className="text-sm font-medium">{f.path}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
