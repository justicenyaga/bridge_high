from django.urls import path
from base.views import session_views as views

urlpatterns = [
    path('', views.getSessions, name="sessions"),
    path('create/', views.createSession, name="session-create"),
    path('<str:pk>/update/', views.updateSession, name="session-update"),
    path('<str:pk>/delete/', views.deleteSession, name="session-delete"),

    path('<str:pk>/', views.getSession, name="session"),
]
