from django.urls import path
from base.views import exam_views as views

urlpatterns = [
    path('', views.getExams, name="exams"),
    path('create/', views.createExam, name="exam-create"),
    path('<str:pk>/update/', views.updateExam, name="exam-update"),
    path('<str:pk>/delete/', views.deleteExam, name="exam-delete"),

    path('<str:pk>/', views.getExam, name="exam"),
]
