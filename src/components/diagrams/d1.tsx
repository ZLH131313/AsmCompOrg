// 第 1–3 章图解：冯·诺依曼结构、补码钟面、IEEE 754、ALU
import { C, ArrowDef, Box, Caption } from './common'

export function DVonNeumann() {
  return (
    <svg viewBox="0 0 640 400" className="w-full" role="img" aria-label="冯·诺依曼体系结构图">
      <defs>
        <ArrowDef id="ar-vn" color={C.soft} />
        <ArrowDef id="ar-vn2" color={C.purple} />
      </defs>
      <Caption x={320} y={24} size={13} color={C.faint}>冯·诺依曼体系结构：以存储器为中心</Caption>

      {/* 存储器居中 */}
      <Box x={240} y={150} w={160} h={90} fill={C.amberBg} stroke={C.amber} label="存储器" sub="程序 + 数据（按地址存取）" />

      {/* CPU */}
      <rect x={230} y={300} width={180} height={80} rx={10} fill={C.tealBg} stroke={C.teal} strokeWidth={1.6} />
      <Caption x={320} y={320} size={12} color={C.teal}>CPU</Caption>
      <Box x={242} y={330} w={76} h={38} fill="#ffffff" stroke={C.teal} label="运算器" labelSize={12} />
      <Box x={322} y={330} w={76} h={38} fill="#ffffff" stroke={C.teal} label="控制器" labelSize={12} />

      {/* 输入/输出 */}
      <Box x={40} y={165} w={120} h={60} fill={C.blueBg} stroke={C.blue} label="输入设备" sub="键盘 · 鼠标" labelSize={13} />
      <Box x={480} y={165} w={120} h={60} fill={C.roseBg} stroke={C.rose} label="输出设备" sub="显示器 · 磁盘" labelSize={13} />

      {/* 数据流 */}
      <line x1={160} y1={195} x2={234} y2={195} stroke={C.soft} strokeWidth={1.6} markerEnd="url(#ar-vn)" />
      <line x1={406} y1={195} x2={474} y2={195} stroke={C.soft} strokeWidth={1.6} markerEnd="url(#ar-vn)" />
      <line x1={320} y1={240} x2={320} y2={294} stroke={C.soft} strokeWidth={1.6} markerEnd="url(#ar-vn)" />
      <line x1={350} y1={294} x2={350} y2={246} stroke={C.soft} strokeWidth={1.6} markerEnd="url(#ar-vn)" />
      <Caption x={200} y={186}>数据</Caption>
      <Caption x={440} y={186}>数据</Caption>
      <Caption x={345} y={270}>指令 / 数据</Caption>

      {/* 控制流 */}
      <path d="M 240 345 C 120 345, 100 300, 100 230" fill="none" stroke={C.purple} strokeWidth={1.4} strokeDasharray="5 4" markerEnd="url(#ar-vn2)" />
      <path d="M 400 345 C 520 345, 545 300, 545 230" fill="none" stroke={C.purple} strokeWidth={1.4} strokeDasharray="5 4" markerEnd="url(#ar-vn2)" />
      <Caption x={130} y={315} color={C.purple}>控制信号</Caption>
      <Caption x={510} y={315} color={C.purple}>控制信号</Caption>
      <Caption x={320} y={396} color={C.faint} size={11}>实线 = 数据流，虚线 = 控制流</Caption>
    </svg>
  )
}

export function DComplement() {
  // 模 256 钟面：+243 与 −13 等价
  const cx = 320, cy = 200, r = 130
  const pt = (deg: number) => {
    const a = ((deg - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  }
  const deg13 = (13 / 256) * 360
  const deg243 = (243 / 256) * 360
  const p0 = pt(0), p13 = pt(deg13), p243 = pt(deg243)
  return (
    <svg viewBox="0 0 640 400" className="w-full" role="img" aria-label="补码的模运算钟面">
      <defs>
        <ArrowDef id="ar-cp1" color={C.rose} />
        <ArrowDef id="ar-cp2" color={C.teal} />
      </defs>
      <Caption x={320} y={24} size={13} color={C.faint}>8 位寄存器 = 模 256 的钟面</Caption>
      <circle cx={cx} cy={cy} r={r} fill={C.paper} stroke={C.line} strokeWidth={1.5} />
      {Array.from({ length: 32 }).map((_, i) => {
        const a = ((i * 11.25 - 90) * Math.PI) / 180
        const x1 = cx + (r - 7) * Math.cos(a), y1 = cy + (r - 7) * Math.sin(a)
        const x2 = cx + r * Math.cos(a), y2 = cy + r * Math.sin(a)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.line} strokeWidth={1} />
      })}
      {/* 0 点 */}
      <circle cx={p0.x} cy={p0.y} r={5} fill={C.ink} />
      <Caption x={p0.x + 10} y={p0.y - 12} color={C.ink} size={13}>0（= 256）</Caption>
      {/* +13 */}
      <circle cx={p13.x} cy={p13.y} r={6} fill={C.teal} />
      <Caption x={p13.x + 36} y={p13.y + 14} color={C.teal} size={13}>+13</Caption>
      {/* 243 = −13 */}
      <circle cx={p243.x} cy={p243.y} r={6} fill={C.rose} />
      <Caption x={p243.x - 30} y={p243.y + 16} color={C.rose} size={13}>243 ⇔ −13</Caption>
      {/* 弧：从 0 逆时针到 243 */}
      <path
        d={`M ${p0.x} ${p0.y} A ${r} ${r} 0 0 0 ${p243.x} ${p243.y}`}
        fill="none" stroke={C.rose} strokeWidth={2} strokeDasharray="6 4" markerEnd="url(#ar-cp1)"
      />
      <path
        d={`M ${p0.x} ${p0.y} A ${r} ${r} 0 0 1 ${p13.x} ${p13.y}`}
        fill="none" stroke={C.teal} strokeWidth={2} markerEnd="url(#ar-cp2)"
      />
      <Caption x={cx} y={cy - 16} size={14} color={C.ink}>加 243 ≡ 加 (−13)</Caption>
      <Caption x={cx} y={cy + 6} size={12} color={C.soft}>因为 243 + 13 = 256 ≡ 0</Caption>
      <Caption x={cx} y={cy + 26} size={12} color={C.rose}>−13 的补码 = 1111 0011 = 243</Caption>
      <Caption x={320} y={390} color={C.faint} size={11}>减法变加法：x − 13 = x + 243（mod 256）</Caption>
    </svg>
  )
}

export function DFloat754() {
  const y = 150, h = 56, x0 = 80
  const wS = 40, wE = 120, wM = 360
  return (
    <svg viewBox="0 0 640 330" className="w-full" role="img" aria-label="IEEE 754 单精度浮点数格式">
      <Caption x={320} y={36} size={13} color={C.faint}>IEEE 754 单精度（32 位）</Caption>
      {/* 位号 */}
      <Caption x={x0 + wS / 2} y={y - 14} size={11}>31</Caption>
      <Caption x={x0 + wS + wE / 2} y={y - 14} size={11}>30 ~ 23</Caption>
      <Caption x={x0 + wS + wE + wM / 2} y={y - 14} size={11}>22 ~ 0</Caption>
      {/* 三段 */}
      <rect x={x0} y={y} width={wS} height={h} rx={6} fill={C.roseBg} stroke={C.rose} strokeWidth={1.5} />
      <rect x={x0 + wS + 8} y={y} width={wE} height={h} rx={6} fill={C.amberBg} stroke={C.amber} strokeWidth={1.5} />
      <rect x={x0 + wS + wE + 16} y={y} width={wM} height={h} rx={6} fill={C.tealBg} stroke={C.teal} strokeWidth={1.5} />
      <Caption x={x0 + wS / 2} y={y + 34} size={16} color={C.rose}>S</Caption>
      <Caption x={x0 + wS + 8 + wE / 2} y={y + 34} size={16} color={C.amber}>阶码 E（8 位）</Caption>
      <Caption x={x0 + wS + wE + 16 + wM / 2} y={y + 34} size={16} color={C.teal}>尾数 M（23 位，小数部分）</Caption>
      {/* 说明 */}
      <Caption x={320} y={250} size={13} color={C.ink}>x = (−1)ˢ × 1.M × 2^(E − 127)</Caption>
      <Caption x={320} y={276} size={12} color={C.soft}>符号位决定正负 · 阶码（移码，偏置 127）决定范围 · 尾数（隐含整数 1）决定精度</Caption>
      <Caption x={320} y={300} size={11} color={C.faint}>双精度：1 + 11 + 52 位，偏置 1023</Caption>
    </svg>
  )
}

export function DAlu() {
  return (
    <svg viewBox="0 0 640 330" className="w-full" role="img" aria-label="ALU 与标志寄存器">
      <defs>
        <ArrowDef id="ar-alu" color={C.soft} />
      </defs>
      <Caption x={320} y={28} size={13} color={C.faint}>ALU：算结果，也算「性格」</Caption>
      {/* 输入 */}
      <Box x={90} y={80} w={110} h={44} fill={C.blueBg} stroke={C.blue} label="操作数 A" labelSize={13} />
      <Box x={90} y={160} w={110} h={44} fill={C.blueBg} stroke={C.blue} label="操作数 B" labelSize={13} />
      {/* ALU 梯形 */}
      <path d="M 260 60 L 420 60 L 390 140 L 420 220 L 260 220 L 290 140 Z" fill={C.tealBg} stroke={C.teal} strokeWidth={1.6} />
      <Caption x={346} y={145} size={16} color={C.teal}>ALU</Caption>
      <line x1={200} y1={102} x2={254} y2={102} stroke={C.soft} strokeWidth={1.6} markerEnd="url(#ar-alu)" />
      <line x1={200} y1={182} x2={254} y2={182} stroke={C.soft} strokeWidth={1.6} markerEnd="url(#ar-alu)" />
      {/* 结果 */}
      <Box x={470} y={115} w={120} h={50} fill={C.amberBg} stroke={C.amber} label="运算结果" labelSize={13} />
      <line x1={422} y1={140} x2={464} y2={140} stroke={C.soft} strokeWidth={1.6} markerEnd="url(#ar-alu)" />
      {/* 标志寄存器 */}
      <rect x={60} y={260} width={520} height={46} rx={8} fill="#ffffff" stroke={C.line} strokeWidth={1.4} />
      <Caption x={120} y={289} size={13} color={C.ink}>FLAGS</Caption>
      {[
        { x: 170, t: 'ZF 零', c: C.teal },
        { x: 270, t: 'SF 符号', c: C.blue },
        { x: 370, t: 'CF 进位', c: C.amber },
        { x: 470, t: 'OF 溢出', c: C.rose },
      ].map((f) => (
        <g key={f.t}>
          <rect x={f.x} y={269} width={86} height={28} rx={6} fill="#ffffff" stroke={f.c} strokeWidth={1.4} />
          <Caption x={f.x + 43} y={288} size={12} color={f.c}>{f.t}</Caption>
        </g>
      ))}
      <path d="M 346 220 L 346 248" stroke={C.soft} strokeWidth={1.6} markerEnd="url(#ar-alu)" />
      <Caption x={398} y={242} size={11}>同时写标志位</Caption>
    </svg>
  )
}
