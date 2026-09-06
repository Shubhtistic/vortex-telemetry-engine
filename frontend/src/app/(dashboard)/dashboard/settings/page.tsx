"use client"

import { useEffect, useState } from "react"
import DashboardShell from "@/components/dashboard/DashboardShell"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import Input from "@/components/ui/Input"
import { orgApi, userApi } from "@/services/api.services"
import type { Organization, User } from "@/services/api.types"

// PENDING API: PATCH /organizations/me - Backend not implemented yet. Static handler. Will be mapped to real API when implemented.
// PENDING API: PATCH /organizations/members/{user_id} - Backend not implemented yet. Static handler. Will be mapped to real API when implemented.

export default function SettingsPage() {
  const [org, setOrg] = useState<Organization | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        const [orgRes, userRes] = await Promise.all([orgApi.getMe(), userApi.getMe()])
        if (orgRes?.data?.data) setOrg(orgRes.data.data)
        if (userRes?.data?.data) {
          setUser(userRes.data.data)
          setFirstName(userRes.data.data.first_name)
          setLastName(userRes.data.data.last_name)
        }
      } catch {
        /* silent fail */
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // PENDING API: PATCH /organizations/me - Backend not implemented yet. Static handler. Will be mapped to real API when implemented.
  const handleSave = async () => {
    setSaveMessage("")
    setSaving(true)
    try {
      // PENDING API: PATCH /organizations/me - Backend not implemented yet. Static handler. Will be mapped to real API when implemented.
      await new Promise((resolve) => setTimeout(resolve, 500))
      setSaveMessage("Profile updated (static handler — awaiting backend)")
    } catch {
      setSaveMessage("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <span className="font-dm text-white/60 text-sm tracking-widest uppercase">Loading...</span>
      </div>
    )
  }

  return (
    <DashboardShell title="Settings" showDock={false}>
      <div className="max-w-lg space-y-8">
        <Card title="Organization" subtitle={org?.slug ? `@${org.slug}` : undefined}>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-white/40 font-dm text-xs uppercase tracking-widest mb-1">Name</p>
              <p className="font-dm text-white/70">{org?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-white/40 font-dm text-xs uppercase tracking-widest mb-1">ID</p>
              <p className="font-dm text-white/70 break-all">{org?.id ?? "—"}</p>
            </div>
          </div>
        </Card>

        <Card title="Profile" subtitle="Update your personal information">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                value={firstName}
                onChange={setFirstName}
                placeholder="Jane"
              />
              <Input label="Last name" value={lastName} onChange={setLastName} placeholder="Doe" />
            </div>
            {user && (
              <div>
                <p className="text-white/40 font-dm text-xs uppercase tracking-widest mb-1">
                  Email
                </p>
                <p className="font-dm text-white/70">{user.email}</p>
              </div>
            )}
            {saveMessage && (
              <p
                className={`text-sm font-dm ${saveMessage.includes("updated") ? "text-[var(--color-accent2)]" : "text-[var(--color-red)]"}`}
              >
                {saveMessage}
              </p>
            )}
            <Button onClick={handleSave} disabled={saving} size="sm">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Card>

        <Card title="API Keys" subtitle="Manage your organization's API keys">
          <div className="text-center py-6">
            <p className="text-white/30 font-dm text-sm">
              Go to{" "}
              <a
                href="/dashboard/tenants"
                className="text-brand hover:text-brand-dark transition-colors"
              >
                Tenants
              </a>{" "}
              to manage API keys
            </p>
          </div>
        </Card>
      </div>
    </DashboardShell>
  )
}
