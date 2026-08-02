import TeacherSubjectStudentsClient from "@/app/_components/TeacherSubjectStudentsClient";

export const metadata = {
  title: "Subject · Students",
};

export default async function TeacherSubjectStudentsPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;
  return <TeacherSubjectStudentsClient subjectId={subjectId} />;
}