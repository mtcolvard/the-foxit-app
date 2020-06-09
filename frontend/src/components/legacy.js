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
