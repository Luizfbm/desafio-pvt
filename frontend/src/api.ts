import type { Projeto, Status } from './types'

export async function buscarProjetos(status?: Status): Promise<Projeto[]> {
  const url = status ? `/api/projetos?status=${status}` : '/api/projetos'
  const resp = await fetch(url)
  if (!resp.ok) throw new Error('Falha ao carregar projetos')
  return resp.json()
}
