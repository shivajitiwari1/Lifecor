'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useDemoSession } from '@/hooks/useDemoSession'
import { ConversationalField } from '@/components/dtc/conversational-field'
import { ConfirmedChip } from '@/components/dtc/confirmed-chip'

const US_STATES = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' },
]

type Step = 'name' | 'age' | 'state'

export default function DemoPage() {
  const router = useRouter()
  const { setField } = useDemoSession()
  const [step, setStep] = useState<Step>('name')
  const [confirmedName, setConfirmedName] = useState('')
  const [confirmedAge, setConfirmedAge] = useState('')

  const handleName = (val: string) => {
    setField('name', val)
    setConfirmedName(val)
    setStep('age')
  }

  const handleAge = (val: string) => {
    setField('age', parseInt(val))
    setConfirmedAge(val)
    setStep('state')
  }

  const handleState = (val: string) => {
    setField('state', val)
    router.push('/demo/lifestyle')
  }

  const topProgress = step === 'name' ? '10%' : step === 'age' ? '50%' : '90%'

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Orb */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-electric-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top progress line (replaces bottom strip on this screen only) */}
      <div className="fixed top-14 left-0 right-0 h-0.5 bg-muted/40 z-40">
        <motion.div
          className="h-full bg-electric-500"
          animate={{ width: topProgress }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Confirmed chips */}
      <div className="flex gap-3 mb-12 flex-wrap justify-center min-h-8">
        <AnimatePresence>
          {confirmedName && <ConfirmedChip key="name" label="Name" value={confirmedName} />}
          {confirmedAge && <ConfirmedChip key="age" label="Age" value={confirmedAge} />}
        </AnimatePresence>
      </div>

      {/* Active question */}
      <AnimatePresence mode="wait">
        {step === 'name' && (
          <ConversationalField
            key="name"
            question="Before we start — what's your name?"
            placeholder="Jane Smith"
            validate={v => v.trim().length < 2 ? 'Name must be at least 2 characters' : null}
            onConfirm={handleName}
            autoFocus
          />
        )}
        {step === 'age' && (
          <ConversationalField
            key="age"
            question={`And how old are you, ${confirmedName}?`}
            placeholder="32"
            type="number"
            validate={v => {
              const n = parseInt(v)
              return isNaN(n) || n < 18 || n > 75 ? 'Age must be between 18 and 75' : null
            }}
            onConfirm={handleAge}
            autoFocus
          />
        )}
        {step === 'state' && (
          <ConversationalField
            key="state"
            question="Which state do you live in?"
            type="select"
            options={US_STATES}
            validate={v => !v ? 'Please select a state' : null}
            onConfirm={handleState}
            autoFocus
          />
        )}
      </AnimatePresence>
    </div>
  )
}
