import { Question, questions } from './questions';

export const quickScanQuestionIds = ['q1', 'q10', 'q15', 'q22', 'q25'];

export const quickScanQuestions: Question[] = quickScanQuestionIds.map(id => 
  questions.find(q => q.id === id)!
);
