import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { toast } from "sonner";
import { useAdminSessions, exportAdminSessions } from "../../../hooks/useAdmin";
import SubscriptionBadge from "../../../components/SubscriptionBadge";
import StatusChip from "../../../components/StatusChip";
import PageWrapper from "../../../components/common/PageWrapper";

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

export default function AdminSessions() {
  const [page, setPage] = useState(0);
  const { data: sessions, isLoading } = useAdminSessions(page);
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      await exportAdminSessions();
    } catch {
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  const filtered = sessions?.filter((s) =>
    s.user_id?.toLowerCase().includes(search.toLowerCase()) ||
    s.assessment_id?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const hasPrev = page > 0;
  const hasNext = sessions?.length === 50;

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
              placeholder="Search by user or assessment ID…"
              style={{
                width: 260,
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
                    {["User ID", "Assessment ID", "Tier", "Started", "Status"].map((h) => (
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
                        No sessions found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s) => (
                      <tr
                        key={s.id}
                        style={{ borderTop: "1px solid var(--border)", transition: "background .15s var(--ease)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "14px 20px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--faint)" }}>
                          {s.user_id.slice(0, 8)}…
                        </td>
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
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 12, color: "var(--faint)", fontFamily: "var(--font-mono)" }}>Page {page + 1}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!hasPrev}
                  style={{ ...softButton, padding: "6px 12px", fontSize: 12, opacity: hasPrev ? 1 : 0.4, cursor: hasPrev ? "pointer" : "not-allowed" }}
                >
                  <ChevronLeft size={13} /> Prev
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext}
                  style={{ ...softButton, padding: "6px 12px", fontSize: 12, opacity: hasNext ? 1 : 0.4, cursor: hasNext ? "pointer" : "not-allowed" }}
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
