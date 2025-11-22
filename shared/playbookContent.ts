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
  recommendedTools: string[]; // Tool IDs from the tools table
}

// Structured Achiever Playbook Content
export const structuredAchieverPlaybook: PlaybookContent = {
  archetype: "structured-achiever",
  title: "The Structured Achiever Playbook",
  subtitle: "Leverage your natural planning strengths to achieve sustainable productivity",
  chapters: [
    {
      id: "understanding",
      title: "Understanding Your Archetype",
      sections: [
        {
          id: "core-traits",
          title: "Your Core Traits",
          content: `As a Structured Achiever, you thrive on organization, clear goals, and systematic progress. Your mind naturally gravitates toward planning and structure, making you excellent at breaking down complex projects into manageable steps.

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
- May find it challenging to embrace spontaneity
- Can experience stress when operating without clear structure`
        },
        {
          id: "science-behind",
          title: "The Science Behind Your Productivity Style",
          content: `Your productivity style is grounded in several psychological principles:

**Executive Function Strength**: Your prefrontal cortex excels at planning, organizing, and executing structured tasks. Research shows that individuals with strong executive function perform best when they can leverage systematic approaches.

**Goal-Setting Theory**: Your archetype aligns perfectly with Locke and Latham's goal-setting research, which demonstrates that specific, challenging goals paired with structured plans lead to higher performance.

**Cognitive Load Management**: By creating structure, you reduce cognitive load and free up mental resources for deep work. This aligns with Sweller's Cognitive Load Theory.

**Routine Optimization**: Your brain has developed strong neural pathways for routine behaviors, making structured work feel natural and energizing rather than restrictive.`
        }
      ]
    },
    {
      id: "optimization",
      title: "Optimizing Your System",
      sections: [
        {
          id: "planning-framework",
          title: "Your Ideal Planning Framework",
          content: `Maximize your natural strengths with this comprehensive planning system:

**Weekly Planning Ritual (Every Sunday):**
1. Review last week's accomplishments and lessons
2. Set 3-5 major goals for the upcoming week
3. Break each goal into specific daily tasks
4. Assign tasks to time blocks in your calendar
5. Identify potential obstacles and plan contingencies

**Daily Planning (Each Morning):**
1. Review your day's scheduled tasks
2. Prioritize using the Eisenhower Matrix
3. Set 1-3 "must-accomplish" items
4. Block time for deep work on priority tasks
5. Build in buffer time for unexpected items

**Monthly Reviews:**
- Analyze your productivity patterns
- Adjust systems that aren't working
- Set strategic goals for the next month
- Review and refine your routine structures`
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

// Export a mapping of all playbook content (will add more archetypes later)
export const playbookContentMap: Record<string, PlaybookContent> = {
  "structured-achiever": structuredAchieverPlaybook,
  // TODO: Add other archetypes
  "chaotic-creative": structuredAchieverPlaybook, // Placeholder
  "anxious-perfectionist": structuredAchieverPlaybook, // Placeholder
  "novelty-seeker": structuredAchieverPlaybook, // Placeholder
  "strategic-planner": structuredAchieverPlaybook, // Placeholder
  "flexible-improviser": structuredAchieverPlaybook, // Placeholder
};
