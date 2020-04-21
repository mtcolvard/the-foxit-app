from django.urls import path

from .views import LocationList, LocationDetail, MapMatrixView, MapDirectionsView, BoundingBox

urlpatterns = [
    path('locations/', LocationList.as_view()),
    path('locations/<int:pk>', LocationDetail.as_view()),
    path('boundingbox/', BoundingBox.as_view()),
    path('mapbox/matrix/<coords>', MapMatrixView.as_view()),
    path('mapbox/directions/<coords>', MapDirectionsView.as_view()),
]
