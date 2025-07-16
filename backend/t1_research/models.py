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
