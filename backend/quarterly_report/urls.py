# quarterly_report/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from reports.views import *
from users.views import (
    RegisterUserView, 
    GetUserProfileView, 
    UserManagementViewSet,
    CustomTokenObtainPairView
)
from rest_framework_simplejwt.views import TokenRefreshView

# --- V NEW: IMPORTS FOR API DOCUMENTATION ---
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
# --- ^ END NEW ---


# --- Router for Faculty Data Submissions ---
faculty_router = DefaultRouter()
# (All your faculty router registrations remain unchanged)
faculty_router.register(r't1research', T1ResearchViewSet, basename='t1research')
faculty_router.register(r't1_2research', T1_2ResearchViewSet, basename='t1_2research')
faculty_router.register(r't2_1workshops', T2_1WorkshopAttendanceViewSet, basename='t2_1workshops')
faculty_router.register(r't2_2organized', T2_2WorkshopOrganizedViewSet, basename='t2_2organized')
faculty_router.register(r't3_1books', T3_1BookPublicationViewSet, basename='t3_1books')
faculty_router.register(r't3_2chapters', T3_2ChapterPublicationViewSet, basename='t3_2chapters')
faculty_router.register(r't4_1editorial', T4_1EditorialBoardViewSet, basename='t4_1editorial')
faculty_router.register(r't4_2reviewers', T4_2ReviewerDetailsViewSet, basename='t4_2reviewers')
faculty_router.register(r't4_3committees', T4_3CommitteeMembershipViewSet, basename='t4_3committees')
faculty_router.register(r't5_1patents',   T5_1PatentDetailsViewSet,   basename='t5_1patents')
faculty_router.register(r't5_2sponsored', T5_2SponsoredProjectViewSet, basename='t5_2sponsored')
faculty_router.register(r't5_3consultancy', T5_3ConsultancyProjectViewSet, basename='t5_3consultancy')
faculty_router.register(r't5_4content',   T5_4CourseDevelopmentViewSet,  basename='t5_4content')
faculty_router.register(r't5_5labequipment', T5_5LabEquipmentDevelopmentViewSet, basename='t5_5labequipment')
faculty_router.register(r't5_6research',   T5_6ResearchGuidanceViewSet,   basename='t5_6research')
faculty_router.register(r't6_1certcourses', T6_1CertificationCourseViewSet,   basename='t6_1certcourses')
faculty_router.register(r't6_2professmb',  T6_2ProfessionalBodyMembershipViewSet, basename='t6_2professmb')
faculty_router.register(r't6_3awards',     T6_3AwardViewSet, basename='t6_3awards')
faculty_router.register(r't6_4resource',   T6_4ResourcePersonViewSet,         basename='t6_4resource')
faculty_router.register(r't6_5aicte',      T6_5AICTEInitiativeViewSet,     basename='t6_5aicte')
faculty_router.register(r't7_1programs',   T7_1ProgramOrganizedViewSet,    basename='t7_1programs')
faculty_router.register(r's1_1subjects',   S1_1TheorySubjectDataViewSet,     basename='s1_1subjects')
faculty_router.register(r's2_1articles',   S2_1StudentArticleViewSet,       basename='s2_1articles')
faculty_router.register(r's2_2conferences', S2_2StudentConferencePaperViewSet,    basename='s2_2conferences')
faculty_router.register(r's2_3sponsored',   S2_3StudentSponsoredProjectViewSet, basename='s2_3sponsored')
faculty_router.register(r's3_1competitions', S3_1CompetitionParticipationViewSet, basename='s3_1competitions')
faculty_router.register(r's3_2deptprograms', S3_2DeptProgramViewSet,              basename='s3_2deptprograms')
faculty_router.register(r's4_1examqual',      S4_1StudentExamQualificationViewSet, basename='s4_1examqual')
faculty_router.register(r's4_2campus',   S4_2CampusRecruitmentViewSet,       basename='s4_2campus')
faculty_router.register(r's4_3psu',    S4_3GovtPSUSelectionViewSet,       basename='s4_3psu')
faculty_router.register(r's4_4full', S4_4PlacementHigherStudiesViewSet,    basename='s4_4full')
faculty_router.register(r's5_1certcourses', S5_1StudentCertificationCourseViewSet, basename='s5_1certcourses')
faculty_router.register(r's5_2vocational',  S5_2VocationalTrainingViewSet,      basename='s5_2vocational')
faculty_router.register(r's5_3special',     S5_3SpecialMentionAchievementViewSet, basename='s5_3special')
faculty_router.register(r's5_4entrepreneurs', S5_4StudentEntrepreneurshipViewSet, basename='s5_4entrepreneurs')


# --- Router for Admin Management ---
admin_router = DefaultRouter()
admin_router.register(r'users', UserManagementViewSet, basename='user-management')
admin_router.register(r'departments', DepartmentViewSet, basename='department')

# --- Main URL Patterns ---
urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('api/faculty/', include(faculty_router.urls)),
    path('api/admin/', include(admin_router.urls)),
    path('api/analytics/', include('analytics.urls')),

    # Auth & Profile routes
    path('api/register/', RegisterUserView.as_view(), name='register'),
    path('api/profile/', GetUserProfileView.as_view(), name='profile'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # --- V NEW: API DOCUMENTATION URLS ---
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    # --- ^ END NEW ---
]
