from django.urls import path
from . import views


urlpatterns = [
    path('all/', views.getSchoolResults, name="all-results"),

    path('', views.getResults, name="results"),

    path('create/', views.createResult, name="result-create"),

    path('<str:pk>/', views.getResult, name="result"),

    path('class/<str:pk>/<str:sn>/', views.getClassResults, name="class-results"),

    path('student/<str:pk>/', views.getStudentResults, name="student-results"),
    path('student/<str:pk>/<str:cls>/',
         views.getStudentYearResults, name="student-year-results"),
    path('student/<str:pk>/<str:cls>/<str:tm>/',
         views.getStudentTermResults, name="student-term-results"),
]
