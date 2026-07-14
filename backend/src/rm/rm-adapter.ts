// Simula o TOTVS RM (caixa externa). Em produção, este adapter (anti-corruption
// layer) traduziria o modelo do ERP para o nosso domínio. Aqui, retorna dados fixos.

export interface RMCliente {
  codigoRm: string
  nome: string
  cnpj: string
}
export interface RMAnalista {
  codigoRm: string
  nome: string
  email: string
}
export interface RMProjeto {
  codigoRm: string
  clienteCodigoRm: string
  nome: string
  dataInicio: string
  dataFimPrevista: string
  horasVendidas: number
  valorContrato: number
}
export interface RMAlocacao {
  projetoCodigoRm: string
  analistaCodigoRm: string
  papel: string
  horasPlanejadas: number
}
export interface RMApontamento {
  projetoCodigoRm: string
  analistaCodigoRm: string
  data: string
  horas: number
  descricao: string
}
export interface RMFaturamento {
  projetoCodigoRm: string
  competencia: string
  valorFaturado: number
}
export interface RMSnapshot {
  clientes: RMCliente[]
  analistas: RMAnalista[]
  projetos: RMProjeto[]
  alocacoes: RMAlocacao[]
  apontamentos: RMApontamento[]
  faturamentos: RMFaturamento[]
}

export function buscarSnapshotRM(): RMSnapshot {
  return {
    clientes: [
      { codigoRm: 'CLI-001', nome: 'Banco XPTO', cnpj: '11.111.111/0001-11' },
      { codigoRm: 'CLI-002', nome: 'Varejo ABC', cnpj: '22.222.222/0001-22' },
      { codigoRm: 'CLI-003', nome: 'Indústria K', cnpj: '33.333.333/0001-33' },
      { codigoRm: 'CLI-004', nome: 'Tech Startup', cnpj: '44.444.444/0001-44' },
    ],
    analistas: [
      { codigoRm: 'ANA-001', nome: 'João Souza', email: 'joao@pvt.com' },
      { codigoRm: 'ANA-002', nome: 'Maria Lima', email: 'maria@pvt.com' },
      { codigoRm: 'ANA-003', nome: 'Pedro Alves', email: 'pedro@pvt.com' },
    ],
    projetos: [
      { codigoRm: 'PRJ-1042', clienteCodigoRm: 'CLI-001', nome: 'Implantação RM — Banco XPTO', dataInicio: '2026-01-06', dataFimPrevista: '2026-09-30', horasVendidas: 200, valorContrato: 100000 },
      { codigoRm: 'PRJ-1043', clienteCodigoRm: 'CLI-002', nome: 'Migração Fiscal — Varejo ABC', dataInicio: '2026-02-03', dataFimPrevista: '2026-06-30', horasVendidas: 100, valorContrato: 80000 },
      { codigoRm: 'PRJ-1044', clienteCodigoRm: 'CLI-003', nome: 'BI Corporativo — Indústria K', dataInicio: '2026-03-10', dataFimPrevista: '2026-12-15', horasVendidas: 300, valorContrato: 150000 },
      { codigoRm: 'PRJ-1045', clienteCodigoRm: 'CLI-004', nome: 'Portal de Vendas — Tech Startup', dataInicio: '2026-04-01', dataFimPrevista: '2026-10-01', horasVendidas: 160, valorContrato: 90000 },
    ],
    alocacoes: [
      { projetoCodigoRm: 'PRJ-1042', analistaCodigoRm: 'ANA-001', papel: 'Consultor', horasPlanejadas: 120 },
      { projetoCodigoRm: 'PRJ-1042', analistaCodigoRm: 'ANA-002', papel: 'Consultor', horasPlanejadas: 80 },
      { projetoCodigoRm: 'PRJ-1043', analistaCodigoRm: 'ANA-002', papel: 'Consultor', horasPlanejadas: 100 },
      { projetoCodigoRm: 'PRJ-1044', analistaCodigoRm: 'ANA-003', papel: 'Consultor', horasPlanejadas: 180 },
      { projetoCodigoRm: 'PRJ-1044', analistaCodigoRm: 'ANA-001', papel: 'Consultor', horasPlanejadas: 120 },
      { projetoCodigoRm: 'PRJ-1045', analistaCodigoRm: 'ANA-001', papel: 'Consultor', horasPlanejadas: 160 },
    ],
    // apontamentos somam: PRJ-1042=140, PRJ-1043=105, PRJ-1044=120, PRJ-1045=80
    apontamentos: [
      { projetoCodigoRm: 'PRJ-1042', analistaCodigoRm: 'ANA-001', data: '2026-05-05', horas: 80, descricao: 'Parametrização' },
      { projetoCodigoRm: 'PRJ-1042', analistaCodigoRm: 'ANA-002', data: '2026-05-12', horas: 60, descricao: 'Testes' },
      { projetoCodigoRm: 'PRJ-1043', analistaCodigoRm: 'ANA-002', data: '2026-05-06', horas: 105, descricao: 'Migração' },
      { projetoCodigoRm: 'PRJ-1044', analistaCodigoRm: 'ANA-003', data: '2026-05-08', horas: 120, descricao: 'Modelagem BI' },
      { projetoCodigoRm: 'PRJ-1045', analistaCodigoRm: 'ANA-001', data: '2026-05-09', horas: 80, descricao: 'Desenvolvimento' },
    ],
    // faturado: PRJ-1042=85000(85%), PRJ-1043=72000(90%), PRJ-1044=112500(75%), PRJ-1045=45000(50%)
    faturamentos: [
      { projetoCodigoRm: 'PRJ-1042', competencia: '2026-05', valorFaturado: 85000 },
      { projetoCodigoRm: 'PRJ-1043', competencia: '2026-05', valorFaturado: 72000 },
      { projetoCodigoRm: 'PRJ-1044', competencia: '2026-05', valorFaturado: 112500 },
      { projetoCodigoRm: 'PRJ-1045', competencia: '2026-05', valorFaturado: 45000 },
    ],
  }
}
