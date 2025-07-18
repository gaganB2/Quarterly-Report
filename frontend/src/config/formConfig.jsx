// src/config/formConfig.jsx
import React from "react";
import T1_1Form from "../components/T1_1Form";
import T1_2Form from "../components/T1_2Form";

export const formSections = [
  { code: "T1.1", title: "T1.1: Details of the Published Research Articles/Papers in Journals/Periodicals" },
  { code: "T1.2", title: "T1.2: Details of the Paper Publication in Conferences" },
  { code: "T2.1", title: "Books / Book Chapters / Edited Volumes" },
  { code: "T2.2", title: "Patents / IP Rights Filed/Granted" },
  { code: "T3.1", title: "Consultancy Projects" },
  { code: "T3.2", title: "Revenue Generated Through Consultancy" },
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
  { code: "S2.1", title: "Sports Achievements" },
  { code: "S2.2", title: "Cultural Achievements" },
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
      { label: "WOS (ESCI, SCIE…)", key: "indexing_wos", render: i => i.indexing_wos ? "✔︎" : "" },
      { label: "Scopus", key: "indexing_scopus", render: i => i.indexing_scopus ? "✔︎" : "" },
      { label: "UGC Care 1", key: "indexing_ugc", render: i => i.indexing_ugc ? "✔︎" : "" },
      { label: "Other (Referred Journal)", key: "indexing_other" },
      { label: "DOI", key: "doi" },
      {
        label: "Google Drive Link",
        key: "google_drive_link",
        render: i =>
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
      { label: "Scopus", key: "indexing_scopus", render: i => i.indexing_scopus ? "✔︎" : "" },
      { label: "Other Indexing", key: "indexing_other" },
      { label: "Conference Status", key: "conference_status" },
      { label: "Conference Mode", key: "conference_mode" },
      { label: "Registration Fee Reimbursed", key: "registration_fee_reimbursed", render: i => i.registration_fee_reimbursed ? "✔︎" : "" },
      { label: "Special Leave Dates", key: "special_leave_dates" },
      {
        label: "Certificate Link",
        key: "certificate_link",
        render: i =>
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

  // …other configs remain unchanged
};
