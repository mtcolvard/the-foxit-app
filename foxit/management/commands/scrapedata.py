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

        citymapper_href = soup.find(id='basic').a.get('href')
        citymapper_href_edit1 = citymapper_href.replace('http://citymapper.com/directions?endcoord=', '')
        sep = '&'
        citymapper_href_edit2 = (citymapper_href_edit1.split(sep, 1)[0]).split(',')
        citymapper_href_edit3 = [float(i) for i in citymapper_href_edit2]
        citymapper_href_edit3.reverse()
        citymapper_lon = citymapper_href_edit3.pop(0)
        citymapper_lat = citymapper_href_edit3.pop(0)
        citymapper_href_edit4 = f'{citymapper_lon},{citymapper_lat}'

        if soup.find(id='photos') == None:
            image_formatted = 'http://www.londongardensonline.org.uk/images/sitepics/THM033-site.jpg'
        else:
            image = ([str(soup.find(id='photos').img)].pop().split('src="', 1)[1]).replace('"/>','')
            image_formatted = ''.join(['http://www.londongardensonline.org.uk/', image])

        data = {
            'name': soup.title.string,
            'summary': soup.find(id='summary').p.string,
            'previous_name': soup.find(id='basic').select("dt ~ dd:nth-of-type(1)")[0].string,
            'site_location': soup.find(id='basic').select("dt ~ dd:nth-of-type(2)")[0].string,
            'postcode': soup.find(id='basic').select("dt ~ dd:nth-of-type(3)")[0].string.rstrip(),
            'type_of_site': soup.find(id='basic').select("dt ~ dd:nth-of-type(4)")[0].string,
            'date': soup.find(id='basic').select("dt ~ dd:nth-of-type(5)")[0].string,
            'designer': soup.find(id='basic').select("dt ~ dd:nth-of-type(6)")[0].string,
            'listed_structures': soup.find(id='basic').select("dt ~ dd:nth-of-type(7)")[0].string,
            'borough': soup.find(id='basic').select("dt ~ dd:nth-of-type(8)")[0].string,
            'site_ownership': soup.find(id='basic').select("dt ~ dd:nth-of-type(9)")[0].string,
            'site_management': soup.find(id='basic').select("dt ~ dd:nth-of-type(10)")[0].string,
            'open_to_public': soup.find(id='basic').select("dt ~ dd:nth-of-type(11)")[0].string,
            'opening_times': soup.find(id='basic').select("dt ~ dd:nth-of-type(12)")[0].string,
        # 'special_conditions' is returning the entry for 'facilities' because special conditions has no elements in its <dd></dd> tags so its moving on to the next <dd> which is 'facilities'
            'special_conditions': soup.find(id='basic').select("dt ~ dd:nth-of-type(13)")[0].string,
            # 'facilities': soup.find(id='basic').select("dt ~ dd:nth-of-type(14)")[0].string,
        # the only reason ("dt > dd")[1] works ... it shouldn't ...is because of an error in London Park's html. 'events' doesn't close out the <dt> tag so i think soup is parsing the tree as if everything following it is a 'dt' which is a child of a 'dt'
            'public_transportation': soup.find(id='basic').select("dt > dd")[1].string,
            'lon_lat': citymapper_href_edit4,
            'lon': citymapper_lon,
            'lat': citymapper_lat,
            'grid_reference': soup.find(id='further').select("dt ~ dd:nth-of-type(1)")[0].string.rstrip(),
            'size_in_hectares': soup.find(id='further').select("dt ~ dd:nth-of-type(2)")[0].string,
            'image': image_formatted,
            'fuller_information': soup.find(id='fuller').p.get_text(),
            # 'sources_consulted': soup.find(id='fuller').select("section > p")[1].string,
        }

        location = Location(**data)
        location.save()


    def handle(self, *_args, **_options):

        x = urllib.request.urlopen('http://www.londongardensonline.org.uk/search-advanced-results.php?type=%25&keyword=&borough=%25&offset=2400')

        soup = BeautifulSoup(x, 'html.parser')

        for link in soup.nav.find_all('a'):
            href = link.get('href')
            self.scrape_location(href)
