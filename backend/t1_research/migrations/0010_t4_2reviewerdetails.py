# Generated by Django 5.2.3 on 2025-07-20 15:25

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('t1_research', '0009_t4_1editorialboard'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='T4_2ReviewerDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('faculty_name', models.CharField(max_length=200)),
                ('publication_type', models.CharField(choices=[('Journal', 'Journal'), ('Conference', 'Conference'), ('Book', 'Book'), ('Other', 'Other')], max_length=20, verbose_name='Journal/Conference/Book etc.')),
                ('title', models.CharField(help_text='Title of the Journal/Conference/Book', max_length=255)),
                ('indexing', models.CharField(choices=[('SCI', 'SCI'), ('Scopus', 'Scopus'), ('UGC CARE', 'UGC CARE'), ('Others', 'Others')], max_length=20)),
                ('issn_isbn', models.CharField(max_length=50, verbose_name='ISSN/ISBN No.')),
                ('publisher', models.CharField(max_length=255)),
                ('year', models.PositiveIntegerField()),
                ('type', models.CharField(choices=[('National', 'National'), ('International', 'International')], max_length=20, verbose_name='Type (National/International)')),
                ('proof_link', models.URLField(blank=True, verbose_name='Google Drive Link (Upload Proof)')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('department', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='t1_research.department')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
