from django.urls import path
from . import views


urlpatterns = [
    path('', views.getTeachers, name="teachers"),
    path('create/', views.createTeacher, name="teacher-create"),
    path('upload-passport/', views.uploadPassport,
         name="teacher-upload-passport"),

    path('class-teachers/', views.getClassTeachers, name="class-teachers"),
    path('class-teachers/create/', views.createClassTeacher,
         name="class-teacher-create"),
    path('class-teachers/<str:pk>/', views.getClassTeacher,
         name="class-teacher"),
    path('class-teachers/teacher/<str:pk>/',
         views.getClassTeacherByTeacherId, name="class-teacher-by-teacher-id"),
    path('class-teachers/<str:pk>/update/',
         views.updateClassTeacher, name="class-teacher-update"),
    path('class-teachers/<str:pk>/delete/',
         views.deleteClassTeacher, name="class-teacher-delete"),

    path('<str:pk>/update/', views.updateTeacher, name="teacher-update"),
    path('<str:pk>/delete/', views.deleteTeacher, name="teacher-delete"),

    path('<str:pk>/subjects/', views.getSubjectsAssignedToTeacher,
         name="subjects-assigned-to-teacher"),

    path('<str:pk>/', views.getTeacher, name="teacher"),
]
