from django.urls import path, include
from . import views
from .views import (UserViewSet, MovieViewSet, MovieCommentViewSet,
                    CinemaViewSet, CinemaRoomViewSet, FilmSessionViewSet,
                    FilmTicketViewSet, CinemaComingSoonViewSet)
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"movies", MovieViewSet)
router.register(r"comments", MovieCommentViewSet)
router.register(r"cinemas", CinemaViewSet)
router.register(r"cinemaRooms", CinemaRoomViewSet)
router.register(r"cinemaComingSoonFilms", CinemaComingSoonViewSet)
router.register(r"filmSessions", FilmSessionViewSet)
router.register(r"filmTickets", FilmTicketViewSet)

urlpatterns = [
    path("", include(router.urls)),
]