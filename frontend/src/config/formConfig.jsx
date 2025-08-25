// src/config/formConfig.jsx
import React from "react";
import T1_1Form from "../components/T1_1Form";
import T1_2Form from "../components/T1_2Form";
import T2_1Form from "../components/T2_1Form";
import T2_2Form from "../components/T2_2Form";
import T3_1Form from "../components/T3_1Form";
import T3_2Form from "../components/T3_2Form";
import T4_1Form from "../components/T4_1Form";
import T4_2Form from "../components/T4_2Form";
import T4_3Form from "../components/T4_3Form";
import T5_1Form from "../components/T5_1Form";
import T5_2Form from "../components/T5_2Form";
import T5_3Form from "../components/T5_3Form";
import T5_4Form from "../components/T5_4Form";
import T5_5Form from "../components/T5_5Form";
import T5_6Form from "../components/T5_6Form";
import T6_1Form from "../components/T6_1Form";
import T6_2Form from "../components/T6_2Form";
import T6_3Form from "../components/T6_3Form";
import T6_4Form from "../components/T6_4Form";
import T6_5Form from "../components/T6_5Form";
import T7_1Form from "../components/T7_1Form";
import S2_1Form from "../components/S2_1Form";
import S2_2Form from "../components/S2_2Form"; 


export const formSections = [
  {
    code: "T1.1",
    title:
      "T1.1: Details of the Published Research Articles/Papers in Journals/Periodicals",
  },
  {
    code: "T1.2",
    title: "T1.2: Details of the Paper Publication in Conferences",
  },
  {
    code: "T2.1",
    title:
      "Details of the FDP/Short Term Training Program/Workshop etc. Attended By Faculty Members",
  },
  {
    code: "T2.2",
    title: "Details of FDP/STTP/Workshop/Skill Development Organized",
  },
  { code: "T3.1", title: "Consultancy Details of Books/Monographs Published" },
  {
    code: "T3.2",
    title:
      "Details of Chapters Published in Books/Reference Books/Edited Books",
  },
  { code: "T4.1", title: "Funded Research Projects (New)" },
  { code: "T4.2", title: "Funded Research Projects (Ongoing)" },
  { code: "T4.3", title: "Research Guidance: Ph.D. Awarded" },
  { code: "T5.1", title: "Conferences / Seminars / Workshops Conducted" },
  { code: "T5.2", title: "FDPs / STTPs Conducted" },
  { code: "T5.3", title: "FDPs / STTPs Attended" },
  { code: "T5.4", title: "Invited Talks / Guest Lectures Delivered" },
  { code: "T5.5", title: "Chair / Co-chair / Panelist Roles" },
  { code: "T5.6", title: "MOUs Signed" },
  { code: "T6.1", title: "National / International Awards / Recognitions" },
  { code: "T6.2", title: "Professional Society Memberships" },
  { code: "T6.3", title: "Reviewers / Editorial Board Members" },
  { code: "T6.4", title: "Students Qualified GATE/NET/GMAT/etc." },
  { code: "T6.5", title: "Hackathons / Technical Competitions" },
  { code: "T7.1", title: "Startups / Entrepreneurship Initiatives" },
  { code: "S1.1", title: "Extension Activities / Social Responsibility" },
  { code: "S2.1", title: "Details of the Published Research Articles/Papers in Journals/Periodicals by the students" },
  { code: "S2.2", title: "Details of the Research Paper Presented by the Students in a conferences" },
  { code: "S2.3", title: "Student Awards / Scholarships" },
  { code: "S3.1", title: "Placements & Higher Studies" },
  { code: "S3.2", title: "Internships (Students)" },
  { code: "S4.1", title: "Faculty Development Initiatives" },
  { code: "S4.2", title: "Infrastructure Development" },
  { code: "S4.3", title: "Digital Initiatives" },
  { code: "S4.4", title: "Green Campus / Sustainability Efforts" },
  { code: "S5.1", title: "Institutional Collaborations" },
  { code: "S5.2", title: "Alumni Engagement" },
  { code: "S5.3", title: "Industry Visits / Linkages" },
  { code: "S5.4", title: "Feedback / Surveys / Rankings" },
];

export const formConfig = {
  "T1.1": {
    endpoint: "/api/faculty/t1research/",
    FormComponent: T1_1Form,
    listFields: [
      { label: "Name of Faculty", key: "faculty_name" },
      { label: "Title", key: "title" },
      { label: "Author Type", key: "author_type" },
      { label: "Internal Authors", key: "internal_authors" },
      { label: "External Authors", key: "external_authors" },
      { label: "Journal Name", key: "journal_name" },
      { label: "Volume", key: "volume" },
      { label: "Issue", key: "issue" },
      { label: "Page No", key: "page_no" },
      { label: "Month & Year", key: "publication_month_year" },
      { label: "ISSN Number", key: "issn_number" },
      { label: "Impact Factor", key: "impact_factor" },
      { label: "Publisher", key: "publisher" },
      {
        label: "WOS (ESCI, SCIE…)",
        key: "indexing_wos",
        render: (i) => (i.indexing_wos ? "✔︎" : ""),
      },
      {
        label: "Scopus",
        key: "indexing_scopus",
        render: (i) => (i.indexing_scopus ? "✔︎" : ""),
      },
      {
        label: "UGC Care 1",
        key: "indexing_ugc",
        render: (i) => (i.indexing_ugc ? "✔︎" : ""),
      },
      { label: "Other (Referred Journal)", key: "indexing_other" },
      { label: "DOI", key: "doi" },
      {
        label: "Google Drive Link",
        key: "google_drive_link",
        render: (i) =>
          i.google_drive_link ? (
            <a href={i.google_drive_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
      { label: "Department", key: "department" },
    ],
  },

  "T1.2": {
    endpoint: "/api/faculty/t1_2research/",
    FormComponent: T1_2Form,
    listFields: [
      { label: "Name of Faculty", key: "faculty_name" },
      { label: "Title", key: "title" },
      { label: "Author Type", key: "author_type" },
      { label: "Internal Authors", key: "internal_authors" },
      { label: "External Authors", key: "external_authors" },
      { label: "Conference / Publication Details", key: "conference_details" },
      { label: "ISBN/ISSN", key: "isbn_issn" },
      { label: "Publisher", key: "publisher" },
      { label: "Page No", key: "page_no" },
      { label: "Month & Year", key: "publication_month_year" },
      {
        label: "Scopus",
        key: "indexing_scopus",
        render: (i) => (i.indexing_scopus ? "✔︎" : ""),
      },
      { label: "Other Indexing", key: "indexing_other" },
      { label: "Conference Status", key: "conference_status" },
      { label: "Conference Mode", key: "conference_mode" },
      {
        label: "Registration Fee Reimbursed",
        key: "registration_fee_reimbursed",
        render: (i) => (i.registration_fee_reimbursed ? "✔︎" : ""),
      },
      { label: "Special Leave Dates", key: "special_leave_dates" },
      {
        label: "Certificate Link",
        key: "certificate_link",
        render: (i) =>
          i.certificate_link ? (
            <a href={i.certificate_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
      { label: "Department", key: "department" },
      { label: "Quarter", key: "quarter" },
      { label: "Year", key: "year" },
    ],
  },

  "T2.1": {
    endpoint: "/api/faculty/t2_1workshops/",
    FormComponent: T2_1Form,
    listFields: [
      { label: "Name of Faculty", key: "faculty_name" },
      { label: "Program Name", key: "program_name" },
      { label: "Organizer", key: "organizer" },
      { label: "Place", key: "place" },
      { label: "Start Date", key: "start_date" },
      { label: "End Date", key: "end_date" },
      { label: "Number of Days", key: "num_days" },
      { label: "Mode", key: "mode" },
      {
        label: "Registration Fee Reimbursed",
        key: "registration_fee_reimbursed",
        render: (i) => (i.registration_fee_reimbursed ? "✔︎" : ""),
      },
      { label: "Special Leave Dates", key: "special_leave_dates" },
      {
        label: "Certificate Link",
        key: "certificate_link",
        render: (i) =>
          i.certificate_link ? (
            <a href={i.certificate_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
      { label: "Department", key: "department" },
      { label: "Quarter", key: "quarter" },
      { label: "Year", key: "year" },
    ],
  },

  "T2.2": {
    endpoint: "/api/faculty/t2_2organized/",
    FormComponent: T2_2Form,
    listFields: [
      { label: "Name of Faculty", key: "faculty_name" },
      { label: "Role", key: "role" },
      { label: "Activity Type", key: "activity_type" },
      { label: "Program Name", key: "program_name" },
      { label: "Organized By (Dept)", key: "organized_by_dept" },
      { label: "Place", key: "place" },
      { label: "Start Date", key: "start_date" },
      { label: "End Date", key: "end_date" },
      { label: "Number of Days", key: "num_days" },
      { label: "Mode", key: "mode" },
      { label: "Participants", key: "num_participants" },
      { label: "Collaborator", key: "collaborator" },
      {
        label: "Report Link",
        key: "report_link",
        render: (i) =>
          i.report_link ? (
            <a href={i.report_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
      { label: "Department", key: "department" },
      { label: "Quarter", key: "quarter" },
      { label: "Year", key: "year" },
    ],
  },

  "T3.1": {
    endpoint: "/api/faculty/t3_1books/",
    FormComponent: T3_1Form,
    listFields: [
      { label: "Name of Faculty", key: "faculty_name" },
      { label: "Book Title", key: "book_title" },
      { label: "Author Type", key: "author_type" },
      { label: "Publisher Details", key: "publisher_details" },
      { label: "ISBN/ISSN", key: "isbn_number" },
      { label: "Indexing", key: "indexing" },
      { label: "Year of Publication", key: "publication_year" },
      { label: "Print Mode", key: "print_mode" },
      { label: "Book Type", key: "book_type" },
      {
        label: "Proof Link",
        key: "proof_link",
        render: (i) =>
          i.proof_link ? (
            <a href={i.proof_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
      { label: "Department", key: "department" },
      { label: "Quarter", key: "quarter" },
      { label: "Year", key: "year" },
    ],
  },

  "T3.2": {
    endpoint: "/api/faculty/t3_2chapters/",
    FormComponent: T3_2Form,
    listFields: [
      { label: "Name of Faculty", key: "faculty_name" },
      { label: "Chapter Title", key: "chapter_title" },
      { label: "Author Type", key: "author_type" },
      { label: "Publisher Details", key: "publisher_details" },
      { label: "ISBN/ISSN", key: "isbn_number" },
      { label: "Indexing", key: "indexing" },
      { label: "Year of Publication", key: "publication_year" },
      { label: "Book Type", key: "book_type" },
      {
        label: "Proof Link",
        key: "proof_link",
        render: (i) =>
          i.proof_link ? (
            <a href={i.proof_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
      { label: "Department", key: "department" },
      { label: "Quarter", key: "quarter" },
      { label: "Year", key: "year" },
    ],
  },
  "T4.1": {
    endpoint: "/api/faculty/t4_1editorial/",
    FormComponent: T4_1Form,
    listFields: [
      { label: "Faculty Name", key: "faculty_name" },
      { label: "Title", key: "title" },
      { label: "Role", key: "role" },
      { label: "Publisher", key: "publisher" },
      { label: "ISSN/ISBN", key: "issn_isbn" },
      { label: "Indexing", key: "indexing" },
      { label: "Quarter", key: "quarter" }, // Display quarter in the view table
      { label: "Year", key: "year" }, // Display year in the view table
      { label: "Type", key: "type" },
      {
        label: "Proof",
        key: "proof_link",
        render: (i) =>
          i.proof_link ? (
            <a href={i.proof_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
    ],
  },

  "T4.2": {
    endpoint: "/api/faculty/t4_2reviewers/",
    FormComponent: T4_2Form,
    listFields: [
      { label: "Faculty Name", key: "faculty_name" },
      { label: "Publication Type", key: "publication_type" },
      { label: "Title", key: "title" },
      { label: "Indexing", key: "indexing" },
      { label: "Quarter", key: "quarter" },
      { label: "Year", key: "year" },
      {
        label: "Proof",
        key: "proof_link",
        render: (i) =>
          i.proof_link ? (
            <a href={i.proof_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
    ],
  },
  "T4.3": {
    endpoint: "/api/faculty/t4_3committees/",
    FormComponent: T4_3Form,
    listFields: [
      { label: "Faculty Name", key: "faculty_name" },
      { label: "Committee", key: "body_details" },
      { label: "Responsibility", key: "responsibility" },
      { label: "Level", key: "level" },
      { label: "Quarter", key: "quarter" },
      { label: "Year", key: "year" },
      {
        label: "Proof",
        key: "proof_link",
        render: (i) =>
          i.proof_link ? (
            <a href={i.proof_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
    ],
  },
  // In src/config/formConfig.jsx

  "T5.1": {
    endpoint: "/api/faculty/t5_1patents/",
    FormComponent: T5_1Form, // This remains the same
    listFields: [
      // This array now includes all columns to match your screenshot
      { label: "Name of Faculty", key: "faculty_name" },
      { label: "Title", key: "title" },
      { label: "Internal Co-Inventors", key: "internal_co_inventors" },
      { label: "External Co-Inventors", key: "external_co_inventors" },
      { label: "Type of IPR", key: "ipr_type" },
      { label: "Application No", key: "application_number" },
      { label: "Status", key: "status" },
      { label: "Filled Date", key: "filled_date" },
      { label: "Published/Granted Date", key: "published_granted_date" },
      { label: "Publication Number", key: "publication_number" },
      {
        label: "Technology Transfer",
        key: "technology_transfer",
        render: (i) => (i.technology_transfer ? "YES" : "NO"), // Displays YES/NO
      },
      { label: "Country of Patent", key: "country" },
      {
        label: "Google Drive Link (Proof)",
        key: "proof_link",
        render: (i) =>
          i.proof_link ? (
            <a href={i.proof_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
      { label: "Department", key: "department" }, // Assuming department is sent from backend
    ],
  },
  "T5.2": {
    endpoint: "/api/faculty/t5_2sponsored/",
    FormComponent: T5_2Form,
    listFields: [
      { label: "Principal Investigator (PI)", key: "principal_investigator" },
      {
        label: "Co-Principal Investigator (Co-PI)",
        key: "co_principal_investigator",
      },
      { label: "Members (if any)", key: "members" },
      { label: "Name of the Funding Agency", key: "funding_agency" },
      { label: "Title of the Project", key: "project_title" },
      { label: "Sanctioned Order No.", key: "sanctioned_order_no" },
      { label: "Sanctioned Date", key: "sanctioned_date" },
      { label: "Status (Ongoing/Completed)", key: "status" },
      { label: "Completion Date (if applicable)", key: "completion_date" },
      { label: "Sanctioned Amount (In Lakhs)", key: "sanctioned_amount_lakhs" },
      { label: "Amount Received (In Rupees)", key: "amount_received_rupees" },
      { label: "Duration of the Project", key: "duration" },
      { label: "Regional/National/International", key: "regionality" },
      {
        label: "Google Drive Link (Upload Proof)",
        key: "proof_link",
        render: (i) =>
          i.proof_link ? (
            <a href={i.proof_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
      { label: "Department", key: "department" },
    ],
  },
  "T5.3": {
    endpoint: "/api/faculty/t5_3consultancy/",
    FormComponent: T5_3Form,
    listFields: [
      { label: "Internal Faculty", key: "internal_faculty" },
      { label: "External Faculty", key: "external_faculty" },
      { label: "Client Name", key: "client_name" },
      { label: "Title of Consultancy", key: "title" },
      { label: "Sanctioned Order No.", key: "sanctioned_order_no" },
      { label: "Sanctioned Date", key: "sanctioned_date" },
      { label: "Sanctioned Amount (Lakhs)", key: "sanctioned_amount_lakhs" },
      { label: "Amount Received (Rupees)", key: "amount_received_rupees" },
      { label: "Status", key: "status" },
      { label: "Duration", key: "duration" },
      { label: "Regionality", key: "regionality" },
      {
        label: "Proof Link",
        key: "proof_link",
        render: (i) =>
          i.proof_link ? (
            <a href={i.proof_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
      { label: "Department", key: "department" },
    ],
  },
  // In src/config/formConfig.jsx

  "T5.4": {
    endpoint: "/api/faculty/t5_4content/",
    FormComponent: T5_4Form, // This remains the same
    listFields: [
      // This new array matches your screenshot headers exactly
      { label: "Name of the Faculty", key: "faculty_name" },
      {
        label: "Name of the Course/e-content/Laboratory Module Developed",
        key: "course_module_name",
      },
      {
        label: "Plateform on which module is developed (Moodle, Gsuite, etc.)",
        key: "platform",
      },
      {
        label: "Any other Contributory Institute/Industry",
        key: "contributory_institute",
      },
      { label: "Usage and Citation etc.", key: "usage_citation" },
      { label: "Amount Spent (if any)", key: "amount_spent" },
      { label: "Date of Launching Content", key: "launch_date" },
      {
        label: "Google Drive Link (Upload Proof) or Share Online Content Link",
        key: "link",
        render: (i) =>
          i.link ? (
            <a href={i.link} target="_blank" rel="noreferrer">
              View Link
            </a>
          ) : (
            ""
          ),
      },
      { label: "Department", key: "department" },
    ],
  },
  "T5.5": {
    endpoint: "/api/faculty/t5_5labequipment/",
    FormComponent: T5_5Form,
    listFields: [
      { label: "Name of the Laboratory", key: "lab_name" },
      { label: "Major Equipment", key: "major_equipment" },
      { label: "Purpose of the Development of the Laboratory", key: "purpose" },
      {
        label: "Approx. Cost of Equipment in Developing the Laboratory",
        key: "equipment_cost",
      },
      {
        label: "Google Drive Link (Upload Proof)",
        key: "proof_link",
        render: (i) =>
          i.proof_link ? (
            <a href={i.proof_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
      { label: "Department", key: "department" },
    ],
  },
    "T5.6": {
    endpoint: "/api/faculty/t5_6research/",
    FormComponent: T5_6Form,
    listFields: [
      { label: "Name of Faculty", key: "faculty_name" },
      { label: "Role (Supervisor/Co-Supervisor)", key: "role" },
      { label: "Name of Candidate", key: "candidate_name" },
      { label: "Enrollment No.", key: "enrollment_number" },
      { label: "Title of Thesis", key: "thesis_title" },
      { label: "Date of Registration", key: "registration_date" },
      { label: "Date of PhD Viva-Voce", key: "viva_voce_date" },
      { label: "Complete Details of External Examiner", key: "external_examiner_details" },
      { label: "Status (Completed/Ongoing)", key: "status" },
      { label: "Name of the Research Center", key: "research_center" },
      { label: "Name of the PhD Conferring University", key: "conferring_university" },
      {
        label: "Google Drive Link (Proof)",
        key: "proof_link",
        render: (i) =>
          i.proof_link ? (
            <a href={i.proof_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
      { label: "Department", key: "department" },
    ],
  },
    "T6.1": {
    endpoint: "/api/faculty/t6_1certcourses/",
    FormComponent: T6_1Form,
    listFields: [
      { label: "Name of Faculty", key: "faculty_name" },
      { label: "Name of the Certification Course", key: "certification_course" },
      { label: "Course Name", key: "course_name" },
      { label: "Category of the Course", key: "category" },
      { label: "Duration of the Course", key: "duration" },
      { label: "Credit Points Earned", key: "credit_points" },
      { label: "Certification type", key: "certification_type" },
      {
        label: "Google Drive Link (Upload Certificate)",
        key: "certificate_link",
        render: (i) =>
          i.certificate_link ? (
            <a href={i.certificate_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
      { label: "Department", key: "department" },
    ],
  },
    "T6.2": {
    endpoint: "/api/faculty/t6_2professmb/",
    FormComponent: T6_2Form,
    listFields: [
      { label: "Name of Faculty", key: "faculty_name" },
      { label: "Name of Institution/Society", key: "institution_name" },
      { label: "Grade of Membership", key: "membership_grade" },
      { label: "Membership Number", key: "membership_number" },
      { label: "Year of Election", key: "year_of_election" },
      {
        label: "Google Drive Link (Upload Proof)",
        key: "proof_link",
        render: (i) =>
          i.proof_link ? (
            <a href={i.proof_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
      { label: "Department", key: "department" },
    ],
  },
    "T6.3": {
    endpoint: "/api/faculty/t6_3awards/",
    FormComponent: T6_3Form,
    listFields: [
      { label: "Name of the Recipient", key: "faculty_name" },
      { label: "Name of Award", key: "award_name" },
      { label: "Award Conferred by", key: "conferred_by" },
      { label: "Award Date", key: "award_date" },
      { label: "Type of Award (Regional/National/International)", key: "award_type" },
      {
        label: "Google Drive Link (Upload Proof)",
        key: "proof_link",
        render: (i) =>
          i.proof_link ? (
            <a href={i.proof_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
      { label: "Department", key: "department" },
    ],
  },
    "T6.4": {
    endpoint: "/api/faculty/t6_4resource/",
    FormComponent: T6_4Form,
    listFields: [
      { label: "Name of Faculty", key: "faculty_name" },
      { label: "Department", key: "department" }, // Added Department as per screenshot
      { label: "Invited By", key: "invited_by" },
      { label: "Title/Subject of Lecture delivered", key: "lecture_title" },
      { label: "Date", key: "date" },
      { label: "Duration (hrs.)", key: "duration_hours" },
      {
        label: "Google Drive Link (Upload Proof)",
        key: "proof_link",
        render: (i) =>
          i.proof_link ? (
            <a href={i.proof_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
    ],
  },
    "T6.5": {
    endpoint: "/api/faculty/t6_5aicte/",
    FormComponent: T6_5Form,
    listFields: [
      { label: "Name of Faculty", key: "faculty_name" },
      { label: "Name of the AICTE Initiative Taken", key: "initiative_name" },
      { label: "Date", key: "date" },
      { label: "Role", key: "role" },
      { label: "Name of the Organizing Institute", key: "organizing_institute" },
      {
        label: "Google Drive Link (Upload Proof)",
        key: "proof_link",
        render: (i) =>
          i.proof_link ? (
            <a href={i.proof_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
      { label: "Department", key: "department" },
    ],
  },
    "T7.1": {
    endpoint: "/api/faculty/t7_1programs/",
    FormComponent: T7_1Form,
    listFields: [
      { label: "Name of the Organizer", key: "organizer_name" },
      { label: "Name of the Event/Competition", key: "event_name" },
      { label: "Type of Event/Competition", key: "event_type" },
      { label: "Program Start Date", key: "start_date" },
      { label: "Program End Date", key: "end_date" },
      { label: "Number of Days", key: "num_days" },
      { label: "Mode (Online/Offline)", key: "mode" },
      { label: "Number of Participants attended", key: "participants_count" },
      { label: "Collaborator (If any) with complete contact details", key: "collaborator_details" },
      {
        label: "Google Drive Link (Upload Report)",
        key: "report_link",
        render: (i) =>
          i.report_link ? (
            <a href={i.report_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
    ],
  },
  "S2.1": {
    endpoint: "/api/data/s2_1articles/",
    FormComponent: S2_1Form,
    listFields: [
      { label: "Title", key: "title" },
      { label: "Author Type", key: "author_type" },
      { label: "Internal Authors", key: "internal_authors" },
      { label: "External Authors", key: "external_authors" },
      { label: "Journal Name", key: "journal_name" },
      { label: "Volume", key: "volume" },
      { label: "Issue", key: "issue" },
      { label: "Page No", key: "page_no" },
      { label: "Month & Year", key: "publication_month_year" },
      { label: "ISSN", key: "issn_number" },
      { label: "Impact Factor", key: "impact_factor" },
      { label: "Publisher", key: "publisher" },
      {
        label: "Web of Science",
        key: "indexing_wos",
        render: (item) => (item.indexing_wos ? "✔︎" : "—"),
      },
      {
        label: "Scopus",
        key: "indexing_scopus",
        render: (item) => (item.indexing_scopus ? "✔︎" : "—"),
      },
      {
        label: "UGC Care",
        key: "indexing_ugc",
        render: (item) => (item.indexing_ugc ? "✔︎" : "—"),
      },
      { label: "Other Indexing", key: "indexing_other" },
      { label: "DOI", key: "doi" },
      {
        label: "Proof Link",
        key: "proof_link",
        render: (item) =>
          item.proof_link ? (
            <a href={item.proof_link} target="_blank" rel="noopener noreferrer">
              View
            </a>
          ) : (
            "N/A"
          ),
      },
    ],
  },
  "S2.2": {
    endpoint: "/api/data/s2_2conferences/",
    FormComponent: S2_2Form,
    listFields: [
      { label: "Title", key: "title" },
      { label: "Author Type", key: "author_type" },
      { label: "Internal Authors", key: "internal_authors" },
      { label: "External Authors", key: "external_authors" },
      { label: "Conference Details", key: "conference_details" },
      { label: "ISBN/ISSN", key: "isbn_issn" },
      { label: "Publisher", key: "publisher" },
      { label: "Page No", key: "page_no" },
      { label: "Month & Year", key: "publication_month_year" },
      {
        label: "Scopus",
        key: "indexing_scopus",
        render: (item) => (item.indexing_scopus ? "✔︎" : "—"),
      },
      { label: "Other Indexing", key: "indexing_other" },
      { label: "Conference Status", key: "conference_status" },
      { label: "Conference Mode", key: "conference_mode" },
      {
        label: "Proof Link",
        key: "proof_link",
        render: (item) =>
          item.proof_link ? (
            <a href={item.proof_link} target="_blank" rel="noopener noreferrer">
              View
            </a>
          ) : (
            "N/A"
          ),
      },
      { label: "Department", key: "department_name" },
    ],
  },
  // …other configs remain unchanged
};
