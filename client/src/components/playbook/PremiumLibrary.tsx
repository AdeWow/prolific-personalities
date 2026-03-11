import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PDFPreview } from "@/components/pdf-preview";
import { FadeIn } from "@/components/fade-in";
import { Download, Lock, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { getLibrary, getPdfUrl, type PdfItem, type PdfCategory } from "@shared/premiumLibrary";
import { trackEvent } from "@/lib/analytics";

const categoryColors: Record<PdfCategory, string> = {
  Framework: "bg-blue-100 text-blue-700 border-blue-200",
  Tools: "bg-purple-100 text-purple-700 border-purple-200",
  "30-Day Plan": "bg-green-100 text-green-700 border-green-200",
  "Failure Modes": "bg-orange-100 text-orange-700 border-orange-200",
  "Case Studies": "bg-amber-100 text-amber-700 border-amber-200",
  Research: "bg-indigo-100 text-indigo-700 border-indigo-200",
  Templates: "bg-pink-100 text-pink-700 border-pink-200",
  Strategy: "bg-teal-100 text-teal-700 border-teal-200",
};

interface PremiumLibraryProps {
  archetype: string;
  playbookTitle: string;
  authToken?: string;
  hasPremiumAccess: boolean;
}

function PdfCard({ item, hasPremiumAccess, delay }: { item: PdfItem; hasPremiumAccess: boolean; delay: number }) {
  const url = getPdfUrl(item.filename);
  const colorClass = categoryColors[item.category] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <FadeIn delay={delay} distance={12}>
      <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex flex-col flex-1 gap-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm leading-snug flex-1">{item.title}</h4>
            <Badge variant="outline" className={`shrink-0 text-[10px] px-2 py-0.5 ${colorClass}`}>
              {item.category}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed flex-1">
            {item.description}
          </p>
          {hasPremiumAccess ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 hover:text-teal-900 transition-colors mt-auto"
              onClick={() => trackEvent('pdf_downloaded', 'Engagement', item.title, undefined, {
                category: item.category,
                filename: item.filename,
              })}
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>
          ) : (
            <Link href="/pricing">
              <Button
                variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-auto"
                onClick={() => trackEvent('premium_clicked', 'Conversion', item.title, undefined, {
                  source: 'library_tab',
                })}
              >
                <Lock className="h-3.5 w-3.5" />
                Purchase to unlock
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}

function TemplateCard({ item, hasPremiumAccess, delay }: { item: PdfItem; hasPremiumAccess: boolean; delay: number }) {
  const url = getPdfUrl(item.filename);

  return (
    <FadeIn delay={delay} distance={12}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 flex flex-col gap-2">
          <h4 className="font-semibold text-xs leading-snug">{item.title}</h4>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {item.description}
          </p>
          {hasPremiumAccess ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-teal-700 hover:text-teal-900 transition-colors"
              onClick={() => trackEvent('pdf_downloaded', 'Engagement', item.title, undefined, {
                category: 'Templates',
                filename: item.filename,
              })}
            >
              <Download className="h-3 w-3" />
              Download
            </a>
          ) : (
            <Link href="/pricing">
              <Button variant="outline" size="sm" className="w-full text-[11px] gap-1 h-7">
                <Lock className="h-3 w-3" />
                Unlock
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}

export function PremiumLibrary({ archetype, playbookTitle, authToken, hasPremiumAccess }: PremiumLibraryProps) {
  const library = getLibrary(archetype);

  if (!library) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No library content found for this archetype.
        </CardContent>
      </Card>
    );
  }

  const hasTemplates = library.templates.length > 0;

  return (
    <div className="space-y-10">
      {/* Section 1: Core Playbook */}
      <section>
        <FadeIn>
          <h3 className="text-lg font-bold mb-1">Core Playbook</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Your complete personalized productivity guide
          </p>
        </FadeIn>
        <PDFPreview
          src={`/api/playbook/${archetype}/pdf`}
          title={playbookTitle}
          downloadFilename={`${playbookTitle}.pdf`}
          height="500px"
          showDownloadButton={true}
          collapsible={false}
          authToken={authToken}
        />
      </section>

      {/* Section 2: Deep Dives */}
      <section>
        <FadeIn>
          <h3 className="text-lg font-bold mb-1">Deep Dives</h3>
          <p className="text-sm text-muted-foreground mb-5">
            Go deeper into each framework and strategy
          </p>
        </FadeIn>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {library.deepDives.map((item, i) => (
            <PdfCard
              key={item.filename}
              item={item}
              hasPremiumAccess={hasPremiumAccess}
              delay={Math.min(i * 50, 250)}
            />
          ))}
        </div>
      </section>

      {/* Section 3: Templates (only for archetypes that have them) */}
      {hasTemplates && (
        <section>
          <FadeIn>
            <h3 className="text-lg font-bold mb-1">Printable Templates</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Download, print, and use these worksheets
            </p>
          </FadeIn>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
            {library.templates.map((item, i) => (
              <TemplateCard
                key={item.filename}
                item={item}
                hasPremiumAccess={hasPremiumAccess}
                delay={Math.min(i * 50, 200)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Section 4: Download All note */}
      <FadeIn>
        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              All Deep Dives and Templates are included with your purchase. Download as many as you need.
            </p>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
