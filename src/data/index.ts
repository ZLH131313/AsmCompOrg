import type { Chapter } from './types'
import { ch1 } from './chapters/ch1'
import { ch2 } from './chapters/ch2'
import { ch3 } from './chapters/ch3'
import { ch4 } from './chapters/ch4'
import { ch5 } from './chapters/ch5'
import { ch6 } from './chapters/ch6'
import { ch7 } from './chapters/ch7'
import { ch8 } from './chapters/ch8'
import { ch9 } from './chapters/ch9'

export const chapters: Chapter[] = [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9]

export const chapterById = (id: string) => chapters.find((c) => c.id === id)

export const totalSections = chapters.reduce((n, c) => n + c.sections.length, 0)
export const totalCards = chapters.reduce((n, c) => n + c.cards.length, 0)
export const totalQuiz = chapters.reduce((n, c) => n + c.quiz.length, 0)
