import { CourseDetailClient } from './CourseDetailClient';

export default function CoursePage({ params }: { params: { id: string } }) {
  return <CourseDetailClient courseId={params.id} />;
}
