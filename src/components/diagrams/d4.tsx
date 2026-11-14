// 第 8–9 章图解：栈与 CALL/RET、三种 I/O 方式、中断处理流程
import { C, ArrowDef, Box, Caption } from './common'

export function DStack() {
  const cells = [
    { label: '…（未使用）', c: C.faint, bg: '#faf8f2' },
    { label: '参数 2', c: C.teal, bg: C.tealBg },
    { label: '参数 1', c: C.teal, bg: C.tealBg },
    { label: '返回地址', c: C.rose, bg: C.roseBg },
    { label: '保存的 BP', c: C.amber, bg: C.amberBg },
    { label: '局部变量', c: C.blue, bg: C.blueBg },
  ]
  return (
    <svg viewBox="0 0 640 360" className="w-full" role="img" aria-label="函数调用时的栈帧结构">
      <defs><ArrowDef id="ar-st" color={C.soft} /></defs>
      <Caption x={320} y={26} size={13} color={C.faint}>一次 CALL 之后的栈（向低地址生长）</Caption>
      <Caption x={70} y={50} size={11} color={C.soft}>高地址 ↑</Caption>
      {cells.map((cell, i) => (
        <g key={i}>
          <rect x={140} y={40 + i * 46} width={220} height={40} rx={6} fill={cell.bg} stroke={cell.c} strokeWidth={1.3} />
          <Caption x={250} y={65 + i * 46} size={12.5} color={cell.c}>{cell.label}</Caption>
        </g>
      ))}
      <Caption x={70} y={330} size={11} color={C.soft}>低地址 ↓（栈顶方向）</Caption>
      {/* SP / BP 指针 */}
      <line x1={400} y1={270} x2={364} y2={270} stroke={C.blue} strokeWidth={1.8} markerEnd="url(#ar-st)" />
      <Caption x={440} y={274} size={12} color={C.blue}>SP →</Caption>
      <line x1={400} y1={224} x2={364} y2={224} stroke={C.amber} strokeWidth={1.8} markerEnd="url(#ar-st)" />
      <Caption x={440} y={228} size={12} color={C.amber}>BP →</Caption>
      {/* 注释 */}
      <Caption x={490} y={100} size={11} color={C.teal}>调用者压入</Caption>
      <Caption x={490} y={180} size={11} color={C.rose}>CALL 自动压入</Caption>
      <Caption x={490} y={300} size={11} color={C.soft}>RET 弹出返回地址</Caption>
    </svg>
  )
}

export function DIoMethods() {
  const row = (y: number, title: string, color: string, segs: { w: number; busy: boolean }[]) => {
    let x = 150
    return (
      <g key={title}>
        <Caption x={120} y={y + 22} size={12.5} color={color}>{title}</Caption>
        {segs.map((s, i) => {
          const el = (
            <rect key={i} x={x} y={y} width={s.w} height={30} rx={4}
              fill={s.busy ? color : 'transparent'} stroke={color} strokeWidth={1.2}
              opacity={s.busy ? 0.85 : 0.35} strokeDasharray={s.busy ? undefined : '4 3'} />
          )
          x += s.w + 6
          return el
        })}
      </g>
    )
  }
  return (
    <svg viewBox="0 0 640 330" className="w-full" role="img" aria-label="三种 I/O 控制方式 CPU 占用对比">
      <Caption x={320} y={26} size={13} color={C.faint}>CPU 时间线：实心 = CPU 被 I/O 占用，虚线 = CPU 可干别的</Caption>
      {row(60, '程序查询', C.rose, [{ w: 90, busy: true }, { w: 90, busy: true }, { w: 90, busy: true }, { w: 90, busy: true }])}
      <Caption x={150} y={112} size={10.5} color={C.rose}>反复读状态端口，全程空等 ×</Caption>
      {row(140, '中断驱动', C.amber, [{ w: 40, busy: true }, { w: 130, busy: false }, { w: 40, busy: true }, { w: 130, busy: false }])}
      <Caption x={150} y={192} size={10.5} color={C.amber}>外设就绪才打断，期间并行工作 ✓</Caption>
      {row(220, 'DMA', C.teal, [{ w: 30, busy: true }, { w: 200, busy: false }, { w: 30, busy: true }])}
      <Caption x={150} y={272} size={10.5} color={C.teal}>整块搬运由 DMA 控制器代劳，CPU 只管首尾 ✓✓</Caption>
      <Caption x={320} y={312} size={11} color={C.faint}>时间越长 →，I/O 过程本身耗时相同，差别全在 CPU 是否被拖累</Caption>
    </svg>
  )
}

export function DInterrupt() {
  const step = (y: number, label: string, color: string, bg: string, w = 200) => (
    <Box x={60} y={y} w={w} h={38} fill={bg} stroke={color} label={label} labelSize={12.5} />
  )
  return (
    <svg viewBox="0 0 640 380" className="w-full" role="img" aria-label="中断处理流程">
      <defs><ArrowDef id="ar-it" color={C.soft} /></defs>
      <Caption x={320} y={24} size={13} color={C.faint}>中断处理 = 硬件自动发起的一次 CALL</Caption>
      {step(46, '主程序执行中', C.ink, '#faf8f2')}
      <line x1={160} y1={84} x2={160} y2={104} stroke={C.soft} strokeWidth={1.5} markerEnd="url(#ar-it)" />
      {step(104, '外设发中断请求', C.rose, C.roseBg)}
      <line x1={160} y1={142} x2={160} y2={162} stroke={C.soft} strokeWidth={1.5} markerEnd="url(#ar-it)" />
      {step(162, '响应：关中断', C.amber, C.amberBg)}
      <line x1={160} y1={200} x2={160} y2={220} stroke={C.soft} strokeWidth={1.5} markerEnd="url(#ar-it)" />
      {step(220, '保护断点（硬件）', C.amber, C.amberBg)}
      <Caption x={280} y={243} size={11} color={C.amber}>FLAGS / CS / IP 压栈</Caption>
      <line x1={160} y1={258} x2={160} y2={278} stroke={C.soft} strokeWidth={1.5} markerEnd="url(#ar-it)" />
      {step(278, '查向量表 → 转 ISR', C.teal, C.tealBg)}

      {/* ISR 框 */}
      <rect x={360} y={104} width={220} height={212} rx={10} fill={C.tealBg} stroke={C.teal} strokeWidth={1.5} opacity={0.6} />
      <Caption x={470} y={128} size={12.5} color={C.teal}>中断服务程序 ISR</Caption>
      <Box x={380} y={142} w={180} h={34} fill="#fff" stroke={C.teal} label="① 保护现场 PUSH" labelSize={11.5} />
      <Box x={380} y={186} w={180} h={34} fill="#fff" stroke={C.teal} label="② 处理中断事件" labelSize={11.5} />
      <Box x={380} y={230} w={180} h={34} fill="#fff" stroke={C.teal} label="③ 恢复现场 POP" labelSize={11.5} />
      <Box x={380} y={274} w={180} h={34} fill="#fff" stroke={C.rose} label="④ IRET 返回" labelSize={11.5} />
      <line x1={262} y1={297} x2={376} y2={200} stroke={C.teal} strokeWidth={1.5} markerEnd="url(#ar-it)" />

      {/* 返回 */}
      <line x1={380} y1={291} x2={210} y2={340} stroke={C.rose} strokeWidth={1.5} strokeDasharray="6 4" markerEnd="url(#ar-it)" />
      <Caption x={320} y={362} size={12} color={C.rose}>IRET：弹出 IP / CS / FLAGS，回到断点继续执行</Caption>
    </svg>
  )
}
