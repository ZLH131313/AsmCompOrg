import { useState } from 'react'
import type { QuizItem } from '@/data/types'
import { Rich } from './Blocks'

export function Quiz({ items, onFinish }: { items: QuizItem[]; onFinish?: (score: number) => void }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => items.map(() => null))
  const answeredAll = picked.every((p) => p !== null)
  const score = items.reduce((n, it, i) => n + (picked[i] === it.answer ? 1 : 0), 0)

  const choose = (qi: number, oi: number) => {
    if (picked[qi] !== null) return // 每题一次机会，即时反馈
    const next = [...picked]
    next[qi] = oi
    setPicked(next)
    if (next.every((p) => p !== null) && onFinish) {
      onFinish(items.reduce((n, it, i) => n + (next[i] === it.answer ? 1 : 0), 0))
    }
  }

  const retry = () => setPicked(items.map(() => null))

  return (
    <div className="space-y-8">
      {items.map((it, qi) => {
        const sel = picked[qi]
        return (
          <div key={qi} className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-5">
            <p className="mb-3 font-medium text-[var(--ink)]">
              <span className="mr-2 text-[var(--accent)]">{qi + 1}.</span>
              <Rich text={it.q} />
            </p>
            <div className="grid gap-2">
              {it.options.map((op, oi) => {
                let cls = 'border-[var(--line)] bg-[var(--card)] hover:border-[var(--ink-faint)]'
                if (sel !== null) {
                  if (oi === it.answer) cls = 'border-[var(--green-line)] bg-[var(--green-bg)]'
                  else if (oi === sel) cls = 'border-[var(--red-line)] bg-[var(--red-bg)]'
                  else cls = 'border-[var(--line)] bg-[var(--card)] opacity-60'
                }
                return (
                  <button
                    key={oi}
                    onClick={() => choose(qi, oi)}
                    disabled={sel !== null}
                    className={`flex items-start gap-3 rounded-lg border px-4 py-2.5 text-left text-[0.95rem] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${cls}`}
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-xs">
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <span className="text-[var(--ink-soft)]"><Rich text={op} /></span>
                  </button>
                )
              })}
            </div>
            {sel !== null && (
              <p className="mt-3 rounded-lg bg-[var(--paper-deep)] px-4 py-2.5 text-sm leading-relaxed text-[var(--ink-soft)]">
                <span className={sel === it.answer ? 'text-[var(--green-ink)]' : 'text-[var(--red-ink)]'}>
                  {sel === it.answer ? '答对了 · ' : '答错了 · '}
                </span>
                <Rich text={it.explain} />
              </p>
            )}
          </div>
        )
      })}
      {answeredAll && (
        <div className="flex items-center justify-between rounded-xl border border-[var(--amber-line)] bg-[var(--amber-bg)] px-5 py-4">
          <p className="font-serif-cjk text-lg text-[var(--ink)]">
            本次得分：{score} / {items.length}
            {score === items.length ? '，满分！' : score >= items.length * 0.6 ? '，不错，错题再看一眼。' : '，回到正文把错题对应的小节再读一遍。'}
          </p>
          <button
            onClick={retry}
            className="rounded-lg border border-[var(--ink)] px-4 py-1.5 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            再做一遍
          </button>
        </div>
      )}
    </div>
  )
}
