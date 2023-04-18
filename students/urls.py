from django.urls import path
from . import views


urlpatterns = [
    path('', views.getStudents, name="students"),
    path('create/', views.createStudent, name="create-student"),
    path('upload-passport/', views.uploadPassport,
         name="student-upload-passport"),

    path('all/selected-t4', views.getAllStudentsSelectedT4,
         name="all-students-selected-t4"),
    path('all/selected-subjects', views.getAllStudentsSelectedSubjects,
         name="all-students-selected-subjects"),

    path('<str:pk>/', views.getStudent, name="student"),
    path('<str:pk>/update/', views.updateStudent, name="update-student"),
    path('<str:pk>/delete/', views.deleteStudent, name="delete-student"),


    path('<str:pk>/select-t4/', views.selectT4, name="select-t4"),
    path('<str:pk>/drop-subjects/', views.dropSubjects, name="drop-subjects"),
    path('<str:pk>/selected-t4/', views.getSelectedT4, name="selected-t4"),
    path('<str:pk>/selected-subjects/',
         views.getSelectedSubjects, name="selected-subjects"),
]
