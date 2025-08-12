# reports/models.py

from django.db import models
from django.contrib.auth.models import User

# ==============================================================================
# 1. CENTRALIZED CHOICES
# ==============================================================================
# Defining choices here allows reuse across multiple models, adhering to the DRY principle.

class AuthorTypeChoices(models.TextChoices):
    SOLE = 'Sole', 'Sole'
    FIRST = 'First', 'First'
    CORRESPONDING = 'Corresponding', 'Corresponding'
    OTHER = 'Other', 'Other'

class ScopeChoices(models.TextChoices):
    REGIONAL = 'Regional', 'Regional'
    NATIONAL = 'National', 'National'
    INTERNATIONAL = 'International', 'International'

class ModeChoices(models.TextChoices):
    ONLINE = 'Online', 'Online'
    OFFLINE = 'Offline', 'Offline'

class StatusChoices(models.TextChoices):
    ONGOING = 'Ongoing', 'Ongoing'
    COMPLETED = 'Completed', 'Completed'

class LevelChoices(models.TextChoices):
    UNIVERSITY = 'University', 'University'
    STATE = 'State', 'State'
    NATIONAL = 'National', 'National'
    INTERNATIONAL = 'International', 'International'

# ==============================================================================
# 2. CORE & BASE MODELS
# ==============================================================================

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True, null=False, blank=False)

    def __str__(self):
        return self.name

class BaseReportModel(models.Model):
    """
    An abstract base model providing common fields, validation, and performance
    indexes for all report models.
    """
    class Quarter(models.TextChoices):
        Q1 = 'Q1', 'Q1 (July – September)'
        Q2 = 'Q2', 'Q2 (October – December)'
        Q3 = 'Q3', 'Q3 (January – March)'
        Q4 = 'Q4', 'Q4 (April – June)'

    user = models.ForeignKey(User, on_delete=models.PROTECT, null=False, db_index=True)
    department = models.ForeignKey(Department, on_delete=models.PROTECT, null=False, db_index=True)
    quarter = models.CharField(max_length=2, choices=Quarter.choices, null=False, blank=False)
    year = models.PositiveIntegerField(null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def faculty_name(self):
        """
        Returns the full name of the user. This property replaces the need for a separate,
        redundant 'faculty_name' field in every child model.
        """
        return self.user.get_full_name()

    class Meta:
        abstract = True
        ordering = ['-year', '-quarter']

# ==============================================================================
# 3. TEACHER REPORT MODELS (T-SERIES)
# ==============================================================================

class T1_ResearchArticle(BaseReportModel):
    title = models.CharField(max_length=255)
    author_type = models.CharField(max_length=20, choices=AuthorTypeChoices.choices, default=AuthorTypeChoices.SOLE)
    internal_authors = models.TextField(blank=True)
    external_authors = models.TextField(blank=True)
    journal_name = models.CharField(max_length=255)
    volume = models.CharField(max_length=50, blank=True)
    issue = models.CharField(max_length=50, blank=True)
    page_no = models.CharField(max_length=50, blank=True)
    publication_month_year = models.CharField(max_length=20, blank=True)
    issn_number = models.CharField(max_length=20, blank=True)
    doi = models.URLField(blank=True)
    publisher = models.CharField(max_length=200, blank=True)
    indexing_wos = models.BooleanField(default=False)
    indexing_scopus = models.BooleanField(default=False)
    indexing_ugc = models.BooleanField(default=False)
    indexing_other = models.CharField(max_length=100, blank=True)
    impact_factor = models.CharField(max_length=50, blank=True)
    document_link = models.URLField(blank=True)
    google_drive_link = models.URLField(blank=True)

    def __str__(self):
        return self.title

class T1_2ResearchArticle(BaseReportModel):
    title = models.CharField(max_length=255)
    author_type = models.CharField(max_length=20, choices=AuthorTypeChoices.choices, default=AuthorTypeChoices.SOLE)
    internal_authors = models.TextField(blank=True)
    external_authors = models.TextField(blank=True)
    conference_details = models.TextField(blank=True, help_text="Organization/Institution name, Place, State")
    isbn_issn = models.CharField(max_length=50, blank=True)
    publisher = models.CharField(max_length=200, blank=True)
    page_no = models.CharField(max_length=50, blank=True)
    publication_month_year = models.CharField(max_length=20, blank=True)
    indexing_scopus = models.BooleanField(default=False)
    indexing_other = models.CharField(max_length=100, blank=True)
    conference_status = models.CharField(max_length=20, choices=ScopeChoices.choices, default=ScopeChoices.NATIONAL)
    conference_mode = models.CharField(max_length=10, choices=ModeChoices.choices, default=ModeChoices.OFFLINE)
    registration_fee_reimbursed = models.BooleanField(default=False, help_text="Was registration fee reimbursed by the college?")
    special_leave_dates = models.CharField(max_length=100, blank=True)
    certificate_link = models.URLField(blank=True, help_text="Google Drive link to certificate")

    def __str__(self):
        return self.title

class T2_1WorkshopAttendance(BaseReportModel):
    program_name = models.CharField(max_length=255, help_text="Name of the FDP/STTP/Workshop")
    organizer = models.CharField(max_length=255)
    place = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    num_days = models.PositiveIntegerField()
    mode = models.CharField(max_length=10, choices=ModeChoices.choices, default=ModeChoices.OFFLINE)
    registration_fee_reimbursed = models.BooleanField(default=False)
    special_leave_dates = models.CharField(max_length=100, blank=True)
    certificate_link = models.URLField(blank=True)

    def __str__(self):
        return self.program_name

class T2_2WorkshopOrganized(BaseReportModel):
    class Role(models.TextChoices):
        COORDINATOR = 'Coordinator', 'Coordinator'
        CO_COORDINATOR = 'Co-Coordinator', 'Co-Coordinator'

    role = models.CharField(max_length=50, choices=Role.choices, default=Role.COORDINATOR)
    activity_type = models.CharField(max_length=100, help_text="FDP/Workshop/STTP etc.")
    program_name = models.CharField(max_length=255)
    organized_by_dept = models.CharField(max_length=200, help_text="Department")
    place = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    num_days = models.PositiveIntegerField()
    mode = models.CharField(max_length=10, choices=ModeChoices.choices, default=ModeChoices.OFFLINE)
    num_participants = models.PositiveIntegerField()
    collaborator = models.CharField(max_length=255, blank=True)
    report_link = models.URLField(blank=True)

    def __str__(self):
        return self.program_name

class T3_1BookPublication(BaseReportModel):
    class PrintMode(models.TextChoices):
        HARDCOPY = 'Hardcopy', 'Hardcopy'
        EPRINT = 'E-print', 'E-print'
        BOTH = 'Both', 'Both'

    book_title = models.CharField(max_length=255, help_text="Title of the Book/Monograph")
    author_type = models.CharField(max_length=20, choices=[("Sole","Sole"),("Co-Author","Co-Author")], default="Sole")
    publisher_details = models.TextField(help_text="Publisher with complete address")
    isbn_number = models.CharField(max_length=50, help_text="ISSN/ISBN No.")
    indexing = models.CharField(max_length=100, blank=True, help_text="Scopus/Others")
    publication_year = models.PositiveIntegerField()
    print_mode = models.CharField(max_length=10, choices=PrintMode.choices, default=PrintMode.HARDCOPY)
    book_type = models.CharField(max_length=15, choices=ScopeChoices.choices, default=ScopeChoices.NATIONAL)
    proof_link = models.URLField(blank=True, help_text="Google Drive link to proof")

    def __str__(self):
        return self.book_title

class T3_2ChapterPublication(BaseReportModel):
    chapter_title = models.CharField(max_length=255, help_text="Title of the Chapter")
    author_type = models.CharField(max_length=20, choices=[("Sole","Sole"),("Co-Author","Co-Author")], default="Sole")
    publisher_details = models.TextField(help_text="Publisher with complete address")
    isbn_number = models.CharField(max_length=50, help_text="ISSN/ISBN No.")
    indexing = models.CharField(max_length=100, blank=True, help_text="Scopus/Others")
    publication_year = models.PositiveIntegerField()
    book_type = models.CharField(max_length=15, choices=ScopeChoices.choices, default=ScopeChoices.NATIONAL)
    proof_link = models.URLField(blank=True, help_text="Google Drive link to proof")

    def __str__(self):
        return self.chapter_title

class T4_1EditorialBoard(BaseReportModel):
    class Role(models.TextChoices):
        EDITOR = "Editor", "Editor"
        CO_EDITOR = "Co-editor", "Co-editor"
        MEMBER = "Member", "Member"
    class Indexing(models.TextChoices):
        WOS = "WoS", "WoS"
        SCOPUS = "Scopus", "Scopus"
        UGC_CARE = "UGC CARE", "UGC CARE"
        OTHERS = "Others", "Others"

    title = models.CharField(max_length=255, help_text="Title of the Book or Journal")
    role = models.CharField(max_length=20, choices=Role.choices)
    publisher = models.CharField(max_length=255, help_text="Publisher with complete address")
    issn_isbn = models.CharField("ISSN/ISBN No.", max_length=50)
    indexing = models.CharField(max_length=20, choices=Indexing.choices)
    type = models.CharField("Type of Book/Journal", max_length=20, choices=ScopeChoices.choices)
    proof_link = models.URLField("Google Drive Link (Upload Proof)", blank=True)

    def __str__(self):
        return f"{self.user.get_full_name()} – {self.title}"

class T4_2ReviewerDetails(BaseReportModel):
    class PubType(models.TextChoices):
        JOURNAL = "Journal", "Journal"
        CONFERENCE = "Conference", "Conference"
        BOOK = "Book", "Book"
        OTHER = "Other", "Other"
    class Indexing(models.TextChoices):
        SCI = "SCI", "SCI"
        SCOPUS = "Scopus", "Scopus"
        UGC_CARE = "UGC CARE", "UGC CARE"
        OTHERS = "Others", "Others"

    publication_type = models.CharField("Journal/Conference/Book etc.", max_length=20, choices=PubType.choices)
    title = models.CharField(max_length=255, help_text="Title of the Journal/Conference/Book")
    indexing = models.CharField(max_length=20, choices=Indexing.choices)
    issn_isbn = models.CharField("ISSN/ISBN No.", max_length=50)
    publisher = models.CharField(max_length=255)
    type = models.CharField("Type (National/International)", max_length=20, choices=ScopeChoices.choices)
    proof_link = models.URLField("Google Drive Link (Upload Proof)", blank=True)

    def __str__(self):
        return f"{self.user.get_full_name()} – {self.title}"

class T4_3CommitteeMembership(BaseReportModel):
    class Responsibility(models.TextChoices):
        CHAIRPERSON = "Chairperson", "Chairperson"
        MEMBER = "Member", "Member"

    body_details = models.CharField(max_length=255, help_text="Details of the body/committee")
    responsibility = models.CharField(max_length=20, choices=Responsibility.choices)
    level = models.CharField(max_length=20, choices=LevelChoices.choices)
    other_details = models.TextField(blank=True, help_text="Any other details")
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    def __str__(self):
        return f"{self.user.get_full_name()} – {self.body_details}"

class T5_1PatentDetails(BaseReportModel):
    class IprType(models.TextChoices):
        UTILITY = "Utility", "Utility"
        PROCESS = "Process", "Process"
        DESIGN = "Design", "Design"
        COPYRIGHT = "Copyright", "Copyright"
        TRADEMARK = "Trademark", "Trademark"
        OTHER = "Other", "Other"
    class Status(models.TextChoices):
        FILED = "Filed", "Filed"
        PUBLISHED = "Published", "Published"
        GRANTED = "Granted", "Granted"

    title = models.CharField(max_length=255)
    internal_co_inventors = models.TextField(blank=True, help_text="Internal Co-Inventors")
    external_co_inventors = models.TextField(blank=True, help_text="External Co-Inventors")
    ipr_type = models.CharField("Type of IPR", max_length=20, choices=IprType.choices)
    application_number = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices)
    filled_date = models.DateField(null=True, blank=True)
    published_granted_date = models.DateField(null=True, blank=True)
    publication_number = models.CharField(max_length=100, blank=True, help_text="Publication/Granted Number")
    technology_transfer = models.BooleanField(default=False, help_text="Technology Transfer Applicable")
    country = models.CharField(max_length=100, blank=True, help_text="Country of Patent")
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    def __str__(self):
        return f"{self.user.get_full_name()} – {self.title}"

class T5_2SponsoredProject(BaseReportModel):
    class Duration(models.TextChoices):
        SHORT = "Short-Term", "Short-Term"
        MEDIUM = "Medium-Term", "Medium-Term"
        LONG = "Long-Term", "Long-Term"
        OTHER = "Other", "Other"

    principal_investigator = models.CharField(max_length=200, help_text="Name of PI")
    co_principal_investigator = models.CharField(max_length=200, blank=True, help_text="Name of Co-PI")
    members = models.TextField(blank=True, help_text="Other members (if any)")
    funding_agency = models.CharField(max_length=255)
    project_title = models.CharField(max_length=255)
    sanctioned_order_no = models.CharField(max_length=100, blank=True)
    sanctioned_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=StatusChoices.choices)
    completion_date = models.DateField(null=True, blank=True, help_text="If completed")
    sanctioned_amount_lakhs = models.DecimalField(max_digits=12, decimal_places=2, help_text="In Lakhs")
    amount_received_rupees = models.DecimalField(max_digits=15, decimal_places=2, help_text="In Rupees")
    duration = models.CharField(max_length=50, choices=Duration.choices)
    regionality = models.CharField(max_length=20, choices=ScopeChoices.choices)
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    def __str__(self):
        return self.project_title

class T5_3ConsultancyProject(BaseReportModel):
    class Duration(models.TextChoices):
        SHORT = "Short-Term", "Short-Term"
        MEDIUM = "Medium-Term", "Medium-Term"
        LONG = "Long-Term", "Long-Term"
        OTHER = "Other", "Other"

    internal_faculty = models.TextField(blank=True, help_text="Internal Faculty Details")
    external_faculty = models.TextField(blank=True, help_text="External Faculty Details")
    client_name = models.CharField(max_length=255, help_text="Name of Client")
    title = models.CharField(max_length=255, help_text="Title of Consultancy")
    sanctioned_order_no = models.CharField(max_length=100, blank=True)
    sanctioned_date = models.DateField(null=True, blank=True)
    sanctioned_amount_lakhs = models.DecimalField(max_digits=12, decimal_places=2, help_text="In Lakhs")
    amount_received_rupees = models.DecimalField(max_digits=15, decimal_places=2, help_text="In Rupees")
    status = models.CharField(max_length=20, choices=StatusChoices.choices)
    duration = models.CharField(max_length=50, choices=Duration.choices)
    regionality = models.CharField(max_length=20, choices=ScopeChoices.choices)
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    def __str__(self):
        return self.title

class T5_4CourseDevelopment(BaseReportModel):
    course_module_name = models.CharField(max_length=255, help_text="Name of the Course/e-content/Laboratory Module Developed")
    platform = models.CharField(max_length=255, help_text="Platform (Moodle, Gsuite, Media Centre, etc.)")
    contributory_institute = models.CharField(max_length=255, blank=True, help_text="Any other Contributory Institute/Industry")
    usage_citation = models.TextField(blank=True, help_text="Usage and Citation etc.")
    amount_spent = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text="Amount Spent (if any)")
    launch_date = models.DateField(null=True, blank=True, help_text="Date of Launching Content")
    link = models.URLField(blank=True, help_text="Google Drive Link or Share Online Content Link")

    def __str__(self):
        return self.course_module_name

class T5_5LabEquipmentDevelopment(BaseReportModel):
    lab_name = models.CharField(max_length=255, help_text="Name of the Laboratory")
    major_equipment = models.CharField(max_length=255, help_text="Major Equipment")
    purpose = models.TextField(help_text="Purpose of the Development of the Laboratory")
    equipment_cost = models.DecimalField(max_digits=14, decimal_places=2, help_text="Approx. Cost of Equipment in Developing the Laboratory")
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    def __str__(self):
        return self.lab_name

class T5_6ResearchGuidance(BaseReportModel):
    class Role(models.TextChoices):
        SUPERVISOR = "Supervisor", "Supervisor"
        CO_SUPERVISOR = "Co-Supervisor", "Co-Supervisor"

    role = models.CharField(max_length=20, choices=Role.choices)
    candidate_name = models.CharField(max_length=200, help_text="Name of Candidate")
    enrollment_number = models.CharField(max_length=100, help_text="Enrollment No.")
    thesis_title = models.CharField(max_length=255, help_text="Title of Thesis")
    registration_date = models.DateField(help_text="Date of Registration")
    viva_voce_date = models.DateField(help_text="Date of PhD Viva-Voce")
    external_examiner_details = models.TextField(help_text="Complete Details of External Examiner")
    status = models.CharField(max_length=20, choices=StatusChoices.choices)
    research_center = models.CharField(max_length=255, help_text="Name of the Research Center")
    conferring_university = models.CharField(max_length=255, help_text="Name of the PhD Conferring University")
    proof_link = models.URLField(blank=True, help_text=("Drive Link: For Ongoing → RDC Letter; for Completed → Notification Letter"))

    def __str__(self):
        return f"{self.candidate_name} - {self.thesis_title}"

class T6_1CertificationCourse(BaseReportModel):
    class CertType(models.TextChoices):
        ELITE_GOLD = "Elite-Gold", "Elite-Gold"
        ELITE_SILVER = "Elite-Silver", "Elite-Silver"
        PASSED = "Passed", "Passed"
        OTHER = "Other", "Other"

    certification_course = models.CharField(max_length=255, help_text="Name of the Certification Course")
    course_name = models.CharField(max_length=255)
    category = models.CharField(max_length=255, help_text="Category of the Course (e.g. CSE, ECE, etc.)")
    duration = models.CharField(max_length=100, help_text="Duration of the Course")
    credit_points = models.CharField(max_length=50, help_text="Credit Points Earned")
    certification_type = models.CharField(max_length=20, choices=CertType.choices, help_text="Elite-Gold / Elite-Silver / Passed / Other")
    certificate_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Certificate)")

    def __str__(self):
        return self.certification_course

class T6_2ProfessionalBodyMembership(BaseReportModel):
    institution_name = models.CharField(max_length=255, help_text="Name of Institution/Society")
    membership_grade = models.CharField(max_length=100, help_text="Grade of Membership")
    membership_number = models.CharField(max_length=100, help_text="Membership Number")
    year_of_election = models.PositiveIntegerField()
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    def __str__(self):
        return self.institution_name

class T6_3Award(BaseReportModel):
    award_name = models.CharField(max_length=255, help_text="Name of Award")
    conferred_by = models.CharField(max_length=255, help_text="Award Conferred by")
    award_date = models.DateField(help_text="Award Date")
    award_type = models.CharField(max_length=20, choices=ScopeChoices.choices)
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    def __str__(self):
        return self.award_name

class T6_4ResourcePerson(BaseReportModel):
    invited_by = models.CharField(max_length=255, help_text="Invited By")
    lecture_title = models.CharField(max_length=255, help_text="Title/Subject of Lecture Delivered")
    date = models.DateField(help_text="Date of Lecture")
    duration_hours = models.DecimalField(max_digits=5, decimal_places=2, help_text="Duration in hours")
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    def __str__(self):
        return self.lecture_title

class T6_5AICTEInitiative(BaseReportModel):
    initiative_name = models.CharField(max_length=500, help_text=("Name of the AICTE Initiative Taken (e.g. Clean & Smart Campus, Smart India Hackathon, etc.)"))
    date = models.DateField(help_text="Date of Initiative (DD/MMM/YYYY)")
    role = models.CharField(max_length=100)
    organizing_institute = models.CharField(max_length=255, help_text="Name of the Organizing Institute")
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    def __str__(self):
        return self.initiative_name

class T7_1ProgramOrganized(BaseReportModel):
    organizer_name = models.CharField(max_length=255, help_text="Name of the Organizer (Club/Professional Body)")
    event_name = models.CharField(max_length=255, help_text="Name of the Event/Competition")
    event_type = models.CharField(max_length=255, help_text="Type of Event/Competition")
    start_date = models.DateField(help_text="Program Start Date (DD/MMM/YYYY)")
    end_date = models.DateField(help_text="Program End Date (DD/MMM/YYYY)")
    num_days = models.PositiveIntegerField(help_text="Number of Days")
    mode = models.CharField(max_length=10, choices=ModeChoices.choices)
    participants_count = models.PositiveIntegerField(help_text="Number of Participants Attended")
    collaborator_details = models.TextField(blank=True, help_text="Collaborator (if any) with contact details")
    report_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Report)")

    def __str__(self):
        return self.event_name

# ==============================================================================
# 4. STUDENT REPORT MODELS (S-SERIES)
# ==============================================================================
# Note: Some S-series models may not need quarter/year and can inherit directly from a simpler base model if needed.
# For now, inheriting from BaseReportModel is consistent.

class S1_1TheorySubjectData(BaseReportModel):
    semester = models.CharField(max_length=10, help_text="Semester (e.g. S1, S2…)")
    name_of_subject = models.CharField(max_length=255)
    subject_code = models.CharField(max_length=50)
    faculty_name = models.CharField(max_length=200, help_text="Faculty who conducted the classes")
    num_classes = models.PositiveIntegerField(help_text="No. of Classes Conducted")
    num_students_appeared = models.PositiveIntegerField(help_text="No. of Students Appeared")
    num_students_passed = models.PositiveIntegerField(help_text="No. of Students Passed")
    pass_percent = models.DecimalField(max_digits=5, decimal_places=2, help_text="% Pass in the Subject")
    pass_percent_rv = models.DecimalField(max_digits=5, decimal_places=2, help_text="% Pass after RV/RRV")
    prev_year_pass_percent = models.DecimalField(max_digits=5, decimal_places=2, help_text="Previous Year % Result")

    def __str__(self):
        return f"{self.subject_code} – {self.name_of_subject}"

class S2_1StudentArticle(BaseReportModel):
    title = models.CharField(max_length=255)
    author_type = models.CharField(max_length=20, choices=AuthorTypeChoices.choices)
    internal_authors = models.TextField(help_text="Internal Authors")
    external_authors = models.TextField(help_text="External Authors")
    journal_name = models.CharField(max_length=255)
    volume = models.CharField(max_length=50, blank=True)
    issue = models.CharField(max_length=50, blank=True)
    page_numbers = models.CharField(max_length=100, blank=True)
    month_year = models.CharField(max_length=50, help_text="Month & Year of Publication")
    issn_number = models.CharField("ISSN Number", max_length=50, blank=True)
    impact_factor = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Impact Factor")
    publisher = models.CharField(max_length=255, blank=True)
    is_wos = models.BooleanField(default=False, help_text="Web of Science")
    is_scopus = models.BooleanField(default=False)
    is_ugc_care = models.BooleanField(default=False, help_text="UGC CARE")
    other_indexing = models.CharField(max_length=255, blank=True, help_text="Other (Referred Journal)")
    doi = models.CharField(max_length=255, blank=True)
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Proof)")

    def __str__(self):
        return self.title

class S2_2StudentConferencePaper(BaseReportModel):
    title = models.CharField(max_length=255)
    author_type = models.CharField(max_length=20, choices=AuthorTypeChoices.choices)
    internal_authors = models.TextField(help_text="Internal Authors")
    external_authors = models.TextField(help_text="External Authors")
    conference_details = models.CharField(max_length=255, help_text="Organization/Institution name, Place, State")
    isbn_issn = models.CharField("ISBN/ISSN", max_length=50, blank=True)
    publisher = models.CharField(max_length=255, blank=True)
    page_numbers = models.CharField(max_length=100, blank=True, help_text="Page No")
    month_year = models.CharField(max_length=50, help_text="Month & Year")
    is_scopus = models.BooleanField(default=False, help_text="Scopus Indexed")
    other_indexing = models.CharField(max_length=255, blank=True, help_text="Other Indexing (Referred Journal)")
    conference_status = models.CharField(max_length=20, choices=ScopeChoices.choices)
    mode = models.CharField(max_length=10, choices=ModeChoices.choices)
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Proof)")

    def __str__(self):
        return self.title

class S2_3StudentSponsoredProject(BaseReportModel):
    student_name = models.CharField(max_length=200, help_text="Name of the Student")
    semester = models.CharField(max_length=10, help_text="Semester (e.g. S1, S2…)")
    project_title = models.CharField(max_length=255, help_text="Title of the Project")
    sponsored_by = models.CharField(max_length=255, help_text="Sponsored By")
    guide_name = models.CharField(max_length=200, help_text="Name of the Guide")
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    def __str__(self):
        return self.project_title

class S3_1CompetitionParticipation(BaseReportModel):
    student_name = models.CharField(max_length=200, help_text="Name of the Student")
    semester = models.CharField(max_length=10, help_text="Semester (e.g. S1, S2…)")
    activity_type = models.CharField(max_length=255, help_text="Type of Activity (Sports/Cultural etc.)")
    organized_by = models.CharField(max_length=255, help_text="Organized By")
    date = models.DateField(help_text="Date of Participation")
    level = models.CharField(max_length=20, choices=ScopeChoices.choices)
    awards = models.CharField(max_length=255, blank=True, help_text="Awards (if any)")
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    def __str__(self):
        return f"{self.student_name} – {self.activity_type}"

class S3_2DeptProgram(BaseReportModel):
    program_name = models.CharField(max_length=255, help_text="Name of the Programme/Competition")
    participants_count = models.PositiveIntegerField(help_text="Number of Participants")
    program_type = models.CharField(max_length=255, help_text="Type of Programme/Competition")
    external_agency = models.CharField(max_length=255, blank=True, help_text="In collaboration with external agency (if any)")
    date = models.DateField(help_text="Date of Programme")
    level = models.CharField(max_length=20, choices=ScopeChoices.choices)
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    def __str__(self):
        return self.program_name

class S4_1StudentExamQualification(BaseReportModel):
    student_name = models.CharField(max_length=200, help_text="Name of the Student")
    batch = models.CharField(max_length=50, help_text="Batch (e.g. 2024)")
    exam_name = models.CharField(max_length=255, help_text="Competitive Exam Qualified (GATE/CAT/GRE/GMAT etc.)")
    registration_number = models.CharField(max_length=100, help_text="Registration/Roll Number")
    score_detail = models.CharField(max_length=100, help_text="AIR/Percentile/Score")
    pg_programme = models.CharField(max_length=100, help_text="PG Programme Admitted (M.Tech/MS/MBA etc.)")
    admission_year = models.PositiveIntegerField(help_text="Year of Admission in Higher Studies")
    institution_name = models.CharField(max_length=255, help_text="Institution Joined")
    contact_details = models.CharField(max_length=255, help_text="Contact Details")
    email = models.EmailField(help_text="E-mail ID")
    mobile = models.CharField(max_length=15, help_text="Mobile No.")
    social_profile_link = models.URLField(blank=True, help_text="Profile in Social Sites (LinkedIn, Twitter etc.)")
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Proof)")

    def __str__(self):
        return f"{self.student_name} – {self.exam_name}"

class S4_2CampusRecruitment(BaseReportModel):
    student_name = models.CharField(max_length=200, help_text="Name of the Student")
    batch = models.CharField(max_length=50, help_text="Batch (e.g. 2024)")
    company_name = models.CharField(max_length=255, help_text="Name of the Company Joined")
    package_offered = models.DecimalField(max_digits=10, decimal_places=2, help_text="Package Offered")
    offer_ref_number = models.CharField(max_length=100, help_text="Offer Letter Reference Number")
    contact_details = models.CharField(max_length=255, help_text="Contact Details of Student")
    email = models.EmailField(help_text="E-mail ID")
    mobile = models.CharField(max_length=15, help_text="Mobile No.")
    social_profile_link = models.URLField(blank=True, help_text="Profile in Social Sites (Facebook/LinkedIn/Twitter)")
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    def __str__(self):
        return f"{self.student_name} – {self.company_name}"

class S4_3GovtPSUSelection(BaseReportModel):
    student_name = models.CharField(max_length=200, help_text="Name of the Student")
    batch = models.CharField(max_length=50, help_text="Batch (e.g. 2024)")
    exam_name = models.CharField(max_length=255, help_text="Competitive Exam Qualified (UPSC/CGPSC/SSC etc.)")
    registration_number = models.CharField(max_length=100, help_text="Registration/Roll Number")
    psv_name = models.CharField(max_length=255, help_text="Name of the PSU")
    package_offered = models.DecimalField(max_digits=10, decimal_places=2, help_text="Package Offered")
    joining_year = models.PositiveIntegerField(help_text="Year of Joining")
    offer_ref_number = models.CharField(max_length=100, help_text="Reference Number of Joining Letter")
    contact_details = models.CharField(max_length=255, help_text="Contact Details")
    email = models.EmailField(help_text="E-mail ID")
    mobile = models.CharField(max_length=15, help_text="Mobile No.")
    social_profile_link = models.URLField(blank=True, help_text="Profile in Social Sites (Facebook/LinkedIn/Twitter)")
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    def __str__(self):
        return f"{self.student_name} – {self.psv_name}"

class S4_4PlacementHigherStudies(BaseReportModel):
    class PlacementType(models.TextChoices):
        SOFTWARE = "Software", "Software"
        CORE = "Core", "Core"
        PSU = "PSU", "PSU"
        OTHER = "Other", "Other"

    student_roll_no = models.CharField(max_length=50, help_text="Roll No.")
    student_name = models.CharField(max_length=200, help_text="Name of the Student")
    photo_link = models.URLField(blank=True, help_text="Photo URL")
    placement_type = models.CharField(max_length=20, choices=PlacementType.choices, help_text="Software/Core/PSU/Other")
    organization_name = models.CharField(max_length=255, blank=True, help_text="Name of Organization (placement)")
    package_offered = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Package Offered")
    program_name = models.CharField(max_length=255, blank=True, help_text="Name of the Programme (higher studies)")
    institution_joined = models.CharField(max_length=255, blank=True, help_text="Name of the Institution Joined")
    admission_year = models.PositiveIntegerField(null=True, blank=True, help_text="Year of Admission")
    entrepreneurship = models.CharField("Entrepreneurship (Company)", max_length=255, blank=True, help_text="Name of Company (if student became entrepreneur)")
    email = models.EmailField(help_text="E-mail ID")
    contact_details = models.CharField(max_length=255, help_text="Contact Details")
    mobile = models.CharField(max_length=15, help_text="Mobile No.")
    social_profile_link = models.URLField(blank=True, help_text="Profile in Social Sites (LinkedIn, Twitter etc.)")
    offer_ref_number = models.CharField(max_length=100, blank=True, help_text="Reference Number of Joining Letter")
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    def __str__(self):
        return f"{self.student_roll_no} – {self.student_name}"

class S5_1StudentCertificationCourse(BaseReportModel):
    class CertType(models.TextChoices):
        ELITE_GOLD = "Elite-Gold", "Elite-Gold"
        ELITE_SILVER = "Elite-Silver", "Elite-Silver"
        PASSED = "Passed", "Passed"
        OTHER = "Other", "Other"

    student_name = models.CharField(max_length=200, help_text="Name of the Student")
    certification_course = models.CharField(max_length=255, help_text="Name of the Certification Course")
    category = models.CharField(max_length=255, help_text="Category of the Course (e.g. CSE, ECE, etc.)")
    duration = models.CharField(max_length=100, help_text="Duration of the Course")
    credit_points = models.CharField(max_length=50, help_text="Credit Points Earned")
    certification_type = models.CharField(max_length=20, choices=CertType.choices, help_text="Elite-Gold / Elite-Silver / Passed / Other")
    certificate_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Certificate)")

    def __str__(self):
        return f"{self.student_name} – {self.certification_course}"

class S5_2VocationalTraining(BaseReportModel):
    student_name = models.CharField(max_length=200, help_text="Name of the Student")
    company_name = models.CharField(max_length=255, help_text="Name of the Company")
    duration = models.CharField(max_length=100, help_text="Duration of the Course Attended")
    certificate_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Certificate)")

    def __str__(self):
        return f"{self.student_name} – {self.company_name}"

class S5_3SpecialMentionAchievement(BaseReportModel):
    student_name = models.CharField(max_length=200, help_text="Name of the Student/Alumni")
    award_name = models.CharField(max_length=255, help_text="Name of the Award")
    work_title = models.CharField(max_length=255, help_text="Name of the Work for which Award is received")
    date_received = models.DateField(help_text="Date of Award Received")
    awarding_organization = models.CharField(max_length=255, help_text="Name of Awarding Organization")
    award_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text="Award Amount (INR), if any")
    award_level = models.CharField(max_length=20, choices=LevelChoices.choices, help_text="Level of Award")
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    def __str__(self):
        return f"{self.student_name} – {self.award_name}"

class S5_4StudentEntrepreneurship(BaseReportModel):
    student_name = models.CharField(max_length=200, help_text="Name of the Student")
    establishment_year = models.PositiveIntegerField(help_text="Year of Establishment")
    organization_details = models.TextField(help_text="Name, Address & Website of Organization")
    sector = models.CharField(max_length=255, help_text="Sector")
    proof_link = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    def __str__(self):
        return f"{self.student_name} – {self.establishment_year}"
