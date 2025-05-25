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

class MovieViewSet(viewsets.ModelViewSet):
    queryset = MovieModel.objects.all()
    serializer_class = MovieSerializer

class MovieCommentViewSet(viewsets.ModelViewSet):
    queryset = MovieCommentModel.objects.all()
    serializer_class = MovieCommentSerializer

class CinemaViewSet(viewsets.ModelViewSet):
    queryset = CinemaModel.objects.all()
    serializer_class = CinemaSerializer

class CinemaRoomViewSet(viewsets.ModelViewSet):
    queryset = CinemaRoomModel.objects.all()
    serializer_class = CinemaRoomSerializer

class FilmSessionViewSet(viewsets.ModelViewSet):
    queryset = FilmSessionModel.objects.all()
    serializer_class = FilmSessionSerializer