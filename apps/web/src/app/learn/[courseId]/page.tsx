import { LearnClient } from './LearnClient';

export default function LearnPage({ params }: { params: { courseId: string } }) {
  return <LearnClient courseId={params.courseId} />;
}
