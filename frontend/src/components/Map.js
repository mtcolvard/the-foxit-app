import React from 'react'
import ReactMapGl, {BaseControl, NavigationControl, GeolocateControl, LinearInterpolator, FlyToInterpolator, HTMLOverlay, Layer, Source} from 'react-map-gl'
import axios from 'axios'
import 'mapbox-gl/dist/mapbox-gl.css'


// const directionsLayer = {
//   type: 'FeatureCollection',
//   features: [
//     {type: 'Feature', geometry: {type: 'LineString', coordinates: [[-0.083903, 51.518887], [-0.083903, 51.51862], [-0.085547, 51.51688], [-0.085652, 51.516838], [-0.086035, 51.516869], [-0.086637, 51.514809], [-0.087804, 51.514622], [-0.087283, 51.513905], [-0.088961, 51.513409], [-0.089538, 51.513367], [-0.092212, 51.512718], [-0.092505, 51.512611], [-0.093011, 51.510853], [-0.09496, 51.507351], [-0.095722, 51.503902], [-0.104775, 51.503708], [-0.106317, 51.503376], [-0.110179, 51.502075], [-0.11079, 51.500668], [-0.112453, 51.498886], [-0.113087, 51.499195]]}}
//   ]
// }



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
      viewport: {longitude: lngLat[0], latitude: lngLat[1], zoom: 12},
      formData: null,
      geocoderRes: {},
      destinationLonLat: [],
      originLonLat: [-0.084254, 51.518961]

    }
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
    console.log('change', this.state.formData)
  }

  handleSubmit(e) {
    e.preventDefault()
    axios.get(`api/mapbox/geocoder/${this.state.formData}`)
      .then(res => this.setState(
        {formData: res.data['features'][0]['place_name'],
          destinationLonLat: res.data['features'][0]['center']}))
      .then(() => this.getWalkingRoute())
      .then(console.log('response', this.state.formData))
  }

  getWalkingRoute() {
    axios.get(`api/mapbox/directions/${this.state.originLonLat[0]},${this.state.originLonLat[1]};${this.state.destinationLonLat[0]},${this.state.destinationLonLat[1]}`)
      .then(res => this.setState({ directions: res.data.routes[0].geometry }))
  }


  render () {
    const {viewport, directions} = this.state
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
            className="input"
            type="text"
            placeholder='Add destination to plan route'
            onChange={this.handleChange}
            value={`${(this.state.formData === null) ? '' : this.state.formData}`}
          />
        </form>
        <div>
          <ReactMapGl {...viewport}
            mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mtcolvard/ck0wmzhqq0cpu1cqo0uhf1shn"
            height='100vh'
            width='100vw'
            onViewportChange={viewport => this.setState({viewport})}
            onClick={this.handleMouseDown}>
            {this.state.directions && <Source id="my-data" type="geojson" data={directionsLayer}>
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
