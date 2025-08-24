# users/models.py

from django.contrib.auth.models import User
from django.db import models
from reports.models import Department
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    """
    Extends the default Django User model to include role, department,
    and other application-specific details.
    """
    class Role(models.TextChoices):
        FACULTY = 'Faculty', 'Faculty'
        HOD = 'HOD', 'HOD'
        ADMIN = 'Admin', 'Admin'
        STUDENT = 'Student', 'Student'
    
    class Prefix(models.TextChoices):
        DR = 'Dr.', 'Dr.'
        PROF = 'Prof.', 'Prof.'
        MR = 'Mr.', 'Mr.'
        MRS = 'Mrs.', 'Mrs.'
        MS = 'Ms.', 'Ms.'

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    prefix = models.CharField(
        max_length=10, 
        choices=Prefix.choices,
        blank=True
    )
    middle_name = models.CharField(max_length=100, blank=True)

    department = models.ForeignKey(
        Department, 
        on_delete=models.PROTECT, # Prevent department deletion if profiles are linked
        null=True,
        blank=True,
        db_index=True
    )

    role = models.CharField(
        max_length=10, 
        choices=Role.choices,
        default=Role.FACULTY
    )
    
    # This flag will track if the user has set their password after verification.
    password_changed = models.BooleanField(default=False)

    @property
    def full_name(self):
        """Assembles the full name from the available parts for display."""
        parts = [self.prefix, self.user.first_name, self.middle_name, self.user.last_name]
        return ' '.join(part for part in parts if part)

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"


@receiver(post_save, sender=User)
def handle_user_creation(sender, instance, created, **kwargs):
    """
    A signal that runs after a User object is saved.
    - If a new user is created, it creates a corresponding Profile.
    - It also sets the user to inactive, pending email verification.
    - Email sending logic has been REMOVED from here to prevent blocking.
    """
    if created:
        Profile.objects.create(user=instance)
        # Deactivate user until they verify their email.
        # The view that creates the user is now responsible for triggering the email.
        instance.is_active = False
        instance.save(update_fields=['is_active'])

