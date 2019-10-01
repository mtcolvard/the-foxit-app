// +++++++++++++++++++++++++++++++++++++++++++++++++++++++


import * as React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import _ from 'lodash'
import '@fortawesome/fontawesome-svg-core'
import '@fortawesome/free-solid-svg-icons'
import '@fortawesome/react-fontawesome'
import 'bulma'
import './style.scss'
import MapboxGeocoder from 'mapbox-gl-geocoder'
import mapboxgl from 'mapbox-gl'
import ReactMapboxGl, { Layer, Feature, ZoomControl, Popup, Marker } from 'react-mapbox-gl'
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

// const layoutLayer = { 'icon-image': 'foxyMarker' }
//
// // Create an image for the Layer
// const image ='🌻'
// // const image ='\f3c5'
// const images: any = ['foxyMarker', image]
//
// <i className="fas fa-map-marker-alt"aria-hidden="true"></i>

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
      .then(() => this.getWalkingRoute())
  }
  // oneLocationCoordinates: res.data[0].map(({ lon, lat }) => `${lon},${lat}`).join('')
  selectLocation(location) {
    return this.setState({ selectedLocation: location,
      center: [location.lon, location.lat],
      zoom: [14]
    })
      // .then(() => this.getWalkingRoute())
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
    return onStyleLoad && onStyleLoad(map)
  }

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
                {this.state.directions && <Layer
                  type='line'
                  layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                  paint={{ 'line-color': '#4790E5', 'line-width': 6 }}
                >
                  <Feature coordinates={this.state.directions} />
                </Layer>}

                <Layer type="symbol" id="marker" layout={layoutLayer} images={images}>
                  {this.state.allLocations.map(location =>
                    <Feature
                      key={location.id}
                      onClick={() => this.selectLocation(location)}
                      coordinates={[location.lon, location.lat]}
                    />
                  )}
                </Layer>
                    {this.state.selectedLocation === location &&
                      <div className="box">
                        <Popup
                          key={location.id}
                          coordinates={[location.lon, location.lat]}
                          offset={{
                            'bottom-left': [12, -38],
                            'bottom': [0, -38],
                            'bottom-right': [-12, -38]}}>
                          <article className="art">
                            <p className="is-mobile is-size-2">{location.name}</p>
                            <figure className="image is-square">
                              <img src={location.image}/>
                            </figure>
                          </article>
                        </Popup>
                      </div>
                    }
                  </div>
                )}
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
