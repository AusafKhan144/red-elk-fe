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

  return (
    <PageWrapper>
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Import Assessment</h1>
        <p className="text-sm text-gray-500 mt-0.5">Upload an XLSX file to create or update an assessment.</p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-elk-red bg-red-50"
            : "border-gray-200 hover:border-elk-rose hover:bg-gray-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {file ? (
          <div className="flex flex-col items-center gap-3">
            <FileSpreadsheet size={40} className="text-elk-red" />
            <p className="text-sm font-semibold text-gray-800">{file.name}</p>
            <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }}
              className="text-xs text-gray-400 hover:text-elk-red transition-colors"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload size={40} className="text-gray-300" />
            <p className="text-sm font-semibold text-gray-600">
              Drag &amp; drop your XLSX file here
            </p>
            <p className="text-xs text-gray-400">or click to browse</p>
          </div>
        )}
      </div>

      {/* Result banner */}
      {result && (
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${
          result.success
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          {result.success ? <CheckCircle size={18} className="shrink-0 mt-0.5" /> : <XCircle size={18} className="shrink-0 mt-0.5" />}
          <p className="text-sm">{result.message}</p>
        </div>
      )}

      <button
        onClick={handleImport}
        disabled={!file || isPending}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-elk-red hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-colors"
      >
        <Upload size={18} />
        {isPending ? "Importing…" : "Import Assessment"}
      </button>
    </div>
    </PageWrapper>
  );
}
