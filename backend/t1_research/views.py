from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import T1_ResearchArticle, Department
from .serializers import T1ResearchArticleSerializer, DepartmentSerializer
from users.models import Profile

class T1ResearchViewSet(viewsets.ModelViewSet):
    serializer_class = T1ResearchArticleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        profile = Profile.objects.get(user=user)

        if profile.role == 'Admin':
            return T1_ResearchArticle.objects.all()
        elif profile.role == 'HOD':
            return T1_ResearchArticle.objects.filter(department=profile.department)
        return T1_ResearchArticle.objects.filter(user=user)

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(user=self.request.user, department=profile.department)

    def perform_update(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        if profile.role == 'Faculty' and serializer.instance.user != self.request.user:
            raise PermissionDenied("You can only edit your own submissions.")
        serializer.save()

    def perform_destroy(self, instance):
        profile = Profile.objects.get(user=self.request.user)
        if profile.role == 'Faculty' and instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own submissions.")
        instance.delete()

# ✅ THIS was missing — required by urls.py
class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]
