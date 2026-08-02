import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ClassTranscript } from "@/app/_interfaces/transcript";
import { getLetterGrade, getOverallPercentage } from "@/app/_lib/grading";
export function downloadTranscriptPdf(transcript: ClassTranscript) {
    const doc = new jsPDF();

    // ===========================
    // Header
    // ===========================
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(transcript.transcript_header.document_title, 105, 18, {
        align: "center",
    });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    doc.text(
        `Institution: ${transcript.transcript_header.institution_name}`,
        14,
        30
    );

    doc.text(
        `Generated: ${transcript.transcript_header.generated_at}`,
        14,
        37
    );

    // ===========================
    // Student Information
    // ===========================
    doc.setFont("helvetica", "bold");
    doc.text("Student Information", 14, 50);

    doc.setFont("helvetica", "normal");

    doc.text(`Name: ${transcript.student_info.name}`, 14, 58);
    doc.text(`Student ID: ${transcript.student_info.student_id}`, 14, 65);
    doc.text(`Email: ${transcript.student_info.email}`, 14, 72);

    // ===========================
    // Class Information
    // ===========================
    doc.setFont("helvetica", "bold");
    doc.text("Class Information", 14, 85);

    doc.setFont("helvetica", "normal");

    doc.text(`Program: ${transcript.class_info.program}`, 14, 93);
    doc.text(`Section: ${transcript.class_info.section}`, 14, 100);
    doc.text(`Batch: ${transcript.class_info.batch}`, 14, 107);
    doc.text(`Academic Year: ${transcript.class_info.academic_year}`, 14, 114);

    // ===========================
    // Summary
    // ===========================
    const overallPercentage = getOverallPercentage(
        transcript.summary.total_obtained_marks,
        transcript.summary.total_full_marks
    );
    const overallGrade = overallPercentage !== null ? getLetterGrade(overallPercentage) : "-";

    doc.setFont("helvetica", "bold");
    doc.text("Overall Result", 14, 127);

    doc.setFont("helvetica", "normal");

    doc.text(
        `Total Marks: ${transcript.summary.total_obtained_marks} / ${transcript.summary.total_full_marks}`,
        14,
        135
    );

    doc.text(
        `Overall Percentage: ${overallPercentage !== null ? `${overallPercentage}%` : "-"}`,
        14,
        142
    );

    doc.text(
        `Overall Grade: ${overallGrade}`,
        14,
        149
    );

    doc.text(
        `Overall Status: ${transcript.summary.overall_status}`,
        14,
        156
    );

    // ===========================
    // Build Subject Rows
    // ===========================
    const body: (string | number)[][] = [];

    transcript.subjects.forEach((subject) => {
        body.push([
            subject.subject_code,
            subject.subject_name,
            "",
            "",
            "",
            subject.final_percentage == null
                ? "-"
                : `${subject.final_percentage}%`,
            subject.final_letter_grade,
            subject.is_passed ? "Pass" : "Fail",
        ]);

        subject.exam_breakdown.forEach((exam) => {
            body.push([
                "",
                `${exam.exam_type}`,
                exam.obtained_marks,
                exam.full_marks,
                `${exam.percentage}%`,
                "",
                "",
                "",
            ]);
        });
    });

    // ===========================
    // Table
    // ===========================
    autoTable(doc, {
        startY: 166,

        head: [[
            "Code",
            "Subject / Exam",
            "Obtained",
            "Full",
            "Exam %",
            "Final %",
            "Grade",
            "Status",
        ]],

        body,

        styles: {
            fontSize: 9,
            cellPadding: 2,
            valign: "middle",
        },

        headStyles: {
            fillColor: [40, 40, 40],
            textColor: 255,
            fontStyle: "bold",
        },

        alternateRowStyles: {
            fillColor: [245, 245, 245],
        },

        bodyStyles: {
            textColor: 30,
        },

        columnStyles: {
            0: { cellWidth: 22 },
            1: { cellWidth: 55 },
            2: { halign: "center" },
            3: { halign: "center" },
            4: { halign: "center" },
            5: { halign: "center" },
            6: { halign: "center" },
            7: { halign: "center" },
        },
    });

    doc.save(`${transcript.student_info.student_id}_transcript.pdf`);
}