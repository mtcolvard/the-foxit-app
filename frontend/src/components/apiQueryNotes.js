// import React from 'react'
// import axios from 'axios'
// import Card from './Card'
// // import ReactDom from 'react-dom'
//
// class CitiesIndex extends React.Component {
//   constructor() {
//     super()
//     this.state = {
//       cities: [],
//       formData: {},
//       chosenCity: {},
//     }
//     this.handleSubmit = this.handleSubmit.bind(this)
//     this.handleChange = this.handleChange.bind(this)
//     this.handleKeyUp = this.handleKeyUp.bind(this)
//   }
//
//   // SENT THE LATITDE AND LONGITUDE FROM THE MAPQUEST SEARCH TO THE WEATHER API
//     componentDidMount() {
//         const citiesToFetch = [
//           { lat: 37.8267, long: -122.4233 },
//           { lat: 40.7127, long: -74.0059 },
//           // { lat: 51.507351, long: -0.127758 },
//           // { lat: 25.204849, long: 55.270782},
//           { lat: 13.756331, long: 100.501762} ]
//
//         citiesToFetch.forEach(city => {
//           axios.get(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${process.env.API_KEY_WEATHER}/${city.lat},${city.long}`)
//             .then(res => this.setState({cities: this.state.cities.concat(res.data)}))
//
//         })
//     }
//
//   handleChange(e) {
//     const formData = {...this.state.formData, [e.target.location]: e.target.value }
//     this.setState({ formData })
//   }
//
//   handleKeyUp(e) {
//     this.setState({ newCity: e.target.value })
//   }
//
// //GRAB LATITUDE AND LONGITUDE FROM SEARCH FOR CITY IN MAPQUEST API
//   handleSubmit(e) {
//     e.preventDefault()
//     const inputCity = ''
//
//     axios.get(`https://cors-anywhere.herokuapp.com/http://open.mapquestapi.com/geocoding/v1/address?key=${process.env.API_KEY_MAP}&location=${this.state.newCity}`)
//       .then(res => {
//         const latitude = res.data.results[0].locations[0].displayLatLng.lat
//         const longitude = res.data.results[0].locations[0].displayLatLng.lng
//         axios.get(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${process.env.API_KEY_WEATHER}/${latitude},${longitude}`)
//           .then(darkSkyres => {
//               this.setState({cities: this.state.cities.concat(darkSkyres.data)})
//       })
//     })
//
//
//   }
//
//   // {lat: this.state.chosenCity.lat , long: this.state.chosenCity.lng}
//
//   // console.log(this.state.chosenCity)
//   // console.log(this.state.chosenCity.lat)
//   // console.log(this.state.chosenCity.lng)
//   // console.log(this.state.newCity)
//
//
//   render() {
//
//     if(!this.state.cities) return <h2>just a second</h2>
//     return (
//       <section className="section">
//         <div className="hero is-medium is-primary is-bold">
//           <div className="hero-body">
//             <div className="container">
//                 <h1 className="title is-left">
//                   Weather Friends
//                 </h1>
//                 <h2 className="subtitle is-left">
//                   A place to take the weather of your friends.
//                 </h2>
//             </div>
//             </div>
//           </div>
//             <div className="container is-right">
//               <div className="level">
//                 <div className="container">
//                   <form onSubmit={this.handleSubmit}>
//                     <div className="field">
//                       <label className="label">City Name</label>
//                       <div className="control">
//                         <input
//                           className="input navbar-item has-text-black-bis"
//                           name="cityName"
//                           placeholder="New York or Baghdad"
//                           onKeyUp={this.handleKeyUp}
//                         />
//                       </div>
//                       <button className="button is-primary" onClick={this.handleSubmit}>Add City</button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//
//
//
//         <div className="columns is-multiline">
//           {this.state.cities.map(city =>
//             <div className="column" key={city.latitude}>
//               <Card
//                 timezone={city.timezone}
//                 time={city.currently.time}
//                 summary={city.currently.summary}
//                 temperature={city.currently.temperature}
//                 icon={city.currently.icon}
//                 humidity={city.currently.humidity}
//                 precipProbability={city.currently.precipProbability}
//                 apparentTemperature={city.currently.apparentTemperature}
//                 windSpeed={city.currently.windSpeed}
//                 uvIndex={city.currently.uvIndex}
//               />
//             </div>
//           )}
//         </div>
//       </section>
//     )
//   }
// }
//
// export default CitiesIndex
