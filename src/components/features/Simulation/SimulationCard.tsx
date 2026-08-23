import { ExternalLink, Goal, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import type { SimulationRecord } from '@/data/simulation'
import { calcMonthlySavings } from '@/utils/simulation'

interface SimulationCardProps {
  simulation: SimulationRecord
  onDelete: (id: string) => void
}

export function SimulationCard({ simulation, onDelete }: SimulationCardProps) {
  const navigate = useNavigate()
  const monthlySavings = calcMonthlySavings(simulation)

  const formattedDate = simulation.createdAt
    ? new Date(simulation.createdAt).toLocaleDateString('pt-BR')
    : '11/03/2026'

  return (
    <div className="bg-card border-border flex flex-col justify-between gap-6 rounded-3xl border p-6 shadow-sm transition-all hover:shadow-md h-auto w-full sm:flex-row sm:items-center sm:gap-4 sm:rounded-2xl sm:px-6 sm:py-5">
      {/* Header: Nome da Meta e Ícone */}
      <div className="flex items-center gap-4 sm:min-w-[200px]">
        <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
          <Goal className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-foreground text-base font-bold leading-snug">
            {simulation.goalName || 'Sem nome'}
          </h3>
          <span className="text-muted-foreground text-xs font-medium">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Bloco de Métricas (Vertical no Mobile / Horizontal Grid no Desktop) */}
      <div className="flex flex-col gap-4 text-left sm:grid sm:flex-1 sm:grid-cols-3 sm:px-4">
        {/* Custo da Meta */}
        <div>
          <span className="text-muted-foreground block text-[11px] font-semibold uppercase tracking-wider">
            CUSTO DA META
          </span>
          <span className="text-foreground text-base font-bold sm:text-sm">
            R$ {simulation.goalAmount.toLocaleString('pt-BR', {
              minimumFractionDigits: 0,
            })}
          </span>
        </div>

        {/* Prazo */}
        <div>
          <span className="text-muted-foreground block text-[11px] font-semibold uppercase tracking-wider">
            PRAZO
          </span>
          <span className="text-foreground text-base font-bold sm:text-sm">
            {simulation.goalDeadline} meses
          </span>
        </div>

        {/* Economia Mensal */}
        <div>
          <span className="text-muted-foreground block text-[11px] font-semibold uppercase tracking-wider">
            ECONOMIA MENSAL
          </span>
          <span className="text-foreground text-base font-bold sm:text-sm">
            R$ {monthlySavings.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      {/* Ações (Separador horizontal no Mobile / Borda lateral no Desktop) */}
      <div className="border-border flex items-center justify-between border-t pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0 sm:justify-end sm:gap-3">
        <button
          type="button"
          onClick={() => onDelete(simulation.id)}
          className="text-red-500 hover:bg-red-500/10 rounded-xl p-2 transition-colors"
          title="Excluir simulação"
        >
          <Trash2 className="h-5 w-5" />
        </button>

        <div className="bg-border h-4 w-[1px] sm:hidden" />

        <button
          type="button"
          onClick={() => navigate(`/resultado/${simulation.id}`)}
          className="text-foreground hover:text-primary flex items-center gap-2 text-xs font-semibold transition-colors sm:border-border sm:bg-muted/50 sm:hover:bg-muted/80 sm:rounded-xl sm:border sm:px-4 sm:py-2"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Ver detalhes</span>
        </button>
      </div>
    </div>
  )
}