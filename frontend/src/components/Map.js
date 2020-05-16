import React from 'react'
import ReactMapGl, {BaseControl, NavigationControl, GeolocateControl, LinearInterpolator, FlyToInterpolator, HTMLOverlay, Layer, Source} from 'react-map-gl'
import axios from 'axios'
import 'mapbox-gl/dist/mapbox-gl.css'
// import MapboxGeocoder from 'mapbox-gl-geocoder'
import SearchResponse from './SearchResponse'


const geolocateStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  margin: 10
}

const navigationControlStyle = {
  position: 'absolute',
  right: 0
}

const lngLat = [-0.084254, 51.518961]

class Map extends React.Component {
  constructor() {
    super()

    this.state = {
      originLonLat: [-0.084254, 51.518961],
      destinationLonLat: [],
      viewport: {longitude: lngLat[0], latitude: lngLat[1], zoom: 12,
        height: 'calc(100vh - 80px)',
        width: '100vw'},
      formData: '',
      directions: '',
      tabOpen: false,
      searchResponseData: {
        type: null,
        query: [null],
        features: [
          {place_type: [null]}
        ],
        attribution: null
      }

    }
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    axios.get(`api/boundingbox/${this.state.originLonLat}`)
      .then(res => this.setState({
        closestWaypoints: res.data
      }))
      .then(console.log('closestWaypoints', this.state.closestWaypoints))

  }

  handleMouseDown( {lngLat} ) {
    this.setState({viewport: {
      longitude: lngLat[0],
      latitude: lngLat[1],
      zoom: 12,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator({
        curve: 2.4})
    }})
  }

  handleChange(e) {
    this.setState({ formData: e.target.value, error: '' })
    console.log('handleChange', this.state.formData)
  }

  handleSubmit(e) {
    e.preventDefault()
    axios.get(`api/mapbox/geocoder/${this.state.formData}`)
      .then(res => this.setState({
        destinationLonLat: res.data['features'][0]['center'],
        searchResponseData: res.data
      }))
      // .then(() => this.queryDbForClosestParks())
      .then(() => this.getWalkingRoute())
      .then(console.log('response', this.state.destinationLonLat))
  }


  // queryDbForClosestParks() {
  //   axios.get(`api/mapbox/matrix/${this.state.originLonLat}`)
  //     .then(res => this.setState({
  //       closestWaypoints: res.data
  //     }))
  //     .then(console.log('closestWaypoints', this.state.closestWaypoints))
  //
  // }

  getWalkingRoute() {
    axios.get(`api/mapbox/directions/${this.state.originLonLat[0]},${this.state.originLonLat[1]};${this.state.destinationLonLat[0]},${this.state.destinationLonLat[1]}`)
      .then(res => this.setState({ directions: res.data.routes[0].geometry }))
  }

  // getMap(map) {
  //   map.addControl(
  //     new MapboxGeocoder({
  //       accessToken: mapboxgl.accessToken,
  //       mapboxgl: mapboxgl
  //     }))
  // }

  render () {
    const {viewport, directions, formData, searchResponseData} = this.state
    const directionsLayer = {
      type: 'FeatureCollection',
      features: [
        {type: 'Feature', geometry: directions}
      ]
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            className="input is-primary"
            type="text"
            placeholder='Add destination to plan route'
            onChange={this.handleChange}
            value={formData}
          />
        </form>
        <div>
          <SearchResponse
            searchResponseData={searchResponseData}
            selectDestination={this.handleSubmit}
          />
        </div>
        <div className="iconMenu">
          <button className="button">Search
          </button>
          <button className="button">Directions
          </button>
        </div>
        <div>
          <ReactMapGl {...viewport}
            mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mtcolvard/ck0wmzhqq0cpu1cqo0uhf1shn"

            onViewportChange={viewport => this.setState({viewport})}
            onClick={this.handleMouseDown}>
            {directions && <Source id="my-data" type="geojson" data={directionsLayer}>
              <Layer
                type='line'
                layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                paint={{ 'line-color': '#4790E5', 'line-width': 6 }}
              />
            </Source>
            }
            <div>
              <GeolocateControl
                style={geolocateStyle}
                positionOptions={{enableHighAccuracy: true}}
                trackUserLocation={true}
                captureClick={false}
              />
            </div>
            <div style={navigationControlStyle}>
              <NavigationControl/>
            </div>
          </ReactMapGl>
        </div>
      </div>

    )
  }
}

export default Map