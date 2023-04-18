from django.urls import path
from base.views import user_views as views

urlpatterns = [
    path('', views.getUsers, name='users'),

    path('login/', views.MyTokenObtainPairView.as_view(),
         name='token-obtain-pair'),
    path('register/', views.registerUser, name='register'),
    path('profile/', views.getUserProfile, name='user-profile'),
    path('profile/update/', views.updateUserProfile, name='users-profile-update'),
    path('reset-password/', views.resetPassword, name='reset-password'),

    path('<str:pk>/', views.getUserById, name='user'),
    path('<str:pk>/update/', views.updateUser, name='user-update'),
    path('<str:pk>/delete/', views.deleteUser, name='user-delete'),
    path('<str:pk>/details/', views.getUserDetails, name='user-details'),
]
