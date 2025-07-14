// src/config/formConfig.jsx
import React from "react";
import T1_1Form from "../components/T1_1Form";
// import other form components as you build them, e.g.
// import T1_2Form from "../components/T1_2Form";

export const formSections = [
  { code: "T1.1", title: "Published Research Articles in Journals" },
  { code: "T1.2", title: "Published Research Papers in Conferences" },
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
      { label: "Title", key: "title" },
      { label: "Journal", key: "journal_name" },
      {
        label: "Authors",
        render: (item) => {
          const parts = [];
          if (item.internal_authors) parts.push(item.internal_authors);
          if (item.external_authors) parts.push(item.external_authors);
          return parts.join(" | ");
        },
      },
      { label: "Impact Factor", key: "impact_factor" },
      {
        label: "Indexing",
        render: (item) =>
          [
            item.indexing_wos && "WOS",
            item.indexing_scopus && "Scopus",
            item.indexing_ugc && "UGC",
            item.indexing_other,
          ]
            .filter(Boolean)
            .join(", "),
      },
      {
        label: "Document",
        render: (item) =>
          item.document_link ? (
            <a href={item.document_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
    ],
  },

  // Stub entries for the other sections (until you create their FormComponents)
  "T1.2": {
    endpoint: "/api/faculty/t1conferencepapers/",
    FormComponent: null,
    listFields: [
      { label: "Title", key: "title" },
      { label: "Conference", key: "conference_name" },
      { label: "Authors", key: "authors" },
      { label: "Year", key: "year" },
      {
        label: "Document",
        render: (item) =>
          item.document_link ? (
            <a href={item.document_link} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            ""
          ),
      },
    ],
  },
  // Repeat for T2.1, T2.2, …, S5.4 with FormComponent: null until implemented
};
