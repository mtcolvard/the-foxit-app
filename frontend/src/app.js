import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import ReactMapboxGl, { Marker, Popup } from 'react-mapbox-gl'

const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ'
})

const mapboxToken = 'pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      allLocations: [],
      allLocationsCoordinates: null
      // durationTimesToDestinationLocations: []
    }
    // this.fetchLocationsFromDatabase = this.fetchLocationsFromDatabase.bind(this)
    // this.filterToFindClosestLocation = this.filterToFindClosestLocation.bind(this)
    // this.isolateLonLatAndConcat = this.isolateLonLatAndConcat.bind(this)
  }

  componentDidMount() {
    // THIS GRABS LOCATIONS STORED IN OUR DATABASE
    axios.get('/api/locations/')
      .then(res => this.setState(
        { allLocations: res.data,
          // THIS CREATES A STRING OF LONGITUDE AND LATITUDE WITH MAPBOX MATRIX API GET REQUEST FORMATING
          allLocationsCoordinates: res.data.map(location => {
            return `${location.lon},${location.lat};`
          }).join('').slice(0, -1)
          // THIS JOINS ALL THE LOCATIONS IN TO ONE LONG STRING TO SEND TO THE API
        }))
      .then(() => this.filterToFindClosestLocation())
    // THERE WILL BE ONE TRAILING SEMICOLON YOU MUST REMOVE FOR THIS TO WORK
  }

  // THIS USES "MAPBOX MATRIX API" TO DETERMINE THE CLOSEST PARK FROM A ARRAY OF LOCATIONS
  // Durations as an array of arrays that represent the matrix in row-major order. durations[i][j] gives the travel time from the ith source to the jth destination. All values are in seconds. The duration between the same coordinate is always 0. If a duration cannot be found, the result is null.

  filterToFindClosestLocation() {
    axios.get(`https://cors-anywhere.herokuapp.com/https://api.mapbox.com/mapbox/walking/-0.088817,51.514271;${this.state.allLocationsCoordinates}?sources=0&destinations=1;2&access_token=pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ`)
      .then(res => {
        this.setState({durationTimesToDestinationLocations: res.data})
      })
  }

  // if (this.state.allLocations.length === 0) return null
  render() {
    console.log(this.state.durationTimesToDestinationLocations)
    return (
      <div>
        <h1>Goodbye cruel world.</h1>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)


// create a new promise
// const promise = new Promise((resolve, reject) => {
//   Films.find((err, films) => {
//     if(err) return reject(err); // call `.catch` passing in the error
//     return resolve(films); // call `.then` passing in the films
//   });
// });
//
// promise
//   .then(films => console.log(films))
//   .catch(err => console.log(err));

// componentDidMount() {
//   // THIS GRABS LOCATIONS STORED IN OUR DATABASE
//   axios.get('/api/locations/')
//     .then(res => {
//       const allLocationsCoordinates= res.data.map(location => {
//         return `${location.lon},${location.lat};`
//       }).join('').slice(0, -1)
//       // THIS JOINS ALL THE LOCATIONS IN TO ONE LONG STRING TO SEND TO THE API
//       axios.get(`https://cors-anywhere.herokuapp.com/https://api.mapbox.com/mapbox/walking/-0.088817,51.514271;${allLocationsCoordinates}?sources=0&destinations=1;2&access_token=pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ`)
//         .then(res => {
//           this.setState({durationTimesToDestinationLocations: res.data})
//         })
//     })
// }

// <div>
//   <Map
//     center={[-0.088817, 51.514271]}
//     style="mapbox://styles/mapbox/streets-v9"
//     containerStyle={{
//       height: '56.25vh',
//       width: '100%'
//     }}
//   >
//   </Map>
// </div>
//

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
