import { useState, useCallback } from 'react'

type Status = 'idle' | 'success' | 'error' | 'unsupported'
type ExportFormat = 'txt' | 'md' | 'json' | 'csv' | 'html' | 'xml' | 'yaml' | 'log'

const formatConfig: Record<ExportFormat, { label: string; mimeType: string }> = {
  txt: { label: '.txt', mimeType: 'text/plain' },
  md: { label: '.md', mimeType: 'text/markdown' },
  json: { label: '.json', mimeType: 'application/json' },
  csv: { label: '.csv', mimeType: 'text/csv' },
  html: { label: '.html', mimeType: 'text/html' },
  xml: { label: '.xml', mimeType: 'application/xml' },
  yaml: { label: '.yaml', mimeType: 'application/x-yaml' },
  log: { label: '.log', mimeType: 'text/plain' },
}

function stripKnownExtension(name: string) {
  return name.replace(/\.(txt|md|json|csv|html|xml|yaml|log)$/i, '')
}

function toCsvValue(value: string) {
  return `"${value.replace(/"/g, '""')}"`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toYamlBlock(value: string) {
  return value
    .split('\n')
    .map(line => `  ${line}`)
    .join('\n')
}

function getTimestamp() {
  return new Date().toISOString()
}

function getExportContent(text: string, format: ExportFormat) {
  switch (format) {
    case 'md':
      return `# Exported from TxtDrop\n\n${text}`
    case 'json':
      return JSON.stringify(
        {
          content: text,
          exportedAt: getTimestamp(),
        },
        null,
        2,
      )
    case 'csv':
      return `content\n${toCsvValue(text)}`
    case 'html':
      return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TxtDrop Export</title>
  </head>
  <body>
    <pre>${escapeHtml(text)}</pre>
  </body>
</html>`
    case 'xml':
      return `<?xml version="1.0" encoding="UTF-8"?>
<txtdrop>
  <content>${escapeXml(text)}</content>
  <exportedAt>${getTimestamp()}</exportedAt>
</txtdrop>`
    case 'yaml':
      return `content: |
${toYamlBlock(text)}
exportedAt: ${getTimestamp()}`
    case 'log':
      return `[${getTimestamp()}] TxtDrop export\n${text}`
    case 'txt':
    default:
      return text
  }
}

export default function App() {
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('untitled')
  const [format, setFormat] = useState<ExportFormat>('txt')
  const [status, setStatus] = useState<Status>('idle')
  const [statusMsg, setStatusMsg] = useState('')

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  const charCount = text.length

  const getFile = useCallback(() => {
    const content = getExportContent(text, format)
    const blob = new Blob([content], { type: 'application/octet-stream' })
    const name = `${stripKnownExtension(fileName.trim() || 'untitled')}.${format}`
    return new File([blob], name, { type: 'application/octet-stream' })
  }, [text, fileName, format])

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

  const handleShare = useCallback(async () => {
    if (!text.trim()) return

    const file = getFile()

    if (
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [file] }) &&
      navigator.share
    ) {
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

    handleDownload()
  }, [text, getFile, handleDownload])

  const handleClear = () => {
    setText('')
    setStatus('idle')
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-bracket">[</span>
          <span className="logo-text">TxtDrop</span>
          <span className="logo-bracket">]</span>
        </div>
        <p className="tagline">paste anything → export as txt, md, json, csv, html, xml, yaml, or log</p>
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
              placeholder="untitled"
              spellCheck={false}
            />
            <div className="filename-ext-wrap">
              <select
                aria-label="Export format"
                className="filename-ext-select"
                value={format}
                onChange={e => setFormat(e.target.value as ExportFormat)}
              >
                {Object.entries(formatConfig).map(([value, config]) => (
                  <option key={value} value={value}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
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
          <button
            className={`btn btn-primary ${!text.trim() ? 'btn-disabled' : ''}`}
            onClick={handleShare}
            disabled={!text.trim()}
          >
            <span className="btn-icon">↑</span>
            Share as {formatConfig[format].label}
          </button>

          <button
            className={`btn btn-secondary ${!text.trim() ? 'btn-disabled' : ''}`}
            onClick={handleDownload}
            disabled={!text.trim()}
          >
            <span className="btn-icon">↓</span>
            Download {formatConfig[format].label}
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
