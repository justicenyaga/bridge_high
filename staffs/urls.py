from django.urls import path
from . import views


urlpatterns = [
    path('', views.getAdmins, name="admins"),
    path('create/', views.createAdmin, name="admin-create"),
    path('upload-passport/', views.uploadPassport, name="admin-upload-passport"),
    path('<str:pk>/update/', views.updateAdmin, name="admin-update"),
    path('<str:pk>/delete/', views.deleteAdmin, name="admin-delete"),

    path('<str:pk>/', views.getAdmin, name="admin"),
]
