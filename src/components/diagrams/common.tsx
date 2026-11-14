// 图解共享调色板与小组件：暖纸书房配色下的一套彩色语义。
export const C = {
  teal: '#0f766e',
  tealBg: '#d5ebe8',
  blue: '#2563eb',
  blueBg: '#dbe7fb',
  amber: '#b45309',
  amberBg: '#fbeacc',
  rose: '#be123c',
  roseBg: '#fbdce3',
  purple: '#7c3aed',
  purpleBg: '#e9dffc',
  ink: '#1c1b18',
  soft: '#57534a',
  faint: '#a39e93',
  line: '#d9d2c0',
  paper: '#fdfbf7',
}

export function ArrowDef({ id, color }: { id: string; color: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
    </marker>
  )
}

export function Box(props: {
  x: number; y: number; w: number; h: number
  fill: string; stroke: string; label: string; sub?: string
  rx?: number; labelSize?: number; labelColor?: string
}) {
  const { x, y, w, h, fill, stroke, label, sub, rx = 8, labelSize = 14, labelColor = C.ink } = props
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={1.4} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 6 : y + h / 2 + 5} textAnchor="middle" fontSize={labelSize} fontWeight={500} fill={labelColor}>
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fontSize={11} fill={C.soft}>
          {sub}
        </text>
      )}
    </g>
  )
}

export function Caption({ x, y, children, color = C.soft, size = 12 }: { x: number; y: number; children: React.ReactNode; color?: string; size?: number }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={size} fill={color}>
      {children}
    </text>
  )
}
