import { useState } from "react";
import { Search, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import PageWrapper from "../../../components/common/PageWrapper";
import SubscriptionBadge from "../../../components/SubscriptionBadge";
import {
  useAdminUsers,
  useUpdateUserRole,
  useUpdateUserTier,
  exportAdminUsers,
} from "../../../hooks/useAdmin";
import type { AdminUser, SubscriptionTier } from "../../../types/api";

type ConfirmModal =
  | { user: AdminUser; type: "role"; newRole: "user" | "admin" }
  | { user: AdminUser; type: "tier"; newTier: SubscriptionTier };

const softButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  padding: "8px 14px",
  borderRadius: "var(--radius)",
  background: "var(--surface-inset)",
  border: "1px solid var(--border)",
  color: "var(--ink)",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
  transition: "all .15s var(--ease)",
};

const selectStyle: React.CSSProperties = {
  fontSize: 12,
  border: "1px solid var(--border-strong)",
  borderRadius: 8,
  padding: "5px 8px",
  background: "var(--surface)",
  color: "var(--ink)",
  cursor: "pointer",
  outline: "none",
  fontFamily: "var(--font-ui)",
};

export default function AdminUsers() {
  const { data: users, isLoading } = useAdminUsers();
  const { mutateAsync: updateRole, isPending: updatingRole } = useUpdateUserRole();
  const { mutateAsync: updateTier, isPending: updatingTier } = useUpdateUserTier();
  const [search, setSearch] = useState("");
  const [confirmModal, setConfirmModal] = useState<ConfirmModal | null>(null);
  const [exporting, setExporting] = useState(false);

  const updating = updatingRole || updatingTier;

  const filtered =
    users?.filter(
      (u) =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.company?.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  async function confirmAction() {
    if (!confirmModal) return;
    try {
      if (confirmModal.type === "role") {
        await updateRole({ id: confirmModal.user.id, role: confirmModal.newRole });
        toast.success(`${confirmModal.user.email} is now ${confirmModal.newRole}`);
      } else {
        await updateTier({ id: confirmModal.user.id, tier: confirmModal.newTier });
        toast.success(`${confirmModal.user.email} tier set to ${confirmModal.newTier}`);
      }
    } catch {
      toast.error("Failed to update. Please try again.");
    } finally {
      setConfirmModal(null);
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      await exportAdminUsers();
    } catch {
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <PageWrapper>
      <div className="re-fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
          <button onClick={handleExport} disabled={exporting} style={{ ...softButton, opacity: exporting ? 0.5 : 1 }}>
            <Download size={14} />
            {exporting ? "Exporting…" : "Export CSV"}
          </button>
          <div style={{ position: "relative" }}>
            <Search
              size={15}
              style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--faint)" }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users…"
              style={{
                width: 224,
                padding: "8px 12px 8px 32px",
                fontSize: 13,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                color: "var(--ink)",
                outline: "none",
                fontFamily: "var(--font-ui)",
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div
              className="w-8 h-8 border-4 rounded-full animate-spin"
              style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
            />
          </div>
        ) : (
          <div className="re-card" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", fontSize: 13.5, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                    {["Email", "Company", "Tier", "Joined", "Role"].map((h) => (
                      <th key={h} className="re-eyebrow" style={{ padding: "12px 20px", textAlign: "left" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "40px 20px", textAlign: "center", fontSize: 13, color: "var(--faint)" }}>
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((u) => (
                      <tr
                        key={u.id}
                        style={{ borderTop: "1px solid var(--border)", transition: "background .15s var(--ease)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "14px 20px", fontWeight: 500 }}>
                          <Link
                            to={`/admin/users/${u.id}`}
                            style={{ color: "var(--ink)", transition: "color .15s var(--ease)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink)")}
                          >
                            {u.email}
                          </Link>
                        </td>
                        <td style={{ padding: "14px 20px", color: "var(--muted)" }}>{u.company ?? "—"}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {u.tier ? <SubscriptionBadge tier={u.tier} /> : <span style={{ color: "var(--faint)" }}>—</span>}
                            <select
                              value={u.tier ?? "free"}
                              disabled={updating}
                              onChange={(e) =>
                                setConfirmModal({ user: u, type: "tier", newTier: e.target.value as SubscriptionTier })
                              }
                              style={selectStyle}
                            >
                              <option value="free">Free</option>
                              <option value="basic">Basic</option>
                              <option value="premium">Premium</option>
                            </select>
                          </div>
                        </td>
                        <td style={{ padding: "14px 20px", fontSize: 12, color: "var(--faint)", fontFamily: "var(--font-mono)" }}>
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <select
                            value={u.role}
                            disabled={updating}
                            onChange={(e) =>
                              setConfirmModal({ user: u, type: "role", newRole: e.target.value as "user" | "admin" })
                            }
                            style={selectStyle}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Confirm modal */}
        {confirmModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(33,28,22,.55)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
            }}
          >
            <div className="re-card" style={{ padding: 28, maxWidth: 360, width: "100%", margin: "0 16px" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>
                Confirm {confirmModal.type === "role" ? "role" : "tier"} change
              </h3>
              <p style={{ fontSize: 13.5, color: "var(--muted)", marginBottom: 24, lineHeight: 1.5 }}>
                Change <strong style={{ color: "var(--ink)" }}>{confirmModal.user.email}</strong> to{" "}
                <strong style={{ color: "var(--ink)" }}>
                  {confirmModal.type === "role" ? confirmModal.newRole : confirmModal.newTier}
                </strong>
                ?
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button
                  onClick={() => setConfirmModal(null)}
                  style={{
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--muted)",
                    background: "var(--surface)",
                    border: "1px solid var(--border-strong)",
                    borderRadius: "var(--radius)",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  disabled={updating}
                  style={{
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--accent-ink)",
                    background: "var(--accent)",
                    border: "none",
                    borderRadius: "var(--radius)",
                    cursor: updating ? "not-allowed" : "pointer",
                    opacity: updating ? 0.6 : 1,
                  }}
                >
                  {updating ? "Updating…" : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
