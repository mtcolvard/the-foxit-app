// import React from 'react'
// import ReactMapboxGl, { Marker, Popup } from 'react-mapbox-gl'
// import axios from 'axios'
// import HappeningSearch from './HappeningSearch'
//
// const Map = ReactMapboxGl({
//   accessToken: 'pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNqemI4emZydjA2dHIzYm80ZG96ZmQyN2wifQ.kVp6eB7AkWjslUOtsJyLDQ'
// })
//
// class MapView extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//     }
//     this.selectHappening = this.selectHappening.bind(this)
//   }
//
//   // componentDidMount() {
//   //   const sendHappenings = this.props.sendHappenings
//   //   this.setState({sendHappenings})
//   // }
//
//   selectHappening(happening) {
//     this.setState({ selectedHappening: happening })
//   }
//   // if(!this.state.happenings) return null
//
//   render() {
//     console.log('maps', this.state.sendHappenings)
//
//     return (
//       <div className="has-ratio">
//         {!this.props.sendHappenings && <h2 className="title is-2">Loading...</h2>}
//         {this.props.sendHappenings &&
//             <Map
//               center={[-0.088817, 51.514271]}
//               style="mapbox://styles/mapbox/streets-v9"
//               containerStyle={{
//                 height: '56.25vh',
//                 width: '100%'
//               }}
//             >
//               {this.props.sendHappenings.map(happening =>
//                 <div key={happening._id}>
//                   <Marker
//                     coordinates={[happening.lon, happening.lat]}
//                     onClick={() => this.selectHappening(happening)}
//                     ariaRole='button'
//                   >
//                     {<span className="icon is-medium"><i className="fas fa-map-marker-alt"aria-hidden="true"></i></span>}
//                   </Marker>
//                   {this.state.selectedHappening === happening &&
//                     <Popup
//                       className="tile is-parent"
//                       key={happening._id}
//                       coordinates={[happening.lon, happening.lat]}
//                       offset={{
//                         'bottom-left': [12, -38],
//                         'bottom': [0, -38],
//                         'bottom-right': [-12, -38]}}>
//                       <article className="tile is-child">
//                         <p className="is-size-6">{happening.name}</p>
//                       </article>
//                     </Popup>
//                   }
//                 </div>
//               )}
//             </Map>
//         }
//       </div>
//     )
//   }
// }
// export default MapView
//
// //   render() {
// //     console.log('maps', this.state.sendHappenings)
// //
// //     return (
// //       <div className="has-ratio">
// //         {!this.props.sendHappenings && <h2 className="title is-2">Loading...</h2>}
// //         {this.props.sendHappenings &&
// //             <Map
// //               center={[-0.088817, 51.514271]}
// //               style="mapbox://styles/mapbox/streets-v9"
// //               containerStyle={{
// //                 height: '56.25vh',
// //                 width: '100%'
// //               }}
// //             >
// //               {this.props.sendHappenings.map(happening =>
// //                 <div key={happening._id}>
// //                   <Marker
// //                     coordinates={[happening.lon, happening.lat]}
// //                     onClick={() => this.selectHappening(happening)}
// //                     ariaRole='button'
// //                   >
// //                     {<span className="icon is-medium"><i className="fas fa-map-marker-alt"aria-hidden="true"></i></span>}
// //                   </Marker>
// //                   {this.state.selectedHappening === happening &&
// //                     <Popup
// //                       className="tile is-parent"
// //                       key={happening._id}
// //                       coordinates={[happening.lon, happening.lat]}
// //                       offset={{
// //                         'bottom-left': [12, -38],
// //                         'bottom': [0, -38],
// //                         'bottom-right': [-12, -38]}}>
// //                       <article className="tile is-child">
// //                         <p className="is-size-6">{happening.name}</p>
// //                         <figure className="image is-16by9">
// //                           <img src={happening.photo}/>
// //                         </figure>
// //                       </article>
// //                     </Popup>
// //                   }
// //                 </div>
// //               )}
// //             </Map>
// //         }
// //       </div>
// //     )
// //   }
// // }
// // export default MapView
