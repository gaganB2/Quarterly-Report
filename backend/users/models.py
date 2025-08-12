# users/models.py

from django.contrib.auth.models import User
from django.db import models
from reports.models import Department
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    class Role(models.TextChoices):
        FACULTY = 'Faculty', 'Faculty'
        HOD = 'HOD', 'HOD'
        ADMIN = 'Admin', 'Admin'
    
    # --- ADDED: Prefix choices for names ---
    class Prefix(models.TextChoices):
        DR = 'Dr.', 'Dr.'
        PROF = 'Prof.', 'Prof.'
        MR = 'Mr.', 'Mr.'
        MRS = 'Mrs.', 'Mrs.'
        MS = 'Ms.', 'Ms.'

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # --- ADDED: New fields for more detailed names ---
    prefix = models.CharField(
        max_length=10, 
        choices=Prefix.choices,
        blank=True # Making the prefix optional
    )
    middle_name = models.CharField(max_length=100, blank=True)

    department = models.ForeignKey(
        Department, 
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        db_index=True
    )

    role = models.CharField(
        max_length=10, 
        choices=Role.choices,
        default=Role.FACULTY
    )

    # --- ADDED: A property to easily get the full formatted name ---
    @property
    def full_name(self):
        """Assembles the full name from the available parts."""
        # This creates a list of name parts and joins them with spaces,
        # ignoring any parts that are empty (like an empty middle_name).
        parts = [self.prefix, self.user.first_name, self.middle_name, self.user.last_name]
        return ' '.join(part for part in parts if part)

    def __str__(self):
        return f"{self.user.username} - {self.get_role_display()}"


# This signal automatically creates a Profile whenever a new User is created.
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)