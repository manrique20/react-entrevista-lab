import { notFound } from 'next/navigation';
import { jsLevelsData } from '@/data/javascript/levelsData';
import { JsLevelClientView } from '@/components/javascript/JsLevelClientView';

export function generateStaticParams() {
  return jsLevelsData.map(l => ({
    levelId: String(l.id)
  }));
}

interface JsLevelPageProps {
  params: Promise<{ levelId: string }>;
}

export default async function JsLevelPage({ params }: JsLevelPageProps) {
  const { levelId } = await params;
  const levelNum = Number(levelId);

  const levelExists = jsLevelsData.some(l => l.id === levelNum);
  if (!levelExists || isNaN(levelNum)) {
    notFound();
  }

  return <JsLevelClientView levelNum={levelNum} />;
}
