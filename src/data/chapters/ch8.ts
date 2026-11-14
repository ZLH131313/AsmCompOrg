import type { Chapter } from '../types'

export const ch8: Chapter = {
  id: 'ch8',
  no: '第 8 章',
  title: '汇编语言程序设计',
  subtitle: '顺序、分支、循环、子程序——结构化思想的底层实现。',
  sections: [
    {
      id: 'ch8-s1',
      title: '分支结构：JMP 与条件跳转',
      blocks: [
        { type: 'p', text: '高级语言的 if-else，在汇编里就是「**比较 + 条件跳转**」两步曲：先用 CMP/TEST 设置标志位，再用 Jcc 按标志位跳走。跳转的目标是**标号**。' },
        { type: 'code', title: 'if (AX > BX) AX = AX − BX，有符号数', code: '        CMP AX, BX      ; 做 AX − BX，只设标志\n        JLE next        ; AX ≤ BX 则跳过（有符号用 JLE）\n        SUB AX, BX\nnext:   …' },
        { type: 'p', text: '写分支最容易犯的错误是**跳转条件写反**：把「满足条件执行」翻译成「不满足条件跳过」时，Jcc 要选条件的**反面**。养成先写注释、再选指令的习惯。' },
        { type: 'key', text: '汇编分支 = CMP 设标志 + Jcc 反向跳过；先想清楚「什么时候不执行」，代码自然对。' },
        { type: 'pitfall', text: 'JMP 是无条件跳转，不影响标志位；而条件跳转本身也不改变标志位——多个 Jcc 可以连续读同一次 CMP 的结果。' },
      ],
    },
    {
      id: 'ch8-s2',
      title: '循环结构：LOOP 与条件循环',
      blocks: [
        { type: 'p', text: '已知次数的循环用 **LOOP**：它自动执行「CX − 1，若 CX ≠ 0 则跳回」，等价于 for 循环的计数器。未知次数的循环用「CMP + Jcc」组合，等价于 while。' },
        { type: 'code', title: '求 1+2+…+100（LOOP 循环）', code: '        XOR AX, AX      ; 累加器清零\n        MOV CX, 100     ; 循环 100 次\nsum:    ADD AX, CX\n        LOOP sum        ; CX-- ≠ 0 则跳回 sum\n; 结果 AX = 5050' },
        { type: 'code', title: '遍历数组求和（变址寻址 + 条件循环）', code: '        XOR AX, AX\n        XOR SI, SI      ; 下标清零\nnext:   CMP SI, 10\n        JAE done        ; 无符号：SI ≥ 10 结束\n        ADD AX, buf[SI]\n        ADD SI, 2       ; 字数组步长为 2\n        JMP next\ndone:   …' },
        { type: 'key', text: 'LOOP = 会自动递减的 CX 计数循环；条件循环 = CMP + Jcc，死循环的救星是出口条件。' },
        { type: 'pitfall', text: 'LOOP 的分减与判断先于循环体结束动作吗？记住顺序：LOOP 先 CX←CX−1 再判断，若进入循环前 CX=0，会错误地循环 65536 次——这是经典陷阱。' },
      ],
    },
    {
      id: 'ch8-s3',
      title: '子程序与栈',
      blocks: [
        { type: 'p', text: '**栈**是向下（低地址）生长的后进先出结构，SP 始终指向栈顶。PUSH 先减 SP 再存数，POP 先取数再加 SP。' },
        { type: 'p', text: '**CALL** 做两件事：把返回地址（下一条指令地址）PUSH 进栈，然后跳到子程序；**RET** 把返回地址 POP 回 IP。一进一出，严丝合缝。' },
        { type: 'diagram', id: 'stack' },
        { type: 'p', text: '子程序设计的三个规矩：' },
        { type: 'list', ordered: true, items: [
          '**现场保护**：子程序开头 PUSH 要用到的寄存器，返回前按**相反顺序** POP 恢复（先进后出）。',
          '**参数传递**：约定用寄存器传参，或把参数压栈（高级语言函数调用的底层原型）。',
          '**用 BP 访问栈中参数**：BP 指向栈帧基准，[BP+4]、[BP+6] 依次是参数（返回地址占 [BP+2]）。',
        ] },
        { type: 'code', title: '子程序现场保护的标准写法', code: 'myproc  PROC\n        PUSH AX         ; 保护现场\n        PUSH CX\n        …               ; 子程序体\n        POP  CX         ; 逆序恢复\n        POP  AX\n        RET\nmyproc  ENDP' },
        { type: 'key', text: 'CALL 压返回地址、RET 弹返回地址；谁用寄存器谁保护，PUSH 与 POP 逆序配对。' },
        { type: 'pitfall', text: 'PUSH/POP 顺序写反、子程序里忘了 RET、递归时没保存寄存器，是汇编程序三大「段错误」之源。递归必须依赖栈保存每一层的现场与返回地址。' },
      ],
    },
  ],
  quiz: [
    {
      q: '「CMP AX, BX」后想实现「AX > BX 时跳转」（有符号数），应使用？',
      options: ['JA', 'JG', 'JAE', 'JGE'],
      answer: 1,
      explain: '有符号数严格大于用 JG（Greater）；JA 用于无符号数，JGE 含等于。',
    },
    {
      q: 'LOOP 指令执行的操作是？',
      options: ['CX + 1 后判断', 'CX − 1，结果不为 0 则跳转', '比较 CX 与 0', '无条件跳转'],
      answer: 1,
      explain: 'LOOP 先对 CX 减 1，再判断 CX ≠ 0 是否成立，成立则跳回标号。',
    },
    {
      q: 'CALL 指令执行时，CPU 首先？',
      options: ['跳转到子程序', '把返回地址压入栈', '保护所有寄存器', '修改标志位'],
      answer: 1,
      explain: 'CALL = PUSH 下一条指令地址 + JMP 到子程序；RET = POP IP。',
    },
    {
      q: '子程序开头依次 PUSH AX、PUSH BX，返回前应如何恢复现场？',
      options: ['POP AX、POP BX', 'POP BX、POP AX', '任意顺序', '不用恢复'],
      answer: 1,
      explain: '栈是后进先出，恢复顺序必须与保护顺序相反。',
    },
    {
      q: '进入 LOOP 循环前 CX 恰好为 0，循环体会执行多少次？',
      options: ['0 次', '1 次', '65536 次', '出错'],
      answer: 2,
      explain: 'LOOP 先减后判：0 − 1 = FFFFH ≠ 0，于是继续循环直到 CX 绕回 0，共 65536 次。',
    },
  ],
  cards: [
    { front: '汇编如何实现 if-else？', back: 'CMP/TEST 设置标志位 + 条件跳转 Jcc 跳到标号。关键：Jcc 选的是「跳过分支」的反面条件。' },
    { front: 'LOOP 指令等价于什么？有什么陷阱？', back: '等价于 CX−− 后若 CX≠0 跳回。陷阱：进入前 CX=0 会循环 65536 次（先减后判）。' },
    { front: 'CALL 和 RET 各自做什么？', back: 'CALL：把返回地址压栈，再跳转到子程序入口。RET：从栈中弹出返回地址到 IP，回到调用点。' },
    { front: '子程序现场保护的原则？', back: '谁使用谁保护：入口 PUSH 将用到的寄存器，出口按相反顺序 POP 恢复。' },
    { front: '为什么栈能支持递归调用？', back: '每次 CALL 都在栈上保存一份返回地址和现场，各层互不干扰，RET 时逐层弹回。' },
  ],
}
