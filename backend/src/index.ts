import { criarApp } from './app'

const porta = Number(process.env.PORT ?? 3000)
criarApp().listen(porta, () => {
  console.log(`API do Painel de Projetos ouvindo em http://localhost:${porta}`)
})
