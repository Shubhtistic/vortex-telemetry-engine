"use client"

import { useEffect, useState } from "react"
import DashboardShell from "@/components/dashboard/DashboardShell"
import Badge from "@/components/ui/Badge"
import Card from "@/components/ui/Card"
import StatCard from "@/components/ui/StatCard"
import { orgApi, tenantApi } from "@/services/api.services"
import type { Organization, OrgMember, Tenant } from "@/services/api.types"

export default function DashboardPage() {
  const [org, setOrg] = useState<Organization | null>(null)
  const [members, setMembers] = useState<OrgMember[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [orgRes, membersRes, tenantsRes] = await Promise.all([
          orgApi.getMe(),
          orgApi.getMembers({ limit: 50 }),
          tenantApi.list({ limit: 50 }),
        ])
        if (orgRes?.data?.data) setOrg(orgRes.data.data)
        if (membersRes?.data?.data) setMembers(membersRes.data.data)
        if (tenantsRes?.data?.data) setTenants(tenantsRes.data.data)
      } catch (err) {
        const msg =
          err instanceof Error && "frontendMessage" in err
            ? (err as { frontendMessage: string }).frontendMessage
            : String(err)
        console.error("[dashboard] loadData failed:", msg)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <span className="font-dm text-white/60 text-sm tracking-widest uppercase">Loading...</span>
      </div>
    )
  }

  return (
    <DashboardShell
      title="Overview"
      subtitle={`Welcome back to ${org?.name ?? "your organization"}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard label="Members" value={members.length} />
        <StatCard label="Tenants" value={tenants.length} />
        <StatCard label="Status" value="Active" />
        <StatCard label="Org" value={org?.slug ?? "—"} />
      </div>

      <Card
        className="mb-12"
        title={org?.name ?? "Organization"}
        subtitle={org?.slug ? `@${org.slug}` : undefined}
      >
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-white/40 font-dm text-xs uppercase tracking-widest mb-1">
              Organization ID
            </p>
            <p className="font-dm text-white/70">{org?.id ?? "—"}</p>
          </div>
          <div>
            <p className="text-white/40 font-dm text-xs uppercase tracking-widest mb-1">Created</p>
            <p className="font-dm text-white/70">
              {org?.created_at ? new Date(org.created_at).toLocaleDateString() : "—"}
            </p>
          </div>
          <div>
            <p className="text-white/40 font-dm text-xs uppercase tracking-widest mb-1">Members</p>
            <p className="font-dm text-white/70">{members.length}</p>
          </div>
          <div>
            <p className="text-white/40 font-dm text-xs uppercase tracking-widest mb-1">Tenants</p>
            <p className="font-dm text-white/70">{tenants.length}</p>
          </div>
        </div>
      </Card>

      <Card
        title="Members"
        subtitle={`${members.length} total`}
        action={
          <a
            href="/dashboard/members"
            className="text-xs text-brand hover:text-brand-dark font-dm transition-colors"
          >
            View all →
          </a>
        }
        className="mb-8"
      >
        {members.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/30 font-dm text-sm">No members yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.slice(0, 5).map((member) => (
              <div
                key={member.user_id}
                className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
                    <span className="text-xs font-syne font-bold text-brand">
                      {member.first_name?.[0]}
                      {member.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-white font-dm">
                      {member.first_name} {member.last_name}
                    </p>
                    <p className="text-xs text-white/40 font-dm">{member.email}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    member.role === "owner"
                      ? "warning"
                      : member.role === "admin"
                        ? "info"
                        : "default"
                  }
                >
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card
        title="Tenants"
        subtitle={`${tenants.length} total`}
        action={
          <a
            href="/dashboard/tenants"
            className="text-xs text-brand hover:text-brand-dark font-dm transition-colors"
          >
            View all →
          </a>
        }
      >
        {tenants.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/30 font-dm text-sm">No tenants yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tenants.slice(0, 5).map((tenant) => (
              <div
                key={tenant.id}
                className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0"
              >
                <div>
                  <p className="text-sm text-white font-dm">{tenant.tenant_name}</p>
                  <p className="text-xs text-white/40 font-dm">{tenant.slug}</p>
                </div>
                <Badge
                  variant={
                    tenant.status === "active"
                      ? "success"
                      : tenant.status === "suspended"
                        ? "warning"
                        : "default"
                  }
                >
                  {tenant.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardShell>
  )
}
