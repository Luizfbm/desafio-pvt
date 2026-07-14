import { Router } from 'express'
import { getProjetos } from './projetos.controller'

export const router = Router()

router.get('/health', (_req, res) => res.json({ ok: true }))
router.get('/projetos', getProjetos)
