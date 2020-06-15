import React, { useMemo } from 'react'
import Map from './Map'

function DecideToQueryMapboxDirections(props) {
  const queryMapboxDirection = useMemo(() => props.onsendDestinationToBackend(props.originLonLat, props.destinationLonLat), [props.originLonLat, props.destinationLonLat])
}

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
