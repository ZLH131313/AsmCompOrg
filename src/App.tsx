import { useCallback, useEffect, useMemo, useState } from 'react'
import { chapters, chapterById, totalSections, totalCards } from '@/data'
import { useProgress } from '@/hooks/useProgress'
import { BlockView } from '@/components/Blocks'
import { Quiz } from '@/components/Quiz'
import { Flashcards, type DeckCard } from '@/components/Flashcards'
import { SearchModal } from '@/components/SearchModal'

type View = { kind: 'home' } | { kind: 'chapter'; id: string } | { kind: 'cards'; id: string }

function viewFromHash(): View {
  const h = window.location.hash.replace(/^#\/?/, '')
  const [kind, id] = h.split('/')
  if (kind === 'chapter' && id && chapterById(id)) return { kind: 'chapter', id }
  if (kind === 'cards' && (id === 'all' || chapterById(id))) return { kind: 'cards', id }
  return { kind: 'home' }
}

function hashFromView(v: View): string {
  if (v.kind === 'home') return '#/'
  return `#/${v.kind}/${v.id}`
}

export default function App() {
  const [view, setView] = useState<View>(viewFromHash)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('asmcomporg-theme')
      if (saved) return saved === 'dark'
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
    } catch {
      return false
    }
  })
  const { progress, toggleSection, markCard, recordQuiz } = useProgress()

  // 应用主题到 <html> 并持久化
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem('asmcomporg-theme', dark ? 'dark' : 'light')
    } catch {
      /* 存储失败不影响切换 */
    }
  }, [dark])

  // 浏览器前进/后退 → 视图
  useEffect(() => {
    const onHash = () => {
      setView(viewFromHash())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = useCallback((v: View, sectionId?: string) => {
    setView(v)
    setMenuOpen(false)
    setSearchOpen(false)
    if (window.location.hash !== hashFromView(v)) {
      window.location.hash = hashFromView(v)
    }
    requestAnimationFrame(() => {
      if (sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0 })
      }
    })
  }, [])

  // Ctrl/⌘ + K 打开搜索
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const doneSet = useMemo(() => new Set(progress.doneSections), [progress.doneSections])

  return (
    <div className="min-h-dvh">
      {/* 顶栏 */}
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button
            className="rounded-md p-1.5 hover:bg-[var(--paper-deep)] md:hidden"
            aria-label="打开目录"
            onClick={() => setMenuOpen(true)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <button onClick={() => go({ kind: 'home' })} className="font-serif-cjk min-w-0 truncate text-lg font-medium text-[var(--ink)]">
            汇编与计组自习室
          </button>
          <span className="hidden shrink-0 text-xs text-[var(--ink-faint)] sm:inline">汇编语言 × 计算机系统组成</span>
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="搜索概念"
            className="ml-auto flex shrink-0 items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-1.5 text-sm text-[var(--ink-faint)] transition-colors hover:border-[var(--ink-faint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" />
            </svg>
            <span className="hidden sm:inline">搜索概念</span>
            <kbd className="hidden rounded border border-[var(--line)] px-1 text-[10px] sm:inline">Ctrl K</kbd>
          </button>
          <button
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? '切换到日间模式' : '切换到夜间模式'}
            title={dark ? '日间模式' : '夜间模式'}
            className="flex shrink-0 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--card)] p-2 text-[var(--ink-soft)] transition-colors hover:border-[var(--ink-faint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
                <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
                <line x1="4.9" y1="4.9" x2="7" y2="7" /><line x1="17" y1="17" x2="19.1" y2="19.1" />
                <line x1="4.9" y1="19.1" x2="7" y2="17" /><line x1="17" y1="7" x2="19.1" y2="4.9" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-10 px-4">
        {/* 桌面侧栏 */}
        <aside className="sticky top-[57px] hidden h-[calc(100dvh-57px)] w-64 shrink-0 overflow-y-auto py-8 pr-2 md:block">
          <Nav view={view} doneSet={doneSet} onGo={go} />
        </aside>

        {/* 移动端抽屉 */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="课程目录">
            <div className="absolute inset-0 bg-black/25" onClick={() => setMenuOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-[var(--paper)] p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-serif-cjk text-lg">课程目录</span>
                <button onClick={() => setMenuOpen(false)} aria-label="关闭目录" className="rounded-md p-1.5 hover:bg-[var(--paper-deep)]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <Nav view={view} doneSet={doneSet} onGo={go} />
            </div>
          </div>
        )}

        {/* 主内容 */}
        <main className="min-w-0 flex-1 py-10 pb-24">
          {view.kind === 'home' && (
            <Home doneSet={doneSet} quizBest={progress.quizBest} knownCards={progress.knownCards} onGo={go} />
          )}
          {view.kind === 'chapter' && (
            <ChapterView
              id={view.id}
              doneSet={doneSet}
              quizBest={progress.quizBest[view.id]}
              onToggleSection={toggleSection}
              onQuizFinish={(score) => recordQuiz(view.id, score)}
              onGo={go}
            />
          )}
          {view.kind === 'cards' && (
            <CardsView id={view.id} knownCards={progress.knownCards} onMark={markCard} />
          )}
        </main>
      </div>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onJump={(cid, sid) => go({ kind: 'chapter', id: cid }, sid)}
      />
    </div>
  )
}

/* ---------- 侧栏导航 ---------- */
function Nav({ view, doneSet, onGo }: {
  view: View
  doneSet: Set<string>
  onGo: (v: View, sectionId?: string) => void
}) {
  return (
    <nav className="space-y-5 text-sm">
      <button
        onClick={() => onGo({ kind: 'home' })}
        className={`block w-full rounded-md px-2 py-1 text-left transition-colors hover:bg-[var(--paper-deep)] ${view.kind === 'home' ? 'font-medium text-[var(--accent)]' : 'text-[var(--ink-soft)]'}`}
      >
        首页 · 学习路线
      </button>
      {chapters.map((ch) => {
        const done = ch.sections.filter((s) => doneSet.has(s.id)).length
        const active = view.kind === 'chapter' && view.id === ch.id
        return (
          <div key={ch.id}>
            <button
              onClick={() => onGo({ kind: 'chapter', id: ch.id })}
              className={`flex w-full items-baseline justify-between rounded-md px-2 py-1 text-left transition-colors hover:bg-[var(--paper-deep)] ${active ? 'font-medium text-[var(--accent)]' : 'text-[var(--ink)]'}`}
            >
              <span>{ch.no} {ch.title}</span>
              <span className="ml-2 shrink-0 text-xs text-[var(--ink-faint)]">{done}/{ch.sections.length}</span>
            </button>
            {active && (
              <div className="mt-1 space-y-0.5 border-l border-[var(--line)] pl-3">
                {ch.sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onGo({ kind: 'chapter', id: ch.id }, s.id)}
                    className="flex w-full items-center gap-1.5 rounded px-2 py-0.5 text-left text-[0.83rem] text-[var(--ink-soft)] transition-colors hover:bg-[var(--paper-deep)]"
                  >
                    <span className={doneSet.has(s.id) ? 'text-[var(--green-ink)]' : 'text-[var(--ink-faint)]'}>
                      {doneSet.has(s.id) ? '✓' : '○'}
                    </span>
                    {s.title}
                  </button>
                ))}
                <button
                  onClick={() => onGo({ kind: 'cards', id: ch.id })}
                  className="block w-full rounded px-2 py-0.5 text-left text-[0.83rem] text-[var(--accent)] transition-colors hover:bg-[var(--paper-deep)]"
                >
                  ▣ 本章闪卡
                </button>
              </div>
            )}
          </div>
        )
      })}
      <button
        onClick={() => onGo({ kind: 'cards', id: 'all' })}
        className={`block w-full rounded-md px-2 py-1 text-left transition-colors hover:bg-[var(--paper-deep)] ${view.kind === 'cards' && view.id === 'all' ? 'font-medium text-[var(--accent)]' : 'text-[var(--ink-soft)]'}`}
      >
        ▣ 全部闪卡复习
      </button>
    </nav>
  )
}

/* ---------- 首页 ---------- */
function Home({ doneSet, quizBest, knownCards, onGo }: {
  doneSet: Set<string>
  quizBest: Record<string, number>
  knownCards: string[]
  onGo: (v: View) => void
}) {
  const doneCount = doneSet.size
  const pct = Math.round((doneCount / totalSections) * 100)
  return (
    <div>
      <p className="mb-2 text-sm tracking-widest text-[var(--accent)]">无痛复习 · 概念驱动</p>
      <h1 className="font-serif-cjk mb-4 text-4xl leading-snug text-[var(--ink)]">
        把《汇编语言与<br />计算机系统组成》读薄
      </h1>
      <p className="mb-8 max-w-[62ch] text-[var(--ink-soft)]">
        九章内容、{totalSections} 个小节、{totalCards} 张闪卡。每节配彩色图解、「一句话记住它」和易错点提醒；
        每章末尾有自测，随时可以用闪卡把整门课再过一遍。
      </p>

      {/* 总进度 */}
      <div className="mb-10 rounded-xl border border-[var(--line)] bg-[var(--card)] p-5">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm text-[var(--ink-soft)]">学习总进度</span>
          <span className="font-serif-cjk text-2xl text-[var(--ink)]">{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--paper-deep)]">
          <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs text-[var(--ink-faint)]">
          已学完 {doneCount} / {totalSections} 个小节 · 进度只保存在本浏览器
        </p>
      </div>

      {/* 章节卡片 */}
      <div className="grid gap-4 sm:grid-cols-2">
        {chapters.map((ch) => {
          const done = ch.sections.filter((s) => doneSet.has(s.id)).length
          const best = quizBest[ch.id]
          const known = ch.cards.filter((_, i) => knownCards.includes(`${ch.id}:${i}`)).length
          return (
            <div key={ch.id} className="group rounded-xl border border-[var(--line)] bg-[var(--card)] p-5 transition-shadow hover:shadow-md">
              <p className="mb-1 text-xs text-[var(--accent)]">{ch.no}</p>
              <h2 className="font-serif-cjk mb-1 text-xl text-[var(--ink)]">{ch.title}</h2>
              <p className="mb-4 text-sm leading-relaxed text-[var(--ink-faint)]">{ch.subtitle}</p>
              <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--ink-soft)]">
                <span>小节 {done}/{ch.sections.length}</span>
                <span>闪卡 {known}/{ch.cards.length}</span>
                <span>自测最好 {best === undefined ? '—' : `${best}/${ch.quiz.length}`}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onGo({ kind: 'chapter', id: ch.id })}
                  className="rounded-lg bg-[var(--ink)] px-4 py-1.5 text-sm text-[var(--paper)] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {done === 0 ? '开始学习' : done === ch.sections.length ? '温习' : '继续'}
                </button>
                <button
                  onClick={() => onGo({ kind: 'cards', id: ch.id })}
                  className="rounded-lg border border-[var(--line)] px-4 py-1.5 text-sm text-[var(--ink-soft)] transition-colors hover:border-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  闪卡复习
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- 章节页 ---------- */
function ChapterView({ id, doneSet, quizBest, onToggleSection, onQuizFinish, onGo }: {
  id: string
  doneSet: Set<string>
  quizBest?: number
  onToggleSection: (id: string) => void
  onQuizFinish: (score: number) => void
  onGo: (v: View) => void
}) {
  const ch = chapterById(id)
  if (!ch) return null
  const idx = chapters.findIndex((c) => c.id === id)
  const prev = chapters[idx - 1]
  const next = chapters[idx + 1]

  return (
    <article className="max-w-[72ch]">
      <p className="mb-1 text-sm tracking-widest text-[var(--accent)]">{ch.no}</p>
      <h1 className="font-serif-cjk mb-2 text-3xl text-[var(--ink)]">{ch.title}</h1>
      <p className="mb-10 text-[var(--ink-faint)]">{ch.subtitle}</p>

      {ch.sections.map((sec, si) => {
        const done = doneSet.has(sec.id)
        return (
          <section key={sec.id} id={sec.id} className="mb-12 scroll-mt-20">
            <div className="mb-1 flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-2">
              <h2 className="font-serif-cjk text-xl text-[var(--ink)]">
                <span className="mr-2 text-sm text-[var(--ink-faint)]">{idx + 1}.{si + 1}</span>
                {sec.title}
              </h2>
              <button
                onClick={() => onToggleSection(sec.id)}
                aria-pressed={done}
                className={`shrink-0 rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${done
                  ? 'border-[var(--green-line)] bg-[var(--green-bg)] text-[var(--green-ink)]'
                  : 'border-[var(--line)] text-[var(--ink-faint)] hover:border-[var(--ink-faint)]'}`}
              >
                {done ? '✓ 已学完' : '标记学完'}
              </button>
            </div>
            {sec.blocks.map((b, bi) => <BlockView key={bi} block={b} />)}
          </section>
        )
      })}

      {/* 自测 */}
      <section className="mb-12 scroll-mt-20">
        <div className="mb-4 flex items-baseline justify-between border-b border-[var(--line)] pb-2">
          <h2 className="font-serif-cjk text-xl text-[var(--ink)]">本章自测</h2>
          {quizBest !== undefined && (
            <span className="text-xs text-[var(--ink-faint)]">历史最好：{quizBest}/{ch.quiz.length}</span>
          )}
        </div>
        <Quiz items={ch.quiz} onFinish={onQuizFinish} />
      </section>

      {/* 章末导航 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-6">
        {prev ? (
          <button onClick={() => onGo({ kind: 'chapter', id: prev.id })} className="text-sm text-[var(--ink-soft)] underline-offset-4 hover:underline">
            ← {prev.no} {prev.title}
          </button>
        ) : <span />}
        <button
          onClick={() => onGo({ kind: 'cards', id: ch.id })}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          ▣ 用闪卡过一遍本章
        </button>
        {next ? (
          <button onClick={() => onGo({ kind: 'chapter', id: next.id })} className="text-sm text-[var(--ink-soft)] underline-offset-4 hover:underline">
            {next.no} {next.title} →
          </button>
        ) : <span />}
      </div>
    </article>
  )
}

/* ---------- 闪卡页 ---------- */
function CardsView({ id, knownCards, onMark }: {
  id: string
  knownCards: string[]
  onMark: (key: string, known: boolean) => void
}) {
  const deck = useMemo<DeckCard[]>(() => {
    const src = id === 'all' ? chapters : chapters.filter((c) => c.id === id)
    return src.flatMap((ch) =>
      ch.cards.map((c, i) => ({ ...c, key: `${ch.id}:${i}`, from: `${ch.no} ${ch.title}` }))
    )
  }, [id])
  const title = id === 'all' ? '全部闪卡' : `${chapterById(id)?.no ?? ''} ${chapterById(id)?.title ?? ''} · 闪卡`
  return <Flashcards deck={deck} knownKeys={knownCards} onMark={onMark} title={title} />
}
