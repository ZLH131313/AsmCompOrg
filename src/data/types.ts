// 课程内容数据模型：所有章节内容以结构化数据驱动，渲染层只负责展示。

export type Block =
  | { type: 'p'; text: string }                 // 段落，支持 **加粗** 与 `行内代码`
  | { type: 'h3'; text: string }                // 节内小标题
  | { type: 'key'; text: string }               // 一句话记住它（金句卡）
  | { type: 'pitfall'; text: string }           // 易错点
  | { type: 'note'; text: string }              // 补充说明
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'table'; caption?: string; head: string[]; rows: string[][] }
  | { type: 'code'; title?: string; code: string }
  | { type: 'diagram'; id: string }             // 引用 diagrams 注册表里的 SVG 图解

export interface Section {
  id: string
  title: string
  blocks: Block[]
}

export interface QuizItem {
  q: string
  options: string[]
  answer: number        // 正确选项下标
  explain: string
}

export interface Card {
  front: string         // 闪卡正面（提问）
  back: string          // 背面（答案）
}

export interface Chapter {
  id: string            // 'ch1'
  no: string            // '第 1 章'
  title: string
  subtitle: string      // 本章导览一句话
  sections: Section[]
  quiz: QuizItem[]
  cards: Card[]
}
