from mapbox import Geocoder

class MapGeocoderView:
    address = "Paris"
    geocoder = Geocoder(access_token='pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ')
    response = geocoder.forward(address)
    data = response.json()
    print(data)

def main():
    query1 = GeocoderView()

if __name__ == "__main__":
    main()
