from django.contrib import admin
from .models import UserModel, MovieModel, MovieCommentModel, CinemaModel, CinemaRoomModel

# Register your models here.

admin.site.register(UserModel)
admin.site.register(MovieModel)
admin.site.register(MovieCommentModel)
admin.site.register(CinemaModel)
admin.site.register(CinemaRoomModel)