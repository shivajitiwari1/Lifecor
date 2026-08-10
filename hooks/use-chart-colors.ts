'use client'
import { useTheme } from 'next-themes'
import { CHART_DARK, CHART_LIGHT } from '@/lib/chart-colors'

export function useChartColors() {
  const { resolvedTheme } = useTheme()
  return resolvedTheme === 'dark' ? CHART_DARK : CHART_LIGHT
}
