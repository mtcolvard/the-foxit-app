from django.core.management.base import BaseCommand
from bs4 import BeautifulSoup
import urllib.request
from foxit.models import Location

class Command(BaseCommand):

    def scrape_location(self, url):
        x = urllib.request.urlopen(f'http://www.londongardensonline.org.uk/{url}')

        # x = urllib.request.urlopen('http://www.londongardensonline.org.uk/search-advanced-results.php?borough=%25&type=%25&keyword=&Submit=Search')
        # print(x.read())
        soup = BeautifulSoup(x, 'html.parser')
        data = {
            'name': soup.title.string,
            'endname': soup.title.string,
            'endcoord': soup.title.string,
            'lat': 51.5555,
            'lon': 0.0000
        }

        location = Location(**data)
        location.save()


    def handle(self, *_args, **_options):

        x = urllib.request.urlopen('http://www.londongardensonline.org.uk/search-advanced-results.php?borough=%25&type=%25&keyword=&Submit=Search')

        soup = BeautifulSoup(x, 'html.parser')

        for link in soup.nav.find_all('a'):
            href = link.get('href')
            self.scrape_location(href)
