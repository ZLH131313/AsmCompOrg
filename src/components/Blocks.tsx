import type { Block } from '@/data/types'
import { Diagram } from './diagrams'

/** 行内轻量排版：**加粗** 与 `行内代码` */
export function Rich({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  let rest = text, key = 0
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/
  while (rest) {
    const m = rest.match(re)
    if (!m || m.index === undefined) {
      parts.push(rest)
      break
    }
    if (m.index > 0) parts.push(rest.slice(0, m.index))
    const tok = m[0]
    if (tok.startsWith('**')) {
      parts.push(<strong key={key++} className="font-medium text-[var(--ink)]">{tok.slice(2, -2)}</strong>)
    } else {
      parts.push(<code key={key++} className="inline-code">{tok.slice(1, -1)}</code>)
    }
    rest = rest.slice(m.index + tok.length)
  }
  return <>{parts}</>
}

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return <p className="my-4 text-[var(--ink-soft)]"><Rich text={block.text} /></p>
    case 'h3':
      return (
        <h3 className="font-serif-cjk mt-8 mb-3 text-lg font-medium text-[var(--ink)]">
          {block.text}
        </h3>
      )
    case 'key':
      return (
        <aside className="my-6 rounded-lg border border-[var(--amber-line)] bg-[var(--amber-bg)] px-5 py-4">
          <div className="mb-1 text-xs tracking-wide text-[var(--amber-ink)]">一句话记住它</div>
          <p className="font-serif-cjk text-[1.05rem] leading-relaxed text-[var(--ink)]">
            <Rich text={block.text} />
          </p>
        </aside>
      )
    case 'pitfall':
      return (
        <aside className="my-6 rounded-lg border border-[var(--red-line)] bg-[var(--red-bg)] px-5 py-4">
          <div className="mb-1 text-xs tracking-wide text-[var(--red-ink)]">易错点</div>
          <p className="leading-relaxed text-[var(--ink-soft)]"><Rich text={block.text} /></p>
        </aside>
      )
    case 'note':
      return (
        <aside className="my-5 rounded-lg border border-[var(--line)] bg-[var(--paper-deep)] px-5 py-3.5">
          <p className="text-sm leading-relaxed text-[var(--ink-soft)]"><Rich text={block.text} /></p>
        </aside>
      )
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul'
      return (
        <Tag className={`my-4 space-y-2 pl-5 text-[var(--ink-soft)] ${block.ordered ? 'list-decimal' : 'list-disc'}`}>
          {block.items.map((it, i) => (
            <li key={i} className="leading-relaxed marker:text-[var(--accent)]">
              <Rich text={it} />
            </li>
          ))}
        </Tag>
      )
    }
    case 'table':
      return (
        <figure className="my-6 overflow-x-auto">
          {block.caption && (
            <figcaption className="mb-2 text-sm text-[var(--ink-faint)]">{block.caption}</figcaption>
          )}
          <table className="w-full border-collapse text-[0.95rem]">
            <thead>
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} className="border-b-2 border-[var(--ink)] px-3 py-2 text-left font-medium text-[var(--ink)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--paper-deep)]">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2.5 align-top text-[var(--ink-soft)]">
                      <Rich text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      )
    case 'code':
      return (
        <figure className="my-6 overflow-hidden rounded-lg border border-[var(--code-line)] bg-[var(--code-bg)]">
          {block.title && (
            <figcaption className="border-b border-[var(--code-line)] px-4 py-2 text-xs text-[var(--code-caption)]">
              {block.title}
            </figcaption>
          )}
          <pre className="overflow-x-auto p-4 text-[0.85rem] leading-relaxed text-[var(--code-ink)]">
            <code className="font-mono-code">{block.code}</code>
          </pre>
        </figure>
      )
    case 'diagram':
      return <Diagram id={block.id} />
  }
}
