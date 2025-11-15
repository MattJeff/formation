import { LearnClient } from './LearnClient';

export default function CourseLearnPage({ params }: { params: { id: string } }) {
  return <LearnClient courseId={params.id} />;
}
