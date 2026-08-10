import { create } from 'zustand'
import type { DTCSession } from '@/types'

interface DemoSessionStore {
  session: Partial<DTCSession>
  setField: <K extends keyof DTCSession>(key: K, value: DTCSession[K]) => void
  resetSession: () => void
}

export const useDemoSession = create<DemoSessionStore>((set) => ({
  session: {},
  setField: (key, value) => set((s) => ({ session: { ...s.session, [key]: value } })),
  resetSession: () => set({ session: {} }),
}))
