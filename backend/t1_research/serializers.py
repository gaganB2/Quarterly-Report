from rest_framework import serializers
from .models import T1_ResearchArticle, Department

class T1ResearchArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = T1_ResearchArticle
        fields = [
            'id',
            'user',
            'department',
            'title',
            'journal_name',
            'publication_date',
            'issn_number',
            'impact_factor',
            'internal_authors',
            'external_authors',
            'indexing_wos',
            'indexing_scopus',
            'indexing_ugc',
            'indexing_other',
            'document_link',
            'quarter',
            'year',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['user', 'department', 'created_at', 'updated_at']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'
