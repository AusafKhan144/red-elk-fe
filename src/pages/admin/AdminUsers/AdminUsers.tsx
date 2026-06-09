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
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-2xl font-extrabold text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Users
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage user roles and access levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-all"
          >
            <Download size={14} />
            {exporting ? "Exporting…" : "Export CSV"}
          </button>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users…"
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-elk-rose w-56"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-elk-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Email", "Company", "Tier", "Joined", "Role"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-gray-800 font-medium">
                      <Link
                        to={`/admin/users/${u.id}`}
                        className="hover:text-elk-red transition-colors"
                      >
                        {u.email}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{u.company ?? "—"}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {u.tier ? <SubscriptionBadge tier={u.tier} /> : <span className="text-gray-400">—</span>}
                        <select
                          value={u.tier ?? "free"}
                          disabled={updating}
                          onChange={(e) =>
                            setConfirmModal({
                              user: u,
                              type: "tier",
                              newTier: e.target.value as SubscriptionTier,
                            })
                          }
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-elk-rose cursor-pointer text-gray-600"
                        >
                          <option value="free">Free</option>
                          <option value="basic">Basic</option>
                          <option value="premium">Premium</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={u.role}
                        disabled={updating}
                        onChange={(e) =>
                          setConfirmModal({
                            user: u,
                            type: "role",
                            newRole: e.target.value as "user" | "admin",
                          })
                        }
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-elk-rose cursor-pointer"
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
      )}

      {/* Confirm modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
            <h3 className="text-base font-bold text-gray-900 mb-2">
              Confirm {confirmModal.type === "role" ? "Role" : "Tier"} Change
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Change <strong>{confirmModal.user.email}</strong> to{" "}
              <strong>
                {confirmModal.type === "role" ? confirmModal.newRole : confirmModal.newTier}
              </strong>
              ?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={updating}
                className="px-4 py-2 text-sm font-semibold text-white rounded-xl disabled:opacity-60 transition-all"
                style={{ background: "linear-gradient(135deg, #C0392B 0%, #5b1013 100%)" }}
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
