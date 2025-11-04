export interface Question {
  id: string;
  text: string;
  type: 'likert' | 'scenario' | 'binary';
  options?: string[];
  scaleLabels?: { min: string; max: string };
  axis: 'structure' | 'motivation' | 'cognitive' | 'task';
  scoring: {
    [key: string]: number;
  };
  reverseScored?: boolean;
}

export const questions: Question[] = [
  // AXIS 1: STRUCTURE ORIENTATION (Rigid ↔ Flexible) - Questions 1-7
  {
    id: 'q1',
    text: 'I feel most productive when my day follows a predictable routine.',
    type: 'likert',
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    axis: 'structure',
    scoring: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
    reverseScored: false
  },
  {
    id: 'q2',
    text: 'When plans change unexpectedly, I adapt easily and don\'t feel stressed.',
    type: 'likert',
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    axis: 'structure',
    scoring: { '1': 5, '2': 4, '3': 3, '4': 2, '5': 1 },
    reverseScored: true
  },
  {
    id: 'q3',
    text: 'It\'s Monday morning. How do you typically start your work day?',
    type: 'scenario',
    options: [
      'I have a detailed plan/to-do list prepared from last week',
      'I check my calendar and figure out priorities as I go',
      'I see what feels interesting/urgent and dive in'
    ],
    axis: 'structure',
    scoring: { '0': 5, '1': 3, '2': 1 }
  },
  {
    id: 'q4',
    text: 'I prefer clear step-by-step instructions over general guidelines.',
    type: 'likert',
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    axis: 'structure',
    scoring: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
    reverseScored: false
  },
  {
    id: 'q5',
    text: 'Which statement resonates more with you?',
    type: 'binary',
    options: [
      'A good plan today is better than a perfect plan tomorrow',
      'I\'ll figure it out as I go - overthinking kills momentum'
    ],
    axis: 'structure',
    scoring: { '0': 5, '1': 1 }
  },
  {
    id: 'q6',
    text: 'I thrive in environments with flexible deadlines and open-ended projects.',
    type: 'likert',
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    axis: 'structure',
    scoring: { '1': 5, '2': 4, '3': 3, '4': 2, '5': 1 },
    reverseScored: true
  },
  {
    id: 'q7',
    text: 'I prefer to work in the same physical location every day.',
    type: 'likert',
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    axis: 'structure',
    scoring: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
    reverseScored: false
  },

  // AXIS 2: MOTIVATION STYLE (Intrinsic ↔ Extrinsic) - Questions 8-14
  {
    id: 'q8',
    text: 'I\'m most motivated to complete tasks when others are counting on me or watching my progress.',
    type: 'likert',
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    axis: 'motivation',
    scoring: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
    reverseScored: false
  },
  {
    id: 'q9',
    text: 'You just finished a challenging project. What feels most rewarding?',
    type: 'scenario',
    options: [
      'Public recognition or praise from others',
      'The personal satisfaction of solving the problem',
      'A tangible reward (bonus, promotion, etc.)',
      'Learning something new in the process'
    ],
    axis: 'motivation',
    scoring: { '0': 5, '1': 1, '2': 5, '3': 1 }
  },
  {
    id: 'q10',
    text: 'I need external deadlines to get things done - without them, I procrastinate.',
    type: 'likert',
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    axis: 'motivation',
    scoring: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
    reverseScored: false
  },
  {
    id: 'q11',
    text: 'Which motivates you more?',
    type: 'binary',
    options: [
      'Beating a competitor or hitting a visible goal (leaderboard, streak, etc.)',
      'Mastering a skill or creating something meaningful'
    ],
    axis: 'motivation',
    scoring: { '0': 5, '1': 1 }
  },
  {
    id: 'q12',
    text: 'I enjoy working on projects even when no one will see or evaluate the results.',
    type: 'likert',
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    axis: 'motivation',
    scoring: { '1': 5, '2': 4, '3': 3, '4': 2, '5': 1 },
    reverseScored: true
  },
  {
    id: 'q13',
    text: 'Accountability partners, coaches, or public commitments help me stay on track.',
    type: 'likert',
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    axis: 'motivation',
    scoring: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
    reverseScored: false
  },
  {
    id: 'q14',
    text: 'Your current project feels boring. What would help you push through?',
    type: 'scenario',
    options: [
      'Someone checking in on my progress regularly',
      'Reminding myself why this matters to me personally',
      'Gamifying it (rewards, streaks, challenges)',
      'Finding a more interesting angle to explore'
    ],
    axis: 'motivation',
    scoring: { '0': 5, '1': 1, '2': 5, '3': 1 }
  },

  // AXIS 3: COGNITIVE FOCUS (Big Picture ↔ Detail-Oriented) - Questions 15-21
  {
    id: 'q15',
    text: 'I\'m energized by brainstorming possibilities and long-term strategy.',
    type: 'likert',
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    axis: 'cognitive',
    scoring: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
    reverseScored: false
  },
  {
    id: 'q16',
    text: 'You\'re starting a new project. Where do you naturally begin?',
    type: 'scenario',
    options: [
      'Outlining the vision and desired end state',
      'Breaking down specific tasks and next steps',
      'Researching how others have done similar projects',
      'Sketching out different possibilities and approaches'
    ],
    axis: 'cognitive',
    scoring: { '0': 5, '1': 1, '2': 1, '3': 5 }
  },
  {
    id: 'q17',
    text: 'I get frustrated when conversations stay too high-level without diving into specifics.',
    type: 'likert',
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    axis: 'cognitive',
    scoring: { '1': 5, '2': 4, '3': 3, '4': 2, '5': 1 },
    reverseScored: true
  },
  {
    id: 'q18',
    text: 'In meetings, you\'re more likely to:',
    type: 'binary',
    options: [
      'Ask "What\'s the big goal here?" or "Why are we doing this?"',
      'Ask "How exactly will this work?" or "What are the specific steps?"'
    ],
    axis: 'cognitive',
    scoring: { '0': 5, '1': 1 }
  },
  {
    id: 'q19',
    text: 'I prefer clear, concrete tasks over open-ended exploration.',
    type: 'likert',
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    axis: 'cognitive',
    scoring: { '1': 5, '2': 4, '3': 3, '4': 2, '5': 1 },
    reverseScored: true
  },
  {
    id: 'q20',
    text: 'I often see connections between seemingly unrelated ideas or concepts.',
    type: 'likert',
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    axis: 'cognitive',
    scoring: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
    reverseScored: false
  },
  {
    id: 'q21',
    text: 'When reading a book or article, you tend to:',
    type: 'scenario',
    options: [
      'Skim for main ideas and overall themes',
      'Read carefully and take detailed notes'
    ],
    axis: 'cognitive',
    scoring: { '0': 5, '1': 1 }
  },

  // AXIS 4: TASK RELATIONSHIP (Avoidant ↔ Action-Oriented) - Questions 22-28
  {
    id: 'q22',
    text: 'I frequently delay starting tasks, even when I know they\'re important.',
    type: 'likert',
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    axis: 'task',
    scoring: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
    reverseScored: false
  },
  {
    id: 'q23',
    text: 'You have a difficult task due next week. When do you typically start?',
    type: 'scenario',
    options: [
      'Immediately - I like getting ahead',
      'A few days before - enough time to do it well',
      'The day before or day of - I work best under pressure'
    ],
    axis: 'task',
    scoring: { '0': 1, '1': 3, '2': 5 }
  },
  {
    id: 'q24',
    text: 'When I think about starting a task, I often feel anxious or overwhelmed.',
    type: 'likert',
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    axis: 'task',
    scoring: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
    reverseScored: false
  },
  {
    id: 'q25',
    text: 'Which statement describes you better?',
    type: 'binary',
    options: [
      'I tend to overthink things before starting',
      'I prefer to jump in and figure it out as I go'
    ],
    axis: 'task',
    scoring: { '0': 5, '1': 1 }
  },
  {
    id: 'q26',
    text: 'I frequently have a long list of tasks I\'ve been meaning to do for weeks or months.',
    type: 'likert',
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    axis: 'task',
    scoring: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
    reverseScored: false
  },
  {
    id: 'q27',
    text: 'Once I start a task, I usually maintain momentum until it\'s done.',
    type: 'likert',
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    axis: 'task',
    scoring: { '1': 5, '2': 4, '3': 3, '4': 2, '5': 1 },
    reverseScored: true
  },
  {
    id: 'q28',
    text: 'It\'s 2pm on a workday and you have a challenging task on your to-do list. What happens?',
    type: 'scenario',
    options: [
      'I tackle it head-on while I have energy',
      'I do easier tasks first to build momentum',
      'I find myself distracted (email, social media, snacks)',
      'I decide to do it tomorrow when I\'m "more ready"'
    ],
    axis: 'task',
    scoring: { '0': 1, '1': 3, '2': 4, '3': 5 }
  }
];
