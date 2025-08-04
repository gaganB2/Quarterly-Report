# users/models.py

from django.contrib.auth.models import User
from django.db import models
from reports.models import Department
# We no longer need ValidationError here for the clean method
# from django.core.exceptions import ValidationError 

# NEW - Add these imports for the signal
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    class Role(models.TextChoices):
        FACULTY = 'Faculty', 'Faculty'
        HOD = 'HOD', 'HOD'
        ADMIN = 'Admin', 'Admin'

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    department = models.ForeignKey(
        Department, 
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        db_index=True
    )

    role = models.CharField(
        max_length=10, 
        choices=Role.choices,
        default=Role.FACULTY
    )

    # --- V REMOVED ---
    # The clean() and save() methods have been removed.
    # The validation logic they contained is now correctly handled
    # by the RegistrationSerializer.
    # --- ^ END REMOVED ---

    def __str__(self):
        return f"{self.user.username} - {self.get_role_display()}"


# --- Keep the signal receiver at the end of the file ---
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)