import express from 'express'
import cors from 'cors'
import { router } from './http/routes'

export function criarApp() {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use('/api', router)
  return app
}
