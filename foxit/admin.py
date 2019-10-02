from import_export.admin import ImportExportModelAdmin
from django.contrib import admin
from .models import Location

# Register your models here.
# admin.site.register(Location)

@admin.register(Location)
class LocationAdmin(ImportExportModelAdmin):
    class Meta:
        model = Location
        exclude = ('fuller_information', )

    # pass
