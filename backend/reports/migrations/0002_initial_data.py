# reports/migrations/0002_initial_data.py

from django.db import migrations

def create_initial_departments(apps, schema_editor):
    """
    Creates the initial data for the application, consisting only of the
    pre-defined academic departments.
    
    Superuser creation is now handled manually via the `createsuperuser` command
    for better security practice.
    """
    Department = apps.get_model('reports', 'Department')

    # --- Create Departments ---
    departments_to_create = [
        'B. Tech.', 'CIVIL', 'CSE', 'CSE-AI', 'CSE-DS', 'ECS', 'EE', 'EEE', 
        'ETC', 'IT', 'MECH', 'B. Voc.', 'Computer Network', 'Data Science', 
        'e-Security', 'Electrical Power & Energy System', 
        'Environmental Science and Engineering', 'Industrial Drives and Control', 
        'Instrumentation & Control', 'Production Engineering', 
        'Structural Engineering', 'MBA', 'MCA'
    ]
    
    for dept_name in departments_to_create:
        Department.objects.get_or_create(name=dept_name)
    
    print(f"Created/verified {len(departments_to_create)} initial departments.")


class Migration(migrations.Migration):

    dependencies = [
        ('reports', '0001_initial'),
        # The dependency on the users app is no longer strictly necessary
        # as we are not creating a Profile, but it's harmless to leave.
        ('users', '0001_initial'), 
    ]

    operations = [
        migrations.RunPython(create_initial_departments),
    ]
