import { db, pool } from '../db/client'
import { clientes, analistas, projetos, alocacoes, apontamentos, faturamentos } from '../db/schema'
import { buscarSnapshotRM } from '../rm/rm-adapter'

async function main() {
  const snapshot = buscarSnapshotRM()

  // idempotente: limpa em ordem segura de FK
  await db.delete(faturamentos)
  await db.delete(apontamentos)
  await db.delete(alocacoes)
  await db.delete(projetos)
  await db.delete(analistas)
  await db.delete(clientes)

  const clientesInseridos = await db
    .insert(clientes)
    .values(snapshot.clientes.map((c) => ({ nome: c.nome, cnpj: c.cnpj, codigoRm: c.codigoRm })))
    .returning({ id: clientes.id, codigoRm: clientes.codigoRm })
  const clienteId = new Map(clientesInseridos.map((c) => [c.codigoRm, c.id]))

  const analistasInseridos = await db
    .insert(analistas)
    .values(snapshot.analistas.map((a) => ({ nome: a.nome, email: a.email, codigoRm: a.codigoRm })))
    .returning({ id: analistas.id, codigoRm: analistas.codigoRm })
  const analistaId = new Map(analistasInseridos.map((a) => [a.codigoRm, a.id]))

  const agora = new Date()
  const projetosInseridos = await db
    .insert(projetos)
    .values(
      snapshot.projetos.map((p) => ({
        clienteId: clienteId.get(p.clienteCodigoRm)!,
        codigoRm: p.codigoRm,
        nome: p.nome,
        dataInicio: p.dataInicio,
        dataFimPrevista: p.dataFimPrevista,
        horasVendidas: p.horasVendidas,
        valorContrato: p.valorContrato,
        statusProjeto: 'ativo',
        ultimaSincronizacaoRm: agora,
      })),
    )
    .returning({ id: projetos.id, codigoRm: projetos.codigoRm })
  const projetoId = new Map(projetosInseridos.map((p) => [p.codigoRm, p.id]))

  await db.insert(alocacoes).values(
    snapshot.alocacoes.map((a) => ({
      projetoId: projetoId.get(a.projetoCodigoRm)!,
      analistaId: analistaId.get(a.analistaCodigoRm)!,
      papel: a.papel,
      horasPlanejadas: a.horasPlanejadas,
    })),
  )

  await db.insert(apontamentos).values(
    snapshot.apontamentos.map((a) => ({
      projetoId: projetoId.get(a.projetoCodigoRm)!,
      analistaId: analistaId.get(a.analistaCodigoRm)!,
      data: a.data,
      horas: a.horas,
      descricao: a.descricao,
      origem: 'RM',
    })),
  )

  await db.insert(faturamentos).values(
    snapshot.faturamentos.map((f) => ({
      projetoId: projetoId.get(f.projetoCodigoRm)!,
      competencia: f.competencia,
      valorFaturado: f.valorFaturado,
    })),
  )

  console.log(`Seed concluído: ${snapshot.projetos.length} projetos sincronizados do RM (mock).`)
  await pool.end()
}

main().catch((err) => {
  console.error('Falha no seed:', err)
  process.exit(1)
})
