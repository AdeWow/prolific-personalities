import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, FileText, ChevronDown, ChevronUp } from "lucide-react";

interface PDFPreviewProps {
  src: string;
  title: string;
  downloadFilename?: string;
  height?: string;
  showDownloadButton?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export function PDFPreview({ 
  src, 
  title, 
  downloadFilename,
  height = "600px",
  showDownloadButton = true,
  collapsible = false,
  defaultExpanded = true
}: PDFPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [hasError, setHasError] = useState(false);

  const handleOpenInNewTab = () => {
    window.open(src, '_blank');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = downloadFilename || title.replace(/\s+/g, '-') + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">PDF Document</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showDownloadButton && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                data-testid="button-pdf-download"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleOpenInNewTab}
              data-testid="button-pdf-fullscreen"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Full Screen
            </Button>
            {collapsible && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsExpanded(!isExpanded)}
                data-testid="button-pdf-toggle"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      {(!collapsible || isExpanded) && (
        <CardContent className="p-0">
          {hasError ? (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800 border-t">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
                Unable to preview PDF in browser. Click below to view or download.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleOpenInNewTab} data-testid="button-pdf-open">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open PDF
                </Button>
                {showDownloadButton && (
                  <Button variant="outline" onClick={handleDownload} data-testid="button-pdf-download-fallback">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="border-t">
              <iframe
                src={`${src}#toolbar=1&navpanes=1&scrollbar=1`}
                className="w-full"
                style={{ height }}
                title={title}
                onError={() => setHasError(true)}
                data-testid="pdf-iframe"
              />
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
