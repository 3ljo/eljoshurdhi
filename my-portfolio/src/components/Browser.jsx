// A real screenshot in a plain browser frame. Long captures scroll the page
// inside the frame on hover, so the whole site can be read without leaving.
export function Browser({ url, shot, long = false, alt, note, sizes = '(min-width: 1024px) 45vw, 100vw' }) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const src = long ? `/media/shots/${shot}-long.webp` : `/media/shots/${shot}-desktop.webp`
  return (
    <figure className="browser">
      <div className="browser__bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{host}</span>
      </div>
      <div className={`browser__view ${long ? 'browser__view--scroll' : ''}`}>
        <img
          src={src}
          srcSet={long ? undefined : `/media/shots/${shot}-desktop-720.webp 720w, /media/shots/${shot}-desktop.webp 1280w`}
          sizes={long ? undefined : sizes}
          alt={alt}
          loading="lazy"
          decoding="async"
          width="1280"
          height={long ? 3200 : 800}
        />
      </div>
      {note && <figcaption className="browser__note">{note}</figcaption>}
    </figure>
  )
}

export function Phone({ shot, alt }) {
  return (
    <div className="phone">
      <img src={`/media/shots/${shot}-mobile.webp`} alt={alt} loading="lazy" decoding="async" width="390" height="844" />
    </div>
  )
}
