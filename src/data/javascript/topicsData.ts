import { JsTopic } from '@/types/javascript';
import { level1Topics } from './topics/level1';
import { level2Topics } from './topics/level2';
import { level3Topics } from './topics/level3';
import { level4Topics } from './topics/level4';
import { level5Topics } from './topics/level5';
import { level6Topics } from './topics/level6';
import { level7Topics } from './topics/level7';
import { level8Topics } from './topics/level8';

export const allJsTopics: JsTopic[] = [
  ...level1Topics,
  ...level2Topics,
  ...level3Topics,
  ...level4Topics,
  ...level5Topics,
  ...level6Topics,
  ...level7Topics,
  ...level8Topics
];

export const jsTopicsByLevel: Record<number, JsTopic[]> = {
  1: level1Topics,
  2: level2Topics,
  3: level3Topics,
  4: level4Topics,
  5: level5Topics,
  6: level6Topics,
  7: level7Topics,
  8: level8Topics
};

export function getJsTopicById(id: string): JsTopic | undefined {
  return allJsTopics.find(t => t.id === id);
}
