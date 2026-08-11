'use client'
import { usePathname } from 'next/navigation'
import { StepProgress } from './step-progress'

const PATH_TO_STEP: Record<string, number> = {
  '/demo': 1,
  '/demo/lifestyle': 2,
  '/demo/eligibility': 3,
  '/demo/quotes': 4,
  '/demo/recommendation': 5,
  '/demo/summary': 6,
  '/demo/approved': 7,
}

export function DtcProgressBar() {
  const pathname = usePathname()
  // Step 1 (/demo) uses its own top progress line — hide the bottom strip there
  if (pathname === '/demo') return null
  const currentStep = PATH_TO_STEP[pathname] ?? 1
  return <StepProgress currentStep={currentStep} />
}
