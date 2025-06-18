export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'scale';
  options?: string[];
  scaleRange?: { min: number; max: number };
  scaleLabels?: { min: string; max: string };
  dimensions: {
    structure?: number;
    motivation?: number;
    cognitive?: number;
    task?: number;
  };
}

export const questions: Question[] = [
  {
    id: 'q1',
    text: 'When facing a complex project, I prefer to:',
    type: 'multiple-choice',
    options: [
      'Break it down into smaller, manageable tasks with clear deadlines',
      'Dive in immediately and figure it out as I go',
      'Research thoroughly and create a detailed plan before starting',
      'Collaborate with others to brainstorm approaches'
    ],
    dimensions: {
      structure: 3,
      motivation: 1,
      cognitive: 2,
      task: 0
    }
  },
  {
    id: 'q2',
    text: 'Rate how much you agree: "I work best when I have complete control over my schedule and environment"',
    type: 'scale',
    scaleRange: { min: 1, max: 7 },
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    dimensions: {
      structure: 1,
      motivation: 0,
      cognitive: 0,
      task: -1
    }
  },
  {
    id: 'q3',
    text: 'My ideal workspace is:',
    type: 'multiple-choice',
    options: [
      'A quiet, organized space with minimal distractions',
      'A dynamic environment with people and activity around me',
      'A flexible space that I can adapt based on the task',
      'A home office where I have complete control'
    ],
    dimensions: {
      structure: 2,
      motivation: -1,
      cognitive: 1,
      task: 0
    }
  },
  {
    id: 'q4',
    text: 'When learning something new, I typically:',
    type: 'multiple-choice',
    options: [
      'Follow a structured course or guide step by step',
      'Jump in and learn through trial and error',
      'Research multiple sources and create my own learning path',
      'Find others who can teach me or learn with me'
    ],
    dimensions: {
      structure: 1,
      motivation: 0,
      cognitive: 2,
      task: -1
    }
  },
  {
    id: 'q5',
    text: 'Rate your agreement: "I get energized by tight deadlines and pressure"',
    type: 'scale',
    scaleRange: { min: 1, max: 7 },
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    dimensions: {
      structure: -1,
      motivation: 2,
      cognitive: 0,
      task: 0
    }
  },
  {
    id: 'q6',
    text: 'My approach to goal setting is:',
    type: 'multiple-choice',
    options: [
      'Set specific, measurable goals with clear timelines',
      'Set ambitious targets and adjust as needed',
      'Focus on systems and processes rather than outcomes',
      'Set collaborative goals that involve others'
    ],
    dimensions: {
      structure: 2,
      motivation: 1,
      cognitive: 0,
      task: -1
    }
  },
  {
    id: 'q7',
    text: 'When I encounter obstacles, I typically:',
    type: 'multiple-choice',
    options: [
      'Methodically analyze the problem and develop solutions',
      'Push through with determination and persistence',
      'Step back and look for creative alternative approaches',
      'Seek input and support from others'
    ],
    dimensions: {
      structure: 1,
      motivation: 0,
      cognitive: 2,
      task: -1
    }
  },
  {
    id: 'q8',
    text: 'Rate your preference: "I prefer to work on one task at a time rather than multitask"',
    type: 'scale',
    scaleRange: { min: 1, max: 7 },
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    dimensions: {
      structure: 1,
      motivation: 0,
      cognitive: 2,
      task: 0
    }
  },
  {
    id: 'q9',
    text: 'My motivation comes primarily from:',
    type: 'multiple-choice',
    options: [
      'Achieving specific targets and completing tasks',
      'The excitement of challenges and competition',
      'Personal growth and learning new things',
      'Making a positive impact on others'
    ],
    dimensions: {
      structure: 0,
      motivation: 2,
      cognitive: 1,
      task: -1
    }
  },
  {
    id: 'q10',
    text: 'When planning my week, I:',
    type: 'multiple-choice',
    options: [
      'Schedule every hour with specific activities',
      'Block time for priorities but stay flexible',
      'Plan key objectives and adapt day by day',
      'Coordinate with others to align schedules'
    ],
    dimensions: {
      structure: 3,
      motivation: 0,
      cognitive: 1,
      task: -2
    }
  },
  {
    id: 'q11',
    text: 'Rate your agreement: "I enjoy experimenting with new productivity tools and methods"',
    type: 'scale',
    scaleRange: { min: 1, max: 7 },
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    dimensions: {
      structure: -1,
      motivation: 1,
      cognitive: 2,
      task: 0
    }
  },
  {
    id: 'q12',
    text: 'My relationship with routine is:',
    type: 'multiple-choice',
    options: [
      'I thrive on consistent daily routines and habits',
      'I prefer variety and changing things up regularly',
      'I like flexible routines that can adapt to circumstances',
      'I prefer routines that include regular interaction with others'
    ],
    dimensions: {
      structure: 2,
      motivation: -1,
      cognitive: 0,
      task: 0
    }
  },
  {
    id: 'q13',
    text: 'When making decisions, I typically:',
    type: 'multiple-choice',
    options: [
      'Gather data and analyze options systematically',
      'Trust my instincts and decide quickly',
      'Consider multiple perspectives and think creatively',
      'Consult with others and seek consensus'
    ],
    dimensions: {
      structure: 1,
      motivation: 0,
      cognitive: 2,
      task: -2
    }
  },
  {
    id: 'q14',
    text: 'Rate your preference: "I work better with external accountability and check-ins"',
    type: 'scale',
    scaleRange: { min: 1, max: 7 },
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    dimensions: {
      structure: 0,
      motivation: 1,
      cognitive: 0,
      task: -2
    }
  },
  {
    id: 'q15',
    text: 'My energy levels throughout the day are:',
    type: 'multiple-choice',
    options: [
      'Consistent and predictable',
      'High-energy bursts followed by recovery periods',
      'Variable depending on the type of work',
      'Influenced by the people around me'
    ],
    dimensions: {
      structure: 1,
      motivation: 1,
      cognitive: 0,
      task: -1
    }
  },
  {
    id: 'q16',
    text: 'When I have a big idea or insight, I:',
    type: 'multiple-choice',
    options: [
      'Immediately create a plan to implement it',
      'Get excited and want to act on it right away',
      'Explore it from multiple angles before moving forward',
      'Share it with others to get their thoughts and feedback'
    ],
    dimensions: {
      structure: 1,
      motivation: 2,
      cognitive: 1,
      task: -2
    }
  },
  {
    id: 'q17',
    text: 'Rate your agreement: "I prefer to finish projects completely before starting new ones"',
    type: 'scale',
    scaleRange: { min: 1, max: 7 },
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    dimensions: {
      structure: 2,
      motivation: 0,
      cognitive: 1,
      task: 0
    }
  },
  {
    id: 'q18',
    text: 'My approach to professional development is:',
    type: 'multiple-choice',
    options: [
      'Follow a structured learning plan with clear milestones',
      'Seek out challenging opportunities and learn on the job',
      'Pursue diverse interests and connect different fields',
      'Learn through mentorship and collaborative relationships'
    ],
    dimensions: {
      structure: 2,
      motivation: 1,
      cognitive: 1,
      task: -2
    }
  },
  {
    id: 'q19',
    text: 'When facing competing priorities, I:',
    type: 'multiple-choice',
    options: [
      'Use a systematic method to rank and tackle them',
      'Focus on the most urgent or exciting one first',
      'Look for ways to combine or eliminate some priorities',
      'Discuss with others to get perspective on what matters most'
    ],
    dimensions: {
      structure: 2,
      motivation: 1,
      cognitive: 1,
      task: -2
    }
  },
  {
    id: 'q20',
    text: 'Rate your preference: "I value work-life balance over maximum productivity"',
    type: 'scale',
    scaleRange: { min: 1, max: 7 },
    scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
    dimensions: {
      structure: 0,
      motivation: -1,
      cognitive: 0,
      task: 1
    }
  }
];
