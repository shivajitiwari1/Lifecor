'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StepProgress } from '@/components/dtc/step-progress'
import { useDemoSession } from '@/hooks/useDemoSession'

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.coerce.number().min(18, 'Must be at least 18').max(75, 'Maximum age is 75'),
  state: z.string().min(1, 'Please select a state'),
})
type FormData = z.infer<typeof schema>

export default function WelcomePage() {
  const router = useRouter()
  const { setField } = useDemoSession()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormData) => {
    setField('name', data.name)
    setField('age', data.age)
    setField('state', data.state)
    router.push('/demo/lifestyle')
  }

  return (
    <>
      <StepProgress currentStep={1} />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to Lifecor</h1>
            <p className="text-muted-foreground">Let's get you covered in minutes. Tell us a bit about yourself.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Jane Smith" className="mt-1.5" {...register('name')} />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="32" className="mt-1.5" {...register('age')} />
              {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age.message}</p>}
            </div>
            <div>
              <Label>State</Label>
              <Select onValueChange={(v) => setValue('state', v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-electric-600 hover:bg-electric-700 text-white h-12 text-base font-semibold mt-2">
              Continue <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </motion.div>
      </div>
    </>
  )
}
