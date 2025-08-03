# reports/migrations/0002_initial_data.py

from django.db import migrations
from django.contrib.auth.hashers import make_password
import os

def create_initial_data(apps, schema_editor):
    """
    Creates the initial data for the application, including:
    - Pre-defined academic departments.
    - A default superuser (admin) for system management.
    - The admin's corresponding user profile.
    """
    Department = apps.get_model('reports', 'Department')
    User = apps.get_model('auth', 'User')
    Profile = apps.get_model('users', 'Profile')

    # --- 1. Create Departments ---
    departments_to_create = [
    'B. Tech.',
    'CIVIL',
    'CSE',
    'CSE-AI',
    'CSE-DS',
    'ECS',
    'EE',
    'EEE',
    'ETC',
    'IT',
    'MECH',
    'B. Voc.',
    'Computer Network',
    'Data Science',
    'e-Security',
    'Electrical Power & Energy System',
    'Environmental Science and Engineering',
    'Industrial Drives and Control',
    'Instrumentation & Control',
    'Production Engineering',
    'Structural Engineering',
    'MBA',
    'MCA'
]

    
    department_objects = []
    for dept_name in departments_to_create:
        department, created = Department.objects.get_or_create(name=dept_name)
        department_objects.append(department)
        if created:
            print(f'Created department: {dept_name}')

    # --- 2. Create Admin User ---
    admin_username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
    admin_email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'gagansahu55428@gmail.com')
    admin_password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'qr_report')

    if not User.objects.filter(username=admin_username).exists():
        admin_user = User.objects.create(
            username=admin_username,
            email=admin_email,
            password=make_password(admin_password),
            is_superuser=True,
            is_staff=True,
            is_active=True,
            first_name='Admin',
            last_name='User'
        )
        print(f'Created superuser: {admin_username}')

        # --- 3. Create Admin Profile ---
        if department_objects:
            Profile.objects.create(
                user=admin_user,
                department=department_objects[0],
                role='Admin'
            )
            print(f'Created profile for {admin_username}')
    else:
        print(f'Superuser {admin_username} already exists.')


class Migration(migrations.Migration):

    dependencies = [
        ('reports', '0001_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_initial_data),
    ]
