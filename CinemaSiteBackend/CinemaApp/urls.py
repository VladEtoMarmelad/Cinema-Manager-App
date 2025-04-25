from django.urls import path, include
from . import views
from .views import UserViewSet, MovieViewSet, MovieCommentViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"movies", MovieViewSet)
router.register(r"comments", MovieCommentViewSet)

urlpatterns = [
    path("", include(router.urls)),
]