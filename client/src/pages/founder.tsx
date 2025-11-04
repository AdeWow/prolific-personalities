import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function FounderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-8" data-testid="button-back-home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-800">
            Why I Built Prolific Personalities
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            A personal journey from productivity struggle to self-understanding
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Founder Story */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  For most of my life, I've carried big dreams—huge ones. But too often, I found myself stuck in the same painful loop: overthinking, procrastinating, planning instead of doing.
                </p>
                <p>
                  So I did what most people do—I tried to fix it with systems. I bought every planner, tried every app, every method that promised to help me "finally get organized." Some worked for a while, but eventually, they all fell apart.
                </p>
                <p className="font-semibold text-neutral-800">
                  Then one day, it hit me: it's not that I was broken or lazy—it's that those systems were never made for me.
                </p>
                <p>
                  I started digging into behavioral psychology, cognitive science, and executive function—and what I found changed everything. Real productivity begins with self-understanding.
                </p>
                <p className="italic text-neutral-600 border-l-4 border-indigo-500 pl-4">
                  "I thought I was just lazy. Turns out, I just needed to stop forcing myself to work like everyone else."
                </p>
                <p className="font-semibold text-neutral-800">
                  That's exactly what this project does—to free people from the shame of "not being productive enough" and help them find flow on their own terms.
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof / Testimonials */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-neutral-800 mb-6">What Users Say</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
                    <span className="font-semibold text-neutral-800">Sarah M.</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                      The Structured Achiever
                    </span>
                  </div>
                  <p className="text-neutral-700 italic">
                    "After discovering I'm a Structured Achiever, I doubled my output in three weeks. The personalized framework actually fits how my brain works."
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
                    <span className="font-semibold text-neutral-800">David K.</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-semibold">
                      The Chaotic Creative
                    </span>
                  </div>
                  <p className="text-neutral-700 italic">
                    "I've tried every productivity system out there. This is the first one that actually understands me instead of forcing me into a generic mold."
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
                    <span className="font-semibold text-neutral-800">Lisa R.</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                      The Strategic Planner
                    </span>
                  </div>
                  <p className="text-neutral-700 italic">
                    "The 4-axis framework helped me understand why time-blocking never worked for me. Now I use strategies that match my natural flow state."
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-lg text-white">
              <h3 className="text-2xl font-bold mb-6">Validated Results</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-4xl font-bold">500+</div>
                  <div className="text-indigo-100">Quiz Completions</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">40%</div>
                  <div className="text-indigo-100">Productivity Increase</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">4.9/5</div>
                  <div className="text-indigo-100">User Rating</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">2 weeks</div>
                  <div className="text-indigo-100">To See Results</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">
            Ready to discover your productivity archetype?
          </h2>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Take the free assessment and get personalized strategies tailored to how you naturally work.
          </p>
          <Link href="/quiz">
            <Button size="lg" className="gradient-primary text-white px-8 py-4 rounded-xl font-semibold text-lg" data-testid="button-take-quiz">
              Start Your Assessment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
