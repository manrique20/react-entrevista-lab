import { Topic } from '@/types';
import { LEVEL_1_TOPICS } from './topics/level1';
import { LEVEL_2_TOPICS } from './topics/level2';
import { LEVEL_3_TOPICS } from './topics/level3';
import { LEVEL_4_TOPICS } from './topics/level4';
import { LEVEL_5_TOPICS } from './topics/level5';
import { LEVEL_6_TOPICS } from './topics/level6';
import { LEVEL_7_TOPICS } from './topics/level7';
import { LEVEL_8_TOPICS } from './topics/level8';

export const ALL_TOPICS: Topic[] = [
  ...LEVEL_1_TOPICS,
  ...LEVEL_2_TOPICS,
  ...LEVEL_3_TOPICS,
  ...LEVEL_4_TOPICS,
  ...LEVEL_5_TOPICS,
  ...LEVEL_6_TOPICS,
  ...LEVEL_7_TOPICS,
  ...LEVEL_8_TOPICS
];

export const TOPICS = ALL_TOPICS;

export function getTopicsByLevel(level: number): Topic[] {
  return ALL_TOPICS.filter(t => t.level === level);
}

export function getTopicById(id: string): Topic | undefined {
  return ALL_TOPICS.find(t => t.id === id);
}

export function searchTopics(query: string): Topic[] {
  if (!query || !query.trim()) return [];
  const clean = query.toLowerCase().trim();
  return ALL_TOPICS.filter(t =>
    t.title.toLowerCase().includes(clean) ||
    t.summary.toLowerCase().includes(clean) ||
    t.whatIsIt.toLowerCase().includes(clean) ||
    t.keyTakeaway.toLowerCase().includes(clean) ||
    t.tags.some(tag => tag.toLowerCase().includes(clean))
  );
}
