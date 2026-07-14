export type Status = 'saudavel' | 'atencao' | 'critico'

export interface Projeto {
  id: string
  codigoRm: string
  nome: string
  cliente: { id: string; nome: string }
  horas: { vendidas: number; planejadas: number; realizadas: number; saldo: number }
  percentualAvanco: number
  percentualFinanceiro: number
  status: Status
  motivosCriticidade: string[]
  ultimaSincronizacaoRm: string | null
}
