import { LIMIARES } from '../config/thresholds'

export type Status = 'saudavel' | 'atencao' | 'critico'
export type MotivoCriticidade = 'estouro_horas' | 'fisico_atras_financeiro'

export interface EntradaMetricas {
  horasVendidas: number
  horasRealizadas: number
  valorContrato: number
  valorFaturado: number
}

export interface Metricas {
  saldo: number
  percentualAvanco: number
  percentualFinanceiro: number
  status: Status
  motivosCriticidade: MotivoCriticidade[]
}

export function calcularSaldo(horasVendidas: number, horasRealizadas: number): number {
  return horasVendidas - horasRealizadas
}

function percentual(parte: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((parte / total) * 100)
}

export function calcularPercentualAvanco(horasVendidas: number, horasRealizadas: number): number {
  return percentual(horasRealizadas, horasVendidas)
}

export function calcularPercentualFinanceiro(valorContrato: number, valorFaturado: number): number {
  return percentual(valorFaturado, valorContrato)
}

const SEVERIDADE: Record<Status, number> = { saudavel: 0, atencao: 1, critico: 2 }

export function classificarStatus(
  percentualAvanco: number,
  percentualFinanceiro: number,
): { status: Status; motivosCriticidade: MotivoCriticidade[] } {
  // Sinal A — consumo de horas
  let sinalA: Status = 'saudavel'
  if (percentualAvanco > LIMIARES.consumoCritico) sinalA = 'critico'
  else if (percentualAvanco > LIMIARES.consumoAtencao) sinalA = 'atencao'

  // Sinal B — físico vs financeiro (financeiro adiantado em relação ao físico)
  const gap = percentualFinanceiro - percentualAvanco
  let sinalB: Status = 'saudavel'
  if (gap >= LIMIARES.gapCritico) sinalB = 'critico'
  else if (gap >= LIMIARES.gapAtencao) sinalB = 'atencao'

  // worst-wins
  const status = SEVERIDADE[sinalA] >= SEVERIDADE[sinalB] ? sinalA : sinalB

  const motivosCriticidade: MotivoCriticidade[] = []
  if (sinalA === 'critico') motivosCriticidade.push('estouro_horas')
  if (sinalB === 'critico') motivosCriticidade.push('fisico_atras_financeiro')

  return { status, motivosCriticidade }
}

export function calcularMetricas(e: EntradaMetricas): Metricas {
  const saldo = calcularSaldo(e.horasVendidas, e.horasRealizadas)
  const percentualAvanco = calcularPercentualAvanco(e.horasVendidas, e.horasRealizadas)
  const percentualFinanceiro = calcularPercentualFinanceiro(e.valorContrato, e.valorFaturado)
  const { status, motivosCriticidade } = classificarStatus(percentualAvanco, percentualFinanceiro)
  return { saldo, percentualAvanco, percentualFinanceiro, status, motivosCriticidade }
}
