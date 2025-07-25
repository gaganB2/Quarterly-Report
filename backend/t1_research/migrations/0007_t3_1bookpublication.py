# Generated by Django 5.2.3 on 2025-07-18 10:00

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('t1_research', '0006_t2_2workshoporganized'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='T3_1BookPublication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('faculty_name', models.CharField(max_length=200)),
                ('book_title', models.CharField(help_text='Title of the Book/Monograph', max_length=255)),
                ('author_type', models.CharField(choices=[('Sole', 'Sole'), ('Co-Author', 'Co-Author')], default='Sole', max_length=20)),
                ('publisher_details', models.TextField(help_text='Publisher with complete address')),
                ('isbn_number', models.CharField(help_text='ISSN/ISBN No.', max_length=50)),
                ('indexing', models.CharField(blank=True, help_text='Scopus/Others', max_length=100)),
                ('publication_year', models.PositiveIntegerField()),
                ('print_mode', models.CharField(choices=[('Hardcopy', 'Hardcopy'), ('E-print', 'E-print'), ('Both', 'Both')], default='Hardcopy', max_length=10)),
                ('book_type', models.CharField(choices=[('National', 'National'), ('International', 'International')], default='National', max_length=15)),
                ('proof_link', models.URLField(blank=True, help_text='Google Drive link to proof')),
                ('quarter', models.CharField(max_length=10)),
                ('year', models.PositiveIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('department', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='t1_research.department')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
