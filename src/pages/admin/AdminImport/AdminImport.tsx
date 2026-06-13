import { useState, useRef, DragEvent } from "react";
import { Upload, FileSpreadsheet, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "../../../components/common/PageWrapper";
import { useImportAssessment } from "../../../hooks/useAdmin";

export default function AdminImport() {
  const { mutateAsync: importFile, isPending } = useImportAssessment();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    setResult(null);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function handleImport() {
    if (!file) return;
    try {
      const data = await importFile(file);
      const msg = data?.message ?? "Assessment imported successfully!";
      setResult({ success: true, message: msg });
      toast.success(msg);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Import failed. Please check the file format.";
      setResult({ success: false, message: msg });
      toast.error(msg);
    }
  }

  const successColor = "var(--t-leading)";

  return (
    <PageWrapper>
      <div className="re-fade-in" style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 640 }}>
        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: "2px dashed " + (isDragging ? "var(--accent)" : "var(--border-strong)"),
            borderRadius: "var(--radius-lg)",
            padding: 48,
            textAlign: "center",
            cursor: "pointer",
            background: isDragging ? "var(--accent-soft)" : "var(--surface)",
            transition: "all .15s var(--ease)",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {file ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <FileSpreadsheet size={40} style={{ color: "var(--accent)" }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{file.name}</p>
              <p style={{ fontSize: 12, color: "var(--faint)" }}>{(file.size / 1024).toFixed(1)} KB</p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }}
                style={{ fontSize: 12, color: "var(--faint)", background: "transparent", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--faint)")}
              >
                Remove
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <Upload size={40} style={{ color: "var(--faint)" }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--muted)" }}>Drag &amp; drop your XLSX file here</p>
              <p style={{ fontSize: 12, color: "var(--faint)" }}>or click to browse</p>
            </div>
          )}
        </div>

        {/* Result banner */}
        {result && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: 16,
              borderRadius: "var(--radius)",
              background: `color-mix(in srgb, ${result.success ? successColor : "var(--accent)"} 8%, var(--surface))`,
              border: `1px solid color-mix(in srgb, ${result.success ? successColor : "var(--accent)"} 22%, transparent)`,
              color: result.success ? successColor : "var(--accent)",
            }}
          >
            {result.success ? (
              <CheckCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            ) : (
              <XCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            )}
            <p style={{ fontSize: 13.5, margin: 0 }}>{result.message}</p>
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={!file || isPending}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "14px 0",
            background: "var(--accent)",
            color: "var(--accent-ink)",
            fontWeight: 700,
            fontSize: 14,
            border: "none",
            borderRadius: "var(--radius-lg)",
            cursor: !file || isPending ? "not-allowed" : "pointer",
            opacity: !file || isPending ? 0.5 : 1,
            transition: "background .18s var(--ease)",
          }}
        >
          <Upload size={18} />
          {isPending ? "Importing…" : "Import Assessment"}
        </button>
      </div>
    </PageWrapper>
  );
}
