from rest_framework import serializers
from .models import UserModel, MovieModel, MovieCommentModel, CinemaModel, CinemaRoomModel, FilmSessionModel

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UserModel
        fields = [
            "id",
            "name",
            "password",
            "admin",
            "cinemaAdmin"
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

class CinemaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CinemaModel
        fields = [
            "id",
            "name"
        ]

class CinemaRoomSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CinemaRoomModel
        fields = [
            "id",
            "cinemaId",
            "defaultSeats",
        ]

class FilmSessionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = FilmSessionModel
        fields = [
            "id",
            "roomId",
            "film",
            "sessionTime",
            "seats"
        ]