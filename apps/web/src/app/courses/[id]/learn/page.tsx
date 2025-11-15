import { LearnClient } from './LearnClient';

interface PageProps {
  params: { id: string };
}

export default function LearnPage({ params }: PageProps) {
  return <LearnClient courseId={params.id} />;
}
