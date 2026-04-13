'use client'

import { useState } from 'react'
import { useBrandSettings } from '../_lib/use-brand-settings'

export default function BrandMembersPage() {
  const {
    brand,
    members,
    invites,
    loading,
    message,
    setMessage,
    membershipRole,
    currentUserId,
    createInvite,
    copyInviteLink,
    updateMemberRole,
    removeMember,
    revokeInvite,
  } = useBrandSettings()
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('editor')
  const [inviting, setInviting] = useState(false)
  const [roleUpdatingId, setRoleUpdatingId] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [revokingId, setRevokingId] = useState<string | null>(null)

  const canManage = membershipRole === 'owner' || membershipRole === 'admin'

  const handleInvite = async () => {
    try {
      if (!inviteEmail.trim()) {
        setMessage('Invite email is required.')
        return
      }

      setInviting(true)
      setMessage('')
      await createInvite(inviteEmail.trim(), inviteRole)
      setInviteEmail('')
      setInviteRole('editor')
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Failed to create invite')
    } finally {
      setInviting(false)
    }
  }

  const handleRoleChange = async (memberId: string, role: string) => {
    try {
      setRoleUpdatingId(memberId)
      setMessage('')
      await updateMemberRole(memberId, role)
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Failed to update member role')
    } finally {
      setRoleUpdatingId(null)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      setRemovingId(memberId)
      setMessage('')
      await removeMember(memberId)
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Failed to remove member')
    } finally {
      setRemovingId(null)
    }
  }

  const handleRevokeInvite = async (inviteId: string) => {
    try {
      setRevokingId(inviteId)
      setMessage('')
      await revokeInvite(inviteId)
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Failed to revoke invite')
    } finally {
      setRevokingId(null)
    }
  }

  return (
    <div className="space-y-5">
      <section className="panel-strong rounded-[1.8rem] p-6 md:p-8">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
          Brand Settings
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">Members</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/58">
          Manage who can collaborate inside {brand?.name || 'this workspace'}, what role they have,
          and which invites are still pending.
        </p>
      </section>

      <section className="panel rounded-[1.8rem] p-6 md:p-7">
        <div className="flex items-center justify-between gap-3">
          <div className="text-2xl font-bold text-white">Invite teammate</div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/58">
            {members.length} members
          </div>
        </div>
        <p className="mt-2 text-sm leading-7 text-white/54">
          Invite collaborators into the current brand workspace and assign a role right away.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <input
            type="email"
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
            placeholder="teammate@company.com"
            className="field"
            disabled={!canManage}
          />
          <select
            className="field"
            value={inviteRole}
            onChange={(event) => setInviteRole(event.target.value)}
            disabled={!canManage}
          >
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
          <button onClick={handleInvite} disabled={!canManage || inviting} className="cta-primary text-sm">
            {inviting ? 'Saving...' : 'Save invite'}
          </button>
        </div>

        <div className="mt-4 text-sm text-white/54">
          {message || 'Invites stay in this section so team management lives in one place.'}
        </div>
      </section>

      <section className="panel rounded-[1.8rem] p-6 md:p-7">
        <div className="flex items-center justify-between gap-3">
          <div className="text-2xl font-bold text-white">Current members</div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/58">
            {members.length} total
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {members.map((member) => {
            const isCurrentUser = member.user_id === currentUserId
            const isRoleLocked = member.role === 'owner' && membershipRole !== 'owner'

            return (
              <div
                key={member.id}
                className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-4 py-3"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white">
                      {member.display_name || member.email || member.user_id}
                    </div>
                    <div className="mt-1 text-sm text-white/46">{member.email || member.user_id}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      className="field min-w-[130px]"
                      value={member.role}
                      disabled={!canManage || isRoleLocked || roleUpdatingId === member.id}
                      onChange={(event) => handleRoleChange(member.id, event.target.value)}
                    >
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={!canManage || isCurrentUser || removingId === member.id}
                      className="rounded-[1rem] border border-white/10 px-3 py-2 text-xs font-semibold text-white/72 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {removingId === member.id ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {!loading && members.length === 0 ? (
            <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-sm text-white/46">
              Brand members will show up here once you start inviting collaborators.
            </div>
          ) : null}
        </div>
      </section>

      <section className="panel rounded-[1.8rem] p-6 md:p-7">
        <div className="flex items-center justify-between gap-3">
          <div className="text-2xl font-bold text-white">Pending invites</div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/58">
            {invites.length} total
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {invites.map((invite) => (
            <div
              key={invite.id}
              className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-4 py-3"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white">{invite.email}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/38">
                    <span>{invite.role}</span>
                    <span>·</span>
                    <span>{invite.status}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => copyInviteLink(invite.token)}
                    className="rounded-[1rem] border border-white/10 px-3 py-2 text-xs font-semibold text-white/72 transition hover:bg-white/[0.04] hover:text-white"
                  >
                    Copy link
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRevokeInvite(invite.id)}
                    disabled={!canManage || revokingId === invite.id}
                    className="rounded-[1rem] border border-white/10 px-3 py-2 text-xs font-semibold text-white/72 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {revokingId === invite.id ? 'Revoking...' : 'Revoke'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!loading && invites.length === 0 ? (
            <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-sm text-white/46">
              Pending teammate invites will show up here.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
