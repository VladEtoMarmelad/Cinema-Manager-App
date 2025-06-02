from django.shortcuts import render

# Create your views here.

from django.shortcuts import render
from rest_framework import viewsets
from .models import UserModel, MovieModel, MovieCommentModel, CinemaModel, CinemaRoomModel, FilmSessionModel
from .serializers import UserSerializer, MovieSerializer, MovieCommentSerializer, CinemaSerializer, CinemaRoomSerializer, FilmSessionSerializer

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = UserModel.objects.all()
        name = self.request.query_params.get("name")

        if (name):
            queryset = queryset.filter(name=name)
        return queryset

class MovieViewSet(viewsets.ModelViewSet):
    queryset = MovieModel.objects.all()
    serializer_class = MovieSerializer

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
        if (cinemaId):
            queryset = queryset.filter(cinemaId=cinemaId)
        return queryset