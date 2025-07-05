from rest_framework import serializers
from .models import (UserModel, MovieModel, MovieCommentModel,
                     CinemaModel, CinemaRoomModel, FilmSessionModel,
                     FilmTicketModel, CinemaComingSoonModel)

class UserSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = UserModel
        fields = "__all__"

class MovieSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = MovieModel
        fields = "__all__"

class MovieCommentSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = MovieCommentModel
        fields = "__all__"

class CinemaSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = CinemaModel
        fields = "__all__"

class CinemaRoomSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = CinemaRoomModel
        fields = "__all__"

class FilmSessionSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    roomNumber = serializers.ReadOnlyField(source='roomId.number', read_only=True)
    class Meta:
        model = FilmSessionModel
        fields = "__all__"

class FilmTicketSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    roomNumber = serializers.ReadOnlyField(source='filmSessionId.roomId.number', read_only=True)
    class Meta:
        model = FilmTicketModel
        fields = "__all__"

class CinemaComingSoonSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = CinemaComingSoonModel
        fields = "__all__"