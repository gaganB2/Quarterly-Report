# reports/permissions.py

from rest_framework.permissions import BasePermission
from users.models import Profile

class IsStudent(BasePermission):
    """
    Custom permission to only allow users with the 'Student' role.
    """
    message = "You do not have permission to perform this action as you are not a student."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            return request.user.profile.role == Profile.Role.STUDENT
        except Profile.DoesNotExist:
            return False

class IsNotStudent(BasePermission):
    """
    Custom permission to allow any authenticated user EXCEPT those with the 'Student' role.
    This is used to protect endpoints intended for Faculty, HODs, and Admins.
    """
    message = "Students do not have permission to perform this action."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            return request.user.profile.role != Profile.Role.STUDENT
        except Profile.DoesNotExist:
            return False

