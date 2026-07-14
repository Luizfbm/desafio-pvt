# Painel de Projetos (case técnico PVT)

Módulo de acompanhamento de saúde de projetos para o portal de gestão da PVT: por projeto, mostra horas vendidas, planejadas e realizadas, o saldo restante, o avanço físico contra o financeiro e um status calculado (saudável, atenção ou crítico) com o motivo explícito. O TOTVS RM é a fonte oficial dos dados e aqui aparece como uma caixa externa simulada.

O projeto atende as duas partes do case: o documento de design está em [docs/design.md](docs/design.md) e uma fatia do desenho roda de verdade (API + regras de cálculo testadas + tela).

## Como rodar

Único pré-requisito: Docker.

```bash
docker compose up --build
```

O comando sobe os três serviços: PostgreSQL, backend (que aplica as migrações e roda o seed sozinho) e frontend. O primeiro build leva alguns minutos.

- Painel: http://localhost:5173
- API: http://localhost:3000/api/projetos

O seed simula uma sincronização com o RM e carrega quatro projetos que cobrem os três status, incluindo os dois motivos de criticidade (estouro de horas e físico atrás do financeiro).

## Testes

As regras de negócio (saldo, percentuais, classificação de status) têm testes unitários:

```bash
cd backend
npm install
npm test
```

## Rodar sem containers (modo dev)

Se preferir rodar backend e frontend direto na máquina, suba só o banco pelo compose:

```bash
docker compose up -d db

cd backend
npm install
npm run db:migrate
npm run seed
npm run dev        # API em :3000

cd ../frontend
npm install
npm run dev        # painel em :5173
```

Detalhe de porta: no host, o Postgres do compose responde em `localhost:5433` para não conflitar com uma instalação local de Postgres. Dentro da rede do compose os serviços falam com `db:5432`.

## Decisões em resumo

A justificativa completa está em [docs/design.md](docs/design.md). O essencial:

- O painel nunca consulta o RM durante a request. Um read-model local no Postgres guarda o snapshot dos dados, sincronizado fora do caminho do usuário. Se o ERP cair, o painel continua no ar servindo a última foto, e cada resposta informa a idade do dado.
- Saldo, avanço e status são derivados, nunca colunas. O cálculo vive em funções puras na camada de serviço, testáveis sem banco e sem servidor.
- O status usa dois sinais independentes (consumo de horas e gap entre financeiro e físico) e vale o pior dos dois. Os limiares ficam num único módulo de configuração.
- Faturamento é entidade própria porque o critério "entrega física atrasada em relação ao financeiro" exige comparar o que se entregou com o que se cobrou.
- Stack alinhada ao ambiente da PVT: React + TypeScript no front, Node + Express + Zod no back, PostgreSQL com Drizzle. Tudo em containers para a execução ser um comando só.

## Estrutura

```
├── docs/design.md      documento da Parte 1
├── docker-compose.yml  db + backend + frontend
├── backend/
│   └── src/
│       ├── config/     limiares de status
│       ├── domain/     regras puras (saldo, avanço, status)
│       ├── db/         schema Drizzle, cliente, migrações
│       ├── rm/         RM Adapter (mock do ERP)
│       ├── seed/       sincronização simulada
│       ├── services/   consulta + cálculo por projeto
│       └── http/       rotas e validação
└── frontend/
    └── src/            tela do painel (React + TS)
```
