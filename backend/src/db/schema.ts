import { pgTable, uuid, text, integer, date, timestamp } from 'drizzle-orm/pg-core'

export const clientes = pgTable('clientes', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: text('nome').notNull(),
  cnpj: text('cnpj'),
  codigoRm: text('codigo_rm').notNull().unique(),
})

export const analistas = pgTable('analistas', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: text('nome').notNull(),
  email: text('email'),
  codigoRm: text('codigo_rm').notNull().unique(),
})

export const projetos = pgTable('projetos', {
  id: uuid('id').primaryKey().defaultRandom(),
  clienteId: uuid('cliente_id')
    .notNull()
    .references(() => clientes.id),
  codigoRm: text('codigo_rm').notNull().unique(),
  nome: text('nome').notNull(),
  dataInicio: date('data_inicio'),
  dataFimPrevista: date('data_fim_prevista'),
  horasVendidas: integer('horas_vendidas').notNull().default(0),
  valorContrato: integer('valor_contrato').notNull().default(0),
  statusProjeto: text('status_projeto').notNull().default('ativo'),
  ultimaSincronizacaoRm: timestamp('ultima_sincronizacao_rm', { withTimezone: true }),
})

export const alocacoes = pgTable('alocacoes', {
  id: uuid('id').primaryKey().defaultRandom(),
  projetoId: uuid('projeto_id')
    .notNull()
    .references(() => projetos.id),
  analistaId: uuid('analista_id')
    .notNull()
    .references(() => analistas.id),
  papel: text('papel'),
  dataInicio: date('data_inicio'),
  dataFim: date('data_fim'),
  horasPlanejadas: integer('horas_planejadas').notNull().default(0),
})

export const apontamentos = pgTable('apontamentos', {
  id: uuid('id').primaryKey().defaultRandom(),
  projetoId: uuid('projeto_id')
    .notNull()
    .references(() => projetos.id),
  analistaId: uuid('analista_id')
    .notNull()
    .references(() => analistas.id),
  data: date('data').notNull(),
  horas: integer('horas').notNull(),
  descricao: text('descricao'),
  origem: text('origem').default('RM'),
})

export const faturamentos = pgTable('faturamentos', {
  id: uuid('id').primaryKey().defaultRandom(),
  projetoId: uuid('projeto_id')
    .notNull()
    .references(() => projetos.id),
  competencia: text('competencia').notNull(),
  valorFaturado: integer('valor_faturado').notNull().default(0),
})
