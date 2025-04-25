from django.shortcuts import render

# Create your views here.

from django.shortcuts import render
from rest_framework import viewsets
from .models import UserModel, MovieModel, MovieCommentModel
from .serializers import UserSerializer, MovieSerializer, MovieCommentSerializer

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