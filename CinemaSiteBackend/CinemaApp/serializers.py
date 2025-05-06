from rest_framework import serializers
from .models import UserModel, MovieModel, MovieCommentModel

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UserModel
        fields = [
            "id",
            "name",
            "password",
            "admin"
        ]

class MovieSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MovieModel
        fields = [
            "id",
            "name",
            "description",
            "ageRating",
            "publishYear",
            "language",
            "studio",
            "duration",
            "director",
            "scenarist",
            "production",
            "poster",
            "rating"
        ]

class MovieCommentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MovieCommentModel
        fields = [
            "id",
            "movieId",
            "userId",
            "name",
            "description",
            "rating"
        ]