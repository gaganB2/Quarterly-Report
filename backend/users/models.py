# users/models.py

from django.contrib.auth.models import User
from django.db import models
from reports.models import Department
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.template.loader import render_to_string

from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes


class Profile(models.Model):
    class Role(models.TextChoices):
        FACULTY = 'Faculty', 'Faculty'
        HOD = 'HOD', 'HOD'
        ADMIN = 'Admin', 'Admin'
    
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
    
    # --- ADDED: Field to track if the default password has been changed ---
    password_changed = models.BooleanField(default=False)

    @property
    def full_name(self):
        """Assembles the full name from the available parts."""
        parts = [self.prefix, self.user.first_name, self.middle_name, self.user.last_name]
        return ' '.join(part for part in parts if part)

    def __str__(self):
        return f"{self.user.username} - {self.get_role_display()}"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        
        instance.is_active = False
        instance.save()

        token = default_token_generator.make_token(instance)
        uid = urlsafe_base64_encode(force_bytes(instance.pk))
        
        verification_url = f"http://localhost:5173/verify-email/{uid}/{token}/"

        email_subject = "Activate Your Quarterly Report Portal Account"
        email_body = render_to_string('account_verification_email.txt', {
            'user': instance,
            'verification_url': verification_url,
        })
        
        send_mail(
            email_subject,
            email_body,
            'gagannn.skyy@gmail.com',
            [instance.email],
            fail_silently=False,
        )