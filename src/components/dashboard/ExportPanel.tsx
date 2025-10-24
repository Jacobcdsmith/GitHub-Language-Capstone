import { Download, FileText, Presentation } from "lucide-react";
import { useState } from "react";

interface ExportPanelProps {
  selectedLanguages?: string[];
}

export default function ExportPanel({ selectedLanguages = [] }: ExportPanelProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'pptx' | 'report') => {
    setExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, this would generate the file
    const filename = `github-language-analysis-${Date.now()}.${format === 'pptx' ? 'pptx' : 'pdf'}`;
    
    // Create a mock download
    const link = document.createElement('a');
    link.href = '#';
    link.download = filename;
    
    alert(`Export functionality would generate: ${filename}\n\nThis would include:\n- Selected languages: ${selectedLanguages.length > 0 ? selectedLanguages.join(', ') : 'All languages'}\n- Current dashboard state\n- All visualizations and insights`);
    
    setExporting(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-[#161b22] border-2 border-[#30363d] rounded-lg shadow-2xl p-4 min-w-[280px]">
        <div className="flex items-center gap-2 mb-3">
          <Download className="w-5 h-5 text-[#58a6ff]" />
          <h3 className="font-bold text-white">Export Options</h3>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={() => handleExport('pdf')}
            disabled={exporting}
            className="w-full flex items-center gap-3 p-3 bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] rounded transition-colors disabled:opacity-50"
          >
            <FileText className="w-5 h-5 text-[#f0883e]" />
            <div className="text-left flex-1">
              <div className="text-sm font-semibold text-white">PDF Report</div>
              <div className="text-xs text-[#8b949e]">Detailed analysis document</div>
            </div>
          </button>

          <button
            onClick={() => handleExport('pptx')}
            disabled={exporting}
            className="w-full flex items-center gap-3 p-3 bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] rounded transition-colors disabled:opacity-50"
          >
            <Presentation className="w-5 h-5 text-[#3fb950]" />
            <div className="text-left flex-1">
              <div className="text-sm font-semibold text-white">PowerPoint</div>
              <div className="text-xs text-[#8b949e]">Presentation slides</div>
            </div>
          </button>

          <button
            onClick={() => handleExport('report')}
            disabled={exporting}
            className="w-full flex items-center gap-3 p-3 bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] rounded transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5 text-[#58a6ff]" />
            <div className="text-left flex-1">
              <div className="text-sm font-semibold text-white">Custom Report</div>
              <div className="text-xs text-[#8b949e]">Based on selections</div>
            </div>
          </button>
        </div>

        {selectedLanguages.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#30363d]">
            <div className="text-xs text-[#8b949e]">
              Including {selectedLanguages.length} selected language{selectedLanguages.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}

        {exporting && (
          <div className="mt-3 pt-3 border-t border-[#30363d]">
            <div className="flex items-center gap-2 text-xs text-[#58a6ff]">
              <div className="animate-spin w-3 h-3 border-2 border-[#58a6ff] border-t-transparent rounded-full" />
              <span>Generating export...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

