// 第 4–5 章图解：存储层次、Cache 组相联、寻址方式
import { C, ArrowDef, Caption } from './common'

export function DHierarchy() {
  const layers = [
    { label: '寄存器', sub: '< 1 ns · KB 级', color: C.rose, bg: C.roseBg, w: 130 },
    { label: 'Cache', sub: '几 ns · MB 级', color: C.amber, bg: C.amberBg, w: 210 },
    { label: '主存 DRAM', sub: '几十 ns · GB 级', color: C.teal, bg: C.tealBg, w: 290 },
    { label: '本地磁盘 / SSD', sub: 'µs~ms · TB 级', color: C.blue, bg: C.blueBg, w: 370 },
    { label: '远程存储', sub: 'ms 以上 · 几乎无限', color: C.purple, bg: C.purpleBg, w: 450 },
  ]
  return (
    <svg viewBox="0 0 640 380" className="w-full" role="img" aria-label="存储器层次结构金字塔">
      <Caption x={270} y={26} size={13} color={C.faint}>存储层次：越上层越快、越贵、越小</Caption>
      {layers.map((l, i) => {
        const y = 46 + i * 56
        const x = 270 - l.w / 2
        return (
          <g key={l.label}>
            <rect x={x} y={y} width={l.w} height={44} rx={8} fill={l.bg} stroke={l.color} strokeWidth={1.5} />
            <text x={270} y={y + 20} textAnchor="middle" fontSize={14} fontWeight={500} fill={l.color}>{l.label}</text>
            <text x={270} y={y + 36} textAnchor="middle" fontSize={10.5} fill={C.soft}>{l.sub}</text>
          </g>
        )
      })}
      {/* 右侧箭头 */}
      <line x1={520} y1={60} x2={520} y2={310} stroke={C.soft} strokeWidth={1.4} markerEnd="url(#ar-hy)" />
      <defs><ArrowDef id="ar-hy" color={C.soft} /></defs>
      <Caption x={560} y={140} size={11}>速度↓</Caption>
      <Caption x={560} y={185} size={11}>容量↑</Caption>
      <Caption x={560} y={230} size={11}>单价↓</Caption>
      <Caption x={270} y={350} size={12} color={C.soft}>靠时间 / 空间局部性，CPU 绝大多数访问都命中上面几层</Caption>
    </svg>
  )
}

export function DCache() {
  return (
    <svg viewBox="0 0 640 380" className="w-full" role="img" aria-label="Cache 组相联映射示意图">
      <defs><ArrowDef id="ar-ca" color={C.soft} /></defs>
      <Caption x={320} y={26} size={13} color={C.faint}>组相联映射：主存块 → 对组取模 → 组内任意行</Caption>

      {/* 主存 */}
      <Caption x={110} y={52} size={12}>主存（按块划分）</Caption>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const col = i % 2 === 0 ? { bg: C.tealBg, c: C.teal } : { bg: C.roseBg, c: C.rose }
        return (
          <g key={i}>
            <rect x={60} y={62 + i * 46} width={100} height={38} rx={6} fill={col.bg} stroke={col.c} strokeWidth={1.3} />
            <Caption x={110} y={86 + i * 46} size={12} color={col.c}>块 {i}</Caption>
          </g>
        )
      })}
      <Caption x={60} y={330} size={10.5} color={C.teal}>偶数块 → 组 0</Caption>
      <Caption x={60} y={348} size={10.5} color={C.rose}>奇数块 → 组 1</Caption>

      {/* 映射箭头 */}
      <path d="M 162 100 C 230 100, 240 110, 294 116" fill="none" stroke={C.teal} strokeWidth={1.5} markerEnd="url(#ar-ca)" />
      <path d="M 162 146 C 230 146, 240 210, 294 216" fill="none" stroke={C.rose} strokeWidth={1.5} markerEnd="url(#ar-ca)" />

      {/* Cache */}
      <Caption x={400} y={52} size={12}>Cache（2 组 × 2 行）</Caption>
      <rect x={300} y={62} width={200} height={100} rx={8} fill={C.tealBg} stroke={C.teal} strokeWidth={1.5} opacity={0.55} />
      <Caption x={316} y={82} size={11} color={C.teal}>组 0</Caption>
      <rect x={312} y={90} width={88} height={28} rx={5} fill="#fff" stroke={C.teal} strokeWidth={1.2} />
      <rect x={404} y={90} width={88} height={28} rx={5} fill="#fff" stroke={C.teal} strokeWidth={1.2} />
      <Caption x={356} y={108} size={11}>行 0</Caption>
      <Caption x={448} y={108} size={11}>行 1</Caption>

      <rect x={300} y={176} width={200} height={100} rx={8} fill={C.roseBg} stroke={C.rose} strokeWidth={1.5} opacity={0.55} />
      <Caption x={316} y={196} size={11} color={C.rose}>组 1</Caption>
      <rect x={312} y={204} width={88} height={28} rx={5} fill="#fff" stroke={C.rose} strokeWidth={1.2} />
      <rect x={404} y={204} width={88} height={28} rx={5} fill="#fff" stroke={C.rose} strokeWidth={1.2} />
      <Caption x={356} y={222} size={11}>行 0</Caption>
      <Caption x={448} y={222} size={11}>行 1</Caption>

      {/* 地址划分 */}
      <Caption x={400} y={310} size={12} color={C.ink}>主存地址 = 标记 Tag + 组号 + 块内地址</Caption>
      <Caption x={400} y={332} size={11} color={C.soft}>组号决定去哪一组，标记在组内逐行比较，全不匹配才未命中</Caption>
    </svg>
  )
}

export function DAddressing() {
  const panel = (x: number, y: number, title: string, color: string, bg: string) => (
    <g>
      <rect x={x} y={y} width={290} height={140} rx={10} fill={bg} stroke={color} strokeWidth={1.4} opacity={0.5} />
      <Caption x={x + 145} y={y + 22} size={13} color={color}>{title}</Caption>
    </g>
  )
  const chip = (x: number, y: number, w: number, label: string, color = C.ink) => (
    <g>
      <rect x={x} y={y} width={w} height={30} rx={6} fill="#fff" stroke={color} strokeWidth={1.2} />
      <Caption x={x + w / 2} y={y + 20} size={11.5}>{label}</Caption>
    </g>
  )
  const arr = (x1: number, y1: number, x2: number, y2: number, id: string) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.soft} strokeWidth={1.4} markerEnd={`url(#${id})`} />
  )
  return (
    <svg viewBox="0 0 640 340" className="w-full" role="img" aria-label="四种寻址方式对比图">
      <defs><ArrowDef id="ar-ad" color={C.soft} /></defs>
      {/* 立即寻址 */}
      {panel(15, 20, '立即寻址 · 操作数在指令里', C.rose, C.roseBg)}
      {chip(45, 66, 90, '指令')}
      {chip(155, 66, 120, '操作数 5', C.rose)}
      <Caption x={160} y={125} size={11} color={C.soft}>访存 0 次，最快</Caption>
      {/* 直接寻址 */}
      {panel(335, 20, '直接寻址 · EA = A', C.amber, C.amberBg)}
      {chip(365, 56, 80, '指令 A')}
      {chip(475, 56, 110, '存储器 [A]', C.amber)}
      {arr(447, 71, 471, 71, 'ar-ad')}
      <Caption x={480} y={125} size={11} color={C.soft}>访存 1 次</Caption>
      {/* 寄存器间接 */}
      {panel(15, 185, '寄存器间接 · EA = (R)', C.teal, C.tealBg)}
      {chip(35, 230, 70, '指令 R')}
      {chip(125, 230, 70, '寄存器', C.teal)}
      {chip(215, 230, 72, '存储器', C.teal)}
      {arr(107, 245, 121, 245, 'ar-ad')}
      {arr(197, 245, 211, 245, 'ar-ad')}
      <Caption x={160} y={300} size={11} color={C.soft}>访存 1 次，天然指针</Caption>
      {/* 变址寻址 */}
      {panel(335, 185, '变址寻址 · EA = (Rx) + A', C.blue, C.blueBg)}
      {chip(355, 230, 74, '数组首址 A', C.blue)}
      {chip(439, 230, 60, '+ 下标', C.blue)}
      {chip(509, 230, 76, 'A[i]', C.blue)}
      {arr(431, 245, 437, 245, 'ar-ad')}
      {arr(501, 245, 507, 245, 'ar-ad')}
      <Caption x={480} y={300} size={11} color={C.soft}>遍历数组：改下标即可</Caption>
    </svg>
  )
}
