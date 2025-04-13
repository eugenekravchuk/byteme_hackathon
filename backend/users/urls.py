from django.urls import path
from .views import ProfileView, RegisterView

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='user-profile'),
    path('register/', RegisterView.as_view(), name='register'),
]
