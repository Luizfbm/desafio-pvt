// Limiares da classificação de status. Ponto único de calibração.
export const LIMIARES = {
  consumoAtencao: 85, // % de consumo de horas a partir do qual entra em atenção
  consumoCritico: 100, // acima disso = estouro de horas (crítico)
  gapAtencao: 10, // pontos percentuais de gap financeiro−físico p/ atenção
  gapCritico: 20, // pontos percentuais de gap financeiro−físico p/ crítico
} as const
