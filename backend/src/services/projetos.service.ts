import { and, eq, ilike, sql, type SQL } from 'drizzle-orm'
import { db } from '../db/client'
import { projetos, clientes, alocacoes, apontamentos, faturamentos } from '../db/schema'
import { calcularMetricas, type Status } from '../domain/metrics'

export interface FiltrosProjetos {
  status?: Status
  clienteId?: string
  busca?: string
}

export interface ProjetoDTO {
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

function mapaSoma(rows: { projetoId: string; total: number | string }[]): Map<string, number> {
  return new Map(rows.map((r) => [r.projetoId, Number(r.total)]))
}

export async function listarProjetos(filtros: FiltrosProjetos = {}): Promise<ProjetoDTO[]> {
  const condicoes: SQL[] = []
  if (filtros.clienteId) condicoes.push(eq(projetos.clienteId, filtros.clienteId))
  if (filtros.busca) condicoes.push(ilike(projetos.nome, `%${filtros.busca}%`))
  const where = condicoes.length ? and(...condicoes) : undefined

  const linhas = await db
    .select({
      id: projetos.id,
      codigoRm: projetos.codigoRm,
      nome: projetos.nome,
      horasVendidas: projetos.horasVendidas,
      valorContrato: projetos.valorContrato,
      ultimaSincronizacaoRm: projetos.ultimaSincronizacaoRm,
      clienteId: clientes.id,
      clienteNome: clientes.nome,
    })
    .from(projetos)
    .innerJoin(clientes, eq(projetos.clienteId, clientes.id))
    .where(where)

  const planejadas = mapaSoma(
    await db
      .select({
        projetoId: alocacoes.projetoId,
        total: sql<number>`coalesce(sum(${alocacoes.horasPlanejadas}),0)`,
      })
      .from(alocacoes)
      .groupBy(alocacoes.projetoId),
  )
  const realizadas = mapaSoma(
    await db
      .select({
        projetoId: apontamentos.projetoId,
        total: sql<number>`coalesce(sum(${apontamentos.horas}),0)`,
      })
      .from(apontamentos)
      .groupBy(apontamentos.projetoId),
  )
  const faturado = mapaSoma(
    await db
      .select({
        projetoId: faturamentos.projetoId,
        total: sql<number>`coalesce(sum(${faturamentos.valorFaturado}),0)`,
      })
      .from(faturamentos)
      .groupBy(faturamentos.projetoId),
  )

  const dtos: ProjetoDTO[] = linhas.map((l) => {
    const horasRealizadas = realizadas.get(l.id) ?? 0
    const horasPlanejadas = planejadas.get(l.id) ?? 0
    const valorFaturado = faturado.get(l.id) ?? 0
    const m = calcularMetricas({
      horasVendidas: l.horasVendidas,
      horasRealizadas,
      valorContrato: l.valorContrato,
      valorFaturado,
    })
    return {
      id: l.id,
      codigoRm: l.codigoRm,
      nome: l.nome,
      cliente: { id: l.clienteId, nome: l.clienteNome },
      horas: {
        vendidas: l.horasVendidas,
        planejadas: horasPlanejadas,
        realizadas: horasRealizadas,
        saldo: m.saldo,
      },
      percentualAvanco: m.percentualAvanco,
      percentualFinanceiro: m.percentualFinanceiro,
      status: m.status,
      motivosCriticidade: m.motivosCriticidade,
      ultimaSincronizacaoRm: l.ultimaSincronizacaoRm
        ? l.ultimaSincronizacaoRm.toISOString()
        : null,
    }
  })

  // status é derivado → filtra após o cálculo
  return filtros.status ? dtos.filter((d) => d.status === filtros.status) : dtos
}
