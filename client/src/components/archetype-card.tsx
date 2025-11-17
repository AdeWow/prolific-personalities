import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import type { Archetype } from "../data/archetypes";

interface ArchetypeCardProps {
  archetype: Archetype;
  className?: string;
  detailed?: boolean;
  clickable?: boolean;
}

export function ArchetypeCard({ archetype, className, detailed = false, clickable = false }: ArchetypeCardProps) {
  const content = (
    <Card className={cn(
      `bg-gradient-to-br from-${archetype.color}-50 to-${archetype.color}-100 border-${archetype.color}-200 hover:shadow-lg transition-all duration-200`,
      clickable && "cursor-pointer hover:scale-105 transform",
      className
    )}>
      <CardContent className="p-6">
        {archetype.image ? (
          <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4 ring-2 ring-neutral-200">
            <img 
              src={archetype.image} 
              alt={archetype.name}
              className="w-full h-full object-cover object-center scale-125"
            />
          </div>
        ) : (
          <div className={cn(
            `w-16 h-16 bg-gradient-to-br ${archetype.gradientFrom} ${archetype.gradientTo} rounded-2xl flex items-center justify-center mb-4`
          )}>
            <i className={`${archetype.icon} text-white text-2xl`}></i>
          </div>
        )}
        
        <h3 className="text-xl font-bold text-neutral-800 mb-2">
          {archetype.name}
        </h3>
        
        <p className="text-neutral-600 mb-4 leading-relaxed min-h-[3.5rem]">
          {archetype.tagline}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {archetype.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={`px-3 py-1 bg-${archetype.color}-100 text-${archetype.color}-700 hover:bg-${archetype.color}-200`}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {detailed && (
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-neutral-800 mb-3">Your Strengths:</h4>
              <ul className="space-y-2 text-neutral-700">
                {archetype.superpowers.map((power, index) => (
                  <li key={index} className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    {power.title}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-neutral-800 mb-3">Growth Areas:</h4>
              <ul className="space-y-2 text-neutral-700">
                {archetype.blockers.map((blocker, index) => (
                  <li key={index} className="flex items-center">
                    <i className={`fas fa-arrow-up text-${archetype.color}-500 mr-2`}></i>
                    {blocker.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (clickable) {
    return (
      <Link href={`/archetypes#${archetype.id}`}>
        {content}
      </Link>
    );
  }

  return content;
}
