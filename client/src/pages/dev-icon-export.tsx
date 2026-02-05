import { Sparkles, Target, Brain, Zap, Compass, Lightbulb, Shuffle } from "lucide-react";

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

export default function DevIconExport() {
  return (
    <div className="min-h-screen bg-white p-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Archetype Icon Export</h1>
      <p className="text-gray-600 mb-8">Right-click and "Save image as..." to download each icon as PNG (256x256px)</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
        {archetypeIcons.map((archetype) => {
          const Icon = archetype.icon;
          return (
            <div key={archetype.slug} className="flex flex-col items-center">
              <div 
                className={`w-64 h-64 flex items-center justify-center bg-gradient-to-br ${archetype.gradient} rounded-3xl shadow-lg`}
                style={{ width: '256px', height: '256px' }}
              >
                <Icon className="w-32 h-32 text-white" strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-lg font-semibold text-gray-800 text-center">
                {archetype.name}
              </p>
              <p className="text-sm text-gray-500">{archetype.slug}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
