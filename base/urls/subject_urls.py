from django.urls import path
from base.views import subject_views as views

urlpatterns = [
    path('', views.getSubjects, name="subjects"),
    path('create/', views.createSubject, name="subject-create"),
    path('<str:pk>/update/', views.updateSubject, name="subject-update"),
    path('<str:pk>/delete/', views.deleteSubject, name="subject-delete"),

    path('<str:pk>/', views.getSubject, name="subject"),
]
