// 第 6–7 章图解：数据通路、流水线时空图、8086 寄存器、分段地址
import { C, ArrowDef, Box, Caption } from './common'

export function DDatapath() {
  const flow = [
    { x: 20, label: 'PC', sub: '指令地址', c: C.rose, bg: C.roseBg },
    { x: 145, label: '指令存储器', sub: '取出指令', c: C.amber, bg: C.amberBg },
    { x: 270, label: '寄存器堆', sub: '读操作数', c: C.teal, bg: C.tealBg },
    { x: 395, label: 'ALU', sub: '运算', c: C.blue, bg: C.blueBg },
    { x: 520, label: '数据存储器', sub: '读写数据', c: C.purple, bg: C.purpleBg },
  ]
  return (
    <svg viewBox="0 0 640 300" className="w-full" role="img" aria-label="CPU 数据通路示意图">
      <defs><ArrowDef id="ar-dp" color={C.soft} /></defs>
      <Caption x={320} y={30} size={13} color={C.faint}>简化数据通路：一条指令的旅程</Caption>
      {flow.map((f, i) => (
        <g key={f.label}>
          <Box x={f.x} y={80} w={100} h={58} fill={f.bg} stroke={f.c} label={f.label} sub={f.sub} labelSize={12.5} />
          {i < flow.length - 1 && (
            <line x1={f.x + 102} y1={109} x2={f.x + 122} y2={109} stroke={C.soft} strokeWidth={1.6} markerEnd="url(#ar-dp)" />
          )}
        </g>
      ))}
      {/* 写回路径 */}
      <path d="M 570 138 L 570 210 L 320 210 L 320 144" fill="none" stroke={C.purple} strokeWidth={1.6} strokeDasharray="6 4" markerEnd="url(#ar-dp)" />
      <Caption x={450} y={228} color={C.purple} size={12}>结果写回寄存器堆</Caption>
      {/* PC 自增 */}
      <path d="M 70 138 L 70 250 L 620 250" fill="none" stroke={C.rose} strokeWidth={1.4} strokeDasharray="5 4" />
      <Caption x={70} y={270} color={C.rose} size={12}>PC + 1 → 取下一条</Caption>
      <Caption x={320} y={292} size={11} color={C.faint}>控制器按节拍发出微操作信号，驱动数据沿通路流动（图中未画出控制线）</Caption>
    </svg>
  )
}

export function DPipeline() {
  const stages = ['IF 取指', 'ID 译码', 'EX 执行', 'MEM 访存', 'WB 写回']
  const cols = ['#dbe7fb', '#d5ebe8', '#fbeacc', '#e9dffc', '#fbdce3']
  const cellW = 92, cellH = 40, x0 = 118, y0 = 60
  return (
    <svg viewBox="0 0 640 320" className="w-full" role="img" aria-label="五级流水线时空图">
      <Caption x={320} y={28} size={13} color={C.faint}>五级流水线：4 条指令重叠执行</Caption>
      <Caption x={70} y={y0 - 10} size={11} color={C.faint}>指令 ↓ 时间 →</Caption>
      {[0, 1, 2, 3].map((row) =>
        stages.map((s, col) => {
          const x = x0 + (col + row) * cellW
          if (x + cellW > 640) return null
          return (
            <g key={`${row}-${col}`}>
              <rect x={x} y={y0 + row * (cellH + 8)} width={cellW - 8} height={cellH} rx={6} fill={cols[col]} stroke={C.line} strokeWidth={1} />
              <Caption x={x + (cellW - 8) / 2} y={y0 + row * (cellH + 8) + 25} size={11.5}>{s}</Caption>
            </g>
          )
        })
      )}
      {[0, 1, 2, 3].map((row) => (
        <Caption key={row} x={x0 - 20} y={y0 + row * (cellH + 8) + 25} size={12} color={C.soft}>I{row + 1}</Caption>
      ))}
      <Caption x={320} y={298} size={12} color={C.soft}>流水线充满后，每个时钟周期都有一条指令完成（理想 CPI ≈ 1）</Caption>
    </svg>
  )
}

export function DRegisters() {
  const grp = (x: number, y: number, w: number, h: number, title: string, color: string, bg: string) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={bg} stroke={color} strokeWidth={1.4} opacity={0.5} />
      <Caption x={x + w / 2} y={y + 20} size={12} color={color}>{title}</Caption>
    </g>
  )
  const reg = (x: number, y: number, w: number, label: string, sub?: string, color = C.ink) => (
    <g>
      <rect x={x} y={y} width={w} height={30} rx={5} fill="#fff" stroke={color} strokeWidth={1.1} />
      <Caption x={x + w / 2} y={y + (sub ? 13 : 20)} size={11.5}>{label}</Caption>
      {sub && <Caption x={x + w / 2} y={y + 25} size={9} color={C.faint}>{sub}</Caption>}
    </g>
  )
  return (
    <svg viewBox="0 0 640 330" className="w-full" role="img" aria-label="8086 寄存器组">
      <Caption x={320} y={24} size={13} color={C.faint}>8086 的 14 个 16 位寄存器</Caption>
      {/* 数据寄存器 */}
      {grp(20, 40, 300, 160, '数据寄存器（可拆成 8 位）', C.teal, C.tealBg)}
      {reg(40, 72, 120, 'AX', '累加器 AH|AL')}
      {reg(180, 72, 120, 'BX', '基址 BH|BL')}
      {reg(40, 112, 120, 'CX', '计数 CH|CL')}
      {reg(180, 112, 120, 'DX', '数据 DH|DL')}
      {reg(40, 152, 260, '乘除法、I/O 等各有默契分工', undefined, C.line)}
      {/* 指针变址 */}
      {grp(340, 40, 280, 160, '指针与变址寄存器', C.blue, C.blueBg)}
      {reg(360, 72, 120, 'SP', '栈顶指针')}
      {reg(490, 72, 110, 'BP', '栈帧基址')}
      {reg(360, 112, 120, 'SI', '源变址')}
      {reg(490, 112, 110, 'DI', '目的变址')}
      {reg(360, 152, 240, '串操作：SI 源、DI 目的', undefined, C.line)}
      {/* 段寄存器 */}
      {grp(20, 216, 300, 100, '段寄存器', C.amber, C.amberBg)}
      {reg(40, 248, 60, 'CS', '代码')}
      {reg(110, 248, 60, 'DS', '数据')}
      {reg(180, 248, 60, 'SS', '堆栈')}
      {reg(250, 248, 60, 'ES', '附加')}
      {/* 控制 */}
      {grp(340, 216, 280, 100, '控制寄存器', C.rose, C.roseBg)}
      {reg(360, 248, 110, 'IP', '指令指针')}
      {reg(480, 248, 120, 'FLAGS', '标志位')}
    </svg>
  )
}

export function DSegment() {
  return (
    <svg viewBox="0 0 640 300" className="w-full" role="img" aria-label="8086 分段地址计算">
      <defs><ArrowDef id="ar-sg" color={C.soft} /></defs>
      <Caption x={320} y={30} size={13} color={C.faint}>段基址 × 16 + 偏移 = 20 位物理地址</Caption>
      {/* 段寄存器 */}
      <Caption x={120} y={70} size={12} color={C.amber}>段寄存器（16 位）</Caption>
      <rect x={60} y={82} width={120} height={40} rx={6} fill={C.amberBg} stroke={C.amber} strokeWidth={1.5} />
      <Caption x={120} y={107} size={13} color={C.amber}>2000H</Caption>
      <Caption x={120} y={140} size={11} color={C.soft}>左移 4 位（×10H）</Caption>
      <line x1={120} y1={122} x2={120} y2={150} stroke={C.amber} strokeWidth={1.5} markerEnd="url(#ar-sg)" />
      {/* 偏移 */}
      <Caption x={120} y={182} size={12} color={C.teal}>偏移地址（16 位）</Caption>
      <rect x={60} y={194} width={120} height={40} rx={6} fill={C.tealBg} stroke={C.teal} strokeWidth={1.5} />
      <Caption x={120} y={219} size={13} color={C.teal}>0100H</Caption>
      {/* 加法器 */}
      <circle cx={300} cy={160} r={26} fill="#fff" stroke={C.ink} strokeWidth={1.5} />
      <Caption x={300} y={166} size={18}>+</Caption>
      <line x1={182} y1={170} x2={272} y2={160} stroke={C.amber} strokeWidth={1.6} markerEnd="url(#ar-sg)" />
      <line x1={182} y1={214} x2={274} y2={170} stroke={C.teal} strokeWidth={1.6} markerEnd="url(#ar-sg)" />
      <line x1={328} y1={160} x2={380} y2={160} stroke={C.ink} strokeWidth={1.8} markerEnd="url(#ar-sg)" />
      {/* 物理地址 */}
      <rect x={390} y={134} width={190} height={52} rx={8} fill={C.roseBg} stroke={C.rose} strokeWidth={1.6} />
      <Caption x={485} y={156} size={12} color={C.rose}>物理地址（20 位）</Caption>
      <Caption x={485} y={176} size={15} color={C.rose}>20100H</Caption>
      <Caption x={320} y={280} size={11} color={C.faint}>2000H × 10H + 0100H = 20000H + 0100H = 20100H</Caption>
    </svg>
  )
}
