export default function ExpeditionArt() {
  return (
    <div className="expedition-art" aria-hidden="true">
      <svg viewBox="0 0 600 440" fill="none" className="expedition-landscape">
        <defs>
          <linearGradient id="sky" x1="300" y1="0" x2="300" y2="440" gradientUnits="userSpaceOnUse">
            <stop stopColor="#233f36" /><stop offset="1" stopColor="#536658" />
          </linearGradient>
          <linearGradient id="ridge" x1="310" y1="150" x2="280" y2="440" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e3d9c3" /><stop offset="1" stopColor="#988b71" />
          </linearGradient>
          <pattern id="art-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M60 0H0V60" stroke="#d9decc" strokeOpacity=".09" />
          </pattern>
        </defs>
        <path fill="url(#sky)" d="M0 0h600v440H0z" />
        <path fill="url(#art-grid)" d="M0 0h600v440H0z" />
        <circle cx="453" cy="110" r="49" fill="#d9a16d" />
        <circle cx="453" cy="110" r="69" stroke="#d9a16d" strokeOpacity=".25" />
        <g stroke="#e7dfc8" strokeOpacity=".12">
          <path d="M-30 218c102-113 214-85 254-153S440 18 615 65" />
          <path d="M-30 238c102-113 214-85 254-153S440 38 615 85" />
          <path d="M-30 258c102-113 214-85 254-153S440 58 615 105" />
          <path d="M-30 278c102-113 214-85 254-153S440 78 615 125" />
        </g>
        <path d="M0 301 86 200 154 263 230 179 352 308 458 226 600 318v122H0Z" fill="#708071" />
        <path d="m0 335 102-79 61 33 133-155 156 182 67-46 81 80v90H0Z" fill="url(#ridge)" />
        <path d="m296 134-70 82 37-11 22 12 14-26 32 13 23-3Z" fill="#f1ebdf" />
        <path d="m296 134 8 132 48 64-15-96Z" fill="#b4a78d" />
        <path d="m296 134-48 190-73 53 88-83Z" fill="#c8bba1" />
        <path d="M0 389 71 334l118 41 110-52 98 43 94-45 109 53v66H0Z" fill="#405b4b" />
        <path d="m0 429 122-42 90 21 98-27 128 51 84-41 78 22v27H0Z" fill="#294438" />
        <path d="M162 433c11-36 77-17 64-53s41-53 47-78-12-45 11-72 2-34 12-65" stroke="#ce785f" strokeWidth="2.5" strokeDasharray="5 7" strokeLinecap="round" />
        <g fill="#f5eedc" stroke="#a84232" strokeWidth="3">
          <circle cx="227" cy="376" r="5" /><circle cx="273" cy="302" r="5" /><circle cx="284" cy="231" r="5" />
          <circle cx="296" cy="165" r="7" />
        </g>
        <path d="M296 165v-44l28 8-28 10" stroke="#d9795e" strokeWidth="2" fill="#a84232" />
        <g stroke="#e4dac4" strokeOpacity=".5">
          <path d="M31 37h15m-7.5-7.5v15M560 402h15m-7.5-7.5v15" />
          <path d="M40 395h55m-55-4v8m27-8v8m28-8v8" />
        </g>
      </svg>
      <div className="art-location"><span className="location-dot" /> VOLCÁN PISSIS</div>
      <div className="art-altitude"><span>6.800 <small>m</small></span><p>Cumbre del Pissis</p></div>
      <div className="art-coordinate">27° 45′ S &nbsp; / &nbsp; 68° 47′ O</div>
    </div>
  )
}
