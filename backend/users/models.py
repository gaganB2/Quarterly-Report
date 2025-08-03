# users/models.py

from django.contrib.auth.models import User
from django.db import models
from reports.models import Department
from django.core.exceptions import ValidationError

class Profile(models.Model):
    class Role(models.TextChoices):
        FACULTY = 'Faculty', 'Faculty'
        HOD = 'HOD', 'HOD'
        ADMIN = 'Admin', 'Admin'

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # --- V MODIFIED: Department is now optional at the database level ---
    department = models.ForeignKey(
        Department, 
        on_delete=models.CASCADE,
        null=True, # Allow NULL values in the database
        blank=True, # Allow the field to be blank in forms (like the admin)
        db_index=True
    )
    # --- ^ END MODIFIED ---

    role = models.CharField(
        max_length=10, 
        choices=Role.choices,
        default=Role.FACULTY
    )

    # --- V NEW: Custom validation logic ---
    def clean(self):
        """
        Add custom validation to enforce that non-admin users MUST have a department.
        """
        # The super().clean() call is important to run all default model validation first.
        super().clean()
        
        # If the user is a Faculty or HOD, they must be assigned to a department.
        if self.role in [self.Role.FACULTY, self.Role.HOD] and not self.department:
            raise ValidationError({
                'department': 'A Department must be assigned for Faculty and HOD roles.'
            })
        
        # If the user is an Admin, their department should be cleared to avoid confusion.
        if self.role == self.Role.ADMIN:
            self.department = None
    # --- ^ END NEW ---

    def save(self, *args, **kwargs):
        # Run the custom validation logic before every save.
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.get_role_display()}"
