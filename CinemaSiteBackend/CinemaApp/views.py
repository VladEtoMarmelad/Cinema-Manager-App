from django.shortcuts import render

# Create your views here.

from django.shortcuts import render
from rest_framework import viewsets
from .models import (UserModel, MovieModel, MovieCommentModel,
                     CinemaModel, CinemaRoomModel, FilmSessionModel,
                     FilmTicketModel)
from .serializers import (UserSerializer, MovieSerializer, MovieCommentSerializer,
                          CinemaSerializer, CinemaRoomSerializer, FilmSessionSerializer,
                          FilmTicketSerializer)

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = UserModel.objects.all()
        name = self.request.query_params.get("name")
        email = self.request.query_params.get("email")

        if (name):
            queryset = queryset.filter(name=name)
        if (email):
            queryset = queryset.filter(email=email)
        return queryset

class MovieViewSet(viewsets.ModelViewSet):
    queryset = MovieModel.objects.all()
    serializer_class = MovieSerializer

    def get_queryset(self):
        queryset = MovieModel.objects.all()
        name = self.request.query_params.get("name")
        queryset_length = self.request.query_params.get("amount")

        def isInclude(value):
            value = vars(value)["name"].lower()
            index = value.find(name)

            if (index != -1):
                return True
            else:
                return False

        if (queryset_length):
            if (name != "false"): #поиск по названию
                name = name.lower()
                queryset = filter(isInclude, queryset)
                queryset = list(queryset)
                queryset = queryset[:int(queryset_length)]
            else: #поиск последних queryset_length фильмов
                queryset = queryset.order_by("-id")
                queryset = queryset[:int(queryset_length)]
        return queryset

class MovieCommentViewSet(viewsets.ModelViewSet):
    queryset = MovieCommentModel.objects.all()
    serializer_class = MovieCommentSerializer

    def get_queryset(self):
        queryset = MovieCommentModel.objects.all()
        movieId = self.request.query_params.get("movieId")

        if (movieId):
            queryset = queryset.filter(movieId=movieId)
        return queryset

class CinemaViewSet(viewsets.ModelViewSet):
    queryset = CinemaModel.objects.all()
    serializer_class = CinemaSerializer

class CinemaRoomViewSet(viewsets.ModelViewSet):
    queryset = CinemaRoomModel.objects.all()
    serializer_class = CinemaRoomSerializer

    def get_queryset(self):
        queryset = CinemaRoomModel.objects.all()
        cinemaId = self.request.query_params.get("cinemaId")

        if (cinemaId):
            queryset = queryset.filter(cinemaId=cinemaId)
        return queryset

class FilmSessionViewSet(viewsets.ModelViewSet):
    queryset = FilmSessionModel.objects.all()
    serializer_class = FilmSessionSerializer

    def get_queryset(self):
        queryset = FilmSessionModel.objects.all()
        cinemaId = self.request.query_params.get("cinemaId")
        filmId = self.request.query_params.get("filmId")

        if (cinemaId):
            queryset = queryset.filter(cinemaId=cinemaId)
        if (filmId):
            queryset = queryset.filter(film=filmId)
        return queryset

class FilmTicketViewSet(viewsets.ModelViewSet):
    queryset = FilmTicketModel.objects.all()
    serializer_class = FilmTicketSerializer

    def get_queryset(self):
        queryset = FilmTicketModel.objects.all()
        userId = self.request.query_params.get("userId")
        if (userId):
            queryset = queryset.filter(userId = userId)
        return queryset
