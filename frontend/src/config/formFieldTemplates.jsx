// src/config/formFieldTemplates.jsx
import React from 'react';
import { Link } from '@mui/material';

// --- FIX: Add 'export' to the helper functions ---
export const renderLink = (key) => (item) => {
  const url = item[key];
  return url ? (
    <Link href={url} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 500 }}>
      View
    </Link>
  ) : 'N/A';
};

export const renderBoolean = (key) => (item) => item[key] ? 'Yes' : 'No';
// --- END OF FIX ---


// --- Reusable Field Definitions (No changes below this line) ---

export const facultyNameField = { label: "Faculty Name", key: "faculty_name" };
export const studentNameField = { label: "Student Name", key: "student_name" };
export const departmentNameField = { label: "Department", key: "department_name" };

export const sessionFields = [
  { label: "Quarter", key: "quarter" },
  { label: "Year", key: "year" },
];

export const authorFields = [
  { label: "Author Type", key: "author_type" },
  { label: "Internal Authors", key: "internal_authors" },
  { label: "External Authors", key: "external_authors" },
];

export const publicationFields = [
  { label: "Publisher", key: "publisher" },
  { label: "Page No.", key: "page_no" },
  { label: "Month & Year", key: "publication_month_year" },
];

export const indexingFields = [
    { label: "Scopus Indexed", key: "indexing_scopus", render: renderBoolean("indexing_scopus") },
    { label: "Other Indexing", key: "indexing_other" },
];

export const proofLinkField = { label: "Proof", key: "proof_link", render: renderLink("proof_link") };
export const certificateLinkField = { label: "Certificate", key: "certificate_link", render: renderLink("certificate_link") };
export const reportLinkField = { label: "Report", key: "report_link", render: renderLink("report_link") };
export const socialProfileLinkField = { label: "Social Profile", key: "social_profile_link", render: renderLink("social_profile_link") };

export const conferenceFields = [
    { label: "Conference Status", key: "conference_status" },
    { label: "Conference Mode", key: "mode" },
];