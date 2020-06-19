import ReactMapGl, {MapGl, BaseControl, NavigationControl, GeolocateControl, LinearInterpolator, FlyToInterpolator, HTMLOverlay, Layer, Source} from 'react-map-gl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import 'mapbox-gl/dist/mapbox-gl.css'
// import MapboxGeocoder from 'mapbox-gl-geocoder'
import DropDownDisplay from './DropDownDisplay'
import HookDropDownDisplay from './HookDropDownDisplay'
import DirectionsDisplay from './DirectionsDisplay'
import SearchBar from './SearchBar'

import React from 'react'
// import DecideToQueryMapboxDirections from './DecideToQueryMapboxDirections'
// {originLonLat && destinationLonLat &&
//   <DecideToQueryMapboxDirections
//     originLonLat={originLonLat}
//     destinationLonLat={destinationLonLat}
//     onsendDestinationToBackend={this.sendDestinationToBackend}/>
// }


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
      isDestinationSearchTriggered: false,
      isOriginSearchTriggered: false,
      originLonLat: [-0.071132, 51.518891],
      destinationLonLat: [],
      routeGeometry: routeGeometryStateDefault,
      routeLargestPark: {},
      parksWithinPerpDistance: [[-0.071132, 51.518891]],
      viewport: {
        longitude: lngLat[0],
        latitude: lngLat[1],
        zoom: 12},
      originFormData: '',
      destinationFormData: '',
      bottomDestinationData: '',
      destinationData: '',
      originData: '',
      searchResponseData: {
        type: null,
        query: [null],
        features: [{place_type: [null]}],
        attribution: null},
      displayDirectionsDisplay: false,
      displayOriginSearchBar: false,
      displayOriginSearchDropdown: false,
      displayDestinationSearchBar: true,
      displayBottomDestinationData: false
    }
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleViewportChange =this.handleViewportChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.handleDirectionsButtonClick = this.handleDirectionsButtonClick.bind(this)
    this.handleDirectionsMenuArrowLeftClick = this.handleDirectionsMenuArrowLeftClick.bind(this)
    this.handleOriginSearchBarArrowLeft = this.handleOriginSearchBarArrowLeft.bind(this)
    this.displayOriginSearchMenu = this.displayOriginSearchMenu.bind(this)
    this.displayDestinationSearchMenu = this.displayDestinationSearchMenu.bind(this)
    this.displayDestinationDropDownData = this.displayDestinationDropDownData.bind(this)
    this.displayOriginDropDownData = this.displayOriginDropDownData.bind(this)
    this.sendDestinationToBackend = this.sendDestinationToBackend.bind(this)
    this.findMyLocation = this.findMyLocation.bind(this)
    this.chooseLocationOnMap = this.chooseLocationOnMap.bind(this)
    // this.handlefakeclick = this.handlefakeclick.bind(this)
    // this.getWalkingRoute = this.getWalkingRoute.bind(this)
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
    const target = e.target
    const value = target.value
    const name = target.name
    this.setState({ [name]: value, error: '' })
    console.log('handleChange', this.state[name])
  }

  handleSubmit(name) {
    const searchName = `is${name}SearchTriggered`
    axios.get(`api/mapbox/geocoder/${this.state[name]}`)
      .then(res => this.setState({
        isSearchTriggered: true,
        [searchName]: true,
        searchResponseData: res.data
      }))
      .then(console.log('destination submit response', this.state[name]))
      .then(() => {
        if (this.state.originData && this.state.destinationData) {
          this.sendDestinationToBackend()
        }
      })
  }

  handleClear(name) {
    this.setState({
      [name]: '',
      searchResponseData: '',
      isSearchTriggered: false,
      displayBottomDestinationData: false
    })
  }

  handleViewportChange(data) {
    this.setState({
      viewport: {
        ...this.state.viewport,
        longitude: data.center[0],
        latitude: data.center[1],
        transitionInterpolator: new LinearInterpolator(),
        transitionDuration: 1000
      }
    })
  }

  handleOriginSearchBarArrowLeft(name) {
    this.handleClear(name)
    this.handleDirectionsButtonClick()
  }

  // THIS NEEDS TO RECEIVE THE DATA FROM THE GEOLOCATOR AND IF CLICKED TRIGGER THE GEOLOCATOR
  findMyLocation() {
    this.setState({originLonLat: [-0.071132, 51.518891]})
  }
// THIS NEEDS TO BE ABLE FOR A PERSON TO DROP A PIN ON THIER ORIGIN FROM BOTH THE MOUSE AND FROM MOBILE
  chooseLocationOnMap() {
    this.setState({originLonLat: [-0.071132, 51.518891]})
  }

  handleDirectionsButtonClick() {
    this.setState({
      displayDirectionsDisplay: true,
      displayDestinationSearchBar: false,
      displayOriginSearchBar: false,
      displayOriginSearchDropdown: false,
      displayBottomDestinationData: false
    })
  }

  handleDirectionsMenuArrowLeftClick() {
    this.setState({
      displayDirectionsDisplay: false,
      displayDestinationSearchBar: true,
      displayOriginSearchBar: false,
      displayOriginSearchDropdown: false,
      displayBottomDestinationData: false
    })
  }

  displayOriginSearchMenu() {
    this.setState({
      displayDirectionsDisplay: false,
      displayDestinationSearchBar: false,
      displayOriginSearchBar: true,
      displayOriginSearchDropdown: true,
      displayBottomDestinationData: true
    })
  }

  displayDestinationSearchMenu() {
    this.setState({
      displayDirectionsDisplay: false,
      displayDestinationSearchBar: true,
      displayOriginSearchBar: false,
      displayOriginSearchDropdown: false,
      displayBottomDestinationData: false
    })
  }

  displayDestinationDropDownData(data) {
    this.handleViewportChange(data)
    this.setState({
      isDestinationSearchTriggered: false,
      displayBottomDestinationData: true,
      destinationData: data,
      destinationLonLat: data.center,
      bottomDestinationData: data.place_name,
      searchResponseData: searchReponseStateDefault,
      routeGeometry: routeGeometryStateDefault
    })
    // this.sendDestinationToBackend(data.center)
  }
// DOES THIS NEED PROMISES TO BE SURE STATE IS SET BEFORE sendDestinationToBackend() IS TRIGGERED?
  displayOriginDropDownData(data) {
    this.handleViewportChange(data)
    this.setState({
      isOriginSearchTriggered: false,
      displayOriginSearchBar: false,
      displayOriginSearchDropdown: false,
      displayDirectionsDisplay: true,
      originData: data,
      originLonLat: data.center,
      searchResponseData: searchReponseStateDefault,
      routeGeometry: routeGeometryStateDefault
    })
    // this.sendDestinationToBackend(data.center)
  }

  sendDestinationToBackend() {
    axios.get(`api/routethenboundingbox/${this.state.originLonLat}/${this.state.destinationLonLat}/${this.state.ramblingTolerance}`)
      .then(res => this.setState({
        parksWithinPerpDistance: res.data[0],
        routeGeometry: res.data[0],
        routeLargestPark: res.data[1]
      }))
      .then(console.log('parksWithinPerpDistance', this.state.parksWithinPerpDistance))
      .then(console.log('routeLargestPark', this.state.routeLargestPark))
  }

  render () {
    const {viewport, originFormData, destinationFormData, bottomDestinationData, originData, destinationData, displayDirectionsDisplay, displayOriginSearchDropdown, displayOriginSearchBar, displayDestinationSearchBar, displayBottomDestinationData, searchResponseData, isSearchTriggered, isDestinationSearchTriggered, isOriginSearchTriggered, routeGeometry, parksWithinPerpDistance} = this.state
    const directionsLayer = {routeGeometry}
    return (
      <div>
        <div>
          <h1 className="title">Wonder'boutLondon?</h1>
        </div>
        <div className="mapcontainer">
          <ReactMapGl {...viewport}
            height='100vh'
            width='100vw'
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
          <div className="bodyContainer">
            {displayDirectionsDisplay &&
              <DirectionsDisplay
                origin={originData.place_name}
                destination={destinationData.place_name}
                onArrowLeft={this.handleDirectionsMenuArrowLeftClick}
                onTriggerOriginSearchMenu={this.displayOriginSearchMenu}
                onTriggerDestinationSearchMenu={this.displayDestinationSearchMenu}/>
            }
            {displayOriginSearchBar &&
              <SearchBar
                onArrowLeft={this.handleOriginSearchBarArrowLeft}
                onTimes={this.handleClear}
                onHandleChange={this.handleChange}
                onHandleSubmit={this.handleSubmit}
                searchformData={originFormData}
                placeholder='Search'
                name='origin'/>
            }
            {displayDestinationSearchBar &&
              <SearchBar
                onArrowLeft={this.handleClear}
                onTimes={this.handleClear}
                onHandleChange={this.handleChange}
                onHandleSubmit={this.handleSubmit}
                searchformData={destinationFormData}
                placeholder='Add destination to plan route'
                name='destination'/>
            }
            {displayOriginSearchDropdown &&
              <div className="box is-radiusless is-marginless">
                <button className="button is-fullwidth has-text-left" onClick={this.findMyLocation}>
                  <span className="icon">
                    <FontAwesomeIcon icon="location-arrow"/></span>
                  <span>Find my location</span>
                </button>
                <button className="button is-fullwidth has-text-left" onClick={this.chooseLocationOnMap}>
                  <span className="icon">
                    <FontAwesomeIcon icon="map-marker-alt"/></span>
                  <span>Choose on map</span>
                </button>
              </div>
            }
            <div className="dropdown">
              <div>
                {isSearchTriggered && isOriginSearchTriggered && searchResponseData.features.map((element, index) =>
                  <DropDownDisplay
                    key={element.id}
                    index={index}
                    dropDownDisplayName={element.place_name}
                    searchResponseData={searchResponseData}
                    selectDestination={this.displayOriginDropDownData}
                    isSearchTriggered={isSearchTriggered}
                    name='origin'
                  />
                )}
              </div>
            </div>
            <div className="dropdown">
              <div>
                {isSearchTriggered && isDestinationSearchTriggered && searchResponseData.features.map((element, index) =>
                  <DropDownDisplay
                    key={element.id}
                    index={index}
                    dropDownDisplayName={element.place_name}
                    searchResponseData={searchResponseData}
                    selectDestination={this.displayDestinationDropDownData}
                    isSearchTriggered={isSearchTriggered}
                    name='destination'
                  />
                )}
              </div>
            </div>
          </div>
          {displayBottomDestinationData &&
              <div className="bottomFormContainer">
                <div className="box is-radiusless">
                  <p className="button is-static is-fullwidth">{bottomDestinationData}
                  </p>
                  <button className="button is-info" onClick={this.handleDirectionsButtonClick} >
                    <span className="icon">
                      <FontAwesomeIcon icon="directions"/>
                    </span>
                    <span>Directions</span>
                  </button>
                </div>
              </div>}
        </div>
      </div>
    )
  }
}

export default Map

// HOOK VERSION
// displayDestinationDropDownData(data) {
//   this.setState({
//     isDestinationSearchTriggered: false,
//     displayBottomDestinationData: true,
//     destinationData: data,
//     destinationLonLat: data.center,
//     bottomDestinationData: data.place_name,
//     viewport: {
//       ...this.state.viewport,
//       longitude: data.center[0],
//       latitude: data.center[1],
//       transitionInterpolator: new LinearInterpolator(),
//       transitionDuration: 1000
//     },
//
//     searchResponseData: searchReponseStateDefault,
//     routeGeometry: routeGeometryStateDefault
//   })
//   // this.sendDestinationToBackend(data.center)
//   console.log('displayDestinationDropDownData data.center', data.center)
// }


// HOOK VERSION
  // sendDestinationToBackend(originLonLat, destinationLonLat) {
  //   axios.get(`api/routethenboundingbox/${originLonLat}/${destinationLonLat}/${this.state.ramblingTolerance}`)
  //     .then(res => this.setState({
  //       parksWithinPerpDistance: res.data[0],
  //       routeGeometry: res.data[0],
  //       routeLargestPark: res.data[1]
  //     }))
  //     .then(console.log('parksWithinPerpDistance', this.state.parksWithinPerpDistance))
  //     .then(console.log('routeLargestPark', this.state.routeLargestPark))
  // }

// <HookDropDownDisplay
//   key={element.id}
//   index={index}
//   dropDownDisplayName={element.place_name}
//   searchResponseData={searchResponseData}
//   originOrDestinationSearch={'destination'}
//   isSearchTriggered={isSearchTriggered}
//   selectDestination={this.displayDestinationDropDownData}
//   onSendDestinationToBackend={this.sendDestinationToBackend}
// />
//
// <HookDropDownDisplay
//   key={element.id}
//   index={index}
//   dropDownDisplayName={element.place_name}
//   searchResponseData={searchResponseData}
//   originOrDestinationSearch={'origin'}
//   isSearchTriggered={isSearchTriggered}
//   selectDestination={this.displayOriginDropDownData}
//   onSendDestinationToBackend={this.sendDestinationToBackend}
// />



// <div className="dropdown">
//   <div>
//     {isSearchTriggered && isDestinationSearchTriggered && searchResponseData.features.map((element, index) =>
//       <DropDownDisplay
//         key={element.id}
//         index={index}
//         dropDownDisplayName={element.place_name}
//         searchResponseData={searchResponseData}
//         selectDestination={this.displayDestinationDropDownData}
//         isSearchTriggered={isSearchTriggered}
//       />
//     )}
//   </div>
// </div>

// <div className="dropdown">
//   <div>
//     {isSearchTriggered && isOriginSearchTriggered && searchResponseData.features.map((element, index) =>
//       <DropDownDisplay
//         key={element.id}
//         index={index}
//         dropDownDisplayName={element.place_name}
//         searchResponseData={searchResponseData}
//         selectDestination={this.displayOriginDropDownData}
//         isSearchTriggered={isSearchTriggered}
//       />
//     )}
//   </div>
// </div>



// selectDestination={isDestinationSearchTriggered ? this.displayDestinationDropDownData :this.displayOriginDropDownData}

// {originLonLat && destinationLonLat &&
//   <DecideToQueryMapboxDirections
//     originLonLat={originLonLat}
//     destinationLonLat={destinationLonLat}
//     sendDestinationToBackend={this.sendDestinationToBackend}/>
// }


// {displayDirectionsDisplay &&
//   destinationData ? (
//     <DirectionsDisplay
//       origin={startingLocation}
//       destination={destinationData.place_name}/>) :
//   (<DirectionsDisplay
//     origin={startingLocation}
//     destination={''}/>)
// }


// I = -0.042499, 51.543832
// II = -0.032414, 51.446282
// III = -0.115405, 51.495166
// IV = -0.104109, 51.531267
// N = -0.097235, 51.559927
// handlefakeclick(e) {
//   e.preventDefault()
//   this.sendDestinationToBackend([-0.097235, 51.559927])
// }

// <div className="container" id="bottomMenu">
//   <button className="button" onClick={this.handlefakeclick}>Search
//   </button>
//   <button className="button">
//   </button>
// </div>

// this goes just below forms
// <div>
//   <Directions/>
// </div>


// goes above Directions && <Source
// {dictOfWaypoints.map(point => (
//   <Marker
//     key={point.id}
//     lon={point[0]}
//     lat={point[1]}
//     onClick={this.handlePinClick}
//     {...point}
//   />
// ))}
