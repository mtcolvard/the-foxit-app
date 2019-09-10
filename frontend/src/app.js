import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import _ from 'lodash'
import '@fortawesome/fontawesome-svg-core'
import '@fortawesome/free-solid-svg-icons'
import '@fortawesome/react-fontawesome'
import MapboxGeocoder from 'mapbox-gl-geocoder'


import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'
const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ'
})

const startCoordinates = '-0.088817,51.514271'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      allLocations: [],
      allLocationsCoordinates: null,
      closestLocation: null,
      destinations: null
      // durationTimesToDestinationLocations: []
    }
    // this.fetchLocationsFromDatabase = this.fetchLocationsFromDatabase.bind(this)
    this.filterToFindClosestLocation = this.filterToFindClosestLocation.bind(this)
    this.getWalkingRoute = this.getWalkingRoute.bind(this)
    // this.isolateLonLatAndConcat = this.isolateLonLatAndConcat.bind(this)
  }

  componentDidMount() {
    // THIS GRABS LOCATIONS STORED IN OUR DATABASE
    axios.get('/api/locations/')
      // THIS CREATES A STRING OF LONGITUDE AND LATITUDE WITH MAPBOX MATRIX API GET REQUEST FORMATING
      .then(res => this.setState({
        allLocations: res.data,
        allLocationsCoordinates: res.data.map(({ lon, lat }) => `${lon},${lat}`).join(';')
      }))
      .then(() => this.filterToFindClosestLocation())
      .then(() => this.getWalkingRoute())
  }

  // THIS USES "MAPBOX MATRIX API" TO DETERMINE THE CLOSEST PARK FROM A ARRAY OF LOCATIONS
  // BY FINDING THE INDEX NUMBER OF THE ROUTE WITH THE SHORTEST DURATION IN SECONDS IT THEN CALLS THE COORDINATES OF THAT INDEX.

  filterToFindClosestLocation() {
    return axios.get(`/api/mapbox/matrix/${startCoordinates};${this.state.allLocationsCoordinates}?destinations=1;2`)
      .then(res => {
        const closestLocationIdx = _.indexOf(res.data.durations[0], _.min(res.data.durations[0]))
        const closestLocation = res.data.destinations[closestLocationIdx].location
        return this.setState({ closestLocation })
      })
  }

  getWalkingRoute() {
    return axios.get(`/api/mapbox/directions/${startCoordinates};${this.state.closestLocation.join(',')}`)
      .then(res => this.setState({ directions: res.data.routes[0].geometry.coordinates }))
  }

  render() {

    console.log(this.state)
    return (
      <div>
        <h1>Fox Me, Baby</h1>
        <div>
          <Map
            center={this.state.closestLocation}
            style="mapbox://styles/mapbox/streets-v9"
            containerStyle={{
              height: '56.25vh',
              width: '100%'
            }}
          >
            {this.state.directions && <Layer
              type='line'
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
              paint={{ 'line-color': '#4790E5', 'line-width': 2 }}
            >
              <Feature coordinates={this.state.directions} />
            </Layer>}
          </Map>
        </div>
      </div>)
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
