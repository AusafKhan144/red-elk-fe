import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAdminUserSessions } from "../../../hooks/useAdmin";
import SubscriptionBadge from "../../../components/SubscriptionBadge";
import StatusChip from "../../../components/StatusChip";
import PageWrapper from "../../../components/common/PageWrapper";

export default function AdminUserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const { data: sessions, isLoading } = useAdminUserSessions(userId!);

  return (
    <PageWrapper>
      <div className="re-fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <Link
            to="/admin/users"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)", transition: "color .15s var(--ease)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            <ArrowLeft size={15} /> Back to users
          </Link>
          {userId && (
            <span
              className="re-chip"
              style={{ color: "var(--faint)", background: "var(--surface-inset)", borderColor: "var(--border)", fontFamily: "var(--font-mono)" }}
            >
              {userId}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div
              className="w-8 h-8 border-4 rounded-full animate-spin"
              style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
            />
          </div>
        ) : !sessions || sessions.length === 0 ? (
          <div
            className="re-card"
            style={{ padding: 40, textAlign: "center", borderStyle: "dashed", borderColor: "var(--border-strong)" }}
          >
            <p style={{ fontSize: 13, color: "var(--faint)", margin: 0 }}>No sessions found for this user.</p>
          </div>
        ) : (
          <div className="re-card" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", fontSize: 13.5, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                    {["Assessment ID", "Tier", "Started", "Status", ""].map((h, i) => (
                      <th key={i} className="re-eyebrow" style={{ padding: "12px 20px", textAlign: "left" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr
                      key={s.id}
                      style={{ borderTop: "1px solid var(--border)", transition: "background .15s var(--ease)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 20px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--faint)" }}>
                        {s.assessment_id.slice(0, 8)}…
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        {s.tier_at_time ? <SubscriptionBadge tier={s.tier_at_time} /> : <span style={{ color: "var(--faint)" }}>—</span>}
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 12, color: "var(--muted)" }}>
                        {new Date(s.started_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <StatusChip status={s.status} />
                      </td>
                      <td style={{ padding: "14px 20px", textAlign: "right" }}>
                        {s.status === "completed" && (
                          <Link
                            to={`/sessions/${s.id}/report`}
                            style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "var(--accent)" }}
                          >
                            View report <ArrowRight size={12} />
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
