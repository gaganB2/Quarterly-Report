# src/backend/t1_research/models.py

from django.db import models
from django.contrib.auth.models import User

class Department(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class T1_ResearchArticle(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)

    # === Section: Research Article Info ===
    faculty_name = models.CharField(
    max_length=200,
    blank=True,
    default=""
)

    title = models.CharField(max_length=255)
    author_type = models.CharField(
        max_length=20,
        choices=[
            ("Sole", "Sole"),
            ("First", "First"),
            ("Corresponding", "Corresponding"),
            ("Other", "Other"),
        ],
        default="Sole",
    )
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

    # === Section: Indexing ===
    indexing_wos = models.BooleanField(default=False)
    indexing_scopus = models.BooleanField(default=False)
    indexing_ugc = models.BooleanField(default=False)
    indexing_other = models.CharField(max_length=100, blank=True)

    # === Section: Metrics ===
    impact_factor = models.CharField(max_length=50, blank=True)

    # === Section: Supporting Documents ===
    document_link = models.URLField(blank=True)
    google_drive_link = models.URLField(blank=True)

    # === Section: Quarter and Year ===
    quarter = models.CharField(max_length=10)
    year = models.PositiveIntegerField()

    # === Audit Trail ===
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.quarter} {self.year})"

class T1_2ResearchArticle(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)

    # — Core fields —
    faculty_name           = models.CharField(max_length=200, blank=True, default="")
    title                  = models.CharField(max_length=255)
    author_type            = models.CharField(
                                max_length=20,
                                choices=[
                                    ("Sole", "Sole"),
                                    ("First", "First"),
                                    ("Corresponding", "Corresponding"),
                                    ("Other", "Other"),
                                ],
                                default="Sole",
                            )
    internal_authors       = models.TextField(blank=True)
    external_authors       = models.TextField(blank=True)

    # — Conference / Publication details —
    conference_details     = models.TextField(
                                blank=True,
                                help_text="Organization/Institution name, Place, State"
                            )
    isbn_issn              = models.CharField(max_length=50, blank=True)
    publisher              = models.CharField(max_length=200, blank=True)
    page_no                = models.CharField(max_length=50, blank=True)
    publication_month_year = models.CharField(max_length=20, blank=True)

    # — Indexing —
    indexing_scopus        = models.BooleanField(default=False)
    indexing_other         = models.CharField(max_length=100, blank=True)

    # — Conference metadata —
    conference_status      = models.CharField(
                                max_length=20,
                                choices=[("National", "National"), ("International", "International")],
                                default="National",
                            )
    conference_mode        = models.CharField(
                                max_length=10,
                                choices=[("Online", "Online"), ("Offline", "Offline")],
                                default="Offline",
                            )
    registration_fee_reimbursed = models.BooleanField(
                                default=False,
                                help_text="Was registration fee reimbursed by the college?"
                            )
    special_leave_dates    = models.CharField(max_length=100, blank=True)
    certificate_link       = models.URLField(blank=True, help_text="Google Drive link to certificate")

    # — Quarter & Year —
    quarter = models.CharField(max_length=10)
    year    = models.PositiveIntegerField()

    # — Audit trail —
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.quarter} {self.year})"



class T2_1WorkshopAttendance(models.Model):
    user                         = models.ForeignKey(User, on_delete=models.CASCADE)
    department                   = models.ForeignKey(Department, on_delete=models.CASCADE)

    faculty_name                 = models.CharField(max_length=200)
    program_name                 = models.CharField(max_length=255, help_text="Name of the FDP/STTP/Workshop")
    organizer                    = models.CharField(max_length=255)
    place                        = models.CharField(max_length=200)
    start_date                   = models.DateField()
    end_date                     = models.DateField()
    num_days                     = models.PositiveIntegerField()
    mode                         = models.CharField(
                                      max_length=10,
                                      choices=[("Online","Online"),("Offline","Offline")],
                                      default="Offline"
                                  )
    registration_fee_reimbursed  = models.BooleanField(default=False)
    special_leave_dates          = models.CharField(max_length=100, blank=True)
    certificate_link             = models.URLField(blank=True)

    quarter                      = models.CharField(max_length=10)
    year                         = models.PositiveIntegerField()

    created_at                   = models.DateTimeField(auto_now_add=True)
    updated_at                   = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.program_name} ({self.quarter} {self.year})"

class T2_2WorkshopOrganized(models.Model):
    user                   = models.ForeignKey(User, on_delete=models.CASCADE)
    department             = models.ForeignKey(Department, on_delete=models.CASCADE)

    faculty_name           = models.CharField(max_length=200)
    role                   = models.CharField(
                                max_length=50,
                                choices=[("Coordinator","Coordinator"),("Co-Coordinator","Co-Coordinator")],
                                default="Coordinator"
                            )
    activity_type          = models.CharField(max_length=100, help_text="FDP/Workshop/STTP etc.")
    program_name           = models.CharField(max_length=255)
    organized_by_dept      = models.CharField(max_length=200, help_text="Department")
    place                  = models.CharField(max_length=200)
    start_date             = models.DateField()
    end_date               = models.DateField()
    num_days               = models.PositiveIntegerField()
    mode                   = models.CharField(
                                max_length=10,
                                choices=[("Online","Online"),("Offline","Offline")],
                                default="Offline"
                            )
    num_participants       = models.PositiveIntegerField()
    collaborator           = models.CharField(max_length=255, blank=True)
    report_link            = models.URLField(blank=True)

    quarter                = models.CharField(max_length=10)
    year                   = models.PositiveIntegerField()

    created_at             = models.DateTimeField(auto_now_add=True)
    updated_at             = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.program_name} ({self.quarter} {self.year})"
    
class T3_1BookPublication(models.Model):
    user                   = models.ForeignKey(User, on_delete=models.CASCADE)
    department             = models.ForeignKey(Department, on_delete=models.CASCADE)

    faculty_name           = models.CharField(max_length=200)
    book_title             = models.CharField(max_length=255, help_text="Title of the Book/Monograph")
    author_type            = models.CharField(
                                max_length=20,
                                choices=[("Sole","Sole"),("Co-Author","Co-Author")],
                                default="Sole"
                            )
    publisher_details      = models.TextField(help_text="Publisher with complete address")
    isbn_number            = models.CharField(max_length=50, help_text="ISSN/ISBN No.")
    indexing                = models.CharField(max_length=100, blank=True, help_text="Scopus/Others")
    publication_year       = models.PositiveIntegerField()
    print_mode             = models.CharField(
                                max_length=10,
                                choices=[("Hardcopy","Hardcopy"),("E-print","E-print"),("Both","Both")],
                                default="Hardcopy"
                            )
    book_type              = models.CharField(
                                max_length=15,
                                choices=[("National","National"),("International","International")],
                                default="National"
                            )
    proof_link             = models.URLField(blank=True, help_text="Google Drive link to proof")

    quarter                = models.CharField(max_length=10)
    year                   = models.PositiveIntegerField()

    created_at             = models.DateTimeField(auto_now_add=True)
    updated_at             = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.book_title} by {self.faculty_name} ({self.quarter} {self.year})'

class T3_2ChapterPublication(models.Model):
    user             = models.ForeignKey(User, on_delete=models.CASCADE)
    department       = models.ForeignKey(Department, on_delete=models.CASCADE)

    faculty_name     = models.CharField(max_length=200)
    chapter_title    = models.CharField(max_length=255, help_text="Title of the Chapter")
    author_type      = models.CharField(
                         max_length=20,
                         choices=[("Sole","Sole"),("Co-Author","Co-Author")],
                         default="Sole"
                       )
    publisher_details= models.TextField(help_text="Publisher with complete address")
    isbn_number      = models.CharField(max_length=50, help_text="ISSN/ISBN No.")
    indexing         = models.CharField(max_length=100, blank=True, help_text="Scopus/Others")
    publication_year = models.PositiveIntegerField()
    book_type        = models.CharField(
                         max_length=15,
                         choices=[("National","National"),("International","International")],
                         default="National"
                       )
    proof_link       = models.URLField(blank=True, help_text="Google Drive link to proof")

    quarter          = models.CharField(max_length=10)
    year             = models.PositiveIntegerField()

    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.chapter_title} by {self.faculty_name} ({self.quarter} {self.year})'

# ── Add this at the bottom of backend/t1_research/models.py ──

class T4_1EditorialBoard(models.Model):
    ROLE_CHOICES = [
        ("Editor", "Editor"),
        ("Co-editor", "Co-editor"),
        ("Member", "Member"),
    ]
    INDEXING_CHOICES = [
        ("WoS", "WoS"),
        ("Scopus", "Scopus"),
        ("UGC CARE", "UGC CARE"),
        ("Others", "Others"),
    ]
    TYPE_CHOICES = [
        ("National", "National"),
        ("International", "International"),
    ]

    user            = models.ForeignKey(User, on_delete=models.CASCADE)
    department      = models.ForeignKey(Department, on_delete=models.CASCADE)

    faculty_name    = models.CharField(max_length=200)
    title           = models.CharField(max_length=255, help_text="Title of the Book or Journal")
    role            = models.CharField(max_length=20, choices=ROLE_CHOICES)
    publisher       = models.CharField(max_length=255, help_text="Publisher with complete address")
    issn_isbn       = models.CharField("ISSN/ISBN No.", max_length=50)
    indexing        = models.CharField(max_length=20, choices=INDEXING_CHOICES)
    quarter         = models.CharField(max_length=10, default='Q1')
    year            = models.PositiveIntegerField("Year (w.e.f.)")
    type            = models.CharField("Type of Book/Journal", max_length=20, choices=TYPE_CHOICES)
    proof_link      = models.URLField("Google Drive Link (Upload Proof)", blank=True)

    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.faculty_name} – {self.title} ({self.year})"

class T4_2ReviewerDetails(models.Model):
    PUB_TYPE_CHOICES = [
        ("Journal",    "Journal"),
        ("Conference", "Conference"),
        ("Book",       "Book"),
        ("Other",      "Other"),
    ]
    INDEXING_CHOICES = [
        ("SCI",       "SCI"),
        ("Scopus",    "Scopus"),
        ("UGC CARE",  "UGC CARE"),
        ("Others",    "Others"),
    ]

    user              = models.ForeignKey(User, on_delete=models.CASCADE)
    department        = models.ForeignKey(Department, on_delete=models.CASCADE)

    faculty_name      = models.CharField(max_length=200)
    publication_type  = models.CharField(
                            "Journal/Conference/Book etc.",
                            max_length=20,
                            choices=PUB_TYPE_CHOICES
                        )
    title             = models.CharField(max_length=255, help_text="Title of the Journal/Conference/Book")
    indexing          = models.CharField(max_length=20, choices=INDEXING_CHOICES)
    issn_isbn         = models.CharField("ISSN/ISBN No.", max_length=50)
    publisher         = models.CharField(max_length=255)
    quarter = models.CharField(max_length=10, default='Q1')
    year              = models.PositiveIntegerField()
    type              = models.CharField(
                            "Type (National/International)",
                            max_length=20,
                            choices=[("National","National"),("International","International")]
                        )
    proof_link        = models.URLField("Google Drive Link (Upload Proof)", blank=True)

    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.faculty_name} – {self.title} ({self.year})"

class T4_3CommitteeMembership(models.Model):
    RESPONSIBILITY_CHOICES = [
        ("Chairperson",  "Chairperson"),
        ("Member",       "Member"),
    ]
    LEVEL_CHOICES = [
        ("University",   "University"),
        ("State",        "State"),
        ("National",     "National"),
        ("International","International"),
    ]

    user              = models.ForeignKey(User, on_delete=models.CASCADE)
    department        = models.ForeignKey(Department, on_delete=models.CASCADE)

    faculty_name      = models.CharField(max_length=200)
    body_details      = models.CharField(max_length=255, help_text="Details of the body/committee")
    responsibility    = models.CharField(max_length=20, choices=RESPONSIBILITY_CHOICES)
    level             = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    other_details     = models.TextField(blank=True, help_text="Any other details")
    proof_link        = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    quarter           = models.CharField(max_length=10)
    year              = models.PositiveIntegerField()

    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.faculty_name} – {self.body_details} ({self.quarter} {self.year})"

class T5_1PatentDetails(models.Model):
    IPR_TYPE_CHOICES = [
        ("Utility",   "Utility"),
        ("Process",   "Process"),
        ("Design",    "Design"),
        ("Copyright", "Copyright"),
        ("Trademark", "Trademark"),
        ("Other",     "Other"),
    ]
    STATUS_CHOICES = [
        ("Filed",     "Filed"),
        ("Published", "Published"),
        ("Granted",   "Granted"),
    ]

    user                     = models.ForeignKey(User, on_delete=models.CASCADE)
    department               = models.ForeignKey(Department, on_delete=models.CASCADE)

    faculty_name             = models.CharField(max_length=200)
    title                    = models.CharField(max_length=255)
    internal_co_inventors    = models.TextField(blank=True, help_text="Internal Co-Inventors")
    external_co_inventors    = models.TextField(blank=True, help_text="External Co-Inventors")
    ipr_type                 = models.CharField("Type of IPR", max_length=20, choices=IPR_TYPE_CHOICES)
    application_number       = models.CharField(max_length=100, blank=True)
    status                   = models.CharField(max_length=20, choices=STATUS_CHOICES)
    filled_date              = models.DateField(null=True, blank=True)
    published_granted_date   = models.DateField(null=True, blank=True)
    publication_number       = models.CharField(max_length=100, blank=True, help_text="Publication/Granted Number")
    technology_transfer      = models.BooleanField(default=False, help_text="Technology Transfer Applicable")
    country                  = models.CharField(max_length=100, blank=True, help_text="Country of Patent")
    proof_link               = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    quarter                  = models.CharField(max_length=10)
    year                     = models.PositiveIntegerField()

    created_at               = models.DateTimeField(auto_now_add=True)
    updated_at               = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.faculty_name} – {self.title} ({self.quarter} {self.year})"

class T5_2SponsoredProject(models.Model):
    STATUS_CHOICES = [
        ("Ongoing",   "Ongoing"),
        ("Completed", "Completed"),
    ]
    DURATION_CHOICES = [
        ("Short-Term",    "Short-Term"),
        ("Medium-Term",   "Medium-Term"),
        ("Long-Term",     "Long-Term"),
        ("Other",         "Other"),
    ]
    REGIONALITY_CHOICES = [
        ("Regional",      "Regional"),
        ("National",      "National"),
        ("International", "International"),
    ]

    user                      = models.ForeignKey(User, on_delete=models.CASCADE)
    department                = models.ForeignKey(Department, on_delete=models.CASCADE)

    principal_investigator    = models.CharField(max_length=200, help_text="Name of PI")
    co_principal_investigator = models.CharField(max_length=200, blank=True, help_text="Name of Co-PI")
    members                   = models.TextField(blank=True, help_text="Other members (if any)")

    funding_agency            = models.CharField(max_length=255)
    project_title             = models.CharField(max_length=255)
    sanctioned_order_no       = models.CharField(max_length=100, blank=True)
    sanctioned_date           = models.DateField(null=True, blank=True)
    status                    = models.CharField(max_length=20, choices=STATUS_CHOICES)
    completion_date           = models.DateField(null=True, blank=True, help_text="If completed")
    sanctioned_amount_lakhs   = models.DecimalField(max_digits=12, decimal_places=2, help_text="In Lakhs")
    amount_received_rupees    = models.DecimalField(max_digits=15, decimal_places=2, help_text="In Rupees")
    duration                  = models.CharField(max_length=50, choices=DURATION_CHOICES)
    regionality               = models.CharField(max_length=20, choices=REGIONALITY_CHOICES)
    proof_link                = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    quarter                   = models.CharField(max_length=10)
    year                      = models.PositiveIntegerField()

    created_at                = models.DateTimeField(auto_now_add=True)
    updated_at                = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.project_title} ({self.principal_investigator}, {self.quarter} {self.year})"

class T5_3ConsultancyProject(models.Model):
    STATUS_CHOICES = [
        ("Ongoing",   "Ongoing"),
        ("Completed", "Completed"),
    ]
    DURATION_CHOICES = [
        ("Short-Term",    "Short-Term"),
        ("Medium-Term",   "Medium-Term"),
        ("Long-Term",     "Long-Term"),
        ("Other",         "Other"),
    ]
    REGIONALITY_CHOICES = [
        ("Regional",      "Regional"),
        ("National",      "National"),
        ("International", "International"),
    ]

    user                      = models.ForeignKey(User, on_delete=models.CASCADE)
    department                = models.ForeignKey(Department, on_delete=models.CASCADE)

    internal_faculty          = models.TextField(blank=True, help_text="Internal Faculty Details")
    external_faculty          = models.TextField(blank=True, help_text="External Faculty Details")
    client_name               = models.CharField(max_length=255, help_text="Name of Client")
    title                     = models.CharField(max_length=255, help_text="Title of Consultancy")
    sanctioned_order_no       = models.CharField(max_length=100, blank=True)
    sanctioned_date           = models.DateField(null=True, blank=True)
    sanctioned_amount_lakhs   = models.DecimalField(max_digits=12, decimal_places=2, help_text="In Lakhs")
    amount_received_rupees    = models.DecimalField(max_digits=15, decimal_places=2, help_text="In Rupees")
    status                    = models.CharField(max_length=20, choices=STATUS_CHOICES)
    duration                  = models.CharField(max_length=50, choices=DURATION_CHOICES)
    regionality               = models.CharField(max_length=20, choices=REGIONALITY_CHOICES)
    proof_link                = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    quarter                   = models.CharField(max_length=10)
    year                      = models.PositiveIntegerField()

    created_at                = models.DateTimeField(auto_now_add=True)
    updated_at                = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.internal_faculty or self.external_faculty})"

class T5_4CourseDevelopment(models.Model):
    user                   = models.ForeignKey(User, on_delete=models.CASCADE)
    department             = models.ForeignKey(Department, on_delete=models.CASCADE)

    faculty_name           = models.CharField(max_length=200)
    course_module_name     = models.CharField(
                                max_length=255,
                                help_text="Name of the Course/e-content/Laboratory Module Developed"
                             )
    platform               = models.CharField(
                                max_length=255,
                                help_text="Platform (Moodle, Gsuite, Media Centre, etc.)"
                             )
    contributory_institute = models.CharField(
                                max_length=255,
                                blank=True,
                                help_text="Any other Contributory Institute/Industry"
                             )
    usage_citation         = models.TextField(
                                blank=True,
                                help_text="Usage and Citation etc."
                             )
    amount_spent           = models.DecimalField(
                                max_digits=12,
                                decimal_places=2,
                                null=True, blank=True,
                                help_text="Amount Spent (if any)"
                             )
    launch_date            = models.DateField(
                                null=True, blank=True,
                                help_text="Date of Launching Content"
                             )
    link                   = models.URLField(
                                blank=True,
                                help_text="Google Drive Link or Share Online Content Link"
                             )

    quarter                = models.CharField(max_length=10)
    year                   = models.PositiveIntegerField()

    created_at             = models.DateTimeField(auto_now_add=True)
    updated_at             = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.faculty_name} – {self.course_module_name} ({self.quarter} {self.year})"

# ── Add at the bottom of backend/t1_research/models.py ──

class T5_5LabEquipmentDevelopment(models.Model):
    user               = models.ForeignKey(User, on_delete=models.CASCADE)
    department         = models.ForeignKey(Department, on_delete=models.CASCADE)

    lab_name           = models.CharField(
                            max_length=255,
                            help_text="Name of the Laboratory"
                        )
    major_equipment    = models.CharField(
                            max_length=255,
                            help_text="Major Equipment"
                        )
    purpose            = models.TextField(
                            help_text="Purpose of the Development of the Laboratory"
                        )
    equipment_cost     = models.DecimalField(
                            max_digits=14,
                            decimal_places=2,
                            help_text="Approx. Cost of Equipment in Developing the Laboratory"
                        )
    proof_link         = models.URLField(
                            blank=True,
                            help_text="Google Drive Link (Upload Proof)"
                        )

    quarter            = models.CharField(max_length=10)
    year               = models.PositiveIntegerField()

    created_at         = models.DateTimeField(auto_now_add=True)
    updated_at         = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.lab_name} ({self.quarter} {self.year})"

class T5_6ResearchGuidance(models.Model):
    ROLE_CHOICES = [
        ("Supervisor",    "Supervisor"),
        ("Co-Supervisor", "Co-Supervisor"),
    ]
    STATUS_CHOICES = [
        ("Ongoing",   "Ongoing"),
        ("Completed", "Completed"),
    ]

    user                       = models.ForeignKey(User, on_delete=models.CASCADE)
    department                 = models.ForeignKey(Department, on_delete=models.CASCADE)

    faculty_name               = models.CharField(max_length=200)
    role                       = models.CharField(max_length=20, choices=ROLE_CHOICES)
    candidate_name             = models.CharField(max_length=200, help_text="Name of Candidate")
    enrollment_number          = models.CharField(max_length=100, help_text="Enrollment No.")
    thesis_title               = models.CharField(max_length=255, help_text="Title of Thesis")
    registration_date          = models.DateField(help_text="Date of Registration")
    viva_voce_date             = models.DateField(help_text="Date of PhD Viva-Voce")
    external_examiner_details  = models.TextField(help_text="Complete Details of External Examiner")
    status                     = models.CharField(max_length=20, choices=STATUS_CHOICES)
    research_center            = models.CharField(max_length=255, help_text="Name of the Research Center")
    conferring_university      = models.CharField(max_length=255, help_text="Name of the PhD Conferring University")
    proof_link                 = models.URLField(
                                      blank=True,
                                      help_text=(
                                        "Drive Link: For Ongoing → RDC Letter; "
                                        "for Completed → Notification Letter"
                                      )
                                  )

    quarter                    = models.CharField(max_length=10)
    year                       = models.PositiveIntegerField()

    created_at                 = models.DateTimeField(auto_now_add=True)
    updated_at                 = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.faculty_name} – {self.candidate_name} ({self.quarter} {self.year})"

class T6_1CertificationCourse(models.Model):
    CERT_TYPE_CHOICES = [
        ("Elite-Gold",   "Elite-Gold"),
        ("Elite-Silver", "Elite-Silver"),
        ("Passed",       "Passed"),
        ("Other",        "Other"),
    ]

    user                     = models.ForeignKey(User, on_delete=models.CASCADE)
    department               = models.ForeignKey(Department, on_delete=models.CASCADE)

    faculty_name             = models.CharField(max_length=200)
    certification_course     = models.CharField(
                                   max_length=255,
                                   help_text="Name of the Certification Course"
                               )
    course_name              = models.CharField(max_length=255)
    category                 = models.CharField(
                                   max_length=255,
                                   help_text="Category of the Course (e.g. CSE, ECE, etc.)"
                               )
    duration                 = models.CharField(
                                   max_length=100,
                                   help_text="Duration of the Course"
                               )
    credit_points            = models.CharField(
                                   max_length=50,
                                   help_text="Credit Points Earned"
                               )
    certification_type       = models.CharField(
                                   max_length=20,
                                   choices=CERT_TYPE_CHOICES,
                                   help_text="Elite-Gold / Elite-Silver / Passed / Other"
                               )
    certificate_link         = models.URLField(
                                   blank=True,
                                   help_text="Google Drive Link (Upload Certificate)"
                               )

    quarter                  = models.CharField(max_length=10)
    year                     = models.PositiveIntegerField()

    created_at               = models.DateTimeField(auto_now_add=True)
    updated_at               = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.faculty_name} – {self.certification_course} ({self.quarter} {self.year})"

class T6_2ProfessionalBodyMembership(models.Model):
    user               = models.ForeignKey(User, on_delete=models.CASCADE)
    department         = models.ForeignKey(Department, on_delete=models.CASCADE)

    faculty_name       = models.CharField(max_length=200)
    institution_name   = models.CharField(
                            max_length=255,
                            help_text="Name of Institution/Society"
                        )
    membership_grade   = models.CharField(
                            max_length=100,
                            help_text="Grade of Membership"
                        )
    membership_number  = models.CharField(
                            max_length=100,
                            help_text="Membership Number"
                        )
    year_of_election   = models.PositiveIntegerField()
    proof_link         = models.URLField(
                            blank=True,
                            help_text="Google Drive Link (Upload Proof)"
                        )

    quarter            = models.CharField(max_length=10)
    year               = models.PositiveIntegerField()

    created_at         = models.DateTimeField(auto_now_add=True)
    updated_at         = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.faculty_name} – {self.institution_name} ({self.quarter} {self.year})"

# ── at bottom of backend/t1_research/models.py ──

class T6_3Award(models.Model):
    AWARD_TYPE_CHOICES = [
        ("Regional",      "Regional"),
        ("National",      "National"),
        ("International", "International"),
    ]

    user         = models.ForeignKey(User, on_delete=models.CASCADE)
    department   = models.ForeignKey(Department, on_delete=models.CASCADE)

    faculty_name = models.CharField(max_length=200)
    award_name   = models.CharField(max_length=255, help_text="Name of Award")
    conferred_by = models.CharField(max_length=255, help_text="Award Conferred by")
    award_date   = models.DateField(help_text="Award Date")
    award_type   = models.CharField(max_length=20, choices=AWARD_TYPE_CHOICES)
    proof_link   = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    quarter      = models.CharField(max_length=10)
    year         = models.PositiveIntegerField()

    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.faculty_name} – {self.award_name} ({self.quarter} {self.year})"

class T6_4ResourcePerson(models.Model):
    user            = models.ForeignKey(User, on_delete=models.CASCADE)
    department      = models.ForeignKey(Department, on_delete=models.CASCADE)

    faculty_name    = models.CharField(max_length=200, help_text="Name of Faculty")
    invited_by      = models.CharField(max_length=255, help_text="Invited By")
    lecture_title   = models.CharField(max_length=255, help_text="Title/Subject of Lecture Delivered")
    date            = models.DateField(help_text="Date of Lecture")
    duration_hours  = models.DecimalField(
                         max_digits=5,
                         decimal_places=2,
                         help_text="Duration in hours"
                      )
    proof_link      = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    quarter         = models.CharField(max_length=10)
    year            = models.PositiveIntegerField()

    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.faculty_name} – {self.lecture_title} ({self.quarter} {self.year})"

class T6_5AICTEInitiative(models.Model):
    ROLE_CHOICES = [
        ("Coordinator", "Coordinator"),
        ("Member",      "Member"),
        ("Participant", "Participant"),
        ("Other",       "Other"),
    ]

    user                 = models.ForeignKey(User, on_delete=models.CASCADE)
    department           = models.ForeignKey(Department, on_delete=models.CASCADE)

    faculty_name         = models.CharField(
                              max_length=200,
                              help_text="Name of Faculty"
                          )
    initiative_name      = models.CharField(
                              max_length=500,
                              help_text=(
                                  "Name of the AICTE Initiative Taken "
                                  "(e.g. Clean & Smart Campus, Smart India Hackathon, "
                                  "Unnat Bharat Abhiyan, Blood Donation, etc.)"
                              )
                          )
    date                 = models.DateField(help_text="Date of Initiative (DD/MMM/YYYY)")
    # role                 = models.CharField(max_length=20, choices=ROLE_CHOICES)
    role                 = models.CharField(max_length=100)
    organizing_institute = models.CharField(
                              max_length=255,
                              help_text="Name of the Organizing Institute"
                          )
    proof_link           = models.URLField(
                              blank=True,
                              help_text="Google Drive Link (Upload Proof)"
                          )

    quarter              = models.CharField(max_length=10)
    year                 = models.PositiveIntegerField()

    created_at           = models.DateTimeField(auto_now_add=True)
    updated_at           = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.faculty_name} – {self.initiative_name[:30]}… ({self.quarter} {self.year})"

class T7_1ProgramOrganized(models.Model):
    MODE_CHOICES = [
        ("Online",  "Online"),
        ("Offline", "Offline"),
    ]

    user                = models.ForeignKey(User, on_delete=models.CASCADE)
    department          = models.ForeignKey(Department, on_delete=models.CASCADE)

    organizer_name      = models.CharField(
                             max_length=255,
                             help_text="Name of the Organizer (Club/Professional Body)"
                         )
    event_name          = models.CharField(
                             max_length=255,
                             help_text="Name of the Event/Competition"
                         )
    event_type          = models.CharField(
                             max_length=255,
                             help_text="Type of Event/Competition"
                         )
    start_date          = models.DateField(help_text="Program Start Date (DD/MMM/YYYY)")
    end_date            = models.DateField(help_text="Program End Date (DD/MMM/YYYY)")
    num_days            = models.PositiveIntegerField(help_text="Number of Days")
    mode                = models.CharField(max_length=10, choices=MODE_CHOICES)
    participants_count  = models.PositiveIntegerField(help_text="Number of Participants Attended")
    collaborator_details= models.TextField(
                             blank=True,
                             help_text="Collaborator (if any) with contact details"
                         )
    report_link         = models.URLField(
                             blank=True,
                             help_text="Google Drive Link (Upload Report)"
                         )

    quarter             = models.CharField(max_length=10)
    year                = models.PositiveIntegerField()

    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.organizer_name} – {self.event_name} ({self.quarter} {self.year})"
class S1_1TheorySubjectData(models.Model):
    user                     = models.ForeignKey(User, on_delete=models.CASCADE)
    department               = models.ForeignKey(Department, on_delete=models.CASCADE)

    semester                 = models.CharField(
                                   max_length=10,
                                   help_text="Semester (e.g. S1, S2…)"
                               )
    name_of_subject          = models.CharField(max_length=255)
    subject_code             = models.CharField(max_length=50)
    faculty_name             = models.CharField(max_length=200, help_text="Faculty who conducted the classes")
    num_classes              = models.PositiveIntegerField(help_text="No. of Classes Conducted")
    num_students_appeared    = models.PositiveIntegerField(help_text="No. of Students Appeared")
    num_students_passed      = models.PositiveIntegerField(help_text="No. of Students Passed")
    pass_percent             = models.DecimalField(
                                   max_digits=5,
                                   decimal_places=2,
                                   help_text="% Pass in the Subject"
                               )
    pass_percent_rv          = models.DecimalField(
                                   max_digits=5,
                                   decimal_places=2,
                                   help_text="% Pass after RV/RRV"
                               )
    prev_year_pass_percent   = models.DecimalField(
                                   max_digits=5,
                                   decimal_places=2,
                                   help_text="Previous Year % Result"
                               )

    created_at               = models.DateTimeField(auto_now_add=True)
    updated_at               = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.subject_code} – {self.name_of_subject} ({self.semester})"

class S2_1StudentArticle(models.Model):
    AUTHOR_TYPE_CHOICES = [
        ("Sole",          "Sole"),
        ("First",         "First"),
        ("Corresponding", "Corresponding"),
        ("Other",         "Other"),
    ]

    user               = models.ForeignKey(User, on_delete=models.CASCADE)
    department         = models.ForeignKey(Department, on_delete=models.CASCADE)

    title              = models.CharField(max_length=255)
    author_type        = models.CharField(max_length=20, choices=AUTHOR_TYPE_CHOICES)
    internal_authors   = models.TextField(help_text="Internal Authors")
    external_authors   = models.TextField(help_text="External Authors")
    journal_name       = models.CharField(max_length=255)
    volume             = models.CharField(max_length=50, blank=True)
    issue              = models.CharField(max_length=50, blank=True)
    page_numbers       = models.CharField(max_length=100, blank=True)
    month_year         = models.CharField(
                            max_length=50,
                            help_text="Month & Year of Publication"
                        )
    issn_number        = models.CharField("ISSN Number", max_length=50, blank=True)
    impact_factor      = models.DecimalField(
                            max_digits=5,
                            decimal_places=2,
                            null=True,
                            blank=True,
                            help_text="Impact Factor"
                        )
    publisher          = models.CharField(max_length=255, blank=True)

    is_wos             = models.BooleanField(default=False, help_text="Web of Science")
    is_scopus          = models.BooleanField(default=False)
    is_ugc_care        = models.BooleanField(default=False, help_text="UGC CARE")
    other_indexing     = models.CharField(
                            max_length=255,
                            blank=True,
                            help_text="Other (Referred Journal)"
                        )

    doi                = models.CharField(max_length=255, blank=True)
    proof_link         = models.URLField(blank=True, help_text="Google Drive Link (Proof)")

    quarter            = models.CharField(max_length=10)
    year               = models.PositiveIntegerField()

    created_at         = models.DateTimeField(auto_now_add=True)
    updated_at         = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.month_year})"

class S2_2StudentConferencePaper(models.Model):
    AUTHOR_TYPE_CHOICES = [
        ("Sole",          "Sole"),
        ("First",         "First"),
        ("Corresponding", "Corresponding"),
        ("Other",         "Other"),
    ]
    STATUS_CHOICES = [
        ("National",      "National"),
        ("International", "International"),
    ]
    MODE_CHOICES = [
        ("Online",  "Online"),
        ("Offline", "Offline"),
    ]

    user                 = models.ForeignKey(User, on_delete=models.CASCADE)
    department           = models.ForeignKey(Department, on_delete=models.CASCADE)

    title                = models.CharField(max_length=255)
    author_type          = models.CharField(max_length=20, choices=AUTHOR_TYPE_CHOICES)
    internal_authors     = models.TextField(help_text="Internal Authors")
    external_authors     = models.TextField(help_text="External Authors")
    conference_details   = models.CharField(
                              max_length=255,
                              help_text="Organization/Institution name, Place, State"
                          )
    isbn_issn            = models.CharField("ISBN/ISSN", max_length=50, blank=True)
    publisher            = models.CharField(max_length=255, blank=True)
    page_numbers         = models.CharField(max_length=100, blank=True, help_text="Page No")
    month_year           = models.CharField(max_length=50, help_text="Month & Year")
    is_scopus            = models.BooleanField(default=False, help_text="Scopus Indexed")
    other_indexing       = models.CharField(
                              max_length=255,
                              blank=True,
                              help_text="Other Indexing (Referred Journal)"
                          )
    conference_status    = models.CharField(max_length=20, choices=STATUS_CHOICES)
    mode                 = models.CharField(max_length=10, choices=MODE_CHOICES)
    proof_link           = models.URLField(blank=True, help_text="Google Drive Link (Proof)")

    quarter              = models.CharField(max_length=10)
    year                 = models.PositiveIntegerField()

    created_at           = models.DateTimeField(auto_now_add=True)
    updated_at           = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.month_year})"
class S2_3StudentSponsoredProject(models.Model):
    user            = models.ForeignKey(User, on_delete=models.CASCADE)
    department      = models.ForeignKey(Department, on_delete=models.CASCADE)

    student_name    = models.CharField(max_length=200, help_text="Name of the Student")
    semester        = models.CharField(max_length=10, help_text="Semester (e.g. S1, S2…)")
    project_title   = models.CharField(max_length=255, help_text="Title of the Project")
    sponsored_by    = models.CharField(max_length=255, help_text="Sponsored By")
    guide_name      = models.CharField(max_length=200, help_text="Name of the Guide")
    proof_link      = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student_name} – {self.project_title} ({self.semester})"

class S3_1CompetitionParticipation(models.Model):
    LEVEL_CHOICES = [
        ("Regional",      "Regional"),
        ("National",      "National"),
        ("International", "International"),
    ]

    user            = models.ForeignKey(User, on_delete=models.CASCADE)
    department      = models.ForeignKey(Department, on_delete=models.CASCADE)

    student_name    = models.CharField(max_length=200, help_text="Name of the Student")
    semester        = models.CharField(max_length=10, help_text="Semester (e.g. S1, S2…)")
    activity_type   = models.CharField(
                         max_length=255,
                         help_text="Type of Activity (Sports/Cultural etc.)"
                     )
    organized_by    = models.CharField(max_length=255, help_text="Organized By")
    date            = models.DateField(help_text="Date of Participation")
    level           = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    awards          = models.CharField(max_length=255, blank=True, help_text="Awards (if any)")
    proof_link      = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student_name} – {self.activity_type} on {self.date}"

class S3_2DeptProgram(models.Model):
    LEVEL_CHOICES = [
        ("Regional",      "Regional"),
        ("National",      "National"),
        ("International", "International"),
    ]

    user                     = models.ForeignKey(User, on_delete=models.CASCADE)
    department               = models.ForeignKey(Department, on_delete=models.CASCADE)

    program_name             = models.CharField(
                                   max_length=255,
                                   help_text="Name of the Programme/Competition"
                               )
    participants_count       = models.PositiveIntegerField(
                                   help_text="Number of Participants"
                               )
    program_type             = models.CharField(
                                   max_length=255,
                                   help_text="Type of Programme/Competition"
                               )
    external_agency          = models.CharField(
                                   max_length=255,
                                   blank=True,
                                   help_text="In collaboration with external agency (if any)"
                               )
    date                     = models.DateField(help_text="Date of Programme")
    level                    = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    proof_link               = models.URLField(
                                   blank=True,
                                   help_text="Google Drive Link (Upload Proof)"
                               )

    quarter                  = models.CharField(max_length=10)
    year                     = models.PositiveIntegerField()

    created_at               = models.DateTimeField(auto_now_add=True)
    updated_at               = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.program_name} on {self.date} ({self.quarter} {self.year})"

class S4_1StudentExamQualification(models.Model):
    user                       = models.ForeignKey(User, on_delete=models.CASCADE)
    department                 = models.ForeignKey(Department, on_delete=models.CASCADE)

    student_name               = models.CharField(max_length=200, help_text="Name of the Student")
    batch                      = models.CharField(max_length=50, help_text="Batch (e.g. 2024)")
    exam_name                  = models.CharField(max_length=255, help_text="Competitive Exam Qualified (GATE/CAT/GRE/GMAT etc.)")
    registration_number        = models.CharField(max_length=100, help_text="Registration/Roll Number")
    score_detail               = models.CharField(
                                     max_length=100,
                                     help_text="AIR/Percentile/Score"
                                 )
    pg_programme               = models.CharField(
                                     max_length=100,
                                     help_text="PG Programme Admitted (M.Tech/MS/MBA etc.)"
                                 )
    admission_year             = models.PositiveIntegerField(help_text="Year of Admission in Higher Studies")
    institution_name           = models.CharField(max_length=255, help_text="Institution Joined")
    contact_details            = models.CharField(max_length=255, help_text="Contact Details")
    email                      = models.EmailField(help_text="E-mail ID")
    mobile                     = models.CharField(max_length=15, help_text="Mobile No.")
    social_profile_link        = models.URLField(
                                     blank=True,
                                     help_text="Profile in Social Sites (LinkedIn, Twitter etc.)"
                                 )
    proof_link                 = models.URLField(blank=True, help_text="Google Drive Link (Proof)")

    created_at                 = models.DateTimeField(auto_now_add=True)
    updated_at                 = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student_name} – {self.exam_name} ({self.batch})"
class S4_2CampusRecruitment(models.Model):
    user                 = models.ForeignKey(User, on_delete=models.CASCADE)
    department           = models.ForeignKey(Department, on_delete=models.CASCADE)

    student_name         = models.CharField(max_length=200, help_text="Name of the Student")
    batch                = models.CharField(max_length=50, help_text="Batch (e.g. 2024)")
    company_name         = models.CharField(max_length=255, help_text="Name of the Company Joined")
    package_offered      = models.DecimalField(
                              max_digits=10,
                              decimal_places=2,
                              help_text="Package Offered"
                          )
    offer_ref_number     = models.CharField(
                              max_length=100,
                              help_text="Offer Letter Reference Number"
                          )
    contact_details      = models.CharField(
                              max_length=255,
                              help_text="Contact Details of Student"
                          )
    email                = models.EmailField(help_text="E-mail ID")
    mobile               = models.CharField(
                              max_length=15,
                              help_text="Mobile No."
                          )
    social_profile_link  = models.URLField(
                              blank=True,
                              help_text="Profile in Social Sites (Facebook/LinkedIn/Twitter)"
                          )
    proof_link           = models.URLField(
                              blank=True,
                              help_text="Google Drive Link (Upload Proof)"
                          )

    created_at           = models.DateTimeField(auto_now_add=True)
    updated_at           = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student_name} – {self.company_name}"

class S4_3GovtPSUSelection(models.Model):
    user                 = models.ForeignKey(User, on_delete=models.CASCADE)
    department           = models.ForeignKey(Department, on_delete=models.CASCADE)

    student_name         = models.CharField(max_length=200, help_text="Name of the Student")
    batch                = models.CharField(max_length=50, help_text="Batch (e.g. 2024)")
    exam_name            = models.CharField(
                              max_length=255,
                              help_text="Competitive Exam Qualified (UPSC/CGPSC/SSC etc.)"
                          )
    registration_number  = models.CharField(max_length=100, help_text="Registration/Roll Number")
    psv_name             = models.CharField(
                              max_length=255,
                              help_text="Name of the PSU"
                          )
    package_offered      = models.DecimalField(
                              max_digits=10,
                              decimal_places=2,
                              help_text="Package Offered"
                          )
    joining_year         = models.PositiveIntegerField(help_text="Year of Joining")
    offer_ref_number     = models.CharField(
                              max_length=100,
                              help_text="Reference Number of Joining Letter"
                          )
    contact_details      = models.CharField(max_length=255, help_text="Contact Details")
    email                = models.EmailField(help_text="E-mail ID")
    mobile               = models.CharField(max_length=15, help_text="Mobile No.")
    social_profile_link  = models.URLField(
                              blank=True,
                              help_text="Profile in Social Sites (Facebook/LinkedIn/Twitter)"
                          )
    proof_link           = models.URLField(blank=True, help_text="Google Drive Link (Upload Proof)")

    created_at           = models.DateTimeField(auto_now_add=True)
    updated_at           = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student_name} – {self.psv_name}"

class S4_4PlacementHigherStudies(models.Model):
    PLACEMENT_TYPE_CHOICES = [
        ("Software", "Software"),
        ("Core",     "Core"),
        ("PSU",      "PSU"),
        ("Other",    "Other"),
    ]

    user                 = models.ForeignKey(User, on_delete=models.CASCADE)
    department           = models.ForeignKey(Department, on_delete=models.CASCADE)

    student_roll_no      = models.CharField(max_length=50, help_text="Roll No.")
    student_name         = models.CharField(max_length=200, help_text="Name of the Student")
    photo_link           = models.URLField(blank=True, help_text="Photo URL")

    placement_type       = models.CharField(
                              max_length=20,
                              choices=PLACEMENT_TYPE_CHOICES,
                              help_text="Software/Core/PSU/Other"
                          )
    organization_name    = models.CharField(
                              max_length=255,
                              blank=True,
                              help_text="Name of Organization (placement)"
                          )
    package_offered      = models.DecimalField(
                              max_digits=10,
                              decimal_places=2,
                              null=True, blank=True,
                              help_text="Package Offered"
                          )

    program_name         = models.CharField(
                              max_length=255,
                              blank=True,
                              help_text="Name of the Programme (higher studies)"
                          )
    institution_joined   = models.CharField(
                              max_length=255,
                              blank=True,
                              help_text="Name of the Institution Joined"
                          )
    admission_year       = models.PositiveIntegerField(
                              null=True, blank=True,
                              help_text="Year of Admission"
                          )

    entrepreneurship     = models.CharField(
                              "Entrepreneurship (Company)",
                              max_length=255,
                              blank=True,
                              help_text="Name of Company (if student became entrepreneur)"
                          )

    email                = models.EmailField(help_text="E-mail ID")
    contact_details      = models.CharField(max_length=255, help_text="Contact Details")
    mobile               = models.CharField(max_length=15, help_text="Mobile No.")
    social_profile_link  = models.URLField(
                              blank=True,
                              help_text="Profile in Social Sites (LinkedIn, Twitter etc.)"
                          )
    offer_ref_number     = models.CharField(
                              max_length=100,
                              blank=True,
                              help_text="Reference Number of Joining Letter"
                          )
    proof_link           = models.URLField(
                              blank=True,
                              help_text="Google Drive Link (Upload Proof)"
                          )

    created_at           = models.DateTimeField(auto_now_add=True)
    updated_at           = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student_roll_no} – {self.student_name}"
class S5_1StudentCertificationCourse(models.Model):
    CERT_TYPE_CHOICES = [
        ("Elite-Gold",   "Elite-Gold"),
        ("Elite-Silver", "Elite-Silver"),
        ("Passed",       "Passed"),
        ("Other",        "Other"),
    ]

    user                   = models.ForeignKey(User, on_delete=models.CASCADE)
    department             = models.ForeignKey(Department, on_delete=models.CASCADE)

    student_name           = models.CharField(max_length=200, help_text="Name of the Student")
    certification_course   = models.CharField(
                                max_length=255,
                                help_text="Name of the Certification Course"
                             )
    category               = models.CharField(
                                max_length=255,
                                help_text="Category of the Course (e.g. CSE, ECE, etc.)"
                             )
    duration               = models.CharField(
                                max_length=100,
                                help_text="Duration of the Course"
                             )
    credit_points          = models.CharField(
                                max_length=50,
                                help_text="Credit Points Earned"
                             )
    certification_type     = models.CharField(
                                max_length=20,
                                choices=CERT_TYPE_CHOICES,
                                help_text="Elite-Gold / Elite-Silver / Passed / Other"
                             )
    certificate_link       = models.URLField(
                                blank=True,
                                help_text="Google Drive Link (Upload Certificate)"
                             )

    created_at             = models.DateTimeField(auto_now_add=True)
    updated_at             = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student_name} – {self.certification_course}"

class S5_2VocationalTraining(models.Model):
    user                  = models.ForeignKey(User, on_delete=models.CASCADE)
    department            = models.ForeignKey(Department, on_delete=models.CASCADE)

    student_name          = models.CharField(
                               max_length=200,
                               help_text="Name of the Student"
                           )
    company_name          = models.CharField(
                               max_length=255,
                               help_text="Name of the Company"
                           )
    duration              = models.CharField(
                               max_length=100,
                               help_text="Duration of the Course Attended"
                           )
    certificate_link      = models.URLField(
                               blank=True,
                               help_text="Google Drive Link (Upload Certificate)"
                           )

    created_at            = models.DateTimeField(auto_now_add=True)
    updated_at            = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student_name} – {self.company_name}"
class S5_3SpecialMentionAchievement(models.Model):
    LEVEL_CHOICES = [
        ("University",    "University"),
        ("State",         "State"),
        ("National",      "National"),
        ("International", "International"),
    ]

    user                    = models.ForeignKey(User, on_delete=models.CASCADE)
    department              = models.ForeignKey(Department, on_delete=models.CASCADE)

    student_name            = models.CharField(
                                  max_length=200,
                                  help_text="Name of the Student/Alumni"
                              )
    award_name              = models.CharField(
                                  max_length=255,
                                  help_text="Name of the Award"
                              )
    work_title              = models.CharField(
                                  max_length=255,
                                  help_text="Name of the Work for which Award is received"
                              )
    date_received           = models.DateField(help_text="Date of Award Received")
    awarding_organization   = models.CharField(
                                  max_length=255,
                                  help_text="Name of Awarding Organization"
                              )
    award_amount            = models.DecimalField(
                                  max_digits=12,
                                  decimal_places=2,
                                  null=True, blank=True,
                                  help_text="Award Amount (INR), if any"
                              )
    award_level             = models.CharField(
                                  max_length=20,
                                  choices=LEVEL_CHOICES,
                                  help_text="Level of Award"
                              )
    proof_link              = models.URLField(
                                  blank=True,
                                  help_text="Google Drive Link (Upload Proof)"
                              )

    created_at              = models.DateTimeField(auto_now_add=True)
    updated_at              = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student_name} – {self.award_name} ({self.award_level})"

class S5_4StudentEntrepreneurship(models.Model):
    user                   = models.ForeignKey(User, on_delete=models.CASCADE)
    department             = models.ForeignKey(Department, on_delete=models.CASCADE)

    student_name           = models.CharField(
                                max_length=200,
                                help_text="Name of the Student"
                             )
    establishment_year     = models.PositiveIntegerField(
                                help_text="Year of Establishment"
                             )
    organization_details   = models.TextField(
                                help_text="Name, Address & Website of Organization"
                             )
    sector                 = models.CharField(
                                max_length=255,
                                help_text="Sector"
                             )
    proof_link             = models.URLField(
                                blank=True,
                                help_text="Google Drive Link (Upload Proof)"
                             )

    created_at             = models.DateTimeField(auto_now_add=True)
    updated_at             = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student_name} – {self.establishment_year}"
