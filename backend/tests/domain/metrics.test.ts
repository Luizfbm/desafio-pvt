import { describe, expect, it } from 'vitest'
import { calcularMetricas, classificarStatus } from '../../src/domain/metrics'

describe('calcularMetricas', () => {
  it('projeto saudável: consumo baixo e sem gap financeiro', () => {
    const m = calcularMetricas({
      horasVendidas: 160,
      horasRealizadas: 80,
      valorContrato: 90000,
      valorFaturado: 45000,
    })
    expect(m.saldo).toBe(80)
    expect(m.percentualAvanco).toBe(50)
    expect(m.percentualFinanceiro).toBe(50)
    expect(m.status).toBe('saudavel')
    expect(m.motivosCriticidade).toEqual([])
  })

  it('atenção: financeiro adiantado 15pp em relação ao físico', () => {
    const m = calcularMetricas({
      horasVendidas: 200,
      horasRealizadas: 140,
      valorContrato: 100000,
      valorFaturado: 85000,
    })
    expect(m.saldo).toBe(60)
    expect(m.percentualAvanco).toBe(70)
    expect(m.percentualFinanceiro).toBe(85)
    expect(m.status).toBe('atencao')
    expect(m.motivosCriticidade).toEqual([])
  })

  it('crítico por estouro de horas', () => {
    const m = calcularMetricas({
      horasVendidas: 100,
      horasRealizadas: 105,
      valorContrato: 80000,
      valorFaturado: 72000,
    })
    expect(m.saldo).toBe(-5)
    expect(m.percentualAvanco).toBe(105)
    expect(m.status).toBe('critico')
    expect(m.motivosCriticidade).toEqual(['estouro_horas'])
  })

  it('crítico por físico atrasado em relação ao financeiro', () => {
    const m = calcularMetricas({
      horasVendidas: 300,
      horasRealizadas: 120,
      valorContrato: 150000,
      valorFaturado: 112500,
    })
    expect(m.percentualAvanco).toBe(40)
    expect(m.percentualFinanceiro).toBe(75)
    expect(m.status).toBe('critico')
    expect(m.motivosCriticidade).toEqual(['fisico_atras_financeiro'])
  })

  it('pode ser crítico por estouro de horas mesmo com financeiro alto', () => {
    const m = calcularMetricas({
      horasVendidas: 100,
      horasRealizadas: 130, // 130% → estouro
      valorContrato: 100000,
      valorFaturado: 100000, // 100% → gap 100-130 = -30, NÃO dispara B
    })
    expect(m.motivosCriticidade).toContain('estouro_horas')
  })
})

describe('classificarStatus — fronteiras', () => {
  it('consumo exatamente 85% ainda é saudável', () => {
    expect(classificarStatus(85, 0).status).toBe('saudavel')
  })
  it('consumo 86% vira atenção', () => {
    expect(classificarStatus(86, 0).status).toBe('atencao')
  })
  it('consumo exatamente 100% é atenção (ainda não estourou)', () => {
    expect(classificarStatus(100, 0).status).toBe('atencao')
  })
  it('consumo 101% é crítico', () => {
    expect(classificarStatus(101, 0).status).toBe('critico')
  })
  it('gap exatamente 10pp é atenção', () => {
    expect(classificarStatus(50, 60).status).toBe('atencao')
  })
  it('gap exatamente 20pp é crítico', () => {
    expect(classificarStatus(50, 70).status).toBe('critico')
  })
})
