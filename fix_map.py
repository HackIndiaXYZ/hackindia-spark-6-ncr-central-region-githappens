"""
Fix port dot positions on the world map in CommandCenterUI.js.

Root cause:
  Port dots were <div> positioned with CSS % values; the SVG routes used pixel coords
  derived from those percentages -> they desync on any layout change.

Fix:
  Replace both the HTML div nodes and the old SVG with a single unified SVG that
  shares one viewBox coordinate space, so dots always sit exactly on route endpoints.
"""

FILE = r'frontend\app\dashboard\CommandCenterUI.js'

content = open(FILE, encoding='utf-8').read()

# ── Locate exact boundaries ─────────────────────────────────────────────────
START_MARKER = '/* Proper Route Nodes with Stitch-style Tooltips */'
END_MARKER   = '</svg>'

start_pos = content.index(START_MARKER)
# Walk back to the start of the line that contains START_MARKER
line_start = content.rfind('\n', 0, start_pos) + 1

# The old SVG closes some lines later. Find the FIRST </svg> after start_pos.
svg_close_pos = content.index(END_MARKER, start_pos)
# Include everything up to and including that </svg>
end_pos = svg_close_pos + len(END_MARKER)

# ── New unified SVG block ────────────────────────────────────────────────────
# Uses 20-space indent to match surrounding JSX indentation.
NEW_BLOCK = """\
                    {/* Unified SVG — port nodes & routes share one coordinate space */}
                    <svg
                      className="absolute inset-0 w-full h-full z-10"
                      viewBox="0 0 1000 500"
                      preserveAspectRatio="xMidYMid meet"
                    >
                       <defs>
                          <filter id="mapGlow" x="-40%" y="-40%" width="180%" height="180%">
                             <feGaussianBlur stdDeviation="3" result="blur" />
                             <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                          <filter id="mapGlowStrong" x="-60%" y="-60%" width="220%" height="220%">
                             <feGaussianBlur stdDeviation="6" result="blur" />
                             <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                       </defs>

                       {/* ── Routes ── */}
                       {/* Shanghai (837,186) -> Mumbai (702,228) */}
                       <path id="route-sha-mum" d="M 837 186 Q 768 213, 702 228" fill="none" stroke="var(--secondary)" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.65" />
                       {/* Mumbai (702,228) -> Rotterdam (512,114) */}
                       <path id="route-mum-rot" d="M 702 228 Q 600 169, 512 114" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.65" />
                       {/* Rotterdam (512,114) -> Los Angeles (172,176) */}
                       <path id="route-rot-la" d="M 512 114 Q 344 100, 172 176" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.65" />
                       {/* LA -> Shanghai (Pacific wrap - two half-paths) */}
                       <path id="route-la-sha-w" d="M 172 176 Q 86 185, 0 185" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.3" />
                       <path id="route-la-sha-e" d="M 1000 185 Q 918 195, 837 186" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.3" />

                       {/* ── Animated shipment dots ── */}
                       <g filter="url(#mapGlow)">
                          <circle r="4" fill="var(--accent)"><animateMotion dur="25s" repeatCount="indefinite"><mpath href="#route-la-sha-w" /></animateMotion></circle>
                          <circle r="2" fill="#fff"><animateMotion dur="25s" repeatCount="indefinite"><mpath href="#route-la-sha-w" /></animateMotion></circle>
                       </g>
                       <g filter="url(#mapGlow)">
                          <circle r="4" fill="var(--primary)"><animateMotion dur="18s" repeatCount="indefinite"><mpath href="#route-mum-rot" /></animateMotion></circle>
                          <circle r="2" fill="#fff"><animateMotion dur="18s" repeatCount="indefinite"><mpath href="#route-mum-rot" /></animateMotion></circle>
                       </g>
                       <g filter="url(#mapGlow)">
                          <circle r="4" fill="var(--secondary)"><animateMotion dur="22s" repeatCount="indefinite"><mpath href="#route-sha-mum" /></animateMotion></circle>
                          <circle r="2" fill="#fff"><animateMotion dur="22s" repeatCount="indefinite"><mpath href="#route-sha-mum" /></animateMotion></circle>
                       </g>

                       {/* ── Port dots (cx/cy match route endpoints exactly) ── */}
                       {[
                         { name: 'Mumbai',      region: 'IN', cx: 702, cy: 228, status: 'safe'      },
                         { name: 'Shanghai',    region: 'CN', cx: 837, cy: 186, status: 'congested' },
                         { name: 'Rotterdam',   region: 'NL', cx: 512, cy: 114, status: 'safe'      },
                         { name: 'Los Angeles', region: 'US', cx: 172, cy: 176, status: 'disrupted' },
                       ].map((port) => {
                         const col = port.status === 'disrupted' ? '#FF3D00'
                           : port.status === 'congested' ? 'var(--secondary)'
                           : 'var(--primary)';
                         return (
                           <g key={port.name}>
                             <circle cx={port.cx} cy={port.cy} r="10" fill={col} opacity="0.18">
                               <animate attributeName="r" values="8;20;8" dur="2.5s" repeatCount="indefinite" />
                               <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" />
                             </circle>
                             <circle cx={port.cx} cy={port.cy} r="6" fill={col}
                               filter={port.status === 'disrupted' ? 'url(#mapGlowStrong)' : 'url(#mapGlow)'} />
                             <circle cx={port.cx} cy={port.cy} r="2.5" fill="#fff" opacity="0.9" />
                             <text x={port.cx} y={port.cy - 14}
                               textAnchor="middle" fontSize="11" fontWeight="800"
                               fill="var(--text-primary)" letterSpacing="0.05em"
                               paintOrder="stroke" stroke="rgba(0,0,0,0.7)" strokeWidth="3"
                             >{port.name} ({port.region})</text>
                           </g>
                         );
                       })}
                    </svg>"""

new_content = content[:line_start] + NEW_BLOCK + content[end_pos:]

open(FILE, 'w', encoding='utf-8').write(new_content)

lines = new_content.split('\n')
print(f"Done. File now has {len(lines)} lines.")
for i, line in enumerate(lines):
    if 'Unified SVG' in line:
        print(f"  Port/route SVG block found at line {i + 1}")
        break
