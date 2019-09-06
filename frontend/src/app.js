import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import ReactMapboxGl, { Marker, Popup } from 'react-mapbox-gl'

const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNqemI4emZydjA2dHIzYm80ZG96ZmQyN2wifQ.kVp6eB7AkWjslUOtsJyLDQ'
})

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      allLocations: [],
      allLocationsCoordinates: null
    }
    this.fetchLocationsFromDatabase = this.fetchLocationsFromDatabase.bind(this)
    this.filterToFindClosestLocation = this.filterToFindClosestLocation.bind(this)
    this.isolateLonLatAndConcat = this.isolateLonLatAndConcat.bind(this)
  }

  // componentDidMount() {
  //
  // }

// THIS USES "MAPBOX MATRIX API" TO DETERMINE THE CLOSEST PARK FROM A ARRAY OF LOCATIONS
  filterToFindClosestLocation() {
    axios.get(`https://cors-anywhere.herokuapp.com/https://api.mapbox.com/mapbox/walking/${this.state.allLocationsCoordinates}`)
  }

// THIS GRABS LOCATIONS STORED IN OUR DATABASE
  fetchLocationsFromDatabase() {
    axios.get('/api/locations/')
      .then(res => this.setState({ allLocations: res.data }))
  }

// THIS CREATES AN ARRAY OF THE LOCATION COORDINATES AND CONCATES THEM INTO A STRING
  isolateLonLatAndConcat() {
    const locationCoordinates = this.state.allLocations.forEach(location => {
      this.setState({allLocationsLonLatCoordinatesString: this.state.allLocationsLonLatCoordinatesString.concat(`${location.lon}','${location.lat}';'`)})
    })
  }

  render() {
    return (
      <div>
        <h1>Goodbye cruel world.</h1>
        <div>
          <Map
            center={[-0.088817, 51.514271]}
            style="mapbox://styles/mapbox/streets-v9"
            containerStyle={{
              height: '56.25vh',
              width: '100%'
            }}
          >
          </Map>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

// {this.props.sendHappenings.map(happening =>
//   <div key={happening._id}>
//     <Marker
//       coordinates={[happening.lon, happening.lat]}
//       onClick={() => this.selectHappening(happening)}
//       ariaRole='button'
//     >
//       {<span className="icon is-medium"><i className="fas fa-map-marker-alt"aria-hidden="true"></i></span>}
//     </Marker>
//     {this.state.selectedHappening === happening &&
//       <Popup
//         className="tile is-parent"
//         key={happening._id}
//         coordinates={[happening.lon, happening.lat]}
//         offset={{
//           'bottom-left': [12, -38],
//           'bottom': [0, -38],
//           'bottom-right': [-12, -38]}}>
//         <article className="tile is-child">
//           <p className="is-size-6">{happening.name}</p>
//         </article>
//       </Popup>
//     }
//   </div>
// )}
