import React from 'react'
import {Link} from 'react-router-dom'

class DirectionsDisplay extends React.Component {
  constructor() {
    super()
  }


  render() {
    const startingLocation = this.props.startingLocation
    const destination = this.props.destination
    return (
      <div className="box">
        <div className="field">
          <div className="control">
            <Link to={'/selectOrigin/'}>
              <button className="button is-expanded" >
            Your origin
              </button>
            </Link>
          </div>
          <div className="control">
            <input readOnly className="input"
              type="text"
              placeholder="Choose destination"
              value={destination}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default DirectionsDisplay

// <input className="input"
//   type="text"
//   placeholder="Add your location to plan route"
//   value={startingLocation}
// />




// <div className="container is-vcentered">
//   <div className="columns is-mobile">
//     <div className="column">
//     Icon
//     </div>
//     <div className="column is-three-fifths">
//       <div className="field">
//         <div className="control">
//           <input readOnly className="input"
//             type="text"
//             value="Your Location"
//           />
//           <input readOnly className="input"
//             type="text"
//             value="Choose destination"
//           />
//         </div>
//       </div>
//     </div>
//     <div className="column">
//     Icon
//     </div>
//   </div>
// </div>
