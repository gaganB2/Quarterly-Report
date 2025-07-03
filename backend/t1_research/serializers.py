from rest_framework import serializers
from .models import T1_ResearchArticle, Department

class T1ResearchArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = T1_ResearchArticle
        fields = '__all__'
        read_only_fields = ['user', 'department']  # ✅ Auto-filled in perform_create()

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'
