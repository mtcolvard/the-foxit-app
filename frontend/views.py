import os
from django.views.generic import View
from django.http import HttpResponse, HttpResponseNotFound

# Create your views here
# os.path.join('a', 'b', 'c') => /a/b/c
#os.pathdirname(__file__) => /Users/development.CLASSWORK/...
# whenever you get a request for the frontend send index.html
class Home(View):
    def get(self, _request):
        with open(os.path.join(os.path.dirname(__file__), 'dist', 'index.html')) as file:
            return HttpResponse(file.read())

#request to client for forexample /bundle.js
#if it is a file, send a file, if not send 404
class Assets(View):

    def get(self, _request, filename):
        path = os.path.join(os.path.dirname(__file__), 'dist', filename)

        if os.path.isfile(path):
            with open(path) as file:
                return HttpResponse(file.read())
        else:
            return HttpResponseNotFound()
