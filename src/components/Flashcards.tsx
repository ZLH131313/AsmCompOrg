import { useMemo, useState } from 'react'
import type { Card } from '@/data/types'
import { Rich } from './Blocks'

export interface DeckCard extends Card {
  key: string       // `${chapterId}:${index}`
  from: string      // 章节名
}

export function Flashcards({
  deck,
  knownKeys,
  onMark,
  title,
}: {
  deck: DeckCard[]
  knownKeys: string[]
  onMark: (key: string, known: boolean) => void
  title: string
}) {
  const [order, setOrder] = useState(() => deck.map((_, i) => i))
  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const knownSet = useMemo(() => new Set(knownKeys), [knownKeys])
  const card = deck[order[pos]]
  const knownCount = deck.filter((c) => knownSet.has(c.key)).length

  const go = (next: number) => {
    if (flipped) {
      setFlipped(false)
      setTimeout(() => setPos(next), 180)
    } else {
      setPos(next)
    }
  }

  const mark = (known: boolean) => {
    onMark(card.key, known)
    if (pos < order.length - 1) go(pos + 1)
  }

  const shuffle = () => {
    const idx = deck.map((_, i) => i)
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[idx[i], idx[j]] = [idx[j], idx[i]]
    }
    setOrder(idx)
    setPos(0)
    setFlipped(false)
  }

  if (!card) return null
  const isKnown = knownSet.has(card.key)

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif-cjk text-2xl text-[var(--ink)]">{title}</h2>
          <p className="text-sm text-[var(--ink-faint)]">
            第 {pos + 1} / {deck.length} 张 · 已认识 {knownCount} 张
          </p>
        </div>
        <button
          onClick={shuffle}
          className="rounded-lg border border-[var(--line)] bg-[var(--card)] px-4 py-1.5 text-sm text-[var(--ink-soft)] transition-colors hover:border-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          随机打乱
        </button>
      </div>

      {/* 进度条 */}
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-[var(--paper-deep)]">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${((pos + 1) / deck.length) * 100}%` }}
        />
      </div>

      {/* 卡片 */}
      <div className="flip-scene mx-auto max-w-xl">
        <button
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? '查看问题' : '查看答案'}
          className={`flip-card relative block h-64 w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] ${flipped ? 'flipped' : ''}`}
        >
          <div className="flip-face absolute inset-0 flex flex-col rounded-2xl border border-[var(--line)] bg-[var(--card)] p-8 shadow-sm">
            <span className="mb-3 text-xs tracking-widest text-[var(--ink-faint)]">问题 · {card.from} · 点击翻面</span>
            <p className="font-serif-cjk text-xl leading-relaxed text-[var(--ink)]">
              <Rich text={card.front} />
            </p>
            {isKnown && <span className="mt-auto text-xs text-[var(--green-ink)]">✓ 已标记为认识</span>}
          </div>
          <div className="flip-face flip-back absolute inset-0 flex flex-col rounded-2xl border border-[var(--amber-line)] bg-[var(--amber-bg)] p-8 shadow-sm">
            <span className="mb-3 text-xs tracking-widest text-[var(--amber-ink)]">答案 · 点击返回</span>
            <p className="leading-relaxed text-[var(--ink)]">
              <Rich text={card.back} />
            </p>
          </div>
        </button>
      </div>

      {/* 操作 */}
      <div className="mx-auto mt-6 flex max-w-xl items-center justify-between gap-3">
        <button
          onClick={() => pos > 0 && go(pos - 1)}
          disabled={pos === 0}
          className="rounded-lg border border-[var(--line)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--ink-soft)] transition-colors hover:border-[var(--ink)] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          ← 上一张
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => mark(false)}
            className="rounded-lg border border-[var(--red-line)] bg-[var(--red-bg)] px-5 py-2 text-sm text-[var(--red-ink)] transition-colors hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            还不熟
          </button>
          <button
            onClick={() => mark(true)}
            className="rounded-lg border border-[var(--green-line)] bg-[var(--green-bg)] px-5 py-2 text-sm text-[var(--green-ink)] transition-colors hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            认识了 ✓
          </button>
        </div>
        <button
          onClick={() => pos < order.length - 1 && go(pos + 1)}
          disabled={pos === order.length - 1}
          className="rounded-lg border border-[var(--line)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--ink-soft)] transition-colors hover:border-[var(--ink)] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          下一张 →
        </button>
      </div>
    </div>
  )
}
