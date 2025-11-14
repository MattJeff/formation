import { EditCoursePage } from './EditCoursePage';

export default function EditCourse({ params }: { params: { id: string } }) {
  return <EditCoursePage courseId={params.id} />;
}
