import { useRef } from "react";
import { Sparkles, Target, Brain, Zap, Compass, Lightbulb, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";

const archetypeIcons = [
  {
    slug: 'chaotic-creative',
    name: 'Chaotic Creative',
    icon: Sparkles,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    slug: 'anxious-perfectionist',
    name: 'Anxious Perfectionist',
    icon: Target,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    slug: 'structured-achiever',
    name: 'Structured Achiever',
    icon: Brain,
    gradient: 'from-teal-500 to-emerald-500',
  },
  {
    slug: 'novelty-seeker',
    name: 'Novelty Seeker',
    icon: Zap,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    slug: 'strategic-planner',
    name: 'Strategic Planner',
    icon: Compass,
    gradient: 'from-green-500 to-teal-500',
  },
  {
    slug: 'flexible-improviser',
    name: 'Flexible Improviser',
    icon: Lightbulb,
    gradient: 'from-yellow-500 to-amber-500',
  },
  {
    slug: 'adaptive-generalist',
    name: 'Adaptive Generalist',
    icon: Shuffle,
    gradient: 'from-indigo-500 to-purple-500',
  },
];

function IconCard({ archetype, index }: { archetype: typeof archetypeIcons[0], index: number }) {
  const iconRef = useRef<HTMLDivElement>(null);
  const Icon = archetype.icon;

  const downloadIcon = async () => {
    if (!iconRef.current) return;
    
    const canvas = await html2canvas(iconRef.current, {
      backgroundColor: null,
      scale: 2,
      width: 256,
      height: 256,
    });
    
    const link = document.createElement('a');
    link.download = `${archetype.slug}-icon.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        ref={iconRef}
        className={`flex items-center justify-center bg-gradient-to-br ${archetype.gradient} rounded-3xl`}
        style={{ width: '256px', height: '256px' }}
      >
        <Icon className="w-32 h-32 text-white" strokeWidth={1.5} />
      </div>
      <p className="text-lg font-semibold text-gray-800 text-center">
        {archetype.name}
      </p>
      <Button onClick={downloadIcon} variant="outline" size="sm">
        Download PNG
      </Button>
    </div>
  );
}

export default function DevIconExport() {
  const downloadAll = async () => {
    const icons = document.querySelectorAll('[data-icon-container]');
    for (let i = 0; i < icons.length; i++) {
      const icon = icons[i] as HTMLElement;
      const canvas = await html2canvas(icon, {
        backgroundColor: null,
        scale: 2,
        width: 256,
        height: 256,
      });
      
      const link = document.createElement('a');
      link.download = `${archetypeIcons[i].slug}-icon.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      await new Promise(r => setTimeout(r, 500));
    }
  };

  return (
    <div className="min-h-screen bg-white p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Archetype Icon Export</h1>
        <p className="text-gray-600 mb-4">Click "Download PNG" to save each icon as a 256x256px PNG file</p>
        <Button onClick={downloadAll} className="mb-8">
          Download All Icons
        </Button>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {archetypeIcons.map((archetype, index) => (
            <IconCard key={archetype.slug} archetype={archetype} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
