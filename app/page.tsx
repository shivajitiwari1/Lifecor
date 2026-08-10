import { LandingNavbar } from '@/components/shared/landing-navbar'
import { Hero } from '@/components/landing/hero'
import { ProblemSection } from '@/components/landing/problem-section'
import { SolutionSection } from '@/components/landing/solution-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { BenefitsSection } from '@/components/landing/benefits-section'
import { PartnerBenefitsSection } from '@/components/landing/partner-benefits-section'
import { CTASection } from '@/components/landing/cta-section'

export default function LandingPage() {
  return (
    <main>
      <LandingNavbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <BenefitsSection />
      <PartnerBenefitsSection />
      <CTASection />
    </main>
  )
}
