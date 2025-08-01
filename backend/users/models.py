from django.contrib.auth.models import User
from django.db import models
from reports.models import Department  # Make sure this import exists

class Profile(models.Model):
    ROLE_CHOICES = (
        ('Faculty', 'Faculty'),
        ('HOD', 'HOD'),
        ('Admin', 'Admin'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.user.username} - {self.role}"
