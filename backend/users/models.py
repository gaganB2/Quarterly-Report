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
    
    password_changed = models.BooleanField(default=False)

    @property
    def full_name(self):
        parts = [self.prefix, self.user.first_name, self.middle_name, self.user.last_name]
        return ' '.join(part for part in parts if part)

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"


@receiver(post_save, sender=User)
def handle_user_creation(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        instance.is_active = False
        instance.save(update_fields=['is_active'])

