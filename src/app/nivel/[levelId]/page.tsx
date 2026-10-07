import { notFound } from 'next/navigation';
import { LEVELS } from '@/data/levelsData';
import { LevelClientView } from '@/components/level/LevelClientView';

export function generateStaticParams() {
  return LEVELS.map(l => ({
    levelId: String(l.id)
  }));
}

interface LevelPageProps {
  params: Promise<{ levelId: string }>;
}

export default async function LevelPage({ params }: LevelPageProps) {
  const { levelId } = await params;
  const levelNum = Number(levelId);

  const levelExists = LEVELS.some(l => l.id === levelNum);
  if (!levelExists || isNaN(levelNum)) {
    notFound();
  }

  return <LevelClientView levelNum={levelNum} />;
}
