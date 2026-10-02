// Preview builds only: mirrors the files listed in media-bridge.json into
// dist/__bridge/ as base64 text, so a build sandbox that cannot reach the
// media CDN can pull generated assets through the preview deployment.
// Production builds skip this entirely.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'

if (process.env.VERCEL_ENV !== 'preview') process.exit(0)

const CHUNK = 900_000 // base64 characters per text file
const MIN = 200_000 // pad small parts so they arrive as files, not inline text

const list = JSON.parse(await readFile(new URL('../media-bridge.json', import.meta.url), 'utf8'))
await mkdir('dist/__bridge', { recursive: true })

async function download(url) {
  let lastError
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url)
      if (res.ok) return Buffer.from(await res.arrayBuffer())
      lastError = new Error(`HTTP ${res.status}`)
    } catch (error) {
      lastError = error
    }
    await new Promise(resolve => setTimeout(resolve, attempt * 1000))
  }
  throw lastError
}

const index = []
for (const { id, url, webp } of list) {
  try {
    let bytes = await download(url)
    // Optional re-encode (e.g. "webp": 90) keeps big renders to one part.
    if (webp) {
      const { default: sharp } = await import('sharp')
      bytes = await sharp(bytes).webp({ quality: webp, effort: 5 }).toBuffer()
    }
    const sha = createHash('sha256').update(bytes).digest('hex')
    const b64 = bytes.toString('base64')
    const parts = Math.max(1, Math.ceil(b64.length / CHUNK))
    for (let part = 0; part < parts; part++) {
      const body = b64.slice(part * CHUNK, (part + 1) * CHUNK)
      const pad = body.length < MIN ? '#'.repeat(MIN - body.length) : ''
      await writeFile(`dist/__bridge/${id}.${part}.txt`, `BRIDGE ${id} ${part} ${parts} ${sha}\n${body}\n${pad}`)
    }
    index.push({ id, bytes: bytes.length, sha256: sha, parts })
  } catch (error) {
    index.push({ id, url, error: String(error) })
  }
}
await writeFile('dist/__bridge/index.json', JSON.stringify(index, null, 1))
console.log(`media-bridge: ${index.filter(i => !i.error).length}/${list.length} files mirrored`)
