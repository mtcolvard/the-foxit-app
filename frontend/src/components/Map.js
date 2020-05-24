import React from 'react'
import ReactMapGl, {MapGl, BaseControl, NavigationControl, GeolocateControl, LinearInterpolator, FlyToInterpolator, HTMLOverlay, Layer, Source} from 'react-map-gl'
import axios from 'axios'
import 'mapbox-gl/dist/mapbox-gl.css'
// import MapboxGeocoder from 'mapbox-gl-geocoder'
import DropDownDisplay from './DropDownDisplay'

import Marker from './Marker'
const dictOfWaypoints = [[-0.087419024791445, 51.517718896902], [-0.087494313257733, 51.515921612032], [-0.090337358976231, 51.516867197055], [-0.093218055745589, 51.51691406886], [-0.093218055745589, 51.51691406886], [-0.094620903404705, 51.517836124354], [-0.096061284965339, 51.517859516813], [-0.096136233685337, 51.516062222945], [-0.097576560563233, 51.516085596232], [-0.09905430420776, 51.515210303177], [-0.10049460665516, 51.515233640365], [-0.10053199123268, 51.514334990795], [-0.10197226730847, 51.514358309561], [-0.10204697403704, 51.512561008454], [-0.10348719543436, 51.512584308055], [-0.10348719543436, 51.512584308055], [-0.10060675457565, 51.512537691179], [-0.099166537051638, 51.512514356231], [-0.097726321466478, 51.512491003609], [-0.097726321466478, 51.512491003609], [-0.097688884151101, 51.513389652002], [-0.096211174637081, 51.514264928445], [-0.093293113825296, 51.51511677767], [-0.091815264711367, 51.51599199703], [-0.089009852504822, 51.514147804368], [-0.087607231326107, 51.513225683539], [-0.08764486678115, 51.512327040392], [-0.08764486678115, 51.512327040392], [-0.089122673954283, 51.511451872672], [-0.089160277206484, 51.510553228457], [-0.087720131840413, 51.510529753622], [-0.08779538909947, 51.508732466219], [-0.084877533166465, 51.509584108817], [-0.083437421956153, 51.509560581718], [-0.083399707449843, 51.510459223084], [-0.08192182513119, 51.511334318014], [-0.079003695960983, 51.512185811231], [-0.078965890677145, 51.51308444986], [-0.077487838536433, 51.513959486772], [-0.080292766543172, 51.515803950192], [-0.080292766543172, 51.515803950192], [-0.083173379363984, 51.515851067954], [-0.084613688708361, 51.515874600322], [-0.083211105598963, 51.514952427538], [-0.081808579106732, 51.514030238427], [-0.081808579106732, 51.514030238427], [-0.086129337287234, 51.514100831015], [-0.090450113038398, 51.514171264532], [-0.094695908749751, 51.516038831983], [-0.09454589028448, 51.519633416092], [-0.097389315769702, 51.520578833455], [-0.097351860987737, 51.521477480425], [-0.094470869388012, 51.521430707198], [-0.092955291188137, 51.52320458304], [-0.094320804262089, 51.525025287512], [-0.094283283118793, 51.525923932195], [-0.092880198087764, 51.525001871383], [-0.09860519828627, 51.525994076737], [-0.10288977780248, 51.526962711148], [-0.10436777900783, 51.526087355242], [-0.10728634718486, 51.525235236999], [-0.10592030681413, 51.523414678219], [-0.10451705882235, 51.522492754647], [-0.10739813419693, 51.52253928185], [-0.10459168712387, 51.520695453402], [-0.087306077458283, 51.520414823021], [-0.088671282889504, 51.522235590909], [-0.090074197976318, 51.523157700738], [-0.084274319440661, 51.523962363714], [-0.082682760333115, 51.527533378947], [-0.08412343783119, 51.527556921105], [-0.078398576235896, 51.526564010284], [-0.075555186872678, 51.525618133595], [-0.069678742519302, 51.528219335204], [-0.066721235716513, 51.529969137313], [-0.065280496813107, 51.529945380685], [-0.065128086993991, 51.53353989429], [-0.049918, 51.516866]]

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

class Map extends React.Component {
  constructor() {
    super()

    this.state = {
      bounding_box_width: 500,
      isSearchTriggered: false,
      originLonLat: [-0.084254, 51.518961],
      destinationLonLat: [],
      routeGeometry: [],
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
    // this.getWalkingRoute = this.getWalkingRoute.bind(this)
  }


  // componentDidMount() {
  //   axios.get(`api/boundingbox/${this.state.originLonLat}/${this.state.bounding_box_width}`)
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


  dropDownData(data) {
    this.setState({
      isSearchTriggered: !this.state.isSearchTriggered,
      formData: data.place_name,
      searchResponseData: searchReponseStateDefault })
    // this.getWalkingRoute(data.center)
    this.sendDestinationToBackend(data.center)
    console.log('dropDownData data.center', data.center)
  }

  sendDestinationToBackend(data) {
    axios.get(`api/boundingbox/${this.state.originLonLat}/${data}/${this.state.bounding_box_width}`)
      .then(res => this.setState({
        routeGeometry: res.data
      }))
      .then(console.log('routeGeometry', this.state.routeGeometry))
  }

  // getWalkingRoute(data) {
  //   axios.get(`api/mapbox/directions/${this.state.originLonLat[0]},${this.state.originLonLat[1]};${data[0]},${data[1]}`)
  //     .then(res => this.setState({ directions: res.data.routes[0].geometry }))
  // }

  render () {
    const {viewport, directions, formData, searchResponseData, isSearchTriggered, routeGeometry} = this.state
    let dropDownIndexNumber = 0
    const directionsLayer = {
      type: 'FeatureCollection',
      features: [
        {type: 'Feature', geometry: routeGeometry}
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
            {dictOfWaypoints.map(point => (
              <Marker
                key={point.id}
                lon={point[0]}
                lat={point[1]}
                onClick={this.handlePinClick}
                {...point}
              />
            ))}
            {routeGeometry &&
              <Source id="my-data" type="geojson" data={directionsLayer}>
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
