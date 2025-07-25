# Generated by Django 5.2.3 on 2025-07-20 16:13

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('t1_research', '0014_t5_3consultancyproject'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='T5_4CourseDevelopment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('faculty_name', models.CharField(max_length=200)),
                ('course_module_name', models.CharField(help_text='Name of the Course/e-content/Laboratory Module Developed', max_length=255)),
                ('platform', models.CharField(help_text='Platform (Moodle, Gsuite, Media Centre, etc.)', max_length=255)),
                ('contributory_institute', models.CharField(blank=True, help_text='Any other Contributory Institute/Industry', max_length=255)),
                ('usage_citation', models.TextField(blank=True, help_text='Usage and Citation etc.')),
                ('amount_spent', models.DecimalField(blank=True, decimal_places=2, help_text='Amount Spent (if any)', max_digits=12, null=True)),
                ('launch_date', models.DateField(blank=True, help_text='Date of Launching Content', null=True)),
                ('link', models.URLField(blank=True, help_text='Google Drive Link or Share Online Content Link')),
                ('quarter', models.CharField(max_length=10)),
                ('year', models.PositiveIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('department', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='t1_research.department')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
