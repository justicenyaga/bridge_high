from django.urls import path
from base.views import term_views as views

urlpatterns = [
    path('', views.getTerms, name="terms"),
    path('create/', views.createTerm, name="term-create"),
    path("<str:pk>/update/", views.updateTerm, name="term-update"),
    path("<str:pk>/delete/", views.deleteTerm, name="term-delete"),

    path('<str:pk>/', views.getTerm, name="term"),
]
