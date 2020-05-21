import React from 'react'
import { Marker as MapMarker } from 'react-map-gl'

class Marker extends React.Component {
  render() {
    return (
      <MapMarker
        latitude={this.props.lat}
        longitude={this.props.lon}
      >
        <div className="map-marker">
          😀
        </div>
      </MapMarker>
    )
  }
}

export default Marker
