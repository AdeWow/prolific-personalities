import { Sparkles, Target, Brain, Zap, Compass, Lightbulb, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ArchetypeSlug = 
  | 'chaotic-creative'
  | 'anxious-perfectionist'
  | 'structured-achiever'
  | 'novelty-seeker'
  | 'strategic-planner'
  | 'flexible-improviser'
  | 'adaptive-generalist';

interface ArchetypeIconConfig {
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  color: string;
}

const archetypeIconConfigs: Record<ArchetypeSlug, ArchetypeIconConfig> = {
  'chaotic-creative': {
    icon: Sparkles,
    gradient: 'from-purple-500 to-pink-500',
    color: 'text-purple-500',
  },
  'anxious-perfectionist': {
    icon: Target,
    gradient: 'from-blue-500 to-cyan-500',
    color: 'text-blue-500',
  },
  'structured-achiever': {
    icon: Brain,
    gradient: 'from-teal-500 to-emerald-500',
    color: 'text-teal-500',
  },
  'novelty-seeker': {
    icon: Zap,
    gradient: 'from-orange-500 to-red-500',
    color: 'text-orange-500',
  },
  'strategic-planner': {
    icon: Compass,
    gradient: 'from-green-500 to-teal-500',
    color: 'text-green-500',
  },
  'flexible-improviser': {
    icon: Lightbulb,
    gradient: 'from-yellow-500 to-amber-500',
    color: 'text-yellow-500',
  },
  'adaptive-generalist': {
    icon: Shuffle,
    gradient: 'from-indigo-500 to-purple-500',
    color: 'text-indigo-500',
  },
};

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<IconSize, { container: string; icon: string }> = {
  xs: { container: 'w-6 h-6 rounded-md', icon: 'h-3 w-3' },
  sm: { container: 'w-8 h-8 rounded-lg', icon: 'h-4 w-4' },
  md: { container: 'w-12 h-12 rounded-xl', icon: 'h-6 w-6' },
  lg: { container: 'w-16 h-16 rounded-2xl', icon: 'h-8 w-8' },
  xl: { container: 'w-20 h-20 rounded-2xl', icon: 'h-10 w-10' },
};

interface ArchetypeIconProps {
  archetype: ArchetypeSlug;
  size?: IconSize;
  className?: string;
  iconOnly?: boolean;
}

export function ArchetypeIcon({ 
  archetype, 
  size = 'md', 
  className,
  iconOnly = false 
}: ArchetypeIconProps) {
  const config = archetypeIconConfigs[archetype];
  
  if (!config) {
    return null;
  }

  const Icon = config.icon;
  const sizeConfig = sizeClasses[size];

  if (iconOnly) {
    return <Icon className={cn(sizeConfig.icon, config.color, className)} />;
  }

  return (
    <div 
      className={cn(
        'flex items-center justify-center bg-gradient-to-br',
        config.gradient,
        sizeConfig.container,
        className
      )}
    >
      <Icon className={cn(sizeConfig.icon, 'text-white')} />
    </div>
  );
}

export function getArchetypeIconConfig(archetype: ArchetypeSlug): ArchetypeIconConfig | undefined {
  return archetypeIconConfigs[archetype];
}

export function getArchetypeIcon(archetype: ArchetypeSlug): React.ComponentType<{ className?: string }> | undefined {
  return archetypeIconConfigs[archetype]?.icon;
}

export function getArchetypeGradient(archetype: ArchetypeSlug): string | undefined {
  return archetypeIconConfigs[archetype]?.gradient;
}

export function getArchetypeColor(archetype: ArchetypeSlug): string | undefined {
  return archetypeIconConfigs[archetype]?.color;
}
