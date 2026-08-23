import 'react-loading-skeleton/dist/skeleton.css'

import { Send, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'

import type { SimulationRecord } from '@/data/simulation'
import { useInsight } from '@/hooks/useInsight'
import { type ChatMessage, sendChatMessage } from '@/services/aiService'

import { Content } from '../Insights/Content'
import { Error } from '../Insights/Error'

interface AIInsightCardProps {
  simulationId: string
  simulation?: SimulationRecord | null
}

export function AIInsightsCard({
  simulationId,
  simulation,
}: AIInsightCardProps) {
  const { insight, isLoading, error, fetchInsight } = useInsight(simulationId)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)

  const chatEndRef = useRef<HTMLDivElement | null>(null)
  const CHAT_STORAGE_KEY = `chat_messages_${simulationId}`

  // Sincroniza o histórico de mensagens do localStorage sempre que mudar o ID da simulação
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY)
      setMessages(saved ? JSON.parse(saved) : [])
    } catch {
      setMessages([])
    }
  }, [simulationId, CHAT_STORAGE_KEY])

  // Função centralizada para atualizar o estado e o localStorage simultaneamente
  const updateAndSaveMessages = (newMessages: ChatMessage[]) => {
    setMessages(newMessages)
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newMessages))
    } catch (e) {
      console.error('Erro ao salvar mensagens do chat no localStorage:', e)
    }
  }

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isSending])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSending || !simulation) return

    const userText = input.trim()
    setInput('')

    const updatedHistory: ChatMessage[] = [
      ...messages,
      { role: 'user', text: userText },
    ]

    // Salva a mensagem do usuário imediatamente na tela e no storage
    updateAndSaveMessages(updatedHistory)
    setIsSending(true)

    try {
      // Passa o histórico prévio (messages) para manter o contexto sem duplicar a mensagem atual
      const responseText = await sendChatMessage(
        simulation,
        messages,
        userText,
      )

      const finalHistory: ChatMessage[] = [
        ...updatedHistory,
        { role: 'model', text: responseText },
      ]

      updateAndSaveMessages(finalHistory)
    } catch (err) {
      console.error('Erro na chamada da IA:', err)
      const errorHistory: ChatMessage[] = [
        ...updatedHistory,
        {
          role: 'model',
          text: 'Ocorreu um erro ao processar sua pergunta. Tente novamente.',
        },
      ]
      updateAndSaveMessages(errorHistory)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="bg-card text-card-foreground border-border order-2 flex max-h-[465px] flex-col justify-between rounded-2xl border p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      {/* Cabeçalho Fixo do Card */}
      <div className="border-border mb-3 flex items-center gap-1.5 border-b pb-3">
        <span>✨</span>
        <span className="text-primary text-xs font-semibold uppercase tracking-widest">
          Insight Financeiro Personalizado
        </span>
      </div>

      {/* Container ÚNICO de Scroll para Insights + Conversa do Chat */}
      <div className="flex-1 overflow-y-auto scrollbar-none pr-2 space-y-6">
        {isLoading && (
          <div className="flex">
            <Skeleton
              count={10.5}
              baseColor="var(--color-skeleton-base)"
              highlightColor="var(--color-skeleton-highlight)"
              className="mb-3 flex rounded-lg"
              containerClassName="flex-1"
              inline
            />
          </div>
        )}

        {!isLoading && error && (
          <Error
            simulationId={simulationId}
            message={error}
            onRetry={() => {
              fetchInsight(simulationId)
            }}
          />
        )}

        {!isLoading && insight && !error && (
          <>
            {/* 1. Diagnóstico e Insights Primários */}
            <Content insight={insight} />

            {/* 2. Extensão do Chat com o Mentor na mesma div */}
            {messages.length > 0 && (
              <div className="border-border border-t pt-6 space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className="space-y-1.5 border-b border-border/80 pb-4">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                      {msg.role === 'user' ? (
                        <span className="text-primary text-sm font-semibold">🔮 Você</span>
                      ) : (
                        <span className="text-primary text-sm font-semibold">🤖 Resposta da IA</span>
                      )}
                    </div>
                    {msg.role === 'user' ? (
                      <div className="rounded-xl py-2 text-sm leading-relaxed bg-muted/70 text-foreground font-medium">
                        {msg.text}
                      </div>
                    ) : (
                      <div className="rounded-xl p-3.5 text-sm leading-relaxed bg-primary/10 border-primary/20 border text-foreground">
                        {msg.text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {isSending && (
              <div className="text-muted-foreground flex items-center gap-2 py-2 text-sm">
                <Sparkles className="text-primary h-4 w-4 animate-spin" />
                <span>Analisando sua pergunta...</span>
              </div>
            )}

            {/* Ponto de Referência para Scroll Automático */}
            <div ref={chatEndRef} />
          </>
        )}
      </div>

      {/* Formulário de Envio no Rodapé Fixo do Card */}
      {!isLoading && insight && !error && (
        <form
          onSubmit={handleSendMessage}
          className="border-border mt-4 flex gap-2 border-t pt-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Qual são os investimentos mais seguros que posso usar para minha renda?"
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary/50 flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="bg-primary text-primary-foreground flex items-center justify-center rounded-xl px-4 py-2.5 transition-all hover:opacity-90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  )
}
