import { useEffect, useMemo, useRef, useState } from 'react'
import { chapters } from '@/data'
import type { Block } from '@/data/types'

interface Hit {
  chapterId: string
  chapterTitle: string
  sectionId: string
  sectionTitle: string
  snippet: string
}

function blockText(b: Block): string {
  switch (b.type) {
    case 'p': case 'h3': case 'key': case 'pitfall': case 'note':
      return b.text
    case 'list':
      return b.items.join(' ')
    case 'table':
      return [b.caption ?? '', ...b.head, ...b.rows.flat()].join(' ')
    case 'code':
      return `${b.title ?? ''} ${b.code}`
    case 'diagram':
      return ''
  }
}

function strip(s: string) {
  return s.replace(/\*\*/g, '').replace(/`/g, '')
}

export function SearchModal({ open, onClose, onJump }: {
  open: boolean
  onClose: () => void
  onJump: (chapterId: string, sectionId: string) => void
}) {
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQ('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const hits = useMemo<Hit[]>(() => {
    const kw = q.trim()
    if (!kw) return []
    const out: Hit[] = []
    for (const ch of chapters) {
      for (const sec of ch.sections) {
        const corpus = [sec.title, ...sec.blocks.map(blockText)].join('\n')
        const idx = strip(corpus).indexOf(kw)
        if (idx >= 0) {
          const text = strip(corpus)
          out.push({
            chapterId: ch.id,
            chapterTitle: `${ch.no} ${ch.title}`,
            sectionId: sec.id,
            sectionTitle: sec.title,
            snippet: text.slice(Math.max(0, idx - 24), idx + kw.length + 40),
          })
        }
      }
    }
    return out.slice(0, 12)
  }, [q])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/25 px-4 pt-[12vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="搜索课程内容"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索概念、指令、公式……（Esc 关闭）"
          className="w-full border-b border-[var(--line)] bg-transparent px-5 py-4 text-base text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
        />
        <div className="max-h-[50vh] overflow-y-auto">
          {q.trim() && hits.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-[var(--ink-faint)]">没有找到「{q.trim()}」，换个关键词试试</p>
          )}
          {!q.trim() && (
            <p className="px-5 py-8 text-center text-sm text-[var(--ink-faint)]">试试：补码、Cache、寻址、流水线、中断……</p>
          )}
          {hits.map((h) => (
            <button
              key={h.sectionId}
              onClick={() => onJump(h.chapterId, h.sectionId)}
              className="block w-full border-b border-[var(--line)] px-5 py-3 text-left transition-colors last:border-0 hover:bg-[var(--paper-deep)] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[var(--accent)]"
            >
              <span className="mb-0.5 block text-xs text-[var(--accent)]">{h.chapterTitle} · {h.sectionTitle}</span>
              <span className="block text-sm leading-relaxed text-[var(--ink-soft)]">…{h.snippet}…</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
