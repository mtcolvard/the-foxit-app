from import_export import resources
from .models import Location

class LocationResource(resources.ModelResource):
    class Meta:
        model = Location
        fields = ('__all__')
        # exclude = ('fuller_information', )
        # fields = ('name',)
