from django.urls import path
from base.views import grading_system_views as views

urlpatterns = [
    path("", views.getGradingSystems, name="grading-systems"),
    path("create/", views.createGradingSystem, name="grading-system-create"),
    path("<str:pk>/update/", views.updateGradingSystem,
         name="grading-system-update"),
    path("<str:pk>/delete/", views.deleteGradingSystem,
         name="grading-system-delete"),

    path("<str:pk>/", views.getGradingSystem, name="grading-system"),
]
