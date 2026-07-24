import ClassTranscriptClient from "@/app/_components/ClassTranscriptClient";

export const metadata = {
    title: "Class Transcript",
};

export default async function ClassTranscriptPage({
    params,
}: {
    params: Promise<{ classId: string }>;
}) {
    const { classId } = await params;
    return <ClassTranscriptClient classId={classId} />;
}