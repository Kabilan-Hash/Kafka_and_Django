from . import views
from django.urls import path

urlpatterns = [
    path("upload_file/",views.upload_file),
    
]