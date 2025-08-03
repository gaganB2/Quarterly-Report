# users/models.py

from django.contrib.auth.models import User
from django.db import models
from reports.models import Department 

class Profile(models.Model):
    # --- V NEW: Define choices as a class attribute for clarity ---
    class Role(models.TextChoices):
        FACULTY = 'Faculty', 'Faculty'
        HOD = 'HOD', 'HOD'
        ADMIN = 'Admin', 'Admin'
    # --- ^ END NEW ---

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # --- V MODIFIED: Department is now required and indexed for performance ---
    department = models.ForeignKey(
        Department, 
        on_delete=models.CASCADE, # Use CASCADE for data consistency.
        null=False, # This field cannot be empty in the database.
        blank=False, # This field is required in forms/serializers.
        db_index=True # Add a database index for faster lookups.
    )
    # --- ^ END MODIFIED ---

    # --- V MODIFIED: The 'role' field now uses the strict choices defined above ---
    role = models.CharField(
        max_length=10, 
        choices=Role.choices, # Enforce choices at the database level.
        default=Role.FACULTY # Provide a sensible default.
    )
    # --- ^ END MODIFIED ---

    def __str__(self):
        # Use the get_FOO_display() method to show the human-readable label
        return f"{self.user.username} - {self.get_role_display()}"