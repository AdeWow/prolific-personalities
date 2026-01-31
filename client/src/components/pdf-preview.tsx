import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, FileText, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

interface PDFPreviewProps {
  src: string;
  title: string;
  downloadFilename?: string;
  height?: string;
  showDownloadButton?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  authToken?: string;
}

export function PDFPreview({ 
  src, 
  title, 
  downloadFilename,
  height = "600px",
  showDownloadButton = true,
  collapsible = false,
  defaultExpanded = true,
  authToken
}: PDFPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!authToken) {
      setBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }

    let isMounted = true;
    let createdUrl: string | null = null;
    setIsLoading(true);
    setHasError(false);

    const fetchPdf = async () => {
      try {
        const headers: Record<string, string> = {};
        if (authToken) {
          headers["Authorization"] = `Bearer ${authToken}`;
        }
        const res = await fetch(src, { headers });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch PDF: ${res.status}`);
        }
        
        const blob = await res.blob();
        if (isMounted) {
          createdUrl = URL.createObjectURL(blob);
          setBlobUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return createdUrl;
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching PDF:", error);
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    fetchPdf();

    return () => {
      isMounted = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [src, authToken]);

  const handleOpenInNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank');
    }
  };

  const handleDownload = () => {
    if (blobUrl) {
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = downloadFilename || title.replace(/\s+/g, '-') + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
            {showDownloadButton && blobUrl && (
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
            {blobUrl && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleOpenInNewTab}
                data-testid="button-pdf-fullscreen"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Full Screen
              </Button>
            )}
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800 border-t">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading PDF...</p>
            </div>
          ) : hasError || !blobUrl ? (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800 border-t">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
                {!authToken 
                  ? "Please log in to view the PDF." 
                  : "Unable to preview PDF. Please try refreshing the page."}
              </p>
            </div>
          ) : (
            <div className="border-t">
              <iframe
                src={`${blobUrl}#toolbar=1&navpanes=1&scrollbar=1`}
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
