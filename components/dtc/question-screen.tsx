'use client'
import { motion } from 'framer-motion'

interface Option {
  value: string | number | boolean
  label: string
  emoji?: string
}

interface QuestionScreenProps {
  question: string
  options: Option[]
  selected: string | number | boolean | null | undefined
  onSelect: (value: string | number | boolean) => void
  direction: 1 | -1
  questionKey: string
}

export function QuestionScreen({ question, options, selected, onSelect, direction, questionKey }: QuestionScreenProps) {
  return (
    <motion.div
      key={questionKey}
      initial={{ opacity: 0, x: direction * 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -60 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="w-full max-w-xl"
    >
      <h2 className="text-3xl font-semibold text-foreground mb-10 leading-tight">{question}</h2>
      <div className="grid grid-cols-2 gap-4">
        {options.map(opt => {
          const isSelected = selected === opt.value
          return (
            <motion.button
              key={String(opt.value)}
              type="button"
              onClick={() => onSelect(opt.value)}
              whileTap={{ scale: 0.97 }}
              className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 min-h-[120px] flex flex-col justify-end ${
                isSelected
                  ? 'bg-electric-600 border-electric-500 text-white'
                  : 'bg-card border-border text-foreground hover:border-electric-500/50'
              }`}
            >
              {opt.emoji && <span className="text-3xl mb-3 block">{opt.emoji}</span>}
              <span className={`font-semibold text-lg leading-tight ${isSelected ? 'text-white' : ''}`}>
                {opt.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
