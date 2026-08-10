'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface InviteModalProps {
  open: boolean
  onClose: () => void
}

export function InviteModal({ open, onClose }: InviteModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')

  const handleInvite = () => {
    if (!email || !role) return
    toast.success('Invitation sent', { description: `${email} will receive an invite email shortly.` })
    setEmail('')
    setRole('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>Send an invitation to join Lifecor as an agent or admin.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label>Email Address</Label>
            <Input type="email" placeholder="agent@company.com" className="mt-1.5" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Role</Label>
            <Select onValueChange={setRole}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={handleInvite} disabled={!email || !role} className="flex-1 bg-electric-600 hover:bg-electric-700 text-white">
              Send Invite
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
