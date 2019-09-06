
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('admin/', include('rest_framework.urls')),
    path('api/', include('foxit.urls')),
    path('', include('frontend.urls'))
]
