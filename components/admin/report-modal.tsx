'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useChartColors } from '@/hooks/use-chart-colors'

interface ReportModalProps {
  open: boolean
  onClose: () => void
  title: string
  data: unknown[]
  type: 'bar' | 'line'
  dataKey: string
  xKey: string
  formatter?: (v: unknown) => string
}

export function ReportModal({ open, onClose, title, data, type, dataKey, xKey, formatter }: ReportModalProps) {
  const c = useChartColors()
  const tooltipStyle = { backgroundColor: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: '12px', color: c.tooltipColor }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          <ResponsiveContainer width="100%" height={300}>
            {type === 'bar' ? (
              <BarChart data={data as Record<string, unknown>[]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
                <XAxis dataKey={xKey} tick={{ fill: c.tick, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: c.tick, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatter} />
                <Tooltip contentStyle={tooltipStyle} formatter={formatter ? (v) => [formatter(v), dataKey] : undefined} />
                <Bar dataKey={dataKey} fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={data as Record<string, unknown>[]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
                <XAxis dataKey={xKey} tick={{ fill: c.tick, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: c.tick, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatter} />
                <Tooltip contentStyle={tooltipStyle} formatter={formatter ? (v) => [formatter(v), dataKey] : undefined} />
                <Line type="monotone" dataKey={dataKey} stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 3 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  )
}
