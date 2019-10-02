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


class App extends React.Component {
  constructor() {
    super()
    this.state = {
      fitBounds: undefined,
      center: [-0.109970527, 51.52916347],
      zoom: [11],
      allLocations: [],
      boundedLocationsCoordinates: [],
      selectLocationCoordinates: [],
      closestLocation: null,
      destinations: null,
      selectedLocation: null
      // durationTimesToDestinationLocations: []
    }
    this.selectLocation = this.selectLocation.bind(this)
    this.onStyleLoad = this.onStyleLoad.bind(this)
    // this.getWalkingRoute = this.getWalkingRoute.bind(this)

    this.filterToFindClosestLocation = this.filterToFindClosestLocation.bind(this)
  }
  // this.isolateLonLatAndConcat = this.isolateLonLatAndConcat.bind(this)
  // this.fetchLocationsFromDatabase = this.fetchLocationsFromDatabase.bind(this)

  componentDidMount() {
    // THIS GRABS LOCATIONS STORED IN OUR DATABASE
    axios.get('/api/locations/')
      // THIS CREATES A STRING OF LONGITUDE AND LATITUDE WITH MAPBOX MATRIX API GET REQUEST FORMATING
      .then(res => this.setState({

        boundedLocationsCoordinates: res.data.slice(1,5).map(({ lon, lat }) => `${lon},${lat}`).join(';'),
        boundedLocationsString: res.data.slice(1,5).map(({ lon, lat }) => `${lon},${lat}`).join(','),
        selectLocationCoordinates: res.data.slice(1,5),
        allLocations: res.data
      }))
      .then(() => this.filterToFindClosestLocation())
      .then(() => this.getWalkingRoute())
  }
  selectLocation(location) {
    return this.setState({ selectedLocation: location,
      center: [location.lon, location.lat],
      zoom: [14]
    })
      // .then(() => this.getWalkingRoute())
  }

  // THIS USES "MAPBOX MATRIX API" TO DETERMINE THE CLOSEST PARK FROM A ARRAY OF LOCATIONS
  // BY FINDING THE INDEX NUMBER OF THE ROUTE WITH THE SHORTEST DURATION IN SECONDS IT THEN CALLS THE COORDINATES OF THAT INDEX.

  filterToFindClosestLocation() {
    const boundedLocationsCount = this.state.boundedLocationsString.split(',').length/2
    let destinationsString = ''
    for(let i = 1; i <= boundedLocationsCount; i += 1) {
      destinationsString += i + ';'
    }
    const destinationsStringFormatted = destinationsString.slice(0, -1)

    return axios.get(`/api/mapbox/matrix/${startCoordinates};${this.state.boundedLocationsCoordinates}?`)
      .then(res => {
        const closestLocationIdx = _.indexOf(res.data.durations[0], _.min(res.data.durations[0]))
        const closeLocation = res.data.destinations[closestLocationIdx].location
        return this.setState({ closestLocation: closeLocation })
      })
  }

  getWalkingRoute() {
    // return axios.get(`/api/mapbox/directions/${startCoordinates};${this.state.closestLocation.join(',')}`)
    return axios.get(`/api/mapbox/directions/${startCoordinates};${this.state.closestLocation}`)
      .then(res => this.setState({ directions: res.data.routes[0].geometry.coordinates }))
  }

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
    //   marker: {
    //     color: 'orange'
    //   },
    //   ReactMapboxGl: ReactMapboxGl
    // }))
    return onStyleLoad && onStyleLoad(map)
  }

  render() {
    console.log('select', this.state.selectLocationCoordinates)
    console.log('bounded', this.state.boundedLocationsCoordinates)
    console.log('closest', this.state.closestLocation)
    const { fitBounds, center, zoom } = this.state
    return (
      <main>
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

                {this.state.selectLocationCoordinates.map(location =>
                  <div key={location.id}>
                    <Marker
                      coordinates={[location.lon, location.lat]}
                      onClick={() => this.selectLocation(location)}
                      ariaRole='button'
                    >
                      {<span className="icon is-medium"><i className="fas fa-map-marker-alt"aria-hidden="true"></i></span>}
                    </Marker>
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
      </main>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
