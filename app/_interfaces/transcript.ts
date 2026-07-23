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
    overall_status: string;
}

export interface TranscriptSubject {
    subject_name: string;
    subject_code: string;
    obtained_marks: number | null;
    full_marks: number;
    letter_grade: string;
    is_passed: boolean | null;
}

export interface Transcript {
    student_info: TranscriptStudentInfo;
    class_info: TranscriptClassInfo;
    summary: TranscriptSummary;
    subjects: TranscriptSubject[];
}