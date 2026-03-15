import { useState, useCallback } from 'react'

type Status = 'idle' | 'success' | 'error' | 'unsupported'

export default function App() {
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('my-text')
  const [status, setStatus] = useState<Status>('idle')
  const [statusMsg, setStatusMsg] = useState('')

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  const charCount = text.length

  const getFile = useCallback(() => {
    const blob = new Blob([text], { type: 'text/plain' })
    const name = (fileName.trim() || 'my-text').replace(/\.txt$/i, '') + '.txt'
    return new File([blob], name, { type: 'text/plain' })
  }, [text, fileName])

  const handleShare = useCallback(async () => {
    if (!text.trim()) return

    const file = getFile()

    // Try native share (iOS Safari supports file sharing)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: file.name,
        })
        setStatus('success')
        setStatusMsg('Shared!')
        setTimeout(() => setStatus('idle'), 2000)
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setStatus('error')
          setStatusMsg('Share failed. Try Download instead.')
          setTimeout(() => setStatus('idle'), 3000)
        }
      }
      return
    }

    // Fallback: download
    handleDownload()
  }, [text, getFile])

  const handleDownload = useCallback(() => {
    if (!text.trim()) return
    const file = getFile()
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
    setStatus('success')
    setStatusMsg('Downloaded!')
    setTimeout(() => setStatus('idle'), 2000)
  }, [text, getFile])

  const handleClear = () => {
    setText('')
    setStatus('idle')
  }

  const canShare = typeof navigator !== 'undefined' && !!navigator.share

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-bracket">[</span>
          <span className="logo-text">TxtDrop</span>
          <span className="logo-bracket">]</span>
        </div>
        <p className="tagline">paste anything → get a .txt file</p>
      </header>

      <main className="main">
        <div className="filename-row">
          <label className="label" htmlFor="filename">FILE NAME</label>
          <div className="filename-input-wrap">
            <input
              id="filename"
              className="filename-input"
              type="text"
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              placeholder="my-text"
              spellCheck={false}
            />
            <span className="filename-ext">.txt</span>
          </div>
        </div>

        <div className="textarea-wrap">
          <textarea
            className="textarea"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste your text here — no limit on length."
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
          />
          {text && (
            <button className="clear-btn" onClick={handleClear} aria-label="Clear text">
              ✕
            </button>
          )}
        </div>

        <div className="stats">
          <span>{charCount.toLocaleString()} chars</span>
          <span className="dot">·</span>
          <span>{wordCount.toLocaleString()} words</span>
        </div>

        <div className="actions">
          {canShare ? (
            <button
              className={`btn btn-primary ${!text.trim() ? 'btn-disabled' : ''}`}
              onClick={handleShare}
              disabled={!text.trim()}
            >
              <span className="btn-icon">↑</span>
              Share as .txt
            </button>
          ) : null}

          <button
            className={`btn ${canShare ? 'btn-secondary' : 'btn-primary'} ${!text.trim() ? 'btn-disabled' : ''}`}
            onClick={handleDownload}
            disabled={!text.trim()}
          >
            <span className="btn-icon">↓</span>
            Download .txt
          </button>
        </div>

        {status !== 'idle' && (
          <div className={`status status-${status}`}>
            {statusMsg}
          </div>
        )}
      </main>

      <footer className="footer">
        <span>text never leaves your device</span>
      </footer>
    </div>
  )
}
