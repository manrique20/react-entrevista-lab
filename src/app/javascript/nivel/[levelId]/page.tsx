import { Suspense } from 'react';
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

async function JsLevelContent({ params }: JsLevelPageProps) {
  const { levelId } = await params;
  const levelNum = Number(levelId);

  const levelExists = jsLevelsData.some(l => l.id === levelNum);
  if (!levelExists || isNaN(levelNum)) {
    notFound();
  }

  return <JsLevelClientView levelNum={levelNum} />;
}

export default function JsLevelPage(props: JsLevelPageProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted">Cargando nivel...</div>}>
      <JsLevelContent {...props} />
    </Suspense>
  );
}
