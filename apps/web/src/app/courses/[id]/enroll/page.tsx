import { EnrollClient } from './EnrollClient';

interface PageProps {
  params: { id: string };
}

export default function EnrollPage({ params }: PageProps) {
  return <EnrollClient courseId={params.id} />;
}
