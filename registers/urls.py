from django.urls import path
from . import views


urlpatterns = [
    path('', views.getRegisters, name="registers"),

    path('student/<str:pk>/', views.getRegistersByStudent,
         name="registers-by-student"),
    path('session/<str:pk>/', views.getRegistersBySession,
         name="registers-by-session"),

    path('create/', views.createRegister, name="register-create"),
    path('<str:pk>/', views.getRegister, name="register"),
    path('<str:pk>/update/', views.updateRegister, name="register-update"),
    path('<str:pk>/delete/', views.deleteRegister, name="register-delete")

]
