from django.urls import path
from base.views import dept_views as views

urlpatterns = [
    path('', views.getDepartments, name="departments"),
    path('create/', views.createDepartment, name="department-create"),
    path('<str:pk>/update/', views.updateDepartment, name="department-update"),
    path('<str:pk>/delete/', views.deleteDepartment, name="department-delete"),

    path('<str:pk>/', views.getDepartment, name="department"),
]
