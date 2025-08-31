# quarterly_report/urls.py

from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import RedirectView
from rest_framework.routers import DefaultRouter, SimpleRouter
from reports.views import *
from users.views import (
    RegisterUserView, 
    StudentRegisterView,
    GetUserProfileView, 
    UserManagementViewSet,
    CustomTokenObtainPairView,
    VerifyEmailView,
    SetInitialPasswordView,
    RequestPasswordResetView,
    ConfirmPasswordResetView,
)
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


# --- Router for Faculty & Student Data Submissions ---
data_router = DefaultRouter()
data_router.register(r't1research', T1ResearchViewSet, basename='t1research')
data_router.register(r't1_2research', T1_2ResearchViewSet, basename='t1_2research')
data_router.register(r't2_1workshops', T2_1WorkshopAttendanceViewSet, basename='t2_1workshops')
data_router.register(r't2_2organized', T2_2WorkshopOrganizedViewSet, basename='t2_2organized')
data_router.register(r't3_1books', T3_1BookPublicationViewSet, basename='t3_1books')
data_router.register(r't3_2chapters', T3_2ChapterPublicationViewSet, basename='t3_2chapters')
data_router.register(r't4_1editorial', T4_1EditorialBoardViewSet, basename='t4_1editorial')
data_router.register(r't4_2reviewers', T4_2ReviewerDetailsViewSet, basename='t4_2reviewers')
data_router.register(r't4_3committees', T4_3CommitteeMembershipViewSet, basename='t4_3committees')
data_router.register(r't5_1patents',   T5_1PatentDetailsViewSet,   basename='t5_1patents')
data_router.register(r't5_2sponsored', T5_2SponsoredProjectViewSet, basename='t5_2sponsored')
data_router.register(r't5_3consultancy', T5_3ConsultancyProjectViewSet, basename='t5_3consultancy')
data_router.register(r't5_4content',   T5_4CourseDevelopmentViewSet,  basename='t5_4content')
data_router.register(r't5_5labequipment', T5_5LabEquipmentDevelopmentViewSet, basename='t5_5labequipment')
data_router.register(r't5_6research',   T5_6ResearchGuidanceViewSet,   basename='t5_6research')
data_router.register(r't6_1certcourses', T6_1CertificationCourseViewSet,   basename='t6_1certcourses')
data_router.register(r't6_2professmb',  T6_2ProfessionalBodyMembershipViewSet, basename='t6_2professmb')
data_router.register(r't6_3awards',     T6_3AwardViewSet, basename='t6_3awards')
data_router.register(r't6_4resource',   T6_4ResourcePersonViewSet,         basename='t6_4resource')
data_router.register(r't6_5aicte',      T6_5AICTEInitiativeViewSet,     basename='t6_5aicte')
data_router.register(r't7_1programs',   T7_1ProgramOrganizedViewSet,    basename='t7_1programs')
data_router.register(r's1_1subjects',   S1_1TheorySubjectDataViewSet,     basename='s1_1subjects')
data_router.register(r's2_1articles',   S2_1StudentArticleViewSet,       basename='s2_1articles')
data_router.register(r's2_2conferences', S2_2StudentConferencePaperViewSet,    basename='s2_2conferences')
data_router.register(r's2_3sponsored',   S2_3StudentSponsoredProjectViewSet, basename='s2_3sponsored')
data_router.register(r's3_1competitions', S3_1CompetitionParticipationViewSet, basename='s3_1competitions')
data_router.register(r's3_2deptprograms', S3_2DeptProgramViewSet,              basename='s3_2deptprograms')
data_router.register(r's4_1examqual',      S4_1StudentExamQualificationViewSet, basename='s4_1examqual')
data_router.register(r's4_2campus',   S4_2CampusRecruitmentViewSet,       basename='s4_2campus')
data_router.register(r's4_3psu',    S4_3GovtPSUSelectionViewSet,       basename='s4_3psu')
data_router.register(r's4_4full', S4_4PlacementHigherStudiesViewSet,    basename='s4_4full')
data_router.register(r's5_1certcourses', S5_1StudentCertificationCourseViewSet, basename='s5_1certcourses')
data_router.register(r's5_2vocational',  S5_2VocationalTrainingViewSet,      basename='s5_2vocational')
data_router.register(r's5_3special',     S5_3SpecialMentionAchievementViewSet, basename='s5_3special')
data_router.register(r's5_4entrepreneurs', S5_4StudentEntrepreneurshipViewSet, basename='s5_4entrepreneurs')


# --- Router for Admin Management ---
admin_router = DefaultRouter()
admin_router.register(r'users', UserManagementViewSet, basename='user-management')
admin_router.register(r'departments', DepartmentViewSet, basename='department')

# --- Router for Public Data ---
public_router = DefaultRouter()
public_router.register(r'departments', PublicDepartmentListViewSet, basename='public-department')


# --- Main URL Patterns ---
urlpatterns = [
    path('', RedirectView.as_view(url='/api/schema/swagger-ui/', permanent=False), name='index'),
    path('admin/', admin.site.urls),
    path('api/data/', include(data_router.urls)),
    path('api/admin/', include(admin_router.urls)),
    path('api/public/', include(public_router.urls)),
    path('api/analytics/', include('analytics.urls')),
    path('api/reports/counts/', ReportCountsView.as_view(), name='report-counts'),

    # --- NEW: URL for Excel Imports ---
    path('api/import/<str:model_name>/', ExcelImportView.as_view(), name='excel-import'),

    # Auth & Profile routes
    path('api/register/', RegisterUserView.as_view(), name='register'),
    path('api/student/register/', StudentRegisterView.as_view(), name='student-register'),
    path('api/profile/', GetUserProfileView.as_view(), name='profile'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('api/set-password/', SetInitialPasswordView.as_view(), name='set-initial-password'),
    path('api/password-reset/request/', RequestPasswordResetView.as_view(), name='password-reset-request'),
    path('api/password-reset/confirm/', ConfirmPasswordResetView.as_view(), name='password-reset-confirm'),

    # API DOCUMENTATION URLS
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]