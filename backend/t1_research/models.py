from django.db import models
from django.contrib.auth.models import User

class Department(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class T1_ResearchArticle(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    
    # Core T1.1 fields from Excel
    title = models.CharField(max_length=255)
    journal_name = models.CharField(max_length=255)
    publication_date = models.DateField()
    issn_number = models.CharField(max_length=20, blank=True)
    indexing = models.CharField(max_length=100, blank=True)
    impact_factor = models.CharField(max_length=50, blank=True)
    co_authors = models.TextField(blank=True)
    document_link = models.URLField(blank=True)

    # Submission tracking
    quarter = models.CharField(max_length=10)
    year = models.PositiveIntegerField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
