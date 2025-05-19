from django.db import models

# Create your models here.

class CinemaModel(models.Model):
    id = models.BigAutoField(primary_key=True)

    name = models.CharField(max_length=100)

class UserModel(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    password = models.CharField(default="12345", max_length=100)

    admin = models.BooleanField(default=False)

    cinemaAdmin = models.ForeignKey(CinemaModel, on_delete=models.RESTRICT, null=True)

class MovieModel(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(default="Описсание не указано")
    ageRating = models.PositiveIntegerField(default=18)
    publishYear = models.PositiveIntegerField(default=2025)
    language = models.CharField(default="Англиский", max_length=50)
    studio = models.CharField(default="Студия не указана", max_length=50)
    duration = models.CharField(default="Длительность сеанса не указана", max_length=5) #nH:nM nM<60
    director = models.CharField(default="Режиссер не указан", max_length=50)
    scenarist = models.CharField(default="Сценарист не указан", max_length=50)
    production = models.CharField(default="Страна производителя не указана", max_length=50)
    poster = models.ImageField(upload_to="images/posters/", default="images/posters/default.PNG")
    rating = models.PositiveIntegerField(default=1)

    def __str__(self):
        return self.name

class MovieCommentModel(models.Model):
    id = models.BigAutoField(primary_key=True)
    movieId = models.ForeignKey(MovieModel, on_delete=models.CASCADE, related_name="comment")
    userId = models.ForeignKey(UserModel, on_delete=models.CASCADE, default=1)

    name = models.CharField(max_length=100)
    description = models.TextField()
    rating = models.PositiveIntegerField(default=1)

    def __str__(self):
        return self.name


class CinemaRoomModel(models.Model):
    id = models.BigAutoField(primary_key=True)
    cinemaId = models.ForeignKey(CinemaModel, on_delete=models.CASCADE)

    nextFilm = models.ForeignKey(MovieModel, on_delete=models.RESTRICT, null=True)
    nextFilmTime = models.DateTimeField(null=True)

    seats = models.JSONField(default=dict)