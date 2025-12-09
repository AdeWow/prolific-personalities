import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  archetype?: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah M.",
    role: "Marketing Director",
    content: "Finally, a productivity assessment that actually gets how I work! The Chaotic Creative playbook helped me embrace my creative bursts instead of fighting them. My output has doubled.",
    archetype: "Chaotic Creative",
    rating: 5,
  },
  {
    id: "2",
    name: "James L.",
    role: "Software Engineer",
    content: "I've taken dozens of personality tests, but this one gave me actionable strategies. Understanding I'm a Strategic Planner changed how I approach my entire week.",
    archetype: "Strategic Planner",
    rating: 5,
  },
  {
    id: "3",
    name: "Emily R.",
    role: "Freelance Designer",
    content: "The 30-day action plan was a game-changer. I went from constant overwhelm to having a system that actually works with my brain, not against it.",
    archetype: "Anxious Perfectionist",
    rating: 5,
  },
  {
    id: "4",
    name: "Michael T.",
    role: "Startup Founder",
    content: "Worth every penny. The tool recommendations alone saved me hours of research. Found my perfect project management setup in week one.",
    archetype: "Structured Achiever",
    rating: 5,
  },
];

interface TestimonialsSectionProps {
  variant?: "full" | "compact";
  showTitle?: boolean;
  maxItems?: number;
}

export function TestimonialsSection({ 
  variant = "full", 
  showTitle = true,
  maxItems = 4 
}: TestimonialsSectionProps) {
  const displayedTestimonials = testimonials.slice(0, maxItems);

  return (
    <section className={variant === "full" ? "py-16 bg-gradient-to-br from-neutral-50 to-indigo-50" : "py-8"}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4" data-testid="text-testimonials-title">
              What Our Users Say
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Join thousands who've discovered their productivity archetype and transformed their work life.
            </p>
          </div>
        )}

        <div className={`grid gap-6 ${variant === "full" ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-4"}`}>
          {displayedTestimonials.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow"
              data-testid={`card-testimonial-${testimonial.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                
                <div className="relative mb-4">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-indigo-100" />
                  <p className="text-neutral-700 leading-relaxed pl-4" data-testid={`text-testimonial-content-${testimonial.id}`}>
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-neutral-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900" data-testid={`text-testimonial-name-${testimonial.id}`}>
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-neutral-500">{testimonial.role}</p>
                  </div>
                </div>
                
                {testimonial.archetype && variant === "full" && (
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                      {testimonial.archetype}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {variant === "full" && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
              <div className="flex -space-x-2">
                {["SM", "JL", "ER", "MT"].map((initials, i) => (
                  <div 
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <span className="text-sm text-neutral-600 ml-2" data-testid="text-user-count">
                <strong className="text-neutral-900">2,500+</strong> people found their archetype this month
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
