'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface Option { value: string; label: string }

interface ConversationalFieldProps {
  question: string
  placeholder?: string
  type?: 'text' | 'number' | 'select'
  options?: Option[]
  validate?: (val: string) => string | null
  onConfirm: (value: string) => void
  autoFocus?: boolean
}

export function ConversationalField({
  question, placeholder, type = 'text', options, validate, onConfirm, autoFocus,
}: ConversationalFieldProps) {
  const [value, setValue] = useState('')
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) setTimeout(() => inputRef.current?.focus(), 80)
  }, [autoFocus])

  const handleConfirm = () => {
    const err = validate?.(value) ?? (value.trim() ? null : 'Please enter a value')
    if (err) { setError(err); return }
    setError(null)
    onConfirm(value)
  }

  const filteredOptions = (options ?? []).filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg"
    >
      <p className="text-3xl font-semibold text-foreground mb-8 leading-tight">{question}</p>

      {type === 'select' ? (
        <div className="space-y-2">
          <input
            ref={inputRef}
            value={search}
            onChange={e => { setSearch(e.target.value); setValue('') }}
            placeholder="Search states..."
            className="w-full bg-transparent border-b-2 border-border focus:border-electric-500 outline-none text-2xl font-light text-foreground pb-2 transition-colors placeholder:text-muted-foreground/40"
          />
          {search.length > 0 && (
            <div className="max-h-52 overflow-y-auto space-y-1 mt-2">
              {filteredOptions.map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => { setValue(opt.value); setSearch(opt.label) }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    value === opt.value
                      ? 'bg-electric-600/20 text-electric-400'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleConfirm()}
          placeholder={placeholder}
          className="w-full bg-transparent border-b-2 border-border focus:border-electric-500 outline-none text-4xl font-light text-foreground pb-3 transition-colors placeholder:text-muted-foreground/30"
        />
      )}

      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-red-400 text-sm mt-2"
          >{error}</motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={handleConfirm}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-8 flex items-center gap-2 px-6 py-3 rounded-full bg-electric-600 text-white font-medium hover:bg-electric-500 transition-colors"
      >
        Continue <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  )
}
