import type { Chapter } from '../types'

export const ch7: Chapter = {
  id: 'ch7',
  no: '第 7 章',
  title: '汇编语言基础',
  subtitle: '机器指令穿上助记符的外衣，就站在了硬件的门槛上。',
  sections: [
    {
      id: 'ch7-s1',
      title: '汇编语言与上机过程',
      blocks: [
        { type: 'p', text: '**汇编语言**用助记符代替机器指令的操作码、用符号代替地址，与机器指令**一一对应**。它依然面向机器：换一种 CPU，就要换一套汇编语言。这也正是它比高级语言「难」的原因——你必须像 CPU 一样思考。' },
        { type: 'p', text: '一段汇编源码变成可执行程序要走四步：**编辑**（.asm）→ **汇编**（MASM/NASM 翻成目标文件 .obj）→ **链接**（LINK 拼成可执行文件 .exe）→ **调试/运行**（DEBUG/GDB）。注意「汇编程序（Assembler）」是把汇编语言翻译成机器码的**工具**，与「汇编语言」一词分清。' },
        { type: 'p', text: '源程序中的语句分两类：**指令性语句**（有对应的机器指令，真正被 CPU 执行）和**指示性语句/伪指令**（只告诉汇编器如何工作，如定义数据 DB/DW、段定义 SEGMENT，不产生机器代码）。' },
        { type: 'key', text: '指令性语句给 CPU 执行，伪指令给汇编器看——一个产生机器码，一个不产生。' },
        { type: 'pitfall', text: '伪指令不是「假的指令」，它在汇编期起作用（分配空间、定义符号），运行时并不存在。' },
      ],
    },
    {
      id: 'ch7-s2',
      title: '8086 寄存器与存储器分段',
      blocks: [
        { type: 'p', text: '8086 有 14 个 16 位寄存器，分工明确：' },
        { type: 'diagram', id: 'registers' },
        { type: 'list', items: [
          '**数据寄存器**：AX（累加器）、BX（基址）、CX（计数）、DX（数据），每个都可拆成两个 8 位（AH/AL 等）。',
          '**指针与变址**：SP（栈顶指针）、BP（基址指针，访问栈帧）、SI（源变址）、DI（目的变址）。',
          '**段寄存器**：CS（代码段）、DS（数据段）、SS（堆栈段）、ES（附加段）。',
          '**控制**：IP（指令指针，相当于 PC）与 FLAGS（标志寄存器）。',
        ] },
        { type: 'p', text: '8086 寄存器只有 16 位，地址总线却有 20 位（1 MB），矛盾由**分段**解决：' },
        { type: 'diagram', id: 'segment' },
        { type: 'code', title: '物理地址计算（必考）', code: '物理地址 = 段基址 × 16 + 偏移地址\n         = (段寄存器) × 10H + 有效地址\n\n例：DS = 2000H，偏移 = 0100H\n物理地址 = 2000H × 10H + 0100H = 20100H' },
        { type: 'key', text: '16 位寄存器 × 段寄存器左移 4 位 = 20 位物理地址——「段乘 16 加偏移」。' },
        { type: 'pitfall', text: '同一个物理地址可以对应多个「段:偏移」组合（如 2000:0100 与 2010:0000 都指向 20100H）；两个 16 位数拼不出 20 位地址，必须左移 4 位再相加。' },
      ],
    },
    {
      id: 'ch7-s3',
      title: '常用指令与标志位',
      blocks: [
        { type: 'p', text: '汇编学习 80% 的精力应放在最常用的几十条指令上。按功能分五组：' },
        { type: 'table', caption: '常用指令速览', head: ['类别', '指令', '说明'], rows: [
          ['数据传送', 'MOV, XCHG, PUSH, POP, LEA', 'MOV 不允许两个操作数同为内存；LEA 取有效地址'],
          ['算术运算', 'ADD, SUB, INC, DEC, MUL, CMP, NEG', 'CMP 只改标志位不写结果'],
          ['逻辑运算', 'AND, OR, XOR, NOT, TEST', 'XOR AX,AX 是清零惯用法；TEST 同 CMP 不写回'],
          ['移位', 'SHL, SHR, SAL, SAR, ROL, ROR', '左移一位 ≈ 乘 2，右移一位 ≈ 除 2'],
          ['转移控制', 'JMP, JE/JNE, JG/JL, JA/JB, LOOP, CALL, RET', '条件跳转读标志位；CALL/RET 配对'],
        ] },
        { type: 'p', text: '**条件跳转与标志位的对应关系**是汇编的命脉：CMP A, B 做 A−B 后，**无符号数比较**用 JA/JAE/JB/JBE（Above/Below，看 CF 与 ZF）；**有符号数比较**用 JG/JGE/JL/JLE（Greater/Less，看 SF、OF 与 ZF）。两组字母不要混用。' },
        { type: 'code', title: '惯用法三则', code: 'XOR AX, AX      ; AX 清零（比 MOV AX,0 更快更省字节）\nSHL AX, 1       ; AX × 2\nCMP CX, 0       ; 与 JE 搭配：CX 为 0 则跳\nJE  done' },
        { type: 'key', text: '无符号比较用 Above/Below，有符号比较用 Greater/Less——记反了，程序逻辑就全错。' },
        { type: 'pitfall', text: 'MOV 的两个操作数不能同时是存储器操作数，也不能给段寄存器直接送立即数（要经通用寄存器中转）；PUSH/POP 操作的是 16 位字。' },
      ],
    },
  ],
  quiz: [
    {
      q: '8086 中，物理地址的计算方式是？',
      options: ['段基址 + 偏移地址', '段基址 × 16 + 偏移地址', '段基址 × 8 + 偏移地址', '段基址 × 16 × 偏移地址'],
      answer: 1,
      explain: '段寄存器左移 4 位（×16）再与 16 位偏移相加，得到 20 位物理地址。',
    },
    {
      q: '下列哪个寄存器专门用作循环计数？',
      options: ['AX', 'BX', 'CX', 'DX'],
      answer: 2,
      explain: 'CX 是计数寄存器，LOOP 指令自动对 CX 减一并判断是否为 0。',
    },
    {
      q: '比较有符号数大小时，应使用哪组条件跳转？',
      options: ['JA / JB', 'JG / JL', 'JC / JNC', 'JZ / JNZ'],
      answer: 1,
      explain: '有符号数用 Greater/Less（JG/JL 系列），依据 SF、OF、ZF；Above/Below 用于无符号数。',
    },
    {
      q: '「XOR AX, AX」的执行效果是？',
      options: ['AX 不变', 'AX 清零', 'AX 取反', '语法错误'],
      answer: 1,
      explain: '任何数与自身异或结果为 0，是汇编中最常用的清零惯用法。',
    },
    {
      q: '伪指令 DB 20 DUP(0) 的作用是？',
      options: ['让 CPU 执行 20 次清零', '汇编时预留 20 个字节并初值化为 0', '定义 20 个寄存器', '循环 20 次'],
      answer: 1,
      explain: 'DB 是伪指令，汇编期分配存储空间，不产生机器指令。',
    },
  ],
  cards: [
    { front: '8086 的 4 个数据寄存器及各自的惯用角色？', back: 'AX 累加器（运算主力）、BX 基址（存地址）、CX 计数（LOOP）、DX 数据（乘除法扩展、I/O 端口）。' },
    { front: '写出 8086 物理地址计算公式，并解释为什么这样设计。', back: '物理地址 = 段基址 × 16 + 偏移。16 位寄存器无法直接表示 20 位地址，分段后左移 4 位补足。' },
    { front: '指令性语句与伪指令的区别？', back: '指令性语句翻译成机器码、由 CPU 执行；伪指令只在汇编期指导汇编器（定义数据、段），不产生机器码。' },
    { front: '无符号与有符号条件跳转分别用哪组助记符？', back: '无符号：JA/JAE/JB/JBE（Above/Below，看 CF）；有符号：JG/JGE/JL/JLE（Greater/Less，看 SF、OF）。' },
    { front: '汇编程序从源码到运行经过哪四步？', back: '编辑（.asm）→ 汇编（.obj）→ 链接（.exe）→ 调试运行。' },
  ],
}
