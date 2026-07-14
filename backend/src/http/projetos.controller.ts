import type { Request, Response } from 'express'
import { z } from 'zod'
import { listarProjetos } from '../services/projetos.service'

const filtrosSchema = z.object({
  status: z.enum(['saudavel', 'atencao', 'critico']).optional(),
  clienteId: z.string().uuid().optional(),
  busca: z.string().trim().min(1).optional(),
})

export async function getProjetos(req: Request, res: Response) {
  const parsed = filtrosSchema.safeParse(req.query)
  if (!parsed.success) {
    return res.status(400).json({ erro: 'Parâmetros inválidos', detalhes: parsed.error.flatten() })
  }
  try {
    const dados = await listarProjetos(parsed.data)
    res.json(dados)
  } catch (err) {
    console.error('Erro ao listar projetos:', err)
    res.status(500).json({ erro: 'Erro interno ao listar projetos' })
  }
}
