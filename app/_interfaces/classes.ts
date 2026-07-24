export interface Subject {
    id: string;
    code: string;
    name: string;
}

export interface ClassDetails {
    id: string;
    name: string;
    section: string;
    batch_name: string;
    academic_year: string;
    class_code: string;
    subjects: Subject[];
}

export interface MyClass {
    id: string;
    class_details: ClassDetails;
    joined_at: string;
}

export interface MyClassesResponse {
    total_enrolled_classes: number;
    my_classes: MyClass[];
}