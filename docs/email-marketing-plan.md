# Email Marketing Plan - Prolific Personalities

## Brand Voice & Tone Guidelines

### Core Message
**"You're not lazy. You're not broken. You just need a different approach."**

### Target Audience
- Burned-out knowledge workers
- Neurodivergent professionals (ADHD, autism, etc.)
- People who've tried countless productivity systems that never stuck

### Tone Principles
1. **Empathetic, not corporate** — Talk like a friend who gets it, not a SaaS company trying to convert
2. **Authentic vulnerability** — Acknowledge that productivity advice often fails because it's designed for a "normal" brain
3. **Research-backed credibility** — Our differentiator is science. Emphasize peer-reviewed studies, 27-42% effectiveness improvements
4. **Anti-hustle culture** — No "wake up at 5 AM" advice. No guilt-tripping.
5. **Conversational** — Use "Hey" not "Dear valued customer." Use "I" not "we" for personal touch.

### Words to Use
- "Your brain works differently"
- "Not broken, just mismatched"
- "Research-backed" / "Peer-reviewed studies"
- "How you actually work"
- "Stop fighting yourself"

### Words to Avoid
- "Congratulations!" (too corporate)
- "Unlock your potential" (too generic)
- "Maximize productivity" (hustle culture)
- "Limited time offer!" (spammy)
- "Act now!" (pushy)

### Research Differentiator (Use Often)
> "Unlike generic personality tests, every strategy is backed by peer-reviewed research on executive function, motivation psychology, and cognitive load theory. Studies show personalized approaches improve effectiveness by 27-42%."

---

## Email 1: Welcome Email (Sent immediately after signup)

### Subject Line Options:
1. "Your [Archetype Name] Productivity Guide Is Here"
2. "Welcome! Here's Your Personalized Quick-Start Guide"
3. "[First Name], Your Productivity Archetype Revealed"

### Email Body:

---

**Subject:** Your [Archetype Name] Productivity Guide Is Here

Hi there,

Congratulations on discovering your productivity archetype: **[Archetype Name]**!

You're one of the rare individuals who understands that productivity isn't one-size-fits-all. That's already a huge advantage.

**Here's your promised Quick-Start Guide with 3 strategies tailored specifically for [Archetype Name]s:**

**1. [Strategy 1 - Archetype Specific]**
[Brief description of the first quick win]

**2. [Strategy 2 - Archetype Specific]**
[Brief description of the second quick win]

**3. [Strategy 3 - Archetype Specific]**
[Brief description of the third quick win]

**Your Key Strength:** [Archetype's main strength]
**Watch Out For:** [Archetype's common pitfall]

---

**Want the complete playbook?**

Your free results give you the overview, but the Premium Playbook ($27) gives you:
- 100+ pages of strategies designed for YOUR brain
- 30-day implementation plan with daily tasks
- Tool recommendations rated for your archetype
- Common failure modes and how to avoid them

[View Your Results & Upgrade →]

---

Questions? Just reply to this email.

To your productivity,
The Prolific Personalities Team

P.S. Your results are saved! You can access them anytime at [results link].

---

## Email 2: Abandoned Cart Email (Sent 24 hours after starting checkout)

### Subject Line Options:
1. "You left something behind... 👀"
2. "Your [Archetype Name] Playbook is waiting"
3. "Still thinking it over? Here's what you're missing"

### Email Body:

---

**Subject:** You left something behind... 👀

Hi there,

I noticed you started to get your **[Archetype Name] Premium Playbook** but didn't finish checking out.

No pressure at all—I just wanted to make sure nothing went wrong on our end.

**Quick reminder of what's inside your personalized playbook:**

✅ **Deep-dive analysis** of how [Archetype Name]s think, work, and thrive
✅ **30-day action plan** with specific daily tasks (not generic advice)
✅ **Tool recommendations** rated specifically for your working style
✅ **Common failure modes** so you don't fall into the typical [Archetype Name] traps
✅ **Bonus:** Implementation worksheets you can print and use

**The investment:** Just $27 one-time (not a subscription)

**The guarantee:** 30-day satisfaction guarantee. If it doesn't help, you get a full refund. No questions asked.

[Complete My Purchase →]

If you have any questions about whether it's right for you, just reply to this email. I'm happy to help.

Best,
The Prolific Personalities Team

P.S. Your checkout session expires in 24 hours for security reasons. After that, you'll need to start fresh from your results page.

---

## 2-Week Email Nurture Sequence

### Overview
This sequence nurtures email subscribers who haven't purchased, providing value while building toward the premium offer.

---

### Day 1: Welcome Email (above)
**Goal:** Deliver promised value, introduce premium offer softly

---

### Day 3: "The [Archetype] Advantage"
**Subject:** The hidden superpower of [Archetype Name]s

**Content Outline:**
- Acknowledge what makes their archetype unique
- Share one "unfair advantage" their type has
- Quick tip to leverage this advantage today
- Soft CTA: "Learn more advantages in your full playbook"

---

### Day 5: Common Mistakes Email
**Subject:** The #1 mistake [Archetype Name]s make (and how to avoid it)

**Content Outline:**
- Share the most common productivity mistake for their type
- Explain WHY this happens (validate their experience)
- Give one actionable fix they can implement today
- CTA: "The Premium Playbook covers 7 more common pitfalls"

---

### Day 7: Tool Recommendation
**Subject:** The perfect productivity tool for [Archetype Name]s

**Content Outline:**
- Recommend ONE specific tool that works well for their archetype
- Explain why it matches their working style
- Quick-start tip for using it
- Mention: "Your Playbook includes 10+ tool recommendations rated for your type"

---

### Day 10: Social Proof / Case Study
**Subject:** How [Name] went from overwhelmed to in control

**Content Outline:**
- Share a brief story of someone with their archetype
- Focus on the transformation (before → after)
- Highlight one key insight that helped them
- CTA: "Get your own transformation roadmap"

---

### Day 14: Final Value + Offer
**Subject:** A special offer for [Archetype Name]s (expires soon)

**Content Outline:**
- Recap the value they've received from free emails
- Acknowledge they might be "on the fence"
- Limited-time offer or bonus (optional: 10% discount code)
- Clear CTA with urgency
- Remind them of 30-day guarantee

---

## Archetype-Specific Content Notes

Each email should be personalized based on archetype. Here are the 6 archetypes and key messaging angles:

| Archetype | Key Strength | Common Pitfall | Tool Angle |
|-----------|--------------|----------------|------------|
| Structured Achiever | Systems & organization | Over-planning at expense of action | Time-blocking & task management |
| Chaotic Creative | Innovation & connections | Jumping between projects | Idea capture & visual progress tools |
| Anxious Perfectionist | Detail & quality | Analysis paralysis from fear | Task chunking & done-list tools |
| Novelty Seeker | Enthusiasm & quick learning | Losing interest when novelty fades | Gamification & variety tools |
| Strategic Planner | Big picture & long-term thinking | Getting lost in planning | Action-focused planning tools |
| Flexible Improviser | Adaptability & handling change | Lack of consistent routines | Minimal habit tracking tools |

---

## Technical Implementation Notes

### For Resend Integration:
1. **Welcome email**: Trigger on email capture (immediate)
2. **Abandoned cart**: 
   - Track checkout initiated timestamp
   - Cron job or scheduled task checks every few hours
   - Send if >24 hours passed and no completed purchase (give users time to think)
3. **Nurture sequence**: 
   - Option A: Build scheduler in app (complex)
   - Option B: Export to ConvertKit/Mailchimp for automation (recommended for 14-day drip)

### Database Changes Needed:
- Add `archetype` column to `email_captures` table
- Create `checkout_attempts` table to track abandoned carts
- Add `welcome_email_sent` boolean to prevent duplicates

---

## Next Steps

1. ✅ Review these email drafts
2. Let me know any changes to tone, content, or offers
3. Once approved, I'll implement:
   - Welcome email (automated via Resend)
   - Abandoned cart tracking + email
   - Export capability for nurture sequence
