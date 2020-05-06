
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

import * as React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import _ from 'lodash'
import '@fortawesome/fontawesome-svg-core'
import '@fortawesome/free-solid-svg-icons'
import '@fortawesome/react-fontawesome'
import 'bulma'
import './style.css'
import MapboxGeocoder from 'mapbox-gl-geocoder'
import mapboxgl from 'mapbox-gl'
import ReactMapboxGl, { Layer, Feature, ZoomControl, Popup, Marker } from 'react-mapbox-gl'
import { svg } from './assets/map-marker-alt-solid.svg'
// import svg from './assets/map-marker-alt-solid.svg'
// import MapboxDirections from '@mapbox/mapbox-gl-directions'

const Map = ReactMapboxGl({
  minZoom: 8,
  maxZoom: 15,
  accessToken: 'pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ'
})
const accessToken = 'pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ'

const startCoordinates = '-0.088817,51.514271'
const endCoordinates = '0.015200,51.574998'

// const mapStyle = {
//   flex: 1
// }
//
// const flyToOptions = {
//   speed: 0.8
// }

const layoutLayer = { 'icon-image': 'foxyMarker' }
//
// // Create an image for the Layer
const image = new Image()
// image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(svg)
image.src = './assets/map-marker-alt-solid.svg' + btoa(svg)
const images = ['foxyMarker', image]



class App extends React.Component {
  constructor() {
    super()
    this.state = {
      fitBounds: undefined,
      center: [-0.109970527, 51.52916347],
      zoom: [11],
      allLocations: [],
      allLocationsCoordinates: null,
      closestLocation: null,
      destinations: null,
      selectedLocation: null
      // durationTimesToDestinationLocations: []
    }
    this.selectLocation = this.selectLocation.bind(this)
    this.onStyleLoad = this.onStyleLoad.bind(this)
    // this.getWalkingRoute = this.getWalkingRoute.bind(this)

    // this.filterToFindClosestLocation = this.filterToFindClosestLocation.bind(this)
  }
  // this.isolateLonLatAndConcat = this.isolateLonLatAndConcat.bind(this)
  // this.fetchLocationsFromDatabase = this.fetchLocationsFromDatabase.bind(this)

  componentDidMount() {
    // THIS GRABS LOCATIONS STORED IN OUR DATABASE
    axios.get('/api/locations/')
      // THIS CREATES A STRING OF LONGITUDE AND LATITUDE WITH MAPBOX MATRIX API GET REQUEST FORMATING
      .then(res => this.setState({
        allLocations: res.data
        // allLocationsCoordinates: res.data.map(({ lon, lat }) => `${lon},${lat}`).join(''),
      }))
      // .then(() => this.filterToFindClosestLocation())
      // .then(() => this.getWalkingRoute())
  }
  // oneLocationCoordinates: res.data[0].map(({ lon, lat }) => `${lon},${lat}`).join('')
  selectLocation(location) {
    return this.setState({ selectedLocation: location,
      center: [location.lon, location.lat],
      zoom: [14]

      // .then(() => this.getWalkingRoute())
    })
  }


  // THIS USES "MAPBOX MATRIX API" TO DETERMINE THE CLOSEST PARK FROM A ARRAY OF LOCATIONS
  // BY FINDING THE INDEX NUMBER OF THE ROUTE WITH THE SHORTEST DURATION IN SECONDS IT THEN CALLS THE COORDINATES OF THAT INDEX.

  // filterToFindClosestLocation() {
  //   return axios.get(`/api/mapbox/matrix/${startCoordinates}${this.state.allLocationsCoordinates}?destinations=12`)
  //     .then(res => {
  //       const closestLocationIdx = _.indexOf(res.data.durations[0], _.min(res.data.durations[0]))
  //       const closestLocation = res.data.destinations[closestLocationIdx].location
  //       return this.setState({ closestLocation })
  //     })
  // }

  // getWalkingRoute() {
  //   // return axios.get(`/api/mapbox/directions/${startCoordinates}${this.state.closestLocation.join(',')}`)
  //   return axios.get(`/api/mapbox/directions/${startCoordinates};${endCoordinates}`)
  //     .then(res => this.setState({ directions: res.data.routes[0].geometry.coordinates }))
  // }

  onStyleLoad(map)  {
    const { onStyleLoad } = this.props

    map.addControl(new MapboxGeocoder({
      accessToken: accessToken,
      marker: {
        color: 'orange'
      },
      ReactMapboxGl: ReactMapboxGl
    }))

    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }))
    // .then(res => this.setState({liveLocation: res.data.features[0].geometry.coordinates}))
    // map.addControl(new MapboxDirections({
    //   accessToken: accessToken,
    //   // marker: {
    //   //   color: 'orange'
    //   // },
    //   ReactMapboxGl: ReactMapboxGl
    // }))
    // map.on('load', function() {
  //   map.loadImage('https://upload.wikimedia.org/wikipedia/commons/5/52/Favicon_MAS.png', function(error, image) {
  //     if (error) throw error
  //     map.addImage('cat', image)
  //     // {this.state.allLocations.map(location =>
  //     //       key=location.id
  //     //       coordinates={[location.lon, location.lat]}
  //     //   )}
  //     this.state.allLocations.map(location =>
  //       map.addLayer(
  //
  //         {
  //           'id': 'points',
  //           'type': 'symbol',
  //           'source': {
  //             'type': 'geojson',
  //             'data': {
  //               'type': 'FeatureCollection',
  //               'features': [{
  //                 'type': 'Feature',
  //                 'geometry': {
  //                   'type': 'Point',
  //                   'coordinates': [location.lon, location.lat]
  //                 }
  //               }]
  //             }
  //           },
  //           'layout': {
  //             'icon-image': 'cat',
  //             'icon-size': 0.1
  //           }
  //         }))
  //   })
  //   // })
    return onStyleLoad && onStyleLoad(map)
  }

  
  bb_coords_NW = [origin[0] - lon_offset, origin[1] + lat_offset]
    bb_coords_NE = [origin[0] + lon_offset, origin[1] + lat_offset]
    bb_coords_SW = [origin[0] - lon_offset, origin[1] - lat_offset]
    bb_coords_SE = [origin[0] + lon_offset, origin[1] - lat_offset]
    print(bb_coords_NE, bb_coords_SE, bb_coords_SW, bb_coords_NW)

    def find_route_waypoints(BoundingBox):
        loop_count = 0

        features_list = [features_list_dict_tower_hamlets['aa'], features_list_dict_tower_hamlets['bb'], features_list_dict_tower_hamlets['cc'], features_list_dict_tower_hamlets['dd'], features_list_dict_tower_hamlets['ee'], features_list_dict_tower_hamlets['ff'], features_list_dict_tower_hamlets['gg'], features_list_dict_tower_hamlets['hh']]

        response = service.matrix(features_list, profile='mapbox/walking', sources=[0, 1], annotations=['distance'])
        data = response.json()

        # calculate the distance to each possible waypoint from both the origin and the destination
        # for each potential waypoint in the features_list, sum its distance from both the origin and the destination and then find the waypoint with the smallest total distance.
        # convert the sum_distances list into a dictionary to keep track of indexes relative to the features_list
        # lets try converting distance from origin into a dictionary, sorting it, and then comparing it to the sum_distances_minus_average to find the lowest value from the set
        distances_from_origin = data['distances'][0]
        distances_from_destination = data['distances'][1]
        sum_distances = list(map(add, distances_from_origin, distances_from_destination))
        average_distance = sum(sum_distances[2::])/(len(sum_distances)-2)

  render() {
    console.log(this.state)
    const { fitBounds, center, zoom } = this.state
    return (
      <body>
        <section className="hero">
          <div className="hero-body">
            <div className="container">
              <h1 className="title is-1 is-primary has-text-weight-bold">FoxyMaps</h1>
            </div>
          </div>
        </section>
        <section>
          <div>
            <div>
              {this.state.allLocations &&
              <Map
                style="mapbox://styles/mtcolvard/ck0wmzhqq0cpu1cqo0uhf1shn"
                onStyleLoad={this.onStyleLoad}
                fitBounds={fitBounds}
                center={center}
                zoom={zoom}
                containerStyle={{
                  height: '100vh',
                  width: '100%'
                }}
              >
                {this.state.allLocations &&
                  <Layer type="symbol" id="marker" layout={layoutLayer} images={images}>
                    {this.state.allLocations.map(location => (
                      <Feature
                        key={location.id}
                        onClick={() => this.selectLocation(location)}
                        coordinates={[location.lon, location.lat]}
                      />
                    ))}
                  </Layer>
                }
                <ZoomControl
                  zoomDiff={3}
                  onControlClick={this._onControlClick}/>
              </Map>
              }
            </div>
          </div>
        </section>
      </body>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
