import React from 'react'
import ReactMapGl, {MapGl, BaseControl, NavigationControl, GeolocateControl, LinearInterpolator, FlyToInterpolator, HTMLOverlay, Layer, Source} from 'react-map-gl'
import axios from 'axios'
import 'mapbox-gl/dist/mapbox-gl.css'
// import MapboxGeocoder from 'mapbox-gl-geocoder'
import DropDownDisplay from './DropDownDisplay'

// import Marker from './Marker'
import Pins from './Pins'

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

const searchReponseStateDefault = {
  type: null,
  query: [null],
  features: [
    {place_type: [null]}
  ],
  attribution: null
}

const routeGeometryStateDefault = {
  'type': 'Feature',
  'properties': {'name': null},
  'geometry': {
    'type': 'Point',
    'coordinates': lngLat}}


class Map extends React.Component {
  constructor() {
    super()

    this.state = {
      ramblingTolerance: 500,
      isSearchTriggered: false,
      originLonLat: [-0.071132, 51.518891],
      destinationLonLat: [],
      routeGeometry: routeGeometryStateDefault,
      parksWithinPerpDistance: [[-0.071132, 51.518891]],
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
      },
      closestWaypoints: [null]
    }
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.dropDownData = this.dropDownData.bind(this)
    this.sendDestinationToBackend = this.sendDestinationToBackend.bind(this)
    this.handlefakeclick = this.handlefakeclick.bind(this)
    // this.getWalkingRoute = this.getWalkingRoute.bind(this)
  }


  // componentDidMount() {
  //   axios.get(`api/boundingbox/${this.state.originLonLat}/${this.state.ramblingTolerance}`)
  //     .then(res => this.setState({
  //       closestWaypoints: res.data[0]
  //     }))
  //     .then(console.log('closestWaypoints', this.state.closestWaypoints))
  //
  // }

  // THIS WILL NEED A PROMPT TO ASK FOR ORIGIN COORDINATES OR TO ALLOW GEOLOCATOR BEFORE DIRECTION SEARCH

  // this.queryDbForClosestParks = this.queryDbForClosestParks.bind(this)
  // queryDbForClosestParks() {
  //   axios.get(`api/mapbox/matrix/${this.state.originLonLat}`)
  //     .then(res => this.setState({
  //       closestWaypoints: res.data
  //     }))
  //     .then(console.log('closestWaypoints', this.state.closestWaypoints))
  // }


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

  // YOU HAVE A BUG HERE, WHERE IF YOU HIT RETURN TWICE IT CLEARS THE BULMA FORMATING AND DROPS DOWN AN UNFORMATTED LIST AND THEN IF YOU CLICK ON ONE OF THE UNFORMATTED DIVS IT CREATES A BLANK PHANTOM FORMATTED BOX

  handleSubmit(e) {
    e.preventDefault()
    axios.get(`api/mapbox/geocoder/${this.state.formData}`)
      .then(res => this.setState({
        isSearchTriggered: !this.state.isSearchTriggered,
        searchResponseData: res.data
      }))
      // .then(() => this.queryDbForClosestParks())
      .then(console.log('response', this.state.destinationLonLat))
  }
// I = -0.042499, 51.543832
// II = -0.032414, 51.446282
// III = -0.115405, 51.495166
// IV = -0.104109, 51.531267
// N = -0.097235, 51.559927
  handlefakeclick(e) {
    e.preventDefault()
    this.sendDestinationToBackend([-0.097235, 51.559927])
  }


  dropDownData(data) {
    this.setState({
      isSearchTriggered: !this.state.isSearchTriggered,
      formData: data.place_name,
      searchResponseData: searchReponseStateDefault,
      routeGeometry: routeGeometryStateDefault
    })
    // this.getWalkingRoute(data.center)
    this.sendDestinationToBackend(data.center)
    console.log('dropDownData data.center', data.center)
  }

  sendDestinationToBackend(data) {
    axios.get(`api/routethenboundingbox/${this.state.originLonLat}/${data}/${this.state.ramblingTolerance}`)
      .then(res => this.setState({
        parksWithinPerpDistance: res.data,
        routeGeometry: res.data
      }))
      .then(console.log('parksWithinPerpDistance', this.state.parksWithinPerpDistance))
  }

// FOR ORIGINAL BOUNDING BOX VIEW
  // sendDestinationToBackend(data) {
  //   axios.get(`api/boundingbox/${this.state.originLonLat}/${data}/${this.state.ramblingTolerance}`)
  //     .then(res => this.setState({
  //       routeGeometry: res.data
  //     }))
  //     .then(console.log('routeGeometry', this.state.routeGeometry))
  // }

  // getWalkingRoute(data) {
  //   axios.get(`api/mapbox/directions/${this.state.originLonLat[0]},${this.state.originLonLat[1]};${data[0]},${data[1]}`)
  //     .then(res => this.setState({ directions: res.data.routes[0].geometry }))
  // }



  render () {
    const {viewport, directions, formData, searchResponseData, isSearchTriggered, routeGeometry, parksWithinPerpDistance} = this.state
    let dropDownIndexNumber = 0
    const directionsLayer = {routeGeometry}
    return (
      <div>
        <div>
          <h1 className="title">Wonder'boutLondon?</h1>
        </div>
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
          {searchResponseData.features.map((element, index) =>
            <DropDownDisplay
              key={element.id}
              index={index}
              dropDownDisplayName={element.place_name}
              searchResponseData={searchResponseData}
              selectDestination={this.dropDownData}
              isSearchTriggered={isSearchTriggered}
            />
          )}
        </div>
        <div className="iconMenu">
          <button className="button" onClick={this.handlefakeclick}>Search
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
            {routeGeometry &&
              <Source id="my-data" type="geojson" data={routeGeometry}>
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




// // goes above directions && <Source ...
// {dictOfWaypoints.map(point => (
//   <Marker
//     key={point.id}
//     lon={point[0]}
//     lat={point[1]}
//     onClick={this.handlePinClick}
//     {...point}
//   />
// ))}
