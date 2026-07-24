export interface ExamBreakdown {
    exam_type: string;
    obtained_marks: number;
    full_marks: number;
    percentage: number;
}

export interface ClassTranscriptSubject {
    subject_name: string;
    subject_code: string;
    final_percentage: number | null;
    final_letter_grade: string;
    is_passed: boolean | null;
    exam_breakdown: ExamBreakdown[];
}

export interface ClassTranscriptClassInfo {
    program: string;
    section: string;
    batch: string;
    academic_year: string;
}

export interface ClassTranscript {
    transcript_header: {
        institution_name: string;
        document_title: string;
        generated_at: string;
    };
    student_info: TranscriptStudentInfo;
    class_info: ClassTranscriptClassInfo;
    summary: TranscriptSummary;
    subjects: ClassTranscriptSubject[];
}
export interface TranscriptStudentInfo {
    name: string;
    student_id: string;
    email: string;
}

export interface TranscriptClassInfo {
    name: string;
    section: string;
    batch: string;
    academic_year: string;
}

export interface TranscriptSummary {
    total_obtained_marks: number;
    total_full_marks: number;
    overall_status: string; // e.g. "Pending" | "Passed" | "Failed" — tighten if you have a fixed set
}

export interface TranscriptSubject {
    subject_code: string;
    subject_name: string;
    obtained_marks: number | null;
    full_marks: number;
    letter_grade: string;
    is_passed: boolean | null;
}

export interface Transcript {
    class_info: TranscriptClassInfo;
    student_info: TranscriptStudentInfo;
    summary: TranscriptSummary;
    subjects: TranscriptSubject[];
}