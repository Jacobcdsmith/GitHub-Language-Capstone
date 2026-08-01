import type { ReactNode } from "react";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { useAnalysisDataStatus } from "@/contexts/AnalysisDataContext";

export default function LiveDataGate({ children }: { children: ReactNode }) {
  const { status, error, retry } = useAnalysisDataStatus();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-4 text-center px-6">
          <Loader2 className="w-10 h-10 text-[#58a6ff] animate-spin" />
          <div className="text-lg font-semibold text-[var(--text-primary)]">Loading live data&hellip;</div>
          <p className="text-sm text-[var(--text-secondary)] max-w-sm">
            Fetching the latest repository scores directly from the live pipeline.
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-4 text-center px-6 max-w-md">
          <div className="p-3 bg-[#f85149]/10 rounded-full">
            <AlertTriangle className="w-8 h-8 text-[#f85149]" />
          </div>
          <div className="text-lg font-semibold text-[var(--text-primary)]">Live data unavailable</div>
          <p className="text-sm text-[var(--text-secondary)]">
            {error ?? "The live data pipeline could not be reached."} This dashboard only shows live data — there is no
            static fallback — so nothing else can be displayed until this is resolved.
          </p>
          <button
            onClick={retry}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#58a6ff] hover:bg-[#4a9aef] text-white font-semibold rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
