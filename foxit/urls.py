from django.urls import path

from .views import LocationList, LocationDetail

urlpatterns = [
    path('locations', LocationList.as_view()),
    path('locations/<int:pk>', LocationDetail.as_view())
]
