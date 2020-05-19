from django.urls import path

from .views import LocationList, LocationDetail, BoundingBox, MapMatrixView, MapDirectionsView, MapGeocoderView

urlpatterns = [
    path('locations/', LocationList.as_view()),
    path('locations/<int:pk>', LocationDetail.as_view()),
    path('boundingbox/<currentWaypoint>/<bbwidth>', BoundingBox.as_view()),
    path('mapbox/matrix/<coords>', MapMatrixView.as_view()),
    path('mapbox/directions/<coords>', MapDirectionsView.as_view()),
    path('mapbox/geocoder/<searchQuery>', MapGeocoderView.as_view())
]
