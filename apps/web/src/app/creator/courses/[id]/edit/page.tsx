import { NewCourseClient } from '../../new/NewCourseClient';

export default function EditCourse({ params }: { params: { id: string } }) {
  return <NewCourseClient courseId={params.id} mode="edit" />;
}
