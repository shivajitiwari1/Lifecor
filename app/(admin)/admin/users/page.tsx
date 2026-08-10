'use client'
import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { InviteModal } from '@/components/admin/invite-modal'
import agentsData from '@/mock-data/agents.json'
import type { Agent, AgentRole } from '@/types'
import { formatDate } from '@/lib/formatters'

const agents = agentsData as Agent[]

const ROLE_STYLES: Record<AgentRole, string> = {
  admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  agent: 'bg-electric-600/20 text-electric-400 border-electric-600/30',
  viewer: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
}

export default function UsersPage() {
  const [inviteOpen, setInviteOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">{agents.length} team members</p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="bg-electric-600 hover:bg-electric-700 text-white">
          <UserPlus className="mr-2 w-4 h-4" />Invite User
        </Button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Team Member', 'Email', 'Role', 'Leads', 'Conversion', 'Policies', 'Joined'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {agents.map(agent => (
              <tr key={agent.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-electric-600/20 text-electric-400 text-xs">{agent.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{agent.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{agent.email}</td>
                <td className="px-4 py-3">
                  <Badge className={`border capitalize text-xs ${ROLE_STYLES[agent.role]}`}>{agent.role}</Badge>
                </td>
                <td className="px-4 py-3 text-sm">{agent.totalLeads}</td>
                <td className="px-4 py-3 text-sm">{agent.conversionRate}%</td>
                <td className="px-4 py-3 text-sm">{agent.policiesIssued}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(agent.joinedDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  )
}
