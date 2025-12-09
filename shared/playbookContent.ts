export interface PlaybookSection {
  id: string;
  title: string;
  content: string;
}

export interface PlaybookChapter {
  id: string;
  title: string;
  sections: PlaybookSection[];
}

export interface ActionPlanTask {
  id: string;
  day: number;
  task: string;
  description: string;
}

export interface PlaybookContent {
  archetype: string;
  title: string;
  subtitle: string;
  chapters: PlaybookChapter[];
  actionPlan: ActionPlanTask[];
  recommendedTools: string[];
}

// Structured Achiever Playbook Content
export const structuredAchieverPlaybook: PlaybookContent = {
  archetype: "structured-achiever",
  title: "The Structured Achiever Playbook",
  subtitle: "From systems overwhelm to sustainable structure",
  chapters: [
    {
      id: "understanding",
      title: "Understanding Your Archetype",
      sections: [
        {
          id: "core-traits",
          title: "Your Core Traits",
          content: `As a Structured Achiever, you thrive in structured environments with clear routines and plans. You're driven by external accountability and rewards, prefer concrete and specific tasks, and execute well when direction is clear.

**Your 4 Axes Profile:**
- Structure: HIGH (Rigid - craves routines and clear plans)
- Motivation: HIGH (Extrinsic - driven by external accountability/rewards)
- Focus: LOW (Detail-Oriented - prefers concrete, specific tasks)
- Task: LOW (Action-Oriented - executes well when direction is clear)

**Your Core Problem:**
You thrive in structured environments (office, clear reporting, external deadlines). When structure disappears (remote work, self-directed projects, entrepreneurship), productivity collapses. You may also fall into "productivity porn" - optimizing systems instead of doing work.

**Your Superpowers:**
- Exceptional at creating and following structured plans
- Strong ability to prioritize and manage time effectively
- Natural talent for breaking complex goals into actionable steps
- High reliability and consistency in task completion
- Skilled at maintaining productive routines

**Your Growth Areas:**
- May struggle with unexpected changes or shifting priorities
- Can become rigid when plans don't go as expected
- Might over-plan at the expense of taking action
- Can experience stress when operating without clear structure`
        },
        {
          id: "science-behind",
          title: "The Science Behind Your Productivity Style",
          content: `Your productivity style is grounded in several psychological principles:

**External Structure Dependency:**
In office environments, you have boss-assigned tasks, meetings that structure your day, coworkers providing accountability, and 9-5 boundaries. In remote or self-directed environments, decision paralysis sets in without external direction.

**Time Blocking Research:**
Studies show people who time-block complete 30-40% more tasks than those who work from lists alone. Time-blocking reduces decision fatigue and creates external accountability through calendar appointments.

**Citation:** Newport, C. (2016). Deep Work: Rules for Focused Success in a Distracted World. Grand Central Publishing.

**Routine Optimization:**
Your brain has developed strong neural pathways for routine behaviors, making structured work feel natural and energizing rather than restrictive.`
        }
      ]
    },
    {
      id: "optimization",
      title: "Framework 1: Time Blocking (Cal Newport Method)",
      sections: [
        {
          id: "planning-framework",
          title: "Why Time Blocking Works for You",
          content: `Time blocking is the practice of scheduling specific tasks in specific time slots - treating your to-do list items like meetings.

**What You Need:**
1. External structure - Time blocks create artificial "meetings with yourself"
2. Clear expectations - You know exactly what to work on and when

**Why You Struggle Without It:**
Without time blocking, you face decision paralysis (no one tells you what to work on), amorphous time (no meetings to structure day), disappeared motivation (no one watching), and unclear start/stop times.

**Your Ideal Week Template:**

**Morning Block (9am-12pm):** Deep Work
- Your most important project work
- No meetings, no email, no distractions
- Protected time

**Afternoon Block (1pm-3pm):** Shallow Work
- Email, admin, meetings
- Collaborative work
- Responsive tasks

**Late Afternoon (3pm-5pm):** Flexible/Overflow
- Catch-up on what ran over
- Planning for tomorrow
- Low-priority tasks`
        },
        {
          id: "tools-systems",
          title: "Essential Tools and Systems",
          content: `Your productivity stack should emphasize structure and planning:

**Task Management:**
- Use a hierarchical task system (projects > tasks > subtasks)
- Implement recurring tasks for routine activities
- Set clear deadlines and reminders
- Tag tasks by context, energy level, and priority

**Time Blocking:**
- Schedule specific time blocks for different work types
- Include buffer time between blocks
- Protect deep work blocks from interruptions
- Review and adjust blocks weekly

**Progress Tracking:**
- Maintain a visual progress tracker for major goals
- Use checklists for complex processes
- Track completion rates and time estimates
- Celebrate milestones systematically`
        }
      ]
    },
    {
      id: "challenges",
      title: "Overcoming Common Challenges",
      sections: [
        {
          id: "flexibility",
          title: "Building Flexibility Without Losing Structure",
          content: `Learn to adapt while maintaining your structural foundation:

**Flexible Planning:**
- Build "flex blocks" into your schedule for unexpected tasks
- Create contingency plans for your major projects
- Practice the "plan B" mindset for critical deadlines
- Use time-boxed planning sessions to avoid over-planning

**Adapting to Change:**
- When priorities shift, take 15 minutes to re-plan rather than panic
- Keep a "rapid re-planning" template ready
- Accept that some days won't go according to plan
- Build resilience through small, controlled experiments with flexibility

**Avoiding Over-Planning:**
- Set a time limit for planning sessions
- Use the 80/20 rule: 20% planning, 80% execution
- Start with "minimum viable plans" and iterate
- Focus on next actions rather than perfect comprehensive plans`
        },
        {
          id: "stress-management",
          title: "Managing Stress and Overwhelm",
          content: `When structure breaks down or demands exceed capacity:

**Emergency Simplification Protocol:**
1. List everything that needs attention
2. Ruthlessly prioritize top 3 items only
3. Create minimal plan for just those items
4. Defer, delegate, or delete everything else temporarily
5. Rebuild full structure once crisis passes

**Stress Prevention:**
- Maintain "white space" in your calendar (15-20% buffer)
- Set realistic deadlines with cushion time
- Build regular review points to catch issues early
- Practice saying "no" to maintain system integrity
- Schedule recovery time after intense periods

**When You Feel Stuck:**
- Return to basics: simple to-do list, basic prioritization
- Focus on one small win to rebuild momentum
- Consult your past successful patterns
- Ask: "What's the smallest next step?"
- Take a structured break to reset mental clarity`
        }
      ]
    },
    {
      id: "advanced",
      title: "Advanced Strategies",
      sections: [
        {
          id: "energy-management",
          title: "Optimizing Energy and Focus",
          content: `Align your structured approach with natural energy rhythms:

**Energy Mapping:**
- Track your energy levels throughout the day for 2 weeks
- Identify your peak performance windows
- Schedule high-priority deep work during peak times
- Reserve low-energy periods for routine tasks
- Adjust your structure to match your natural rhythms

**Focus Enhancement:**
- Use the Pomodoro Technique for sustained concentration
- Create start rituals to enter deep work quickly
- Minimize context switching between different work types
- Group similar tasks together in batches
- Take structured breaks to maintain peak performance

**Recovery Integration:**
- Schedule specific recovery activities (not just empty time)
- Treat rest as part of your productivity system
- Plan enjoyable activities with the same care as work
- Monitor stress indicators and adjust workload accordingly`
        },
        {
          id: "long-term",
          title: "Long-Term Success",
          content: `Sustaining and evolving your productivity system:

**Quarterly System Reviews:**
- Assess what's working and what's not
- Identify patterns in productivity fluctuations
- Update tools and processes that have become inefficient
- Set strategic goals for the next quarter
- Refine your structure based on lessons learned

**Continuous Improvement:**
- Track productivity metrics that matter to you
- Experiment with one new technique per month
- Document your "productivity patterns" playbook
- Build a personal knowledge base of best practices
- Invest time in learning productivity research

**Avoiding Burnout:**
- Monitor for signs of rigidity or stress
- Regularly reassess goal alignment with values
- Build in variety within structure
- Maintain boundaries between work and personal life
- Remember: productivity serves your life, not the other way around`
        }
      ]
    }
  ],
  actionPlan: [
    { id: "day1", day: 1, task: "Complete your productivity audit", description: "List all your current productivity tools, habits, and systems. Identify what's working and what's not." },
    { id: "day2", day: 2, task: "Choose your core task management tool", description: "Select and set up the task management system that will be your central hub." },
    { id: "day3", day: 3, task: "Create your project structure", description: "Set up folders, projects, and categories in your chosen system." },
    { id: "day4", day: 4, task: "Brain dump all current commitments", description: "Capture every task, project, and commitment in your new system." },
    { id: "day5", day: 5, task: "Organize and prioritize", description: "Sort your tasks by project, add deadlines, and set priorities." },
    { id: "day6", day: 6, task: "Design your weekly review process", description: "Create a checklist and time block for your weekly planning session." },
    { id: "day7", day: 7, task: "Complete first weekly review", description: "Run through your weekly review process and set up next week." },
    { id: "day8", day: 8, task: "Implement daily planning ritual", description: "Start each day with a 10-minute planning session." },
    { id: "day9", day: 9, task: "Set up time blocking", description: "Create your ideal week template with time blocks for different work types." },
    { id: "day10", day: 10, task: "Add buffer time to schedule", description: "Ensure 15-20% of your calendar is flexible buffer time." },
    { id: "day11", day: 11, task: "Create your deep work protocol", description: "Define when and how you'll protect time for focused work." },
    { id: "day12", day: 12, task: "Establish your morning routine", description: "Design and document a morning routine that sets you up for success." },
    { id: "day13", day: 13, task: "Set up progress tracking", description: "Create visual trackers for your major goals and projects." },
    { id: "day14", day: 14, task: "Review and adjust systems", description: "Reflect on week 2, identify what's working, make adjustments." },
    { id: "day15", day: 15, task: "Implement the Eisenhower Matrix", description: "Start categorizing all tasks by urgency and importance." },
    { id: "day16", day: 16, task: "Create project templates", description: "Build reusable templates for recurring project types." },
    { id: "day17", day: 17, task: "Set up automation where possible", description: "Automate recurring tasks and reminders." },
    { id: "day18", day: 18, task: "Build your resource library", description: "Organize templates, checklists, and reference materials." },
    { id: "day19", day: 19, task: "Practice rapid re-planning", description: "When plans change, use your 15-minute re-planning protocol." },
    { id: "day20", day: 20, task: "Energy mapping begins", description: "Start tracking your energy levels throughout each day." },
    { id: "day21", day: 21, task: "Third weekly review", description: "Complete your weekly review and refine your process." },
    { id: "day22", day: 22, task: "Optimize task batching", description: "Group similar tasks together for efficient completion." },
    { id: "day23", day: 23, task: "Create contingency plans", description: "Identify your most critical projects and create backup plans." },
    { id: "day24", day: 24, task: "Set up focus tools", description: "Implement website blockers, focus modes, or other concentration tools." },
    { id: "day25", day: 25, task: "Build in recovery time", description: "Schedule specific recovery activities into your calendar." },
    { id: "day26", day: 26, task: "Analyze energy patterns", description: "Review your energy tracking and adjust your schedule accordingly." },
    { id: "day27", day: 27, task: "Create your ideal day template", description: "Design templates for different types of days (meeting day, deep work day, etc.)." },
    { id: "day28", day: 28, task: "Fourth weekly review", description: "Complete your weekly review and celebrate progress." },
    { id: "day29", day: 29, task: "Document lessons learned", description: "Capture insights from your 30-day journey." },
    { id: "day30", day: 30, task: "Plan your next month", description: "Set goals for month 2 and continue refining your system." }
  ],
  recommendedTools: [
    "todoist",
    "notion",
    "google-calendar",
    "toggl-track",
    "forest",
    "rescuetime"
  ]
};

// Chaotic Creative Playbook Content
export const chaoticCreativePlaybook: PlaybookContent = {
  archetype: "chaotic-creative",
  title: "The Chaotic Creative Playbook",
  subtitle: "From chaos to sustainable creative flow",
  chapters: [
    {
      id: "understanding",
      title: "Understanding Your Archetype",
      sections: [
        {
          id: "core-traits",
          title: "Your Core Traits",
          content: `As a Chaotic Creative, you have bursts of intense creative energy but struggle with consistency. Your mind naturally generates ideas and craves novelty, but traditional productivity systems feel constraining.

**Your 4 Axes Profile:**
- Structure: LOW (Flexible - resists rigid routines)
- Motivation: MIXED (Both intrinsic creative drive and need for external deadlines)
- Focus: HIGH (Big Picture - sees patterns, makes connections)
- Task: HIGH (Idea-Oriented - generates many ideas, struggles with completion)

**Your Core Problem:**
Your working memory is limited (not a flaw - it's neurology). Task initiation is your biggest bottleneck (executive function deficit). Boredom intolerance makes sustained attention painful. You need external structure because internal willpower is unreliable.

**Your Superpowers:**
- Exceptional at generating innovative ideas and creative solutions
- High energy bursts that produce impressive output
- Ability to see connections others miss
- Comfortable with ambiguity and experimentation
- Natural enthusiasm that inspires others

**Your Growth Areas:**
- Difficulty maintaining consistent output
- Task initiation anxiety
- Projects abandoned mid-stream when excitement fades
- Resistance to "boring" but necessary tasks
- Can feel overwhelmed by too many simultaneous ideas`
        },
        {
          id: "science-behind",
          title: "The Science Behind Your Productivity Style",
          content: `Your productivity style is grounded in neuroscience:

**Why Pomodoro + Body Doubling Works for You:**

The Research: Pomodoro was developed by Francesco Cirillo based on principles of time boxing and structured breaks. Studies show:
- Breaking work into 25-minute intervals with 5-minute breaks aligns with ultradian rhythms (90-120 min cycles) and prevents cognitive fatigue
- Studies on ADHD show that external timers reduce task initiation anxiety by creating a defined start AND end point
- Body doubling (working in the presence of others) leverages social facilitation effect - performance improves when others are present, even passively

**For Chaotic Creatives specifically:**
- Your working memory is limited (not a flaw - it's neurology)
- Task initiation is your biggest bottleneck (executive function deficit)
- Boredom intolerance makes sustained attention painful
- You need external structure because internal willpower is unreliable

**The Combination Creates:**
- External structure (timer replaces willpower)
- Social accountability (body double reduces avoidance)
- Reduced initiation anxiety ("just 25 minutes")
- Built-in breaks (prevents burnout and maintains novelty)`
        }
      ]
    },
    {
      id: "optimization",
      title: "Framework 1: Pomodoro + Body Doubling",
      sections: [
        {
          id: "pomodoro-setup",
          title: "Setting Up Your Pomodoro System",
          content: `Don't overthink this. Pick ONE timer and stick with it for 30 days.

**Timer Options Ranked for Chaotic Creatives:**

1. **Physical timer (Amazon Basics, $8)** - BEST for you
   - Why: Tactile, visible, can't be minimized
   - Con: Need to buy one

2. **Forest app (iOS/Android, $2)**
   - Why: Gamified, visual tree grows during focus
   - Con: Easy to ignore phone notifications

3. **Pomofocus.io (Free web app)**
   - Why: Simple, customizable, no download
   - Con: Another browser tab (distraction risk)

⚠️ **CHAOTIC CREATIVE WARNING:** Do NOT spend more than 15 minutes choosing a timer. Analysis paralysis is procrastination. Pick one NOW.

**Design Your Pomodoro Ritual:**

Your brain needs a start trigger and end reward to make this stick.

**Start Trigger (Choose ONE):**
- Close all browser tabs except work tab
- Put phone in another room
- Put on "focus" playlist (same playlist every time)
- Light a specific candle
- Wear specific "work mode" hat/headphones

**End Reward (Choose ONE):**
- Stand up and stretch
- Get a specific snack
- 5-minute walk outside
- Check one social media app
- Text a friend`
        },
        {
          id: "body-doubling",
          title: "Body Doubling Implementation",
          content: `Body doubling means working in the presence of another person - virtually or in-person.

**Why Body Doubling Works:**
Your brain is wired for social cues. Presence of others activates different neural pathways than working alone. This isn't about accountability (though that helps) - it's about leveraging social brain to override avoidance.

**Body Doubling Options:**

**Best: Focusmate.com**
- Free: 3 sessions/week
- Paid: Unlimited (~$5/month)
- 25 or 50-minute sessions with strangers
- You declare goal at start, report at end
- Camera on (optional but more effective)

**Alternatives:**
- Work in coffee shops (ambient presence)
- Coworking spaces
- Study-with-me YouTube videos (less effective but something)
- Discord focus rooms

**Your First Focusmate Session:**
1. Sign up at focusmate.com
2. Book a session during your next high-energy window
3. Before session: Write your ONE task on a Post-It
4. During session: Work ONLY on that task
5. After session: Note what worked/didn't`
        }
      ]
    },
    {
      id: "challenges",
      title: "Troubleshooting Common Problems",
      sections: [
        {
          id: "common-issues",
          title: "When Things Go Wrong",
          content: `**Problem 1: "25 minutes feels too long"**
Solution: Shorten it.
- Try 15-minute Pomodoros instead
- Your brain might need shorter sprints
- This is adaptation, not failure
- Research shows any time-boxing is better than none

**Problem 2: "I keep getting distracted mid-Pomodoro"**
Solution: Physical barriers.
- Phone in another room (not just silenced)
- Browser extension: "Freedom" or "Cold Turkey" blocks websites
- Work in a different location (novelty helps your brain)
- Body double makes this less likely (social presence reduces distraction)

**Problem 3: "I skip my Focusmate sessions"**
Solution: Increase stakes.
- Tell Focusmate partner "I'll Venmo you $5 if I no-show"
- Use Beeminder to charge you money for missed sessions
- Buddy system: Friend texts you 10 min before session
- This is the extrinsic motivation your brain needs

**Problem 4: "I finish one Pomodoro then never start another"**
Solution: Chain them immediately.
- Don't take a "real break" after first Pomodoro
- Do your 5-min reward, then START the next timer immediately
- Decision points are where you lose momentum`
        },
        {
          id: "energy-management",
          title: "Working With Your Energy",
          content: `Your energy is inconsistent. That's not a flaw - it's your pattern.

**High Energy Days (7+/10):**
- Stack as many Pomodoros as possible
- This is when you do 80% of your best work
- Ride the wave - don't question it
- Minimize other obligations on these days

**Medium Energy Days (4-6/10):**
- Use Focusmate to boost energy through social presence
- Aim for 2-3 Pomodoros (not 8)
- Do easier tasks first to build momentum
- Accept "good enough" output

**Low Energy Days (<4/10):**
- Rest without guilt (this is strategic recovery)
- Do ONLY absolutely essential tasks
- Use body doubling for any work you must do
- Prepare for next high-energy day

**The Pattern:**
High Energy → Maximum output
Low Energy → Strategic recovery
Medium Energy → Maintenance mode

Don't fight this pattern. Work with it.`
        }
      ]
    },
    {
      id: "advanced",
      title: "Advanced Strategies",
      sections: [
        {
          id: "capture-system",
          title: "The Capture System for Ideas",
          content: `Your brain generates ideas constantly. Without a capture system, they either:
- Distract you from current work
- Get lost forever
- Create anxiety about forgetting

**The Immediate Capture Protocol:**

When idea strikes during Pomodoro:
1. PAUSE (don't switch tasks)
2. WRITE on Post-It (one sentence max)
3. STICK on "Ideas" area (visible but separate)
4. RETURN to current task immediately

Total interruption time: 15 seconds

**Why This Works:**
- Idea is captured (anxiety resolved)
- You don't context switch (focus maintained)
- Post-It is physical (won't get lost in app)
- You can review ideas later during break

**Daily Idea Processing (5 min, end of day):**
1. Review all Post-Its from today
2. Trash: Ideas that no longer excite you
3. Park: Ideas to consider later (put in "Someday" folder)
4. Act: Ideas worth pursuing (add to project list)`
        },
        {
          id: "shipping",
          title: "Shipping Creative Work",
          content: `The hardest part for Chaotic Creatives: FINISHING.

**Why Finishing Is Hard:**
- New ideas are more exciting than old projects
- The "messy middle" lacks novelty
- Perfectionism disguised as "not ready yet"
- Fear of judgment on completed work

**The Done Threshold:**
Before starting ANY project, define "Done" criteria:
- This is DONE when: [3-5 specific criteria]
- Good enough means: [minimum viable version]
- I will ship by: [specific date/time]

Example for blog post:
- Done when: 800+ words, 3+ sections, 1+ images
- Good enough means: Clear message, no grammatical errors
- Ship by: Friday 5pm

**The 80% Rule:**
Most creative work at 80% is better than 100% that never ships.
- Your 80% is probably others' 95%
- Perfectionism is procrastination in disguise
- Ship, then iterate based on feedback

**Public Accountability:**
Tell someone your shipping date. External accountability works when internal motivation fades.`
        }
      ]
    }
  ],
  actionPlan: [
    { id: "day1", day: 1, task: "The Awareness Audit", description: "Track everything you do today. Note energy levels (1-10) every 2 hours. Identify your peak energy windows and biggest distractions." },
    { id: "day2", day: 2, task: "Choose Your Tools", description: "Sign up for Focusmate, get a physical timer, download Freedom app, and set up Apple Notes for idea capture." },
    { id: "day3", day: 3, task: "First Pomodoro + Body Double", description: "Complete ONE Focusmate session with Pomodoro. Declare your task, set timer for 25 min, WORK, then reward yourself." },
    { id: "day4", day: 4, task: "Two Pomodoros Today", description: "Complete 2 Pomodoro sessions (can be with or without Focusmate). Focus on building the habit, not the output." },
    { id: "day5", day: 5, task: "Set Up Your Distraction Blockers", description: "Configure Freedom app with your top 5 distracting sites. Schedule blocks during your work hours." },
    { id: "day6", day: 6, task: "Design Your Capture System", description: "Set up your idea capture area with Post-Its. Practice the 15-second capture protocol." },
    { id: "day7", day: 7, task: "Weekly Review", description: "Review week 1. How many Pomodoros completed? What worked? What didn't? Adjust for week 2." },
    { id: "day8", day: 8, task: "Increase to 3 Pomodoros", description: "Aim for 3 Pomodoro sessions today. Use body doubling for at least one." },
    { id: "day9", day: 9, task: "Energy Tracking Continues", description: "Continue logging energy levels. Start identifying patterns (morning vs evening person?)." },
    { id: "day10", day: 10, task: "Define One Project's Done Threshold", description: "Pick one current project and define specific 'Done' criteria. Set a ship date." },
    { id: "day11", day: 11, task: "Practice the 15-Second Capture", description: "Every time an idea strikes during focus time, use the capture protocol. Don't context switch." },
    { id: "day12", day: 12, task: "Process Your Captured Ideas", description: "Review all Post-Its from the week. Trash, park, or act on each one." },
    { id: "day13", day: 13, task: "Optimize Your Environment", description: "Set up a dedicated focus space. Remove visual distractions. Make your work area conducive to flow." },
    { id: "day14", day: 14, task: "Week 2 Review", description: "Assess progress. Are Pomodoros becoming easier? What's your average daily count?" },
    { id: "day15", day: 15, task: "Try a 50-Minute Focusmate", description: "If 25-min sessions feel easy, try one 50-minute session with a body double." },
    { id: "day16", day: 16, task: "Build Your Start Ritual", description: "Formalize your focus ritual. Same trigger every time before starting work." },
    { id: "day17", day: 17, task: "Tackle a Hard Task", description: "Use body doubling specifically for a task you've been avoiding. External presence reduces avoidance." },
    { id: "day18", day: 18, task: "Practice Shipping", description: "Complete and ship something small today - even if it's not perfect. Practice the 80% rule." },
    { id: "day19", day: 19, task: "Rest Day with Purpose", description: "If energy is low, take a strategic rest day. This is part of the system, not a failure." },
    { id: "day20", day: 20, task: "Increase Consistency", description: "Aim for at least 3 Pomodoros every day this week, regardless of energy level." },
    { id: "day21", day: 21, task: "Week 3 Review", description: "You're 3 weeks in. What habits are sticking? What still needs adjustment?" },
    { id: "day22", day: 22, task: "Experiment with Timing", description: "Try doing your hardest work during your peak energy window. Protect that time." },
    { id: "day23", day: 23, task: "Set Up Accountability", description: "Tell someone about your current project and ship date. External accountability matters." },
    { id: "day24", day: 24, task: "Practice Finishing", description: "Focus today on completing something rather than starting something new." },
    { id: "day25", day: 25, task: "Review Your Capture System", description: "Is your idea capture working? Adjust the system if needed." },
    { id: "day26", day: 26, task: "Stack Pomodoros", description: "Try chaining 4 Pomodoros with short breaks between. Build endurance." },
    { id: "day27", day: 27, task: "Analyze Your Progress", description: "Count total Pomodoros this month. Compare week 1 to week 4." },
    { id: "day28", day: 28, task: "Week 4 Review", description: "Final weekly review. What's working? What's your sustainable routine?" },
    { id: "day29", day: 29, task: "Document Your System", description: "Write down your personalized Pomodoro + Body Doubling system. Make it repeatable." },
    { id: "day30", day: 30, task: "Plan Month 2", description: "Set goals for next month. Continue refining your creative productivity system." }
  ],
  recommendedTools: [
    "focusmate",
    "forest",
    "freedom",
    "notion",
    "apple-notes",
    "pomofocus"
  ]
};

// Anxious Perfectionist Playbook Content
export const anxiousPerfectionistPlaybook: PlaybookContent = {
  archetype: "anxious-perfectionist",
  title: "The Anxious Perfectionist Playbook",
  subtitle: "From paralysis to imperfect progress",
  chapters: [
    {
      id: "understanding",
      title: "Understanding Your Archetype",
      sections: [
        {
          id: "core-traits",
          title: "Your Core Traits",
          content: `As an Anxious Perfectionist, you have high standards and a detail-oriented mind. You catch every flaw, but this same trait that ensures quality can paralyze you with fear of imperfection.

**Your 4 Axes Profile:**
- Structure: HIGH (Rigid - craves clear plans)
- Motivation: MIXED (Intrinsic lean - internal standards drive you)
- Focus: LOW (Detail-Oriented - catches every flaw)
- Task: HIGH (Avoidant - procrastinates due to fear)

**Your Core Problem:**
Perfectionism creates procrastination. Fear of imperfection prevents starting and finishing. You don't procrastinate because you're lazy. You procrastinate because the gap between your standards and your current ability triggers overwhelming anxiety.

**The Pattern:**
1. Imagine perfect outcome
2. Compare to current draft (which will never be perfect on first try)
3. Feel anxiety about gap
4. Avoid task to avoid anxiety
5. Deadline approaches, anxiety worsens
6. Rush at last minute, confirm belief that "I can't do it perfectly"

**Your Superpowers:**
- Exceptional attention to detail and quality
- High standards that produce excellent work (when you ship)
- Thorough and comprehensive approach
- Catch errors others miss
- Deep commitment to doing things right

**Your Growth Areas:**
- Perfectionism-driven procrastination
- Revision loops that delay shipping
- Difficulty starting when stakes feel high
- Harsh self-criticism
- Anxiety when work will be visible to others`
        },
        {
          id: "science-behind",
          title: "The Science Behind Your Productivity Style",
          content: `Your productivity style is grounded in psychological research:

**The Research on Perfectionism:**

Perfectionism is strongly correlated with:
- Procrastination (r = 0.23-0.36 across studies)
- Anxiety (r = 0.35-0.50)
- Depression (r = 0.25-0.45)
- LOWER quality work (due to revision loops and delayed shipping)

**Citation:** Flett, G. L., & Hewitt, P. L. (2002). "Perfectionism and Maladjustment: An Overview of Theoretical, Definitional, and Treatment Issues." In Perfectionism: Theory, Research, and Treatment. American Psychological Association.

**Why Time-Boxing Works:**

Time-boxing externalizes the stop signal. Instead of "this must be perfect," the rule is "I work for X minutes, then I stop."

This breaks the perfection-procrastination loop by:
- Removing "perfect" as the completion criterion
- Creating external accountability (timer, not your judgment)
- Forcing you to ship "good enough"
- Building evidence that good enough ≠ disaster`
        }
      ]
    },
    {
      id: "optimization",
      title: "Framework 1: Time-Boxed Good Enough System",
      sections: [
        {
          id: "define-good-enough",
          title: "Defining 'Good Enough' Before You Start",
          content: `Your perfectionism activates when goals are vague. "Make it good" = infinite loop. "Meet these 5 criteria" = achievable.

**Pre-Commitment Criteria Exercise:**

For your next project, write down BEFORE starting:

**This is COMPLETE when:**
1. [Specific criterion] ✓
2. [Specific criterion] ✓
3. [Specific criterion] ✓
4. [Specific criterion] ✓
5. [Specific criterion] ✓

**Example for a report:**
This report is complete when:
1. Introduction explains the problem ✓
2. 3+ data points support the recommendation ✓
3. Conclusion has clear next steps ✓
4. No grammatical/spelling errors ✓
5. Formatted consistently ✓

**NOT included:**
- "It sounds smart"
- "I feel good about it"
- "It couldn't be better"

These are subjective and infinite. Stick to objective criteria.

**The Good Enough Contract:**
Before starting, write: "I commit to shipping when criteria are met, regardless of how I feel about it."

Sign it. Put it where you can see it while working.`
        },
        {
          id: "time-boxing",
          title: "The Time-Box Protocol",
          content: `**Step 1: Set Creation Time-Box**

Before creating anything:
- Estimate: How long would this take without perfectionism?
- Multiply by 1.5 (buffer for reality)
- Set timer for that duration
- When timer rings, STOP creating, start revising

**Example:**
- Task: Write blog post
- Non-perfectionist estimate: 2 hours
- Your time-box: 3 hours
- Timer rings at 3 hours → Move to revision phase

**Step 2: Set Revision Time-Box**

Rule of thumb:
- V0 creation time = 100%
- V1 revision time = 50% of V0 time

**Example:**
- V0 took 2 hours
- V1 gets 1 hour max

Why: Most revision past first pass is anxiety management, not quality improvement.

**Prioritized Editing:**

You have limited time. Edit in priority order:

**Priority 1 (Must fix):**
- Structural issues (missing sections, illogical flow)
- Factual errors
- Clarity problems (confusing sentences)

**Priority 2 (Fix if time):**
- Awkward phrasing
- Better word choices
- Polish

**Priority 3 (Skip these):**
- Perfect word choices
- Elegant transitions
- "Just one more pass"`
        }
      ]
    },
    {
      id: "challenges",
      title: "Overcoming Common Challenges",
      sections: [
        {
          id: "starting",
          title: "Breaking Through Start Anxiety",
          content: `**The Imperfect Start Protocol:**

Your perfectionism is loudest at the beginning. The blank page triggers maximum anxiety.

**The Ugly First Draft Rule:**
Your first draft's job is to EXIST, not to be good.
- Write badly on purpose
- No editing while creating
- Embrace the mess
- Give yourself permission to fix later

**The 2-Minute Start:**
- Set timer for 2 minutes
- Write/work on ANYTHING related to project
- Quality doesn't matter
- When timer rings, you can stop OR continue
- Goal: Break the starting barrier

**Why This Works:**
Starting is the hardest part. Once you've started, momentum often takes over. The 2-minute commitment makes starting feel safe.

**Reframe the Start:**
Instead of: "I need to write a great opening"
Try: "I need to write ANY opening that I can revise later"

The revision will come. The start is just to have material to work with.`
        },
        {
          id: "finishing",
          title: "Breaking Through Finish Anxiety",
          content: `**The Shipping Fear Protocol:**

Your perfectionism is also loud at the end. "Just one more revision" is avoidance in disguise.

**External Accountability:**
- Tell someone when you'll ship
- Make a public commitment
- Use a body double for the final hour
- Have someone else click "send" if needed

**The Pre-Mortem:**
Before shipping, ask:
- What's the worst that could happen if this isn't perfect?
- How likely is that worst case?
- What's the cost of NOT shipping?
- What can I learn from shipping imperfect work?

**Reality Check:**
Most "disasters" from imperfect work are:
- Fixable after the fact
- Less noticed than you expect
- Learning opportunities
- Forgotten quickly by others

**The 10-10-10 Rule:**
- How will I feel about this decision in 10 minutes?
- 10 months?
- 10 years?

Shipping B+ work rarely matters in 10 months. Not shipping matters forever.`
        }
      ]
    },
    {
      id: "advanced",
      title: "Advanced Strategies",
      sections: [
        {
          id: "self-compassion",
          title: "Building Self-Compassion",
          content: `Perfectionism often stems from harsh internal criticism. Self-compassion is the antidote.

**The Self-Talk Audit:**

Notice how you talk to yourself when you:
- Make a mistake
- Produce imperfect work
- Miss a deadline
- Receive criticism

**Common Perfectionist Self-Talk:**
- "I'm so stupid"
- "I can't do anything right"
- "Everyone will see I'm a fraud"
- "This isn't good enough (and neither am I)"

**The Friend Filter:**
Would you say this to a friend in the same situation?
If not, why say it to yourself?

**Self-Compassion Practice:**
When you catch harsh self-talk, try:
1. "This is hard" (acknowledge difficulty)
2. "Everyone struggles sometimes" (common humanity)
3. "What would I tell a friend?" (kind response)

**The Imperfect Action Log:**
Track times you shipped imperfect work and the ACTUAL outcome:
- What I shipped: [description]
- What I feared: [worst case]
- What happened: [actual outcome]

Build evidence that imperfect work rarely leads to disaster.`
        },
        {
          id: "sustainable",
          title: "Sustainable Progress Over Perfection",
          content: `**The Perfection Paradox:**
Perfectionism often produces WORSE results than "good enough" because:
- Delays reduce total output
- Revision loops prevent shipping
- Anxiety reduces quality of work
- Fear prevents risk-taking and innovation

**Progress Metrics:**
Track progress, not perfection:
- Things shipped (regardless of quality)
- Days of consistent work
- Revision passes completed within time-box
- Times you started despite fear

**Weekly Progress Review:**
1. What did I ship this week?
2. What did I learn from shipping imperfect work?
3. Where did perfectionism slow me down?
4. What will I do differently next week?

**The Long Game:**
Perfectionism feels safe but keeps you stuck.
Progress feels risky but moves you forward.

In 1 year, would you rather have:
- 50 shipped B+ projects with real-world feedback, OR
- 5 unshipped "almost perfect" projects sitting in drafts?

Shipping builds skills faster than perfecting.`
        }
      ]
    }
  ],
  actionPlan: [
    { id: "day1", day: 1, task: "The Perfectionism Audit", description: "Track your revision time today. Identify perfectionism triggers and your harshest self-criticism patterns." },
    { id: "day2", day: 2, task: "Define Your First Good Enough Criteria", description: "Pick one project and write 5 specific, objective completion criteria." },
    { id: "day3", day: 3, task: "Practice the 2-Minute Start", description: "Use the 2-minute start protocol on a task you've been avoiding." },
    { id: "day4", day: 4, task: "Set Your First Creation Time-Box", description: "Estimate a task, multiply by 1.5, and commit to stopping when timer rings." },
    { id: "day5", day: 5, task: "Practice the Ugly First Draft", description: "Write something badly on purpose. No editing during creation." },
    { id: "day6", day: 6, task: "Set a Revision Time-Box", description: "For today's work, limit revision to 50% of creation time. Use priority-based editing." },
    { id: "day7", day: 7, task: "Weekly Review", description: "What did you ship this week? Where did perfectionism slow you down?" },
    { id: "day8", day: 8, task: "Ship Something Imperfect", description: "Send, publish, or submit something at B+ quality. Notice what happens." },
    { id: "day9", day: 9, task: "Practice the Friend Filter", description: "Catch harsh self-talk today. Ask 'Would I say this to a friend?'" },
    { id: "day10", day: 10, task: "External Accountability Setup", description: "Tell someone about a project and commit to a ship date." },
    { id: "day11", day: 11, task: "The Pre-Mortem Exercise", description: "Before shipping today's work, ask: What's the worst that could happen?" },
    { id: "day12", day: 12, task: "Track Actual Outcomes", description: "Review something you shipped imperfectly. What was the actual outcome vs. feared outcome?" },
    { id: "day13", day: 13, task: "Reduce Revision Passes", description: "Limit yourself to exactly 2 revision passes on today's work." },
    { id: "day14", day: 14, task: "Week 2 Review", description: "Count things shipped vs. things perfectionism-blocked. Adjust for week 3." },
    { id: "day15", day: 15, task: "Practice Self-Compassion", description: "When you catch harsh self-talk today, use the 3-step self-compassion practice." },
    { id: "day16", day: 16, task: "Ship Without Checking Twice", description: "Complete something and send it without re-reading. Trust your work." },
    { id: "day17", day: 17, task: "Define Good Enough for 3 Projects", description: "Create completion criteria for your three most important current projects." },
    { id: "day18", day: 18, task: "Time-Box a Scary Task", description: "Apply time-boxing to something you've been avoiding due to fear of imperfection." },
    { id: "day19", day: 19, task: "The 10-10-10 Exercise", description: "For each decision to revise further, ask: How will I feel in 10 min/months/years?" },
    { id: "day20", day: 20, task: "Celebrate Imperfect Wins", description: "List 3 things you shipped this month that weren't 'perfect' but were good enough." },
    { id: "day21", day: 21, task: "Week 3 Review", description: "Is shipping getting easier? Where does perfectionism still have power?" },
    { id: "day22", day: 22, task: "Practice Priority-Based Editing", description: "For all revision today, focus ONLY on Priority 1 items." },
    { id: "day23", day: 23, task: "Build Your Imperfect Action Log", description: "Document 3 past times imperfect work had positive or neutral outcomes." },
    { id: "day24", day: 24, task: "Shorten Your Time-Boxes", description: "Reduce creation and revision time by 25%. See what you can accomplish faster." },
    { id: "day25", day: 25, task: "External Deadline Practice", description: "Set a deadline with someone else. Ship when the deadline arrives, not when perfect." },
    { id: "day26", day: 26, task: "Reframe Perfectionism", description: "Write down how perfectionism has cost you (delayed projects, stress, missed opportunities)." },
    { id: "day27", day: 27, task: "Practice Starting Fast", description: "Start 3 different tasks using the 2-minute start. Build starting momentum." },
    { id: "day28", day: 28, task: "Week 4 Review", description: "Compare your shipping rate week 1 vs. week 4. What's changed?" },
    { id: "day29", day: 29, task: "Document Your System", description: "Write down your personalized Good Enough system. Time-boxes, criteria, accountability." },
    { id: "day30", day: 30, task: "Plan Month 2", description: "Set shipping goals for next month. Continue building the imperfect progress habit." }
  ],
  recommendedTools: [
    "todoist",
    "notion",
    "focusmate",
    "google-calendar",
    "toggl-track",
    "momentum"
  ]
};

// Novelty Seeker Playbook Content
export const noveltySeekerPlaybook: PlaybookContent = {
  archetype: "novelty-seeker",
  title: "The Novelty Seeker Playbook",
  subtitle: "From scattered starts to satisfying completions",
  chapters: [
    {
      id: "understanding",
      title: "Understanding Your Archetype",
      sections: [
        {
          id: "core-traits",
          title: "Your Core Traits",
          content: `As a Novelty Seeker, you have an endless supply of ideas and enthusiasm. You see patterns and possibilities others miss. But that same gift makes it hard to stay focused when the initial excitement fades.

**Your 4 Axes Profile:**
- Structure: LOW (Flexible - resists rigid routines and plans)
- Motivation: HIGH (Extrinsic - driven by external novelty, rewards, recognition)
- Focus: HIGH (Big Picture - sees patterns, connects ideas, strategic thinking)
- Task: HIGH (Idea-Oriented - generates ideas constantly, struggles with execution)

**Your Core Problem:**
You start projects with intense enthusiasm, but interest fades when novelty wears off. You have 20 unfinished projects, constantly chase the "next big idea," and struggle to execute through the boring middle. You need constant stimulation and new challenges to stay engaged.

**What Happens Neurologically:**
- Novel project → Dopamine spike → High motivation
- Same project Week 2 → Dopamine drops → Lower motivation
- Same project Week 3 → Dopamine baseline → No motivation
- New project → Dopamine spike returns → High motivation

You're not "easily distracted." You're chasing dopamine.

**Your Superpowers:**
- Exceptional at generating innovative ideas
- See connections and patterns others miss
- High enthusiasm that inspires others
- Comfortable with ambiguity and change
- Natural curiosity that drives learning

**Your Growth Areas:**
- Many started projects, few finished
- Interest fades when novelty wears off
- Struggle with the "boring middle"
- Difficulty saying no to new ideas
- Can abandon commitments when excitement fades`
        },
        {
          id: "science-behind",
          title: "The Science Behind Your Productivity Style",
          content: `Your productivity style is grounded in neuroscience:

**The Research on Novelty:**

Traditional productivity advice says: "Focus on ONE thing until complete."
For Novelty Seekers, this is torture. Your brain craves variety.

Studies show:
- Novelty activates dopamine pathways (pleasure/reward system)
- Novel stimuli increase attention and motivation
- Repetitive tasks reduce dopamine → Reduced motivation
- "Variety seeking" is a stable personality trait

**Citation:** Kahn, B. E., & Ratner, R. K. (2005). "Variety for the Sake of Variety? Diversification Motives in Consumer Choice." In Inside Consumption: Consumer Motives, Goals, and Desires.

**Traditional Single-Focus Approach (Why It Fails):**
- Week 1: Work on Project A (exciting!)
- Week 2: Work on Project A (still interesting)
- Week 3: Work on Project A (boring now...)
- Week 4: Abandon Project A, start Project B (new excitement!)
- Result: 10 started projects, 0 finished

**Project Rotation System (Why It Works):**
Instead of forcing focus on ONE project, you work on MULTIPLE projects with strategic rotation. Each project feels "new" every time you return to it fresh.`
        }
      ]
    },
    {
      id: "optimization",
      title: "Framework 1: Project Rotation System",
      sections: [
        {
          id: "rotation-structure",
          title: "Setting Up Your Rotation",
          content: `**The Structure:**
- 3-4 active projects simultaneously
- Rotate between them on schedule
- Each project gets novelty of "returning to it fresh"
- Built-in variety prevents boredom
- Structured completion prevents abandonment

**Weekly Rotation Template:**

**MONDAY:**
AM: Project 1 (fresh start to week)
PM: Admin/email/small tasks

**TUESDAY:**
AM: Project 2 (novelty of switching)
PM: Project 1 overflow

**WEDNESDAY:**
AM: Project 3 (new context again)
PM: Project 2 overflow

**THURSDAY:**
AM: Project 4 or back to Project 1 (feels fresh)
PM: Catch-up day

**FRIDAY:**
AM: Shipping focus (finish what you can)
PM: Planning next week + idea processing

**Why This Works:**
- Monday: Project A (feels fresh after weekend)
- Tuesday: Project B (novelty of switching)
- Wednesday: Project C (new context again)
- Thursday: Project A (feels fresh after 2-day break)
- Friday: Wrap-up day (variety of finishing multiple things)

Each project feels "new" every time you return to it.`
        },
        {
          id: "project-selection",
          title: "Choosing Your Active Projects",
          content: `**The Project Audit:**

List EVERY project you've started but not finished. This is painful but necessary.

Novelty Seeker average: 20-40 unfinished projects

**Project Tiering:**

**TIER A: KEEP (Scores 7+)**
- High excitement AND value
- Worth completing
- Move forward

**TIER B: PAUSE (Scores 5-6)**
- Medium interest
- Put in "parking lot"
- Revisit in 3 months

**TIER C: ABANDON (Scores 1-4)**
- Low excitement AND value
- Or unrealistic
- LET THEM GO

**The Hard Truth:**
Trying to do everything = Finishing nothing
Better: Finish 3-4 great projects than start 30 mediocre ones

**Selection Criteria for Active Projects:**
1. Does this excite me right now?
2. Does completing this create real value?
3. Can I make meaningful progress in 2 weeks?
4. Is this aligned with my current goals?

If yes to all 4, it's a candidate for your rotation.`
        }
      ]
    },
    {
      id: "challenges",
      title: "Overcoming the Boring Middle",
      sections: [
        {
          id: "middle-strategies",
          title: "Getting Through the Messy Middle",
          content: `Every project has a "boring middle" - the phase after initial excitement fades but before completion satisfaction arrives.

**The Novelty Injection Protocol:**

When you feel boredom setting in:

1. **Change the environment:** Work from a different location
2. **Change the format:** If writing, switch to voice recording
3. **Change the approach:** Try a completely different method
4. **Add novelty within the project:** Start a different section
5. **Gamify it:** Set a challenge, compete with yourself

**The Commitment Device:**
External stakes help when internal motivation fades:
- Public announcement of ship date
- Money on the line (Beeminder, StickK)
- Accountability partner check-ins
- Team collaboration (others depending on you)

**The "Future Self" Letter:**
When starting a project with high enthusiasm, write a letter to your future self who will want to abandon it:
- Why this project matters
- What completing it will feel like
- Why past-you committed to this
- Permission to finish it imperfectly

Read this letter when motivation drops.`
        },
        {
          id: "new-idea-management",
          title: "Managing New Ideas",
          content: `New ideas will always come. The goal isn't to stop having them - it's to manage them without abandoning current projects.

**The Idea Capture Protocol:**

When a new exciting idea strikes:
1. CAPTURE it (write it down immediately)
2. PARK it (put in Ideas folder, not Active Projects)
3. RETURN to current work
4. SCHEDULE review (weekly, evaluate new ideas)

**The 2-Week Rule:**
New ideas must wait 2 weeks before becoming active projects.
- If still excited after 2 weeks, consider adding to rotation
- Most ideas lose their appeal after the dopamine fades
- This filters impulse starts from genuine opportunities

**The One-In-One-Out Rule:**
Before adding a new project to your rotation:
- One active project must be completed OR officially abandoned
- No exceptions
- This prevents project pile-up

**Weekly Idea Processing (Friday PM):**
1. Review all captured ideas from the week
2. Rate each: Excitement (1-10) + Value (1-10)
3. Ideas scoring <14 total: Archive
4. Ideas scoring 14+: Add to "candidates" for when a slot opens
5. Continue with current rotation until a project completes`
        }
      ]
    },
    {
      id: "advanced",
      title: "Advanced Strategies",
      sections: [
        {
          id: "shipping",
          title: "The Art of Finishing",
          content: `For Novelty Seekers, finishing is the hardest skill to develop. Here's how to build it:

**Define "Done" at the Start:**
Before ANY project, write:
- Minimum Viable Version: [specific deliverable]
- Ship Date: [specific date]
- Done Criteria: [3-5 checkboxes]

**The 80% Rule:**
Your project at 80% is better than 100% that never ships.
- Perfectionism is novelty-seeking in disguise ("just one more improvement...")
- Ship the B+ version
- Iterate based on real feedback

**Celebrate Completions:**
Your brain needs completion rewards to associate finishing with pleasure:
- Track your "shipped" list visibly
- Reward yourself for each completion (not just starting)
- Share completions publicly for social reward
- Review your wins weekly

**The Finish Sprint:**
When a project is 80% done, declare a "finish sprint":
- Block 2-4 hours
- No other projects during this time
- One goal: Ship
- Accountability partner if possible`
        },
        {
          id: "sustainable",
          title: "Building Sustainable Variety",
          content: `The goal isn't to eliminate variety-seeking - it's to channel it productively.

**Variety Within Structure:**
- Different projects on different days (rotation)
- Different tasks within each project session
- Different locations for different work types
- Different music/ambiance for different phases

**Legitimate Novelty Sources:**
- Learning new skills (related to current projects)
- Meeting new people (potential collaborators)
- Exploring new tools (for current work)
- Reading broadly (input for creative work)

**The 80/20 Rule for Ideas:**
- 80% of your work time: Active rotation projects
- 20% of your work time: Exploration and new ideas

This gives your novelty-seeking brain what it needs while maintaining completion focus.

**Monthly Project Review:**
1. What did I complete this month?
2. What projects are stalled? Why?
3. What should I abandon officially?
4. What new projects are genuinely worth starting?
5. Am I maintaining healthy rotation or falling into old patterns?`
        }
      ]
    }
  ],
  actionPlan: [
    { id: "day1", day: 1, task: "The Unfinished Project Audit", description: "List EVERY project you've started but not finished. Count them. Face the reality." },
    { id: "day2", day: 2, task: "Score Your Projects", description: "Rate each project: Excitement (1-10) + Value (1-10). Calculate totals." },
    { id: "day3", day: 3, task: "Tier Your Projects", description: "Sort into Tier A (keep), Tier B (pause), Tier C (abandon). Be ruthless." },
    { id: "day4", day: 4, task: "Choose Your Rotation", description: "Select 3-4 Tier A projects for your active rotation. No more than 4." },
    { id: "day5", day: 5, task: "Create Completion Plans", description: "For each active project, define: Done criteria, ship date, and what makes it boring." },
    { id: "day6", day: 6, task: "Build Your Weekly Schedule", description: "Assign each project to specific days. Create your rotation template." },
    { id: "day7", day: 7, task: "Week 1 Review", description: "How did the rotation feel? Adjust scheduling if needed." },
    { id: "day8", day: 8, task: "Set Up Idea Capture", description: "Create your Ideas folder/file. Practice the capture-park-return protocol." },
    { id: "day9", day: 9, task: "Work Your Rotation", description: "Follow your schedule. Notice when novelty injection is needed." },
    { id: "day10", day: 10, task: "Practice the 2-Week Rule", description: "Any new ideas today? Capture them but don't act. Let them wait." },
    { id: "day11", day: 11, task: "Novelty Injection Practice", description: "When boredom hits, try changing environment or approach. Document what works." },
    { id: "day12", day: 12, task: "Write Your Future Self Letter", description: "For your most important project, write a letter to your future unmotivated self." },
    { id: "day13", day: 13, task: "Process Captured Ideas", description: "Review all ideas from this week. Score them. Archive low-scorers." },
    { id: "day14", day: 14, task: "Week 2 Review", description: "Are you maintaining your rotation? What's working? What needs adjustment?" },
    { id: "day15", day: 15, task: "Define Done for All Projects", description: "Ensure every active project has clear done criteria and ship date." },
    { id: "day16", day: 16, task: "Set Up Commitment Device", description: "Tell someone about your ship dates. Create external accountability." },
    { id: "day17", day: 17, task: "Focus on Finishing", description: "Today's goal: Make progress toward completion, not just interesting exploration." },
    { id: "day18", day: 18, task: "Practice One-In-One-Out", description: "If you want to add a new project, which current one must complete or be abandoned?" },
    { id: "day19", day: 19, task: "Tackle the Boring Middle", description: "Work on the least exciting part of one project. Use novelty injection strategies." },
    { id: "day20", day: 20, task: "Celebrate a Win", description: "Complete something (even small). Celebrate visibly. Train your brain to value finishing." },
    { id: "day21", day: 21, task: "Week 3 Review", description: "How many completions? How is the rotation system working?" },
    { id: "day22", day: 22, task: "80% Check", description: "Is any project at 80%? If so, schedule a finish sprint." },
    { id: "day23", day: 23, task: "Finish Sprint", description: "Block 2-4 hours. Ship something. No new starts until something completes." },
    { id: "day24", day: 24, task: "Review Abandoned Projects", description: "Look at Tier C. Officially let them go. Feel the relief of closure." },
    { id: "day25", day: 25, task: "Sustainable Variety Check", description: "Are you getting enough novelty within your structure? Adjust if needed." },
    { id: "day26", day: 26, task: "Process New Ideas (2-Week Test)", description: "Review ideas captured 2+ weeks ago. Still excited? Consider for next slot." },
    { id: "day27", day: 27, task: "Analyze Your Completions", description: "What helped you finish? What patterns led to abandonment?" },
    { id: "day28", day: 28, task: "Week 4 Review", description: "Compare to Day 1. How many fewer unfinished projects? How many completions?" },
    { id: "day29", day: 29, task: "Document Your System", description: "Write down your personalized rotation system. Capture what works for you." },
    { id: "day30", day: 30, task: "Plan Month 2", description: "Set completion goals for next month. Continue the rotation system." }
  ],
  recommendedTools: [
    "notion",
    "trello",
    "todoist",
    "focusmate",
    "beeminder",
    "google-calendar"
  ]
};

// Strategic Planner Playbook Content
export const strategicPlannerPlaybook: PlaybookContent = {
  archetype: "strategic-planner",
  title: "The Strategic Planner Playbook",
  subtitle: "From endless planning to strategic execution",
  chapters: [
    {
      id: "understanding",
      title: "Understanding Your Archetype",
      sections: [
        {
          id: "core-traits",
          title: "Your Core Traits",
          content: `As a Strategic Planner, you're a natural strategist who sees the big picture and creates comprehensive plans. You love systems, frameworks, and optimization. But that same strength can become a trap when planning replaces doing.

**Your 4 Axes Profile:**
- Structure: HIGH (Loves systems, planning, organization, processes)
- Motivation: HIGH (Extrinsic - driven by goals, milestones, metrics, achievement)
- Focus: HIGH (Big Picture - strategic thinking, sees connections, patterns, long-term)
- Task: MIXED (Balanced between ideas and execution, but leans toward planning phase)

**Your Core Problem:**
You spend 90% of your time planning and 10% executing. You create elaborate systems, perfect strategies, detailed roadmaps - then struggle to actually DO the work. Analysis paralysis. Over-optimization. Planning becomes procrastination. You need permission to execute imperfectly and systems that force action over endless refinement.

**Your Typical Time Allocation:**
- 90% planning/optimizing/strategizing
- 10% executing/doing/shipping

**Result:** Perfect plans, minimal results.

**Your Superpowers:**
- Exceptional at seeing the big picture
- Natural systems thinker
- Creates comprehensive strategies
- Strong analytical abilities
- Great at optimization and efficiency

**Your Growth Areas:**
- Overthinking and analysis paralysis
- Planning as procrastination
- Difficulty starting without "perfect" plan
- May optimize endlessly instead of shipping
- Can get lost in strategy at expense of action`
        },
        {
          id: "science-behind",
          title: "The Science Behind Your Productivity Style",
          content: `Your productivity style has a hidden trap:

**The Research on Planning vs. Execution:**

Strategic Planners have a cognitive bias toward planning over execution. Studies show:
- Planning feels productive (but doesn't create results)
- Planning is comfortable (low risk, high control)
- Execution feels risky (actual consequences, uncertainty)
- Over-planning is sophisticated procrastination

**The Pareto Principle (80/20 Rule):**
- 80% of results come from 20% of actions
- Most planning is in the 80% (low-impact)
- Execution is in the 20% (high-impact)

**Citation:** Koch, R. (2011). The 80/20 Principle: The Secret to Achieving More with Less. Crown Business.

**The Core Problem:**
You mistake planning for progress.

**Example "Productive" Day for Strategic Planner:**
- Researched 12 productivity systems
- Created color-coded project tracker
- Optimized task management workflow
- Planned next quarter's strategy
- Refined goal-setting framework
- Actual work completed: 0

Planning feels like work (neurologically, it activates similar brain regions).
But: Planning ≠ Execution. Strategy ≠ Results.`
        }
      ]
    },
    {
      id: "optimization",
      title: "Framework 1: The 80/20 Action Bias",
      sections: [
        {
          id: "ratio-flip",
          title: "Flipping Your Ratio",
          content: `**Your Current Allocation:**
- 90% planning/optimizing/strategizing
- 10% executing/doing/shipping

**Optimal Allocation:**
- 20% planning (good enough strategy)
- 80% executing (imperfect action)

**Result:** Imperfect plans, actual results.

**How to Track Your Ratio:**

Create a tracking sheet:
| TIME | ACTIVITY | PLANNING or DOING? |
|------|----------|-------------------|
| 9:00-9:30 | Research tools | PLANNING |
| 9:30-10:00 | Write blog post | DOING |
| 10:00-10:30 | Optimize calendar | PLANNING |

**PLANNING activities include:**
- Researching tools/systems
- Creating frameworks
- Organizing files
- Making lists
- Strategic planning
- Optimizing workflows
- Reading about productivity
- Designing systems
- Refining strategies

**DOING activities include:**
- Writing actual content
- Building actual product
- Having actual client conversation
- Coding actual features
- Making actual sales call
- Shipping actual deliverable
- Creating actual thing (not plan for thing)

**Your Goal:** Get to 20% planning, 80% doing.`
        },
        {
          id: "time-boxing",
          title: "Time-Boxing Your Planning",
          content: `**The 15-Minute Planning Cap:**

For any task, your planning is limited to 15 minutes. Then you MUST execute.

**The Protocol:**
1. Set timer for 15 minutes
2. Plan quickly (not perfectly)
3. When timer rings, STOP planning
4. Start executing immediately
5. Adjust plan while doing (not before)

**Why This Works:**
- Most plans don't survive first contact with reality anyway
- You'll learn more from 30 minutes of doing than 3 hours of planning
- Execution reveals what actually matters (planning just guesses)
- Done > Perfect

**The "Good Enough" Plan:**
Your plan needs ONLY:
- Clear objective (what you're trying to accomplish)
- First action step (what you'll do first)
- Rough timeline (when you'll work on it)

That's it. Everything else is procrastination disguised as preparation.

**Permission Slip:**
"I give myself permission to execute an imperfect plan. I will learn from doing, not from planning."

Write this somewhere visible.`
        }
      ]
    },
    {
      id: "challenges",
      title: "Breaking Planning Addiction",
      sections: [
        {
          id: "action-forcing",
          title: "Action-Forcing Mechanisms",
          content: `Strategic Planners need external forcing functions to start executing.

**The 2-Minute Action Rule:**
Before ANY planning session, complete a 2-minute action related to the project.
- Write one sentence
- Make one call
- Send one email
- Build one thing

This breaks the planning-first pattern.

**Implementation Intentions:**
Instead of: "I'll work on the project this week"
Write: "On Tuesday at 9am, I will [specific action] in [specific location]"

Research shows implementation intentions dramatically increase follow-through.

**The Bias Toward Action:**
When you catch yourself planning:
1. STOP
2. Ask: "What's ONE thing I could DO right now?"
3. DO that thing
4. Resume planning only if genuinely needed

**The Public Commitment:**
Tell someone: "I will ship [specific deliverable] by [specific date]"
External deadlines force action when internal motivation fails.`
        },
        {
          id: "reduce-planning",
          title: "Reducing Unnecessary Planning",
          content: `**The Planning Audit:**

For each planning activity, ask:
1. Will this directly improve my execution?
2. Am I learning something new, or just reorganizing what I know?
3. Could I start executing with what I already have?
4. Is this planning or procrastination?

**Signs Planning Has Become Procrastination:**
- You've researched the same decision multiple times
- You're optimizing a system you haven't used yet
- You're planning a project you haven't started
- You feel busy but haven't shipped anything
- Your plans have more structure than your results

**The Minimum Viable Plan:**
Most projects need only:
1. What am I making? (one sentence)
2. Who is it for? (one sentence)
3. When will I ship? (specific date)
4. What's my first action? (specific task)

Everything beyond this is optional until you've started.

**Planning Detox:**
For one week, try zero formal planning.
- Just do the next obvious thing
- Adjust as you go
- Notice: Does quality actually suffer?

Most Strategic Planners discover they can execute effectively with far less planning than they think.`
        }
      ]
    },
    {
      id: "advanced",
      title: "Advanced Strategies",
      sections: [
        {
          id: "shipping",
          title: "Building a Shipping Habit",
          content: `Strategic Planners often have many plans and few shipped results. Here's how to flip that:

**The Weekly Ship Requirement:**
Every week, you MUST ship something.
- Not plan something
- Not almost finish something
- SHIP something

Even if it's small. Even if it's imperfect. Shipping builds the habit.

**Define "Ship":**
- Made public (published, sent, delivered)
- Complete enough to use (not perfect, usable)
- Received by intended audience
- Out of your control

**Shipping Cadence:**
- Daily: Ship something small (email, update, small task)
- Weekly: Ship something medium (article, feature, deliverable)
- Monthly: Ship something significant (project, product, major outcome)

**Track Your Ships:**
Keep a visible "shipped" list:
- Date
- What I shipped
- Impact (even if small)

Review weekly. Celebrate shipping, not planning.`
        },
        {
          id: "sustainable",
          title: "Sustainable Strategy + Action",
          content: `The goal isn't to eliminate planning - you're naturally good at it. The goal is balance.

**Strategic Planning Sessions (Scheduled):**
- Weekly: 30-minute planning session (max)
- Monthly: 2-hour strategic review
- Quarterly: Half-day deep planning

**Outside These Sessions:**
Default to ACTION, not planning.

**The 5:1 Rule:**
For every 1 hour of planning, you should have 5 hours of execution.
Track this ratio. Adjust if needed.

**Signs You've Found Balance:**
- You ship regularly
- Plans are "good enough," not perfect
- You adjust while doing, not before
- You feel momentum, not paralysis
- Results match your strategic capability

**Monthly Review Questions:**
1. What did I ship this month?
2. What did I plan but not execute?
3. What planning was unnecessary?
4. What actions had the biggest impact?
5. Am I closer to 20/80 ratio?

Strategic Planners who execute become unstoppable. Your strategic mind + action bias = exceptional results.`
        }
      ]
    }
  ],
  actionPlan: [
    { id: "day1", day: 1, task: "Track Everything", description: "Use a timer to track every activity. Categorize as Planning or Doing. Calculate your ratio." },
    { id: "day2", day: 2, task: "Calculate Your Baseline", description: "Review yesterday's tracking. What was your actual Planning:Doing ratio?" },
    { id: "day3", day: 3, task: "Practice the 2-Minute Action Rule", description: "Before any planning today, complete a 2-minute action first." },
    { id: "day4", day: 4, task: "Time-Box Your Planning", description: "For any project, limit planning to 15 minutes. Then execute." },
    { id: "day5", day: 5, task: "Ship Something Small", description: "Publish, send, or deliver something today. Size doesn't matter. Shipping does." },
    { id: "day6", day: 6, task: "Write Your Permission Slip", description: "Write down: 'I give myself permission to execute imperfectly.' Put it where you'll see it." },
    { id: "day7", day: 7, task: "Week 1 Review", description: "How did your ratio change? What did you ship? Where did planning become procrastination?" },
    { id: "day8", day: 8, task: "Create Implementation Intentions", description: "For your 3 most important tasks, write specific when/where/what statements." },
    { id: "day9", day: 9, task: "The Minimum Viable Plan", description: "Start a project with only: What, Who, When, First Action. Nothing more." },
    { id: "day10", day: 10, task: "Action Before Planning", description: "Today, do 30 minutes of execution before any planning activities." },
    { id: "day11", day: 11, task: "Public Commitment", description: "Tell someone about a specific deliverable and deadline. Create external accountability." },
    { id: "day12", day: 12, task: "Planning Audit", description: "Review your recent planning activities. Which were necessary? Which were procrastination?" },
    { id: "day13", day: 13, task: "Ship Something Medium", description: "Complete and deliver a more substantial piece of work today." },
    { id: "day14", day: 14, task: "Week 2 Review", description: "Compare your ratio to week 1. Are you moving toward 20/80?" },
    { id: "day15", day: 15, task: "Planning Detox Day", description: "Today: zero formal planning. Just do the next obvious thing. Notice what happens." },
    { id: "day16", day: 16, task: "Continue Detox", description: "Second day of no formal planning. Adjust while doing, not before." },
    { id: "day17", day: 17, task: "Detox Reflection", description: "Did quality suffer without extensive planning? What did you learn?" },
    { id: "day18", day: 18, task: "Set Up Shipping Cadence", description: "Define what you'll ship daily, weekly, and monthly. Create the rhythm." },
    { id: "day19", day: 19, task: "Track Your Ships", description: "Create a visible 'shipped' list. Add everything you've shipped this month." },
    { id: "day20", day: 20, task: "Apply the 5:1 Rule", description: "For today, aim for 5 hours of execution for every 1 hour of planning." },
    { id: "day21", day: 21, task: "Week 3 Review", description: "How many ships? What's your ratio trend? What's working?" },
    { id: "day22", day: 22, task: "Strategic Session (Time-Boxed)", description: "Do your weekly planning - but limit it to 30 minutes maximum." },
    { id: "day23", day: 23, task: "Bias Toward Action Practice", description: "Whenever you catch yourself planning, stop and ask: What can I DO right now?" },
    { id: "day24", day: 24, task: "Review Unexecuted Plans", description: "Look at plans you made but didn't execute. Why? What would change that?" },
    { id: "day25", day: 25, task: "Ship Something Significant", description: "Complete and deliver a meaningful project or deliverable." },
    { id: "day26", day: 26, task: "Measure Impact of Ships", description: "Review your ships this month. What impact did they have? What did you learn?" },
    { id: "day27", day: 27, task: "Optimize Your Ratio", description: "Based on 27 days of data, what's your optimal planning:doing ratio?" },
    { id: "day28", day: 28, task: "Week 4 Review", description: "Compare to Day 1. How has your ratio changed? How many ships?" },
    { id: "day29", day: 29, task: "Document Your System", description: "Write down your personalized action-bias system. What worked for you?" },
    { id: "day30", day: 30, task: "Plan Month 2 (In 15 Minutes)", description: "Using what you've learned, plan month 2. In 15 minutes. Then start executing." }
  ],
  recommendedTools: [
    "todoist",
    "notion",
    "google-calendar",
    "toggl-track",
    "focusmate",
    "beeminder"
  ]
};

// Flexible Improviser Playbook Content
export const flexibleImproviserPlaybook: PlaybookContent = {
  archetype: "flexible-improviser",
  title: "The Flexible Improviser Playbook",
  subtitle: "From forced schedules to energy-aligned flow",
  chapters: [
    {
      id: "understanding",
      title: "Understanding Your Archetype",
      sections: [
        {
          id: "core-traits",
          title: "Your Core Traits",
          content: `As a Flexible Improviser, you work best when you can flow with your natural energy. You're highly productive in bursts, hate rigid schedules, and thrive on spontaneity. Traditional productivity advice feels like a cage.

**Your 4 Axes Profile:**
- Structure: LOW (Prefers flexibility, spontaneity, adapting in the moment, hates rigid systems)
- Motivation: LOW (Intrinsic - driven by interest, enjoyment, curiosity, internal satisfaction)
- Focus: LOW (Detail-oriented - focuses on immediate tasks, concrete details, present moment)
- Task: EXECUTION (Strong at doing when inspired, prefers action over planning)

**Your Core Problem:**
You work in bursts when inspired but struggle with consistency. You're excellent at execution when motivated, but motivation is unreliable. You abandon projects when they become "work" instead of "fun." You hate schedules, systems, and anything that feels like obligation. You need enough structure to maintain momentum without killing your flexibility and spontaneity.

**Your Pattern Without Energy Alignment:**
- Monday: High energy, work 8 hours, get tons done
- Tuesday: Medium energy, force 8 hours, feel drained
- Wednesday: Low energy, force 8 hours, burnout
- Thursday: Depleted, can't work, guilt spiral
- Friday: Still depleted, project abandoned

This is why you can't maintain momentum - you're forcing work during energy valleys.

**Your Superpowers:**
- Exceptional execution when inspired
- Natural ability to adapt and improvise
- Comfortable with uncertainty
- High energy bursts of impressive productivity
- Authenticity - you do what genuinely interests you

**Your Growth Areas:**
- Inconsistent output patterns
- Struggle with sustained commitment
- Projects abandoned when fun fades
- Resistance to external structure
- Guilt about not being "consistent"`
        },
        {
          id: "science-behind",
          title: "The Science Behind Your Productivity Style",
          content: `Your productivity style is grounded in ultradian rhythms and intrinsic motivation research:

**The Research on Energy-Aligned Work:**

Flexible Improvisers have high sensitivity to internal energy states. Studies show:
- Energy levels fluctuate throughout day (ultradian rhythms)
- Working against energy creates resistance and burnout
- Working with energy creates flow and productivity
- Forcing consistency when energy is low depletes motivation

**Citation:** Rossi, E. L. (1991). The 20-Minute Break: Reduce Stress, Maximize Performance, and Improve Health and Emotional Well-Being Using the New Science of Ultradian Rhythms. Tarcher.

**Your Energy Pattern:**
- High energy bursts (highly productive, in flow)
- Low energy valleys (resistant, unfocused)
- Energy changes unpredictably (not consistent daily)
- External schedules feel oppressive (clash with internal rhythms)

**Traditional Productivity Advice (Why It Fails for You):**
- "Work 9-5 every day" (ignores energy)
- "Consistent routine" (forces work during low energy)
- "Push through resistance" (depletes motivation)

**Result:** Burnout, abandoned projects, productivity guilt.

The solution isn't more discipline - it's working WITH your natural patterns.`
        }
      ]
    },
    {
      id: "optimization",
      title: "Framework 1: Energy-Aligned Workflow",
      sections: [
        {
          id: "energy-tracking",
          title: "Understanding Your Energy Patterns",
          content: `Before optimizing, you need to understand your patterns.

**Week 1: Energy Tracking**

Every 2 hours, log:
- Energy level (1-10)
- Could you do focused work right now? (Y/N)
- Notes (what influenced energy?)

**Energy Scale:**
- 1-3: Depleted, can't focus
- 4-6: Medium, can work with effort
- 7-10: High, ready to work

**Track These Variables:**

**Time of Day:**
- Morning (6-10am): Usually ___ energy
- Midday (10am-2pm): Usually ___ energy
- Afternoon (2-6pm): Usually ___ energy
- Evening (6-10pm): Usually ___ energy

**Day of Week:**
- Some days may be consistently higher/lower
- Notice weekly patterns

**After Activities:**
- After meetings: ___ energy
- After exercise: ___ energy
- After social time: ___ energy
- After deep work: ___ energy

By Day 7, you'll see patterns. Morning person or evening person? Energy dips after certain activities? Days that are consistently better?`
        },
        {
          id: "energy-schedule",
          title: "Designing Your Energy-Aligned Schedule",
          content: `Once you know your patterns, design around them.

**Identify Your HIGH Energy Windows:**
Times/situations when energy is typically 7+. These are your PRIME WORK TIMES.

**Identify Your LOW Energy Windows:**
Times/situations when energy is typically <5. These are your REST TIMES (don't force work).

**The Energy-Aligned Template:**

**HIGH Energy Time (7+):**
- Most important work
- Creative/challenging tasks
- Tasks that require full focus
- Protect this time aggressively

**MEDIUM Energy Time (4-6):**
- Admin tasks
- Email and communication
- Routine tasks that need doing
- Collaborative/social work

**LOW Energy Time (<4):**
- Rest (guilt-free)
- Light reading/learning
- Planning tomorrow
- Movement/walk

**The Flexible Schedule:**
Instead of rigid time blocks, use energy-based priorities:
- When energy is high → Work on [Priority Project]
- When energy is medium → Work on [Admin/Routine]
- When energy is low → Rest or do [Low-Energy Tasks]

Check energy every 2 hours. Work accordingly.`
        }
      ]
    },
    {
      id: "challenges",
      title: "Building Sustainable Momentum",
      sections: [
        {
          id: "minimum-viable",
          title: "The Minimum Viable Progress System",
          content: `The challenge: How do you maintain momentum when energy is unpredictable?

**The Minimum Viable Day (MVD):**

Even on your lowest energy day, commit to ONE small action:
- 10 minutes of work on priority project
- One email sent
- One paragraph written
- One task completed

That's it. This maintains momentum without forcing unsustainable effort.

**Why MVD Works:**
- Keeps project alive in your mind
- Prevents complete abandonment
- Builds evidence of consistent (not intense) effort
- Reduces guilt on low-energy days
- Starting often creates unexpected momentum

**The MVD Contract:**
"On days when energy is low, I commit to [ONE SPECIFIC SMALL ACTION]. This is enough. I am not required to do more."

Write this down. Refer to it on hard days.

**Intensity Cycling:**
- High energy day: Work 4-8 hours (ride the wave)
- Medium energy day: Work 2-4 hours (sustainable effort)
- Low energy day: MVD only (10-30 minutes)

This is not inconsistency - it's working WITH your nature.`
        },
        {
          id: "project-maintenance",
          title: "Keeping Projects Alive",
          content: `Flexible Improvisers often abandon projects when interest fades. Here's how to maintain enough structure:

**The Weekly Touch:**
Every project gets touched at least once per week, even if briefly.
- 10 minutes minimum
- Review where you left off
- Do one small thing
- Note next step

This prevents complete abandonment and keeps context fresh.

**The Interest Renewal Protocol:**

When you feel project interest fading:
1. PAUSE (don't immediately abandon)
2. ASK: "What part of this is still interesting?"
3. PIVOT: Can you change your approach to make it interesting again?
4. CONNECT: Remind yourself why you started this
5. EVALUATE: Is this legitimately done, or are you just bored?

**Legitimate vs. Emotional Abandonment:**

**Legitimate reasons to stop:**
- Project is actually complete (enough)
- Circumstances have changed
- Better opportunity aligned with goals
- Project was a learning experiment (learning complete)

**Emotional reasons (reconsider):**
- "It's not fun anymore"
- "I have a new idea"
- "This is taking too long"
- "I'm stuck"

Emotional reasons call for renewal, not abandonment.`
        }
      ]
    },
    {
      id: "advanced",
      title: "Advanced Strategies",
      sections: [
        {
          id: "flow-optimization",
          title: "Optimizing for Flow States",
          content: `Flexible Improvisers are particularly suited for flow states - those periods of effortless, highly productive work.

**Flow State Triggers:**

**Clear Goals:** Know exactly what you're working toward this session
**Immediate Feedback:** See progress as you work
**Challenge-Skill Balance:** Task is neither too easy nor too hard
**Focus:** Eliminate distractions completely
**Intrinsic Interest:** Work on what genuinely engages you

**Flow Preparation:**

Before a high-energy work session:
1. Clear your environment of distractions
2. Define exactly what you'll work on
3. Ensure you have everything you need
4. Set a rough time intention (but be flexible)
5. Start immediately - momentum builds flow

**Protecting Flow:**

When you're in flow:
- Don't answer calls/messages
- Don't switch tasks
- Eat/drink only if you must
- Ride the wave as long as it lasts
- This is when you do your best work

**Post-Flow:**

After a flow session:
- Note what you accomplished
- Capture where you left off
- Rest (flow is energizing but depleting)
- Don't expect to return to flow immediately`
        },
        {
          id: "sustainable-flexibility",
          title: "Sustainable Flexibility",
          content: `The goal is productivity that works WITH your flexible nature, not against it.

**Anchor Points (Minimal Structure):**

Even Flexible Improvisers benefit from a few anchor points:
- Weekly touch on each project
- Daily MVD commitment
- Weekly energy review
- Monthly project assessment

These anchors provide just enough structure without rigidity.

**The Energy-First Mindset:**

Before starting work, always ask:
- What's my energy level right now?
- What kind of work matches this energy?
- What would force me to work against my energy?

Then work accordingly.

**Permission Slips:**

Give yourself explicit permission:
- To rest on low-energy days
- To work intensely on high-energy days
- To vary your schedule based on how you feel
- To work differently than "consistent" people
- To trust your own patterns

**Signs the System Is Working:**
- You complete projects (even if not on schedule)
- You don't feel constant guilt
- High-energy bursts feel productive and fun
- Low-energy days feel restful, not shameful
- Your output over time is consistent (even if daily output varies)

**Monthly Review:**
1. What did I accomplish this month?
2. Did I honor my energy patterns?
3. What projects need more attention?
4. What did I abandon vs. legitimately complete?
5. How can I optimize for next month?`
        }
      ]
    }
  ],
  actionPlan: [
    { id: "day1", day: 1, task: "Begin Energy Tracking", description: "Create your energy tracking sheet. Log energy (1-10) every 2 hours throughout the day." },
    { id: "day2", day: 2, task: "Continue Tracking", description: "Second day of energy tracking. Note what activities affect your energy positively or negatively." },
    { id: "day3", day: 3, task: "Track and Observe", description: "Continue tracking. Are you a morning or evening person? When do energy dips happen?" },
    { id: "day4", day: 4, task: "Identify High Energy Windows", description: "Review 3 days of data. When is your energy typically 7+? These are your prime work times." },
    { id: "day5", day: 5, task: "Identify Low Energy Windows", description: "When is energy typically <5? These are your rest times - don't force work here." },
    { id: "day6", day: 6, task: "Design Your Energy-Aligned Schedule", description: "Create your first energy-aligned template. Assign task types to energy levels." },
    { id: "day7", day: 7, task: "Week 1 Review", description: "Review your energy patterns. What patterns are emerging? Adjust your template if needed." },
    { id: "day8", day: 8, task: "Practice Energy-Aligned Work", description: "Try following your energy today. Work on priorities during high energy, rest during low." },
    { id: "day9", day: 9, task: "Define Your MVD", description: "Write your Minimum Viable Day commitment. What's the ONE small action you'll do even on hardest days?" },
    { id: "day10", day: 10, task: "Implement MVD", description: "Today, focus only on your MVD. Notice how it feels to have a 'floor' instead of an 'ideal.'" },
    { id: "day11", day: 11, task: "Set Up Weekly Touch", description: "List all active projects. Schedule a weekly touch point for each one (even 10 min counts)." },
    { id: "day12", day: 12, task: "Practice Interest Renewal", description: "Pick a project where interest is fading. Apply the Interest Renewal Protocol." },
    { id: "day13", day: 13, task: "Optimize for Flow", description: "During your next high-energy window, set up for flow: clear goals, no distractions, immediate start." },
    { id: "day14", day: 14, task: "Week 2 Review", description: "How did energy-aligned work feel? What did you accomplish? What needs adjustment?" },
    { id: "day15", day: 15, task: "Refine Your Schedule", description: "Based on 2 weeks, refine your energy-aligned template. What's working? What isn't?" },
    { id: "day16", day: 16, task: "Practice Intensity Cycling", description: "High energy today? Go all in. Low energy? Stick to MVD. No guilt either way." },
    { id: "day17", day: 17, task: "Project Assessment", description: "Review all projects. Which are legitimately paused? Which need renewed attention?" },
    { id: "day18", day: 18, task: "Write Your Permission Slips", description: "Write explicit permissions: to rest, to vary, to work differently than others. Put them where you'll see them." },
    { id: "day19", day: 19, task: "Flow Day", description: "Clear schedule. When high energy hits, dive into flow. Protect it. Ride the wave." },
    { id: "day20", day: 20, task: "Rest Day (Guilt-Free)", description: "If energy is low, rest today. This is part of the system, not failure." },
    { id: "day21", day: 21, task: "Week 3 Review", description: "Three weeks in. Is the guilt reducing? Is output still happening? What patterns are clear?" },
    { id: "day22", day: 22, task: "Anchor Points Check", description: "Are you maintaining: MVD daily, weekly touches, energy awareness? Strengthen any weak anchors." },
    { id: "day23", day: 23, task: "Energy Influences Deep Dive", description: "What affects your energy? Sleep, exercise, food, social time? Note the correlations." },
    { id: "day24", day: 24, task: "Optimize Energy Sources", description: "Increase activities that boost energy. Reduce or rearrange activities that drain energy." },
    { id: "day25", day: 25, task: "Ship Something", description: "Complete and ship something this week. Use high-energy windows strategically." },
    { id: "day26", day: 26, task: "Flexibility Stress Test", description: "Something unexpected comes up? Practice adapting without guilt. This is your strength." },
    { id: "day27", day: 27, task: "Review Output Over Time", description: "Look at your month's output. Is it actually consistent over time, even if not day-to-day?" },
    { id: "day28", day: 28, task: "Week 4 Review", description: "Compare to Day 1. How has your relationship with productivity changed?" },
    { id: "day29", day: 29, task: "Document Your System", description: "Write down your personalized energy-aligned system. Include energy patterns, MVD, anchor points." },
    { id: "day30", day: 30, task: "Plan Month 2", description: "Set intentions for next month. Continue refining your sustainable, flexible productivity system." }
  ],
  recommendedTools: [
    "notion",
    "google-calendar",
    "forest",
    "focusmate",
    "toggl-track",
    "apple-notes"
  ]
};

// Adaptive Generalist Playbook Content  
export const adaptiveGeneralistPlaybook: PlaybookContent = {
  archetype: "adaptive-generalist",
  title: "The Adaptive Generalist Playbook",
  subtitle: "Flow from productivity confusion to adaptive clarity",
  chapters: [
    {
      id: "understanding",
      title: "Understanding Your Archetype",
      sections: [
        {
          id: "core-traits",
          title: "Your Core Traits",
          content: `As an Adaptive Generalist, you scored in the balanced range (40-60%) on most or all productivity axes. This means you don't strongly prefer one approach over another - you're highly adaptable and context-dependent.

**What This Means:**
- You can work structured OR flexibly
- You respond to internal AND external motivators
- You can zoom in on details OR see the big picture
- You can plan AND execute equally well

**This is NOT a flaw. This is a different kind of productivity profile.**

You're not "in between" archetypes. You're multi-modal - able to shift approaches based on context.

**Your Superpower:** Adaptability
**Your Challenge:** No single "default" approach that always works

**Why Traditional Advice Fails You:**

Traditional productivity advice says:
- "Find YOUR system and stick to it"
- "Consistency is key"
- "One approach for everything"

For Adaptive Generalists:
- Different projects need different approaches
- Your energy/context varies significantly
- One-size-fits-all doesn't fit YOU

**Your Framework:**
Match approach to context (not force one approach everywhere).`
        },
        {
          id: "science-behind",
          title: "The Science Behind Your Productivity Style",
          content: `Your productivity style is grounded in research on cognitive flexibility:

**The Research on Adaptability:**

Studies show that cognitive flexibility - the ability to switch between different mental modes - is associated with:
- Better problem-solving
- Higher creativity
- Stronger resilience
- More effective learning

Your balanced scores suggest high cognitive flexibility.

**Why Context Matters for You:**

You don't have a dominant productivity mode that "always works." Instead, you need to:
1. Assess the current context
2. Choose the appropriate approach
3. Execute using that approach
4. Reassess when context changes

**The Four Context Variables:**

1. **Project Type:** Creative, Analytical, Execution, or Exploratory
2. **Energy State:** High (7+), Medium (4-6), or Low (<4)
3. **Pressure Level:** High (urgent), Medium, or Low (flexible)
4. **Clarity Level:** High (clear goals), Medium, or Low (ambiguous)

Different combinations call for different approaches.`
        }
      ]
    },
    {
      id: "optimization",
      title: "Framework 1: The Context-Switching System",
      sections: [
        {
          id: "context-assessment",
          title: "The Context Assessment Protocol",
          content: `Before starting any work session, take 5 minutes for a context check:

**PROJECT TYPE:**
☐ Creative (writing, design, art)
☐ Analytical (data, research, strategy)
☐ Execution (implementation, building)
☐ Exploratory (learning, experimenting)

**ENERGY LEVEL (1-10):** ___

**PRESSURE LEVEL:**
☐ High (urgent)
☐ Medium
☐ Low (flexible)

**CLARITY LEVEL:**
☐ High (clear)
☐ Medium
☐ Low (ambiguous)

**RECOMMENDED APPROACH:** _______________
(Based on above answers)

**Project Type Approaches:**

**Creative Projects:**
- Need: Flexibility, exploration, inspiration time
- Approach: Flexible Improviser style
- Structure: Minimal, burst-friendly

**Analytical Projects:**
- Need: Deep focus, systematic approach
- Approach: Strategic Planner style
- Structure: High, organized, planned

**Execution Projects:**
- Need: Clear tasks, momentum, completion
- Approach: Structured Achiever style
- Structure: Medium, checklist-driven

**Exploratory Projects:**
- Need: Novelty, rotation, multiple angles
- Approach: Novelty Seeker style
- Structure: Low, variety-focused`
        },
        {
          id: "decision-matrix",
          title: "The Approach Decision Matrix",
          content: `Use this matrix to choose your approach:

| Project Type | Energy | Pressure | Clarity | Recommended Approach |
|-------------|--------|----------|---------|---------------------|
| Creative | High | Low | Low | Chaotic Creative (bursts) |
| Analytical | Medium | Medium | High | Strategic Planner (plan-execute) |
| Execution | High | High | High | Structured Achiever (checklist blitz) |
| Exploratory | Medium | Low | Medium | Novelty Seeker (rotate experiments) |
| Any | Low | Any | Any | Flexible Improviser (minimal, energy-first) |
| Any | Depleted | Any | Any | Rest (no approach, just recover) |

**Quick Decision Rules:**

1. **Low energy overrides everything.** If energy is <4, rest or do minimal work.

2. **High pressure + high clarity = Structured Achiever.** When it's urgent and clear, just execute.

3. **Creative + high energy = Chaotic Creative.** Ride the wave, produce in bursts.

4. **Analytical + medium energy = Strategic Planner.** Plan carefully, then execute.

5. **Unclear goals = Exploratory mode.** When you don't know what you need, explore first.

**The Meta-Skill:**
Your advantage is flexibility. Use it intentionally, not randomly.`
        }
      ]
    },
    {
      id: "challenges",
      title: "Building Your Custom Playbook",
      sections: [
        {
          id: "experimentation",
          title: "The 30-Day Experimentation Protocol",
          content: `Since no single approach dominates for you, you need to discover what works in which contexts.

**Week 1: Baseline Awareness (No Changes)**

Daily Protocol (5 min morning + evening):

**Morning:**
- Context assessment (project, energy, pressure, clarity)
- Predicted best approach for today

**During day:**
- Work however you naturally would
- Notice when you're most productive
- Notice when you struggle

**Evening:**
- Actual approach used
- Productivity rating (1-10)
- Energy after work (1-10)
- What worked / what didn't

By end of Week 1, you'll have data on your natural patterns.

**Weeks 2-4: Structured Experimentation**

Each week, test ONE archetype method completely:

**Week 2:** Choose from:
- Chaotic Creative (if you noticed burst energy patterns)
- Structured Achiever (if you crave more organization)

**Week 3:** Choose from:
- Strategic Planner (if you love planning but struggle with execution)
- Flexible Improviser (if energy varies significantly)

**Week 4:**
- Novelty Seeker (if you get bored with one approach)
- Or repeat the approach that worked best

Commit: Follow chosen method fully for 7 days.`
        },
        {
          id: "personal-playbook",
          title: "Creating Your Personal Playbook",
          content: `By end of 30 days, you'll know what works for you in different contexts.

**Your Personal Playbook Template:**

**When I'm working on [CREATIVE] projects:**
Best approach: _______________
Key tactics: _______________
Watch out for: _______________

**When I'm working on [ANALYTICAL] projects:**
Best approach: _______________
Key tactics: _______________
Watch out for: _______________

**When I'm working on [EXECUTION] projects:**
Best approach: _______________
Key tactics: _______________
Watch out for: _______________

**When energy is HIGH:**
I should: _______________
I should avoid: _______________

**When energy is LOW:**
I should: _______________
I should avoid: _______________

**When pressure is HIGH:**
I should: _______________
I should avoid: _______________

**My Default Tools:**
- For structure: _______________
- For flexibility: _______________
- For accountability: _______________
- For focus: _______________

**My Warning Signs (When Current Approach Isn't Working):**
1. _______________
2. _______________
3. _______________

**When warning signs appear, I should:**
_______________`
        }
      ]
    },
    {
      id: "advanced",
      title: "Advanced Strategies",
      sections: [
        {
          id: "hybrid-approaches",
          title: "Creating Hybrid Approaches",
          content: `As an Adaptive Generalist, you can create hybrid approaches that wouldn't work for pure archetypes.

**Example Hybrid: Strategic Creative**
For creative projects that need strategic outcomes:
- Use Strategic Planner methods for goal-setting and structure
- Use Chaotic Creative methods for actual creation
- Alternate between modes within the same day

**Example Hybrid: Flexible Structure**
For when you need structure but energy is variable:
- Use Structured Achiever checklists
- But allow Flexible Improviser timing
- Complete tasks in whatever order matches energy

**Example Hybrid: Accountable Improviser**
For when you need external accountability but hate rigidity:
- Use Flexible Improviser energy-alignment
- Add Novelty Seeker external commitments
- Commit to outcomes, not schedules

**Creating Your Own Hybrids:**

1. Identify the context (project type + energy + pressure + clarity)
2. Ask: What do I need most right now? (structure/flexibility/accountability/variety)
3. Combine elements from multiple approaches
4. Test for one week
5. Refine based on results

Your adaptability is your edge. Use it creatively.`
        },
        {
          id: "sustainable-adaptation",
          title: "Sustainable Adaptation",
          content: `The goal isn't constant optimization - it's sustainable productivity that adapts to your life.

**Signs Your System Is Working:**
- You complete projects across different types
- You don't feel constantly behind
- Energy is generally preserved
- You know what approach to use when
- Switching modes feels natural, not chaotic

**Signs You Need to Adjust:**
- Stuck on one project for weeks
- Fighting your natural patterns
- Guilt about not being "consistent"
- Burnout from forcing one approach
- Confusion about what to do next

**Monthly Meta-Review:**

1. What approaches did I use most this month?
2. In which contexts did I succeed?
3. Where did I struggle?
4. What should I try differently next month?
5. Is my personal playbook still accurate?

**The Adaptive Advantage:**

Pure archetypes have one strong mode. You have multiple.

This means:
- You can handle more varied work
- You can adapt when circumstances change
- You're not trapped by one approach
- You can combine techniques creatively

Your adaptability isn't a weakness to fix. It's a strength to develop.

Over time, you'll develop intuition for context-switching. The 5-minute assessment becomes automatic. You'll know what you need without thinking.

That's adaptive mastery.`
        }
      ]
    }
  ],
  actionPlan: [
    { id: "day1", day: 1, task: "Baseline Assessment", description: "Do the context assessment (project, energy, pressure, clarity). Note your natural approach today." },
    { id: "day2", day: 2, task: "Continue Baseline", description: "Track again. Morning prediction, natural work style, evening reflection." },
    { id: "day3", day: 3, task: "Notice Patterns", description: "When did you feel most productive yesterday? What approach did you naturally use?" },
    { id: "day4", day: 4, task: "Energy Awareness", description: "Focus specifically on energy tracking today. When was it high/low?" },
    { id: "day5", day: 5, task: "Project Type Analysis", description: "Categorize your current projects. Which are creative, analytical, execution, exploratory?" },
    { id: "day6", day: 6, task: "Approach Preference Hypothesis", description: "Based on 5 days, what approaches do you naturally gravitate toward?" },
    { id: "day7", day: 7, task: "Week 1 Review", description: "Review all tracking. What patterns emerged? Form hypotheses for Week 2." },
    { id: "day8", day: 8, task: "Choose Week 2 Experiment", description: "Pick one archetype approach to test fully this week based on your hypotheses." },
    { id: "day9", day: 9, task: "Implement Chosen Approach", description: "Follow your chosen approach strictly today. Note what works." },
    { id: "day10", day: 10, task: "Continue Experiment", description: "Second day with chosen approach. Is it feeling natural or forced?" },
    { id: "day11", day: 11, task: "Adapt Within Approach", description: "Modify the approach slightly if needed. What adjustments help?" },
    { id: "day12", day: 12, task: "Compare to Baseline", description: "How does this approach compare to your natural baseline? Better? Worse? Different?" },
    { id: "day13", day: 13, task: "Push Through Resistance", description: "If approach feels uncomfortable, try one more day. Discomfort isn't always bad." },
    { id: "day14", day: 14, task: "Week 2 Review", description: "Evaluate the experimental approach. Keep? Modify? Discard?" },
    { id: "day15", day: 15, task: "Choose Week 3 Approach", description: "Based on learnings, choose a different approach to test this week." },
    { id: "day16", day: 16, task: "New Approach Day 1", description: "Implement the new approach. Notice how it differs from Week 2." },
    { id: "day17", day: 17, task: "Context Matching", description: "Try matching approach to context today. Different approach for different work types." },
    { id: "day18", day: 18, task: "Energy-Based Switching", description: "Switch approaches based on energy level today. High energy = one approach, low = another." },
    { id: "day19", day: 19, task: "Hybrid Experiment", description: "Try combining elements from two approaches. What hybrid might work for you?" },
    { id: "day20", day: 20, task: "Pressure Response", description: "How do you naturally respond to high pressure? What approach helps?" },
    { id: "day21", day: 21, task: "Week 3 Review", description: "Compare all approaches tested. Which worked best in which contexts?" },
    { id: "day22", day: 22, task: "Draft Personal Playbook", description: "Start writing your personal playbook: approach by context." },
    { id: "day23", day: 23, task: "Test Your Playbook", description: "Use your draft playbook to guide approach selection today." },
    { id: "day24", day: 24, task: "Refine and Adjust", description: "Based on testing, refine your playbook. What needs changing?" },
    { id: "day25", day: 25, task: "Warning Signs Identification", description: "What are your warning signs that an approach isn't working?" },
    { id: "day26", day: 26, task: "Switching Protocol", description: "Define: When warning signs appear, what's your switching protocol?" },
    { id: "day27", day: 27, task: "Full Playbook Test", description: "Use your complete playbook all day. Follow your own guidance." },
    { id: "day28", day: 28, task: "Week 4 Review", description: "Evaluate your personal playbook. Is it working? What's missing?" },
    { id: "day29", day: 29, task: "Finalize Your Playbook", description: "Complete your personal productivity playbook. Document everything that works." },
    { id: "day30", day: 30, task: "Plan Ongoing Adaptation", description: "Set up monthly reviews. Your playbook will evolve. Plan how you'll continue refining." }
  ],
  recommendedTools: [
    "notion",
    "todoist",
    "google-calendar",
    "toggl-track",
    "focusmate",
    "obsidian"
  ]
};

// Export a mapping of all playbook content
export const playbookContentMap: Record<string, PlaybookContent> = {
  "structured-achiever": structuredAchieverPlaybook,
  "chaotic-creative": chaoticCreativePlaybook,
  "anxious-perfectionist": anxiousPerfectionistPlaybook,
  "novelty-seeker": noveltySeekerPlaybook,
  "strategic-planner": strategicPlannerPlaybook,
  "flexible-improviser": flexibleImproviserPlaybook,
  "adaptive-generalist": adaptiveGeneralistPlaybook,
};
