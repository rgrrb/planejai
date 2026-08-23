import type { PropsWithChildren } from 'react'

import type { InsightData } from '@/services/aiService'

interface ContentProps {
  insight: InsightData
}

function Paragraph({ children }: PropsWithChildren) {
  return (
    <p className="text-muted-foreground text-sm leading-relaxed">{children}</p>
  )
}

function SectionTitle({ children }: PropsWithChildren) {
  return (
    <h3 className="text-foreground mt-5 mb-1.5 text-sm leading-relaxed font-semibold">
      {children}
    </h3>
  )
}

function OrderedList({ items }: { items: string[] }) {
  return (
    <ol className="text-muted-foreground ml-6 list-decimal text-sm leading-relaxed">
      {items.map((item, index) => (
        <li key={index} className="pl-1">
          {item}
        </li>
      ))}
    </ol>
  )
}

const statusStyles = {
  viable: {
    label: 'Meta viável no prazo',
    className:
      'bg-purple-100 text-purple-900 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border dark:border-emerald-800/40',
  },
  needs_adjustment: {
    label: 'Ajuste necessário',
    className:
      'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-400 dark:border dark:border-amber-800/40',
  },
  unfeasible: {
    label: 'Meta inviável no prazo',
    className:
      'bg-rose-100 text-rose-900 dark:bg-rose-950/50 dark:text-rose-400 dark:border dark:border-rose-800/40',
  },
}

export function Content({ insight }: ContentProps) {
  const status = statusStyles[insight.feasibility.status] ?? null

  return (
    <div className="space-y-4">
      <section className="flex flex-col gap-2">
        <div className="flex flex-col items-start gap-2 sm:flex-row">
          <span className="text-foreground text-sm font-semibold">
            🎯 Viabilidade da Meta
          </span>
          {status && (
            <span
              className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
            >
              {status.label}
            </span>
          )}
        </div>
        <Paragraph>{insight.feasibility.content}</Paragraph>
      </section>

      <section>
        <SectionTitle>💰 Diagnóstico Financeiro</SectionTitle>
        <Paragraph>{insight.diagnosis.content}</Paragraph>
      </section>

      <section>
        <SectionTitle>📋 Sugestões Práticas</SectionTitle>
        <OrderedList items={insight.suggestions.items} />
      </section>

      <section>
        <SectionTitle>💡 Como Aumentar sua Renda</SectionTitle>
        <OrderedList items={insight.extraIncome.items} />
      </section>

      <section>
        <SectionTitle>🏦 Sugestões de Investimento</SectionTitle>
        <OrderedList items={insight.investment.items} />
      </section>

      <section>
        <SectionTitle>🚀 Mensagem Final</SectionTitle>
        <Paragraph>{insight.motivation.content}</Paragraph>
      </section>
    </div>
  )
}
