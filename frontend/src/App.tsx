import { useEffect, useMemo, useState } from 'react'
import type { Projeto, Status } from './types'
import { buscarProjetos } from './api'
import { StatusBadge } from './components/StatusBadge'

const FILTROS: { valor: Status | 'todos'; rotulo: string }[] = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'critico', rotulo: 'Críticos' },
  { valor: 'atencao', rotulo: 'Atenção' },
  { valor: 'saudavel', rotulo: 'Saudáveis' },
]

const MOTIVO_ROTULO: Record<string, string> = {
  estouro_horas: 'Estouro de horas',
  fisico_atras_financeiro: 'Físico atrás do financeiro',
}

function formatarSincronizacao(iso: string | null): string | null {
  if (!iso) return null
  const data = new Date(iso)
  const diffMin = Math.max(0, Math.round((Date.now() - data.getTime()) / 60000))
  const quando =
    diffMin < 1 ? 'agora há pouco' : diffMin < 60 ? `há ${diffMin} min` : data.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  return `Dados do RM · ${quando}`
}

function LinhaSkeleton() {
  return (
    <tr className="linha-skeleton" aria-hidden="true">
      <td>
        <span className="skel skel-nome" />
        <span className="skel skel-meta" />
      </td>
      <td><span className="skel skel-badge" /></td>
      <td className="num"><span className="skel skel-num" /></td>
      <td className="num"><span className="skel skel-num" /></td>
      <td className="num"><span className="skel skel-num" /></td>
      <td className="num"><span className="skel skel-num" /></td>
      <td><span className="skel skel-barra" /></td>
      <td><span className="skel skel-barra" /></td>
    </tr>
  )
}

function CelulaAvanco({ percentual, estourado }: { percentual: number; estourado?: boolean }) {
  return (
    <div className="avanco">
      <span className={`avanco-num${estourado ? ' negativo' : ''}`}>{percentual}%</span>
      <span
        className="barra"
        role="img"
        aria-label={`${percentual}% concluído`}
      >
        <span className="barra-preenche" style={{ width: `${Math.min(percentual, 100)}%` }} />
      </span>
    </div>
  )
}

export function App() {
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [filtro, setFiltro] = useState<Status | 'todos'>('todos')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  function carregar() {
    setCarregando(true)
    setErro(null)
    buscarProjetos()
      .then(setProjetos)
      .catch((e: Error) => setErro(e.message))
      .finally(() => setCarregando(false))
  }

  useEffect(carregar, [])

  const filtrados = useMemo(
    () => (filtro === 'todos' ? projetos : projetos.filter((p) => p.status === filtro)),
    [projetos, filtro],
  )

  const resumo = useMemo(() => {
    const por = (s: Status) => projetos.filter((p) => p.status === s).length
    return { total: projetos.length, critico: por('critico'), atencao: por('atencao'), saudavel: por('saudavel') }
  }, [projetos])

  const sincronizacao = formatarSincronizacao(projetos[0]?.ultimaSincronizacaoRm ?? null)

  return (
    <div className="pagina">
      <header className="cabecalho">
        <div>
          <h1>Painel de Projetos</h1>
          <p className="subtitulo">PVT Software &amp; Serviços</p>
        </div>
        {sincronizacao && <p className="sincronizacao">{sincronizacao}</p>}
      </header>

      <section className="resumo" aria-label="Resumo da carteira">
        <div className="resumo-item">
          <span className="resumo-numero">{carregando ? '—' : resumo.total}</span>
          <span className="resumo-rotulo">Projetos</span>
        </div>
        <div className="resumo-item">
          <span className={`resumo-numero${!carregando && resumo.critico > 0 ? ' cor-critico' : ''}`}>
            {carregando ? '—' : resumo.critico}
          </span>
          <span className="resumo-rotulo">Críticos</span>
        </div>
        <div className="resumo-item">
          <span className={`resumo-numero${!carregando && resumo.atencao > 0 ? ' cor-atencao' : ''}`}>
            {carregando ? '—' : resumo.atencao}
          </span>
          <span className="resumo-rotulo">Atenção</span>
        </div>
        <div className="resumo-item">
          <span className={`resumo-numero${!carregando && resumo.saudavel > 0 ? ' cor-saudavel' : ''}`}>
            {carregando ? '—' : resumo.saudavel}
          </span>
          <span className="resumo-rotulo">Saudáveis</span>
        </div>
      </section>

      <nav className="filtros" aria-label="Filtrar por status">
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            type="button"
            className="filtro"
            aria-pressed={filtro === f.valor}
            onClick={() => setFiltro(f.valor)}
          >
            {f.rotulo}
          </button>
        ))}
      </nav>

      {erro && (
        <div className="estado-erro" role="alert">
          <p>Não foi possível carregar os projetos. {erro}</p>
          <button type="button" className="filtro" onClick={carregar}>
            Tentar de novo
          </button>
        </div>
      )}

      {!erro && (
        <div className="tabela-wrap">
          <table className="tabela">
            <caption className="visually-hidden">
              Projetos da carteira com horas, saldo e status calculados
            </caption>
            <thead>
              <tr>
                <th scope="col">Projeto</th>
                <th scope="col">Status</th>
                <th scope="col" className="num">Vendidas</th>
                <th scope="col" className="num">Planejadas</th>
                <th scope="col" className="num">Realizadas</th>
                <th scope="col" className="num">Saldo</th>
                <th scope="col">Avanço físico</th>
                <th scope="col">Financeiro</th>
              </tr>
            </thead>
            <tbody>
              {carregando && (
                <>
                  <LinhaSkeleton />
                  <LinhaSkeleton />
                  <LinhaSkeleton />
                  <LinhaSkeleton />
                </>
              )}
              {!carregando &&
                filtrados.map((p) => {
                  const estourado = p.horas.saldo < 0
                  return (
                    <tr key={p.id}>
                      <td>
                        <span className="projeto-nome">{p.nome}</span>
                        <span className="projeto-meta">
                          {p.cliente.nome} · {p.codigoRm}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={p.status} />
                        {p.motivosCriticidade.length > 0 && (
                          <span className="motivos">
                            {p.motivosCriticidade.map((m) => MOTIVO_ROTULO[m] ?? m).join(' · ')}
                          </span>
                        )}
                      </td>
                      <td className="num">{p.horas.vendidas}h</td>
                      <td className="num">{p.horas.planejadas}h</td>
                      <td className="num">{p.horas.realizadas}h</td>
                      <td className={`num saldo${estourado ? ' negativo' : ''}`}>
                        {p.horas.saldo}h
                      </td>
                      <td>
                        <CelulaAvanco percentual={p.percentualAvanco} estourado={estourado} />
                      </td>
                      <td>
                        <CelulaAvanco percentual={p.percentualFinanceiro} />
                      </td>
                    </tr>
                  )
                })}
              {!carregando && filtrados.length === 0 && (
                <tr>
                  <td colSpan={8} className="estado-vazio">
                    Nenhum projeto neste filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
