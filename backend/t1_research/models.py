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