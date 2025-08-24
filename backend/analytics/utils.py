# analytics/utils.py

from reports import models as report_models

# This dictionary provides a structured, maintainable mapping of analytics categories
# to the specific report models they encompass. This is the core of our new, flexible
# analytics feature, allowing the frontend to request data for logical groupings.

ANALYTICS_CATEGORIES = {
    "faculty_research_and_publications": {
        "display_name": "Faculty Research & Publications",
        "models": [
            report_models.T1_ResearchArticle,
            report_models.T1_2ResearchArticle,
            report_models.T3_1BookPublication,
            report_models.T3_2ChapterPublication,
        ],
    },
    "faculty_development_and_training": {
        "display_name": "Faculty Development & Training",
        "models": [
            report_models.T2_1WorkshopAttendance,
            report_models.T2_2WorkshopOrganized,
            report_models.T6_1CertificationCourse,
        ],
    },
    "faculty_professional_services": {
        "display_name": "Faculty Professional Services",
        "models": [
            report_models.T4_1EditorialBoard,
            report_models.T4_2ReviewerDetails,
            report_models.T4_3CommitteeMembership,
            report_models.T6_2ProfessionalBodyMembership,
            report_models.T6_4ResourcePerson,
        ],
    },
    "faculty_projects_and_innovation": {
        "display_name": "Faculty Projects & Innovation",
        "models": [
            report_models.T5_1PatentDetails,
            report_models.T5_2SponsoredProject,
            report_models.T5_3ConsultancyProject,
            report_models.T5_4CourseDevelopment,
            report_models.T5_5LabEquipmentDevelopment,
            report_models.T5_6ResearchGuidance,
        ],
    },
    "faculty_awards_and_initiatives": {
        "display_name": "Faculty Awards & Initiatives",
        "models": [
            report_models.T6_3Award,
            report_models.T6_5AICTEInitiative,
            report_models.T7_1ProgramOrganized,
        ],
    },
    "student_research_and_projects": {
        "display_name": "Student Research & Projects",
        "models": [
            report_models.S2_1StudentArticle,
            report_models.S2_2StudentConferencePaper,
            report_models.S2_3StudentSponsoredProject,
        ],
    },
    "student_placements_and_higher_studies": {
        "display_name": "Student Placements & Higher Studies",
        "models": [
            report_models.S4_1StudentExamQualification,
            report_models.S4_2CampusRecruitment,
            report_models.S4_3GovtPSUSelection,
            report_models.S4_4PlacementHigherStudies,
        ],
    },
    "student_achievements_and_activities": {
        "display_name": "Student Achievements & Activities",
        "models": [
            report_models.S3_1CompetitionParticipation,
            report_models.S3_2DeptProgram,
            report_models.S5_3SpecialMentionAchievement,
            report_models.S5_4StudentEntrepreneurship,
        ],
    },
    "student_training_and_courses": {
        "display_name": "Student Training & Courses",
        "models": [
            report_models.S5_1StudentCertificationCourse,
            report_models.S5_2VocationalTraining,
        ],
    },
    "student_academics": {
        "display_name": "Student Academics",
        "models": [
            report_models.S1_1TheorySubjectData,
        ],
    },
}

def get_all_report_models():
    """A helper function to get a flat list of all report models."""
    all_models = set()
    for category in ANALYTICS_CATEGORIES.values():
        all_models.update(category["models"])
    return list(all_models)

