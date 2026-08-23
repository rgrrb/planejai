import { useState } from 'react'

import { SimulationCard } from '@/components/features/Simulation/SimulationCard'
import { PageHero } from '@/components/shared/PageHero'
import type { SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

export function SimulationActivity() {
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()

  const [simulations, setSimulations] = useState<SimulationRecord[]>(() =>
    getAllSimulations().reverse(),
  )

  const handleDelete = (id: string) => {
    deleteSimulation(id)
    setSimulations((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de Simulações"
        subtitle="Acompanhe suas análises guardadas e retome os planejamentos a qualquer momento."
      />

      {simulations.length === 0 ? (
        <div className="border-border bg-card/50 mt-10 rounded-2xl border border-dashed p-8 text-center">
          <p className="text-muted-foreground text-sm">
            Nenhuma simulação registrada no histórico.
          </p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {simulations.map((item) => (
            <SimulationCard
              key={item.id}
              simulation={item}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </main>
  )
}
