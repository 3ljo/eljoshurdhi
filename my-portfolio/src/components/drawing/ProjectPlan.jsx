import Plot from './Plot'

// As-built drawings of the shipped projects: line drawings of each product's
// main screen, not screenshots. When a project has a `screenshot`, it shows
// the real image in the same frame instead.

const L = ({ t = 0, className = 'ln', ...p }) => <line pathLength="1" className={className} style={{ '--d': t }} {...p} />
const R = ({ t = 0, className = 'ln', ...p }) => <rect pathLength="1" className={className} style={{ '--d': t }} {...p} />
const C = ({ t = 0, className = 'ln', ...p }) => <circle pathLength="1" className={className} style={{ '--d': t }} {...p} />
const P = ({ t = 0, className = 'ln', ...p }) => <path pathLength="1" className={className} style={{ '--d': t }} {...p} />
const B = ({ t = 900, className = '', ...p }) => <rect className={`build ${className}`} style={{ '--d': t }} {...p} />

function Frame({ children }) {
  return (
    <>
      <R t={0} x="10" y="10" width="580" height="380" rx="6" />
      <L t={120} x1="10" y1="38" x2="590" y2="38" />
      {[26, 38, 50].map((cx, i) => (
        <C key={cx} t={160 + i * 30} cx={cx} cy="24" r="3.5" className="ln ln-thin" />
      ))}
      <R t={220} x="80" y="17" width="220" height="13" rx="6.5" className="ln ln-thin" />
      {children}
    </>
  )
}

const Cross = ({ x, y, w, h, t }) => (
  <>
    <L t={t} x1={x} y1={y} x2={x + w} y2={y + h} className="ln ln-thin ln-soft" />
    <L t={t + 20} x1={x + w} y1={y} x2={x} y2={y + h} className="ln ln-thin ln-soft" />
  </>
)

function Store() {
  return (
    <Frame>
      <R t={260} x="34" y="54" width="54" height="14" />
      {[300, 345, 390].map((x, i) => (
        <L key={x} t={300 + i * 30} x1={x} y1="61" x2={x + 30} y2="61" />
      ))}
      <C t={380} cx="548" cy="61" r="11" />
      <circle className="build f-action" style={{ '--d': 1200 }} cx="559" cy="52" r="6" />
      <B t={950} className="f-soft" x="34" y="86" width="532" height="88" />
      <R t={420} x="34" y="86" width="532" height="88" />
      <B t={1000} className="f-ink" x="58" y="108" width="210" height="16" />
      <L t={480} x1="58" y1="142" x2="200" y2="142" />
      {[34, 170, 306, 442].map((x, i) => (
        <g key={x}>
          <R t={520 + i * 50} x={x} y="194" width="124" height="174" />
          <R t={560 + i * 50} x={x + 10} y="204" width="104" height="80" className="ln ln-thin" />
          <Cross x={x + 10} y={204} w={104} h={80} t={600 + i * 50} />
          <L t={640 + i * 50} x1={x + 10} y1="302" x2={x + 96} y2="302" />
          <L t={660 + i * 50} x1={x + 10} y1="316" x2={x + 52} y2="316" className="ln ln-bold" />
          {i === 1 && <B t={1150} className="f-action" x={x + 10} y="334" width="104" height="22" />}
          <R t={680 + i * 50} x={x + 10} y="334" width="104" height="22" />
        </g>
      ))}
    </Frame>
  )
}

function Cv() {
  return (
    <Frame>
      <B t={950} className="f-paper" x="34" y="56" width="230" height="314" />
      <R t={260} x="34" y="56" width="230" height="314" />
      <B t={1000} className="f-ink" x="54" y="76" width="130" height="16" />
      <L t={320} x1="54" y1="104" x2="120" y2="104" className="ln ln-bold" />
      {[132, 152, 172, 192, 212, 236, 256, 276, 296, 320].map((y, i) => (
        <L key={y} t={360 + i * 30} x1="54" y1={y} x2={[240, 220, 236, 200, 228, 238, 214, 230, 190, 222][i]} y2={y} className="ln ln-thin" />
      ))}
      <B t={1150} className="f-soft" x="48" y="183" width="196" height="18" />
      <P t={400} d={'M320 72 l6 16 16 6 -16 6 -6 16 -6 -16 -16 -6 16 -6z'} />
      <L t={460} x1="356" y1="94" x2="520" y2="94" />
      <C t={500} cx="430" cy="196" r="62" className="ln ln-soft" />
      <circle
        className="build"
        style={{ '--d': 1100, fill: 'none', stroke: 'var(--action)', strokeWidth: 7, strokeLinecap: 'round' }}
        cx="430"
        cy="196"
        r="62"
        pathLength="100"
        strokeDasharray="78 100"
        transform="rotate(-90 430 196)"
      />
      {[292, 322, 352].map((y, i) => (
        <g key={y}>
          <C t={640 + i * 60} cx="336" cy={y} r="9" />
          <P t={680 + i * 60} d={`M331 ${y} l4 4 7 -8`} />
          <L t={700 + i * 60} x1="356" y1={y} x2={[520, 488, 506][i]} y2={y} />
        </g>
      ))}
    </Frame>
  )
}

function Voice() {
  const bars = Array.from({ length: 17 }, (_, i) => 10 + Math.round(Math.abs(Math.sin(i * 1.3) * Math.cos(i * 0.7)) * 40))
  return (
    <Frame>
      <R t={260} x="34" y="56" width="206" height="314" />
      <C t={300} cx="137" cy="124" r="32" />
      <circle className="build f-line" style={{ '--d': 1000 }} cx="137" cy="124" r="24" />
      <C t={340} cx="137" cy="124" r="44" className="ln ln-thin ln-dash" />
      <C t={360} cx="137" cy="124" r="56" className="ln ln-thin ln-dash" />
      <L t={400} x1="92" y1="206" x2="182" y2="206" className="ln ln-bold" />
      <L t={420} x1="108" y1="224" x2="166" y2="224" />
      {bars.map((h, i) => (
        <L key={i} t={450 + i * 25} x1={58 + i * 9.5} y1={300 - h / 2} x2={58 + i * 9.5} y2={300 + h / 2} />
      ))}
      <R t={500} x="262" y="64" width="210" height="40" rx="14" />
      <L t={540} x1="280" y1="84" x2="440" y2="84" />
      <B t={1050} className="f-line" x="352" y="122" width="214" height="40" rx="14" />
      <R t={580} x="352" y="122" width="214" height="40" rx="14" />
      <R t={620} x="262" y="180" width="160" height="40" rx="14" />
      <L t={660} x1="280" y1="200" x2="396" y2="200" />
      <B t={1250} className="f-action" x="330" y="254" width="190" height="36" rx="18" />
      <R t={700} x="330" y="254" width="190" height="36" rx="18" />
      <P t={760} d="M352 272 l6 6 11 -12" />
      <L t={780} x1="380" y1="272" x2="494" y2="272" />
    </Frame>
  )
}

function Board() {
  return (
    <Frame>
      <R t={260} x="34" y="54" width="66" height="14" />
      <L t={300} x1="120" y1="61" x2="566" y2="61" className="ln ln-soft" />
      <B t={1000} className="f-action" x="120" y="58" width="290" height="6" />
      {[34, 216, 398].map((x, col) => (
        <g key={x}>
          <R t={340 + col * 60} x={x} y="84" width="168" height="286" />
          <L t={380 + col * 60} x1={x + 14} y1="104" x2={x + 74} y2="104" className="ln ln-bold" />
          {[124, 192].map((y, r) => (
            <g key={y}>
              <R t={420 + col * 60 + r * 40} x={x + 12} y={y} width="144" height="56" />
              <L t={440 + col * 60 + r * 40} x1={x + 24} y1={y + 20} x2={x + 132} y2={y + 20} />
              <L t={460 + col * 60 + r * 40} x1={x + 24} y1={y + 36} x2={x + 92} y2={y + 36} className="ln ln-thin" />
            </g>
          ))}
        </g>
      ))}
      <R t={760} x="228" y="270" width="144" height="56" className="ln ln-dash ln-soft" />
      <B t={1150} className="f-paper" x="410" y="270" width="144" height="56" />
      <R t={800} x="410" y="270" width="144" height="56" className="ln ln-bold" />
      <L t={840} x1="422" y1="290" x2="530" y2="290" />
      <P t={880} d="M372 298 C 386 298, 392 298, 404 298" className="ln" />
      <P t={900} d="M396 292 l8 6 -8 6" className="ln" />
    </Frame>
  )
}

function Agency() {
  return (
    <Frame>
      <B t={900} className="f-ink" x="10" y="38" width="580" height="352" />
      <C t={260} cx="470" cy="150" r="96" className="ln ln-dash" />
      <circle className="build f-action" style={{ '--d': 1100, opacity: 0.85 }} cx="470" cy="150" r="70" />
      <L t={300} x1="36" y1="62" x2="86" y2="62" className="ln ln-bold" />
      <L t={330} x1="110" y1="62" x2="140" y2="62" />
      <L t={350} x1="156" y1="62" x2="186" y2="62" />
      <text
        x="30"
        y="268"
        className="appear"
        style={{
          '--d': 700,
          font: '700 168px var(--font-display)',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          letterSpacing: '-4px',
        }}
      >
        ESHB
      </text>
      <L t={500} x1="36" y1="304" x2="300" y2="304" />
      <B t={1250} className="f-action" x="36" y="324" width="104" height="30" rx="15" />
      <R t={560} x="36" y="324" width="104" height="30" rx="15" />
    </Frame>
  )
}

function Finance() {
  const bars = [0.45, 0.7, 0.55, 0.9, 0.62, 0.8, 0.5]
  return (
    <Frame>
      <B t={950} className="f-soft" x="10" y="38" width="110" height="352" />
      <L t={260} x1="120" y1="38" x2="120" y2="390" />
      <L t={290} x1="28" y1="64" x2="88" y2="64" className="ln ln-bold" />
      {[96, 120, 144, 168].map((y, i) => (
        <L key={y} t={320 + i * 30} x1="28" y1={y} x2={i === 0 ? 100 : 86} y2={y} />
      ))}
      {[140, 292, 444].map((x, i) => (
        <g key={x}>
          <R t={420 + i * 40} x={x} y="56" width="136" height="64" />
          <L t={460 + i * 40} x1={x + 14} y1="76" x2={x + 70} y2="76" className="ln ln-thin" />
          <L t={480 + i * 40} x1={x + 14} y1="98" x2={x + 104} y2="98" className="ln ln-bold" />
        </g>
      ))}
      <C t={600} cx="218" cy="262" r="70" className="ln ln-soft" />
      {[
        [0, 42, 'var(--action)'],
        [42, 26, 'currentColor'],
        [68, 18, 'currentColor'],
        [86, 14, 'currentColor'],
      ].map(([start, len, color], i) => (
        <circle
          key={start}
          className="build"
          style={{ '--d': 1050 + i * 80, fill: 'none', stroke: color, strokeWidth: 22, strokeOpacity: i > 0 ? 0.3 + i * 0.18 : 1 }}
          cx="218"
          cy="262"
          r="70"
          pathLength="100"
          strokeDasharray={`${len - 1} 100`}
          strokeDashoffset={-start}
          transform="rotate(-90 218 262)"
        />
      ))}
      <L t={640} x1="320" y1="360" x2="568" y2="360" />
      {bars.map((h, i) => (
        <g key={i}>
          <B t={1100 + i * 50} className={i === 3 ? 'f-action' : 'f-soft'} x={330 + i * 34} y={360 - h * 180} width="22" height={h * 180} />
          <R t={680 + i * 40} x={330 + i * 34} y={360 - h * 180} width="22" height={h * 180} className="ln ln-thin" />
        </g>
      ))}
    </Frame>
  )
}

const PLANS = { store: Store, cv: Cv, voice: Voice, board: Board, agency: Agency, finance: Finance }

export default function ProjectPlan({ project, className = '' }) {
  if (project.screenshot) {
    return (
      <div className={`overflow-hidden rounded-[6px] border-[1.5px] border-line bg-paper ${className}`}>
        <img src={project.screenshot} alt={`${project.title}, live site`} loading="lazy" className="w-full" />
      </div>
    )
  }
  const Drawing = PLANS[project.plan] ?? Store
  return (
    <Plot className={className}>
      <svg viewBox="0 0 600 400" className="drawing block h-auto w-full" role="img" aria-label={`Drawing of ${project.title}: ${project.description}`}>
        <Drawing />
      </svg>
    </Plot>
  )
}
