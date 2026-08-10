'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { QuoteCard } from '@/components/dtc/quote-card'
import { generateQuoteResult } from '@/lib/mock-ai'
import { sleep } from '@/lib/utils'
import type { QuoteResult, DTCSession } from '@/types'

const US_STATES = ['California','Texas','Florida','New York','Illinois','Arizona','Washington','Colorado','Georgia','Nevada','Michigan','Oregon','Virginia','Minnesota','Ohio','Utah','Pennsylvania','North Carolina','Tennessee','Missouri']

const schema = z.object({
  age: z.coerce.number().min(18).max(75),
  state: z.string().min(1),
  annualIncome: z.coerce.number().min(1),
})
type FormData = z.infer<typeof schema>

export default function QuoteGeneratorPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<QuoteResult | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<DTCSession['selectedPlan']>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setResult(null)
    await sleep(2000)
    const session: Partial<DTCSession> = { age: data.age, state: data.state, annualIncome: data.annualIncome, smoker: false, existingConditions: 'none', dependents: 0 }
    setResult(generateQuoteResult(session))
    setSelectedPlan(null)
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Quote Generator</h1>
        <p className="text-muted-foreground text-sm mt-1">Generate instant quotes for your clients</p>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label>Client Age</Label>
            <Input type="number" placeholder="34" className="mt-1.5" {...register('age')} />
            {errors.age && <p className="text-red-400 text-xs mt-1">Valid age required (18–75)</p>}
          </div>
          <div>
            <Label>State</Label>
            <Select onValueChange={(v) => setValue('state', v as string)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>
                {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.state && <p className="text-red-400 text-xs mt-1">Required</p>}
          </div>
          <div>
            <Label>Annual Income</Label>
            <Input type="number" placeholder="95000" className="mt-1.5" {...register('annualIncome')} />
            {errors.annualIncome && <p className="text-red-400 text-xs mt-1">Required</p>}
          </div>
          <div className="sm:col-span-3">
            <Button type="submit" disabled={loading} className="bg-electric-600 hover:bg-electric-700 text-white h-10 px-8">
              {loading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Calculating...</> : <><Calculator className="mr-2 w-4 h-4" />Generate Quotes</>}
            </Button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Quote Results</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Confidence: <span className="text-electric-400 font-bold">{result.confidenceScore}%</span>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {result.plans.map(plan => (
                <QuoteCard key={plan.name} plan={plan} selected={selectedPlan === plan.name.toLowerCase()} onSelect={() => setSelectedPlan(plan.name.toLowerCase() as DTCSession['selectedPlan'])} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
