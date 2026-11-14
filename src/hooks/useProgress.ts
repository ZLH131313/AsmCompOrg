import { useCallback, useEffect, useState } from 'react'

// 学习进度持久化：仅存本浏览器 localStorage，清缓存即丢。
export interface Progress {
  doneSections: string[]      // 已学完的小节 id
  knownCards: string[]        // 闪卡「认识了」：`${chapterId}:${cardIndex}`
  quizBest: Record<string, number> // 每章测验最好成绩（答对数）
}

const KEY = 'asmcomporg-progress-v1'
const EMPTY: Progress = { doneSections: [], knownCards: [], quizBest: {} }

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const p = JSON.parse(raw)
    return {
      doneSections: Array.isArray(p.doneSections) ? p.doneSections : [],
      knownCards: Array.isArray(p.knownCards) ? p.knownCards : [],
      quizBest: p.quizBest && typeof p.quizBest === 'object' ? p.quizBest : {},
    }
  } catch {
    return EMPTY
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress))
    } catch {
      /* 存储失败不影响使用 */
    }
  }, [progress])

  const toggleSection = useCallback((id: string) => {
    setProgress((p) => ({
      ...p,
      doneSections: p.doneSections.includes(id)
        ? p.doneSections.filter((s) => s !== id)
        : [...p.doneSections, id],
    }))
  }, [])

  const markCard = useCallback((key: string, known: boolean) => {
    setProgress((p) => ({
      ...p,
      knownCards: known ? [...new Set([...p.knownCards, key])] : p.knownCards.filter((k) => k !== key),
    }))
  }, [])

  const recordQuiz = useCallback((chapterId: string, score: number) => {
    setProgress((p) => ({
      ...p,
      quizBest: { ...p.quizBest, [chapterId]: Math.max(p.quizBest[chapterId] ?? 0, score) },
    }))
  }, [])

  const resetAll = useCallback(() => setProgress(EMPTY), [])

  return { progress, toggleSection, markCard, recordQuiz, resetAll }
}
