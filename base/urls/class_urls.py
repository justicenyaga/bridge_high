from django.urls import path
from base.views import class_views as views
from students.views import getSelectedSubjectsClass, getSelectedT4Class

urlpatterns = [
    path('', views.getClasses, name="classes"),
    path('create/', views.createClass, name="class-create"),
    path('streams/', views.getStreams, name="streams"),
    path('<str:pk>/', views.getClass, name="class"),
    path('<str:pk>/update/', views.updateClass, name="class-update"),
    path('<str:pk>/delete/', views.deleteClass, name="class-delete"),

    path('streams/create/', views.createStream, name="stream-create"),
    path('streams/<str:pk>/update/', views.updateStream, name="stream-update"),
    path('streams/<str:pk>/delete/', views.deleteStream, name="stream-delete"),
    path('streams/<str:pk>/', views.getStream, name="stream"),


    path('<str:pk>/selected-t4/', getSelectedT4Class, name="selected-t4"),
    path('<str:pk>/selected-subjects/',
         getSelectedSubjectsClass, name="selected-subjects"),
]
