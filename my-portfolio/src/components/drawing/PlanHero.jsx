import Plot from './Plot'
import { heroKeynotes } from './heroKeynotes'

// The proposed homepage, drawn as a plan: a desktop page and its mobile
// version, with dimension lines and four keynote callouts. Linework plots
// first (`--d` = delay in ms), then the fills build in.
const W = 780
const H = 560


const L = ({ d, ...props }) => <line pathLength="1" className="ln" style={{ '--d': d }} {...props} />
const R = ({ d, className = 'ln', ...props }) => (
  <rect pathLength="1" className={className} style={{ '--d': d }} {...props} />
)
const B = ({ d, className, ...props }) => <rect className={`build ${className}`} style={{ '--d': d }} {...props} />

export default function PlanHero() {
  return (
    <Plot className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="drawing block h-auto w-full" role="img" aria-label="Plan of a proposed business homepage on desktop and mobile, with four numbered notes">
        <defs>
          <pattern id="hero-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.2" />
          </pattern>
        </defs>

        {/* Desktop page */}
        <R d={0} x="70" y="50" width="550" height="430" rx="6" />
        <L d={150} x1="70" y1="82" x2="620" y2="82" />
        {[90, 104, 118].map((cx, i) => (
          <circle key={cx} pathLength="1" className="ln ln-thin" style={{ '--d': 200 + i * 30 }} cx={cx} cy="66" r="4" />
        ))}
        <R d={260} x="140" y="59" width="280" height="14" rx="7" className="ln ln-thin" />

        <R d={320} x="94" y="100" width="60" height="12" />
        <L d={360} x1="400" y1="106" x2="428" y2="106" />
        <L d={380} x1="442" y1="106" x2="470" y2="106" />
        <L d={400} x1="484" y1="106" x2="512" y2="106" />
        <B d={1250} className="f-action" x="536" y="96" width="60" height="20" />
        <R d={420} x="536" y="96" width="60" height="20" />

        <B d={1150} className="f-ink" x="94" y="146" width="300" height="26" />
        <B d={1220} className="f-ink" x="94" y="180" width="232" height="26" />
        <R d={460} x="94" y="146" width="300" height="26" />
        <R d={500} x="94" y="180" width="232" height="26" />
        <L d={560} x1="94" y1="226" x2="380" y2="226" />
        <L d={600} x1="94" y1="240" x2="356" y2="240" />
        <L d={640} x1="94" y1="254" x2="300" y2="254" />

        <B d={1300} className="f-action" x="94" y="276" width="124" height="34" />
        <R d={700} x="94" y="276" width="124" height="34" />
        <R d={740} x="228" y="276" width="104" height="34" />

        <B d={1280} x="410" y="136" width="186" height="174" fill="url(#hero-hatch)" />
        <R d={600} x="410" y="136" width="186" height="174" />
        <L d={680} x1="410" y1="136" x2="596" y2="310" className="ln ln-thin ln-soft" />
        <L d={700} x1="596" y1="136" x2="410" y2="310" className="ln ln-thin ln-soft" />

        {[94, 263, 432].map((x, i) => (
          <g key={x}>
            <R d={800 + i * 40} x={x} y="338" width={i === 2 ? 164 : 158} height="58" />
            <circle pathLength="1" className="ln ln-thin" style={{ '--d': 860 + i * 40 }} cx={x + 18} cy="356" r="7" />
            <L d={880 + i * 40} x1={x + 34} y1="356" x2={x + 120} y2="356" />
            <L d={900 + i * 40} x1={x + 14} y1="378" x2={x + 132} y2="378" />
          </g>
        ))}

        <R d={960} x="94" y="416" width="502" height="40" />
        <L d={1000} x1="108" y1="436" x2="330" y2="436" />
        <B d={1350} className="f-action" x="516" y="424" width="70" height="24" />
        <R d={1020} x="516" y="424" width="70" height="24" />

        {/* Mobile version, overlapping the desktop page */}
        <rect x="600" y="214" width="136" height="290" rx="16" className="f-paper" />
        <R d={1040} x="600" y="214" width="136" height="290" rx="16" />
        <L d={1080} x1="650" y1="228" x2="686" y2="228" />
        <B d={1420} className="f-ink" x="614" y="248" width="96" height="10" />
        <B d={1450} className="f-ink" x="614" y="264" width="74" height="10" />
        <R d={1100} x="614" y="248" width="96" height="10" className="ln ln-thin" />
        <R d={1120} x="614" y="264" width="74" height="10" className="ln ln-thin" />
        <L d={1140} x1="614" y1="288" x2="716" y2="288" />
        <L d={1150} x1="614" y1="298" x2="700" y2="298" />
        <B d={1480} className="f-action" x="614" y="312" width="68" height="18" />
        <R d={1160} x="614" y="312" width="68" height="18" className="ln ln-thin" />
        <B d={1500} x="614" y="342" width="108" height="78" fill="url(#hero-hatch)" />
        <R d={1180} x="614" y="342" width="108" height="78" className="ln ln-thin" />
        <L d={1200} x1="614" y1="442" x2="722" y2="442" />
        <L d={1210} x1="614" y1="458" x2="690" y2="458" />
        <L d={1230} x1="650" y1="490" x2="686" y2="490" />

        {/* Dimension lines */}
        <g className="ln-thin">
          <L d={1300} x1="70" y1="30" x2="620" y2="30" className="ln ln-thin" />
          <L d={1300} x1="70" y1="23" x2="70" y2="37" className="ln ln-thin" />
          <L d={1300} x1="620" y1="23" x2="620" y2="37" className="ln ln-thin" />
          <L d={1330} x1="600" y1="526" x2="736" y2="526" className="ln ln-thin" />
          <L d={1330} x1="600" y1="519" x2="600" y2="533" className="ln ln-thin" />
          <L d={1330} x1="736" y1="519" x2="736" y2="533" className="ln ln-thin" />
        </g>
        <text className="txt appear" style={{ '--d': 1500 }} x="345" y="22" textAnchor="middle">
          DESKTOP
        </text>
        <text className="txt appear" style={{ '--d': 1520 }} x="668" y="548" textAnchor="middle">
          MOBILE
        </text>

        {/* Leader lines to the keynote bubbles */}
        <L d={1550} x1="48" y1="159" x2="90" y2="159" className="ln ln-thin" />
        <L d={1580} x1="48" y1="293" x2="90" y2="293" className="ln ln-thin" />
        <L d={1610} x1="752" y1="189" x2="738" y2="226" className="ln ln-thin" />
        <L d={1640} x1="48" y1="436" x2="90" y2="436" className="ln ln-thin" />
      </svg>

      {heroKeynotes.map((k, i) => (
        <span
          key={k.n}
          className="bubble appear absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(k.x / W) * 100}%`, top: `${(k.y / H) * 100}%`, '--d': 1600 + i * 60 }}
          aria-hidden="true"
        >
          {k.n}
        </span>
      ))}
    </Plot>
  )
}
