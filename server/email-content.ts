export interface ArchetypeEmailContent {
  name: string;
  keyStrength: string;
  commonPitfall: string;
  day3Advantage: string;
  day3QuickTip: string;
  day5Mistake: string;
  day5Fix: string;
  day7Tool: string;
  quickWins: { strategy: string; description: string }[];
}

export const ARCHETYPE_CONTENT: Record<string, ArchetypeEmailContent> = {
  "chaotic-creative": {
    name: "Chaotic Creative",
    keyStrength: "Explosive creative bursts that produce breakthrough ideas",
    commonPitfall: "Starting 10 projects and finishing 2",
    
    day3Advantage: `Research on divergent thinking shows that people with low structure preference and high novelty orientation — your exact profile — generate 40% more unique solutions in brainstorming tasks (Runco & Acar, 2012). The "chaos" isn't a bug. Your brain is designed to explore more possibilities before converging. The key is building a capture system so those ideas don't evaporate.`,
    day3QuickTip: "Set a 2-minute timer right now and brain-dump every open idea/project into one list. Don't organize — just capture. You can triage later.",
    
    day5Mistake: `You start 10 projects and finish 2. Not because you lack discipline — because your brain is wired to chase the dopamine of new ideas. Dr. Tim Pychyl's research at Carleton University shows this isn't a character flaw. It's an emotional regulation pattern. Your brain literally gets more reward from starting than from finishing. The fix isn't "just focus" — it's creating artificial novelty within existing projects. Rename tasks. Change your environment. Approach the same work from a different angle.`,
    day5Fix: "Pick your most stalled project. Rename the next task on it to something that sounds interesting. Change where you'll work on it. Approach it from a completely different angle than you originally planned.",
    
    day7Tool: `Start with a zero-friction capture tool. Your ideas come fast and they don't wait around. I recommend a voice-to-text note app (like Otter.ai or even your phone's voice memo) paired with a weekly 15-minute "idea triage" session. This matches research showing that creative types need to separate idea generation from idea evaluation (Osborn, 1953). Capture everything. Sort later.`,
    
    quickWins: [
      { strategy: "The 2-Minute Brain Dump", description: "Set a timer and capture every open loop in your head. Don't organize — just get it out. Your brain needs to trust that ideas won't be lost." },
      { strategy: "Novelty Rotation", description: "Rotate between 2-3 active projects daily instead of forcing yourself to finish one before starting another. This works WITH your wiring, not against it." },
      { strategy: "The Ugly First Draft", description: "Give yourself permission to produce something terrible. Chaotic Creatives often stall because the vision in your head is so good that the messy reality feels wrong. Ship ugly. Polish later." }
    ]
  },
  
  "anxious-perfectionist": {
    name: "Anxious Perfectionist",
    keyStrength: "Exceptionally high-quality work that others trust and rely on",
    commonPitfall: "Spending 3 hours perfecting something that needed 45 minutes",
    
    day3Advantage: `Studies on conscientiousness and performance show that your detail orientation produces measurably higher quality work (Barrick & Mount, 1991). The anxiety isn't weakness — it's your brain's quality control system running on overdrive. The trick isn't lowering your standards. It's building a "good enough" checkpoint so your quality control doesn't become a bottleneck.`,
    day3QuickTip: "Before starting your next task, write down what 'done' looks like in one sentence. When you hit that definition, stop. Your 80% is most people's 100%.",
    
    day5Mistake: `You spend 3 hours perfecting something that needed 45 minutes. The research calls this "perfectionistic self-presentation" (Hewitt et al., 2003) — the fear that anything less than flawless reveals the "real" you. Here's what helped: set a timer. When it goes off, ship it. Not because the work doesn't matter — because your standards are already so high that your 80% is most people's 100%.`,
    day5Fix: "Pick one task today and set a timer for 75% of the time you'd normally spend on it. When the timer goes off, submit/send/publish it as-is. Notice: the world doesn't end.",
    
    day7Tool: `Start with a visible progress tracker. Your brain needs proof that you're making progress even when it doesn't feel like it. A simple daily checklist (even a physical one — Todoist or a paper notebook) where you can check things off creates the "completion signal" that quiets the anxiety loop. Research on self-efficacy (Bandura, 1997) shows visible progress builds confidence that counteracts perfectionist paralysis.`,
    
    quickWins: [
      { strategy: "The 'Done' Definition", description: "Before starting any task, write one sentence describing what 'done' looks like. When you hit it, stop. This prevents the infinite polishing loop." },
      { strategy: "The 80% Rule", description: "Your 80% is most people's 100%. Set a timer for 75% of the time you'd normally spend, then ship when it rings. The quality will still be excellent." },
      { strategy: "Progress Journaling", description: "End each day by writing 3 things you completed. Your brain discounts progress — give it written evidence that you're moving forward." }
    ]
  },
  
  "structured-achiever": {
    name: "Structured Achiever",
    keyStrength: "Consistency and systematic execution that builds compounding results",
    commonPitfall: "Rigidity when plans change — resisting adaptation even when evidence says pivot",
    
    day3Advantage: `Meta-analyses of self-regulation show that people with high structure orientation complete 23% more of their planned tasks (de Ridder et al., 2012). Your consistency is rare and valuable. Where others burn out chasing novelty, you build compounding systems. The research suggests your biggest unlock is learning when to deliberately break your own rules.`,
    day3QuickTip: "Schedule one 'wildcard hour' this week — time with no agenda where you explore something unplanned. Your systems are strong enough to handle one hour of chaos.",
    
    day5Mistake: `You resist changing plans even when the evidence says you should. Psychologists call this the "sunk cost fallacy" amplified by conscientiousness (Moon, 2001). Your loyalty to The Plan becomes the plan's biggest weakness. The fix: build "checkpoint reviews" into every project where you explicitly ask "should I keep going or pivot?"`,
    day5Fix: "Add a 'checkpoint review' to your current biggest project. Ask yourself: 'If I were starting fresh today, would I still do it this way?' If not, give yourself permission to adjust.",
    
    day7Tool: `Start with an automation tool. You're already consistent — now multiply that consistency. Zapier or IFTTT can connect the systems you already use, handling the repetitive tasks so you can focus on high-value work. Research on cognitive load (Sweller, 1988) shows that automating routine decisions preserves mental energy for complex ones. You're the archetype most likely to actually set up automations and keep them running.`,
    
    quickWins: [
      { strategy: "Checkpoint Reviews", description: "Add a midpoint review to every project: 'If I were starting today, would I still do it this way?' This prevents the sunk cost trap." },
      { strategy: "Automate the Repeatable", description: "Identify 3 tasks you do every week that are identical. Automate or template them. Your consistency makes you the best archetype for building systems that run themselves." },
      { strategy: "Planned Flexibility", description: "Block 2 hours per week as 'buffer time' in your schedule. This gives your structured system room to absorb surprises without derailing your plan." }
    ]
  },
  
  "novelty-seeker": {
    name: "Novelty Seeker",
    keyStrength: "Rapid skill acquisition, high energy, and thriving in new environments",
    commonPitfall: "Getting bored with systems the moment they start working",
    
    day3Advantage: `Studies on openness to experience link your trait profile to faster skill acquisition and higher adaptability in changing environments (DeYoung, 2015). You're not "unfocused" — your brain is optimized for rapid learning and environmental scanning. The science shows you need rotation, not repetition.`,
    day3QuickTip: "Instead of forcing yourself to use one system, set up 2-3 proven approaches and rotate between them weekly. Your brain needs variety — give it variety within a structure.",
    
    day5Mistake: `You get bored with a system the moment it starts working. Research on sensation seeking (Zuckerman, 1994) shows your brain requires more stimulation to maintain engagement — this is neurological, not laziness. The fix isn't sticking with one system. It's rotating between 2-3 proven systems on a schedule that matches your novelty curve.`,
    day5Fix: "Write down the last 3 productivity systems you abandoned. Pick the one that worked best and bring it back for just this week. Rotation IS your system.",
    
    day7Tool: `Start with Habitica or a gamified task manager. Standard to-do lists bore you in 3 days — that's not a personal failing, it's neurology. Gamification provides the variable reward schedule your brain craves (Deterding et al., 2011). Points, levels, and visual progress create enough novelty to maintain engagement with routine tasks. Rotate between 2-3 gamified approaches if one gets stale.`,
    
    quickWins: [
      { strategy: "The Rotation System", description: "Pick 2-3 productivity methods you've tried before. Rotate between them weekly. Novelty Seekers don't need one perfect system — they need a rotation of good ones." },
      { strategy: "Gamify the Boring", description: "Turn routine tasks into challenges with points, streaks, or time trials. Your brain needs variable rewards — so create them deliberately." },
      { strategy: "The 'New Angle' Trick", description: "When boredom hits, don't abandon the project — change HOW you're working on it. New location, new music, new approach. Same goal, fresh dopamine." }
    ]
  },
  
  "strategic-planner": {
    name: "Strategic Planner",
    keyStrength: "Long-range vision, systems thinking, and strategic prioritization",
    commonPitfall: "Analysis paralysis — researching for weeks instead of starting",
    
    day3Advantage: `Research on metacognition shows that people with high structure and intrinsic motivation — your exact profile — excel at long-range planning and systems thinking (Flavell, 1979). Your ability to see three steps ahead is a genuine competitive advantage. The research-backed fix for your analysis paralysis isn't "just decide" — it's time-boxing decisions with pre-committed criteria.`,
    day3QuickTip: "For your next decision, write down 3 criteria that matter most. Set a deadline. When the deadline hits, score your options against those 3 criteria and go with the winner. No more research.",
    
    day5Mistake: `You research for weeks instead of starting. Analysis paralysis isn't indecision — it's your brain trying to eliminate uncertainty before committing (Schwartz, 2004). The problem: uncertainty never reaches zero. The fix is pre-committing to a decision deadline with specific criteria. "I'll decide by Friday using these 3 factors." Remove the infinite loop.`,
    day5Fix: "Identify one decision you've been postponing. Set a 48-hour deadline. Write down your top 3 criteria. When time's up, score and decide. Done.",
    
    day7Tool: `Start with a decision framework tool like Notion or a simple decision matrix template. Your strength is systems thinking, but you need guard rails against infinite research. Build a template that forces you to list criteria, weight them, score options, and commit within a defined timeframe. This channels your strategic thinking productively instead of letting it become a procrastination tool.`,
    
    quickWins: [
      { strategy: "The Decision Deadline", description: "For every decision, set a hard deadline and 3 evaluation criteria BEFORE you start researching. When the deadline hits, score and commit." },
      { strategy: "The 'Good Enough' Launch", description: "Ship at 80% and iterate. Your strategic mind wants to perfect the plan — but the best plans get refined by real-world feedback, not more thinking." },
      { strategy: "Reverse Calendar Planning", description: "Start from your goal date and work backwards. This channels your planning strength into action timelines instead of endless contingency mapping." }
    ]
  },
  
  "flexible-improviser": {
    name: "Flexible Improviser",
    keyStrength: "Adaptability, real-time problem solving, and thriving in dynamic environments",
    commonPitfall: "Working brilliantly in the moment but having nothing to show for it next month",
    
    day3Advantage: `Studies on adaptive performance show that low-structure, externally-motivated individuals excel in dynamic, unpredictable environments (Pulakos et al., 2000). Where rigid planners freeze, you thrive. Your challenge isn't learning to be structured — it's building the minimum viable structure that doesn't kill your adaptability.`,
    day3QuickTip: "Set one weekly anchor: a 30-minute Sunday review where you pick your top 3 priorities for the week. That's it. Everything else stays flexible. One ritual, maximum adaptability.",
    
    day5Mistake: `You work brilliantly in the moment but have nothing to show for it next month. Without minimal structure, your adaptability becomes reactivity (Pulakos et al., 2000). The fix isn't a rigid schedule — it's one weekly anchor. A single 30-minute weekly review where you decide what matters most next week. That's it. One ritual. Everything else stays flexible.`,
    day5Fix: "Right now, open your calendar and block 30 minutes this Sunday for a weekly review. Just three questions: What went well? What needs attention? What are my top 3 for next week?",
    
    day7Tool: `Start with a "minimal viable system" — specifically, a single weekly review template. Not a rigid planner. Not a complex system. One template with three questions: What went well? What needs attention? What are my top 3 priorities next week? Tools like a simple Google Doc or Notion template work best because they're flexible. The research on minimal structure (Langley, 1999) shows that too much system kills your adaptability, but too little leads to reactivity.`,
    
    quickWins: [
      { strategy: "The Weekly Anchor", description: "One 30-minute weekly review. Three questions: What went well? What needs attention? Top 3 next week? That's your entire system. Everything else stays flexible." },
      { strategy: "Energy-Based Scheduling", description: "Instead of time-blocking tasks, match tasks to energy levels. High energy? Deep work. Low energy? Admin. Your adaptability is a strength when pointed in the right direction." },
      { strategy: "The 'Capture & Decide' Split", description: "When tasks come at you throughout the day, capture them in one place but don't act immediately. Decide once daily (or weekly) what actually matters. This prevents reactivity without adding rigidity." }
    ]
  }
};

export function getArchetypeContent(archetypeId: string): ArchetypeEmailContent | undefined {
  return ARCHETYPE_CONTENT[archetypeId];
}

export function formatArchetypeName(archetypeId: string): string {
  return ARCHETYPE_CONTENT[archetypeId]?.name || archetypeId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
