import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class DirectionsDisplay extends React.Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.props.onArrowLeft()
  }

  render() {
    const startingLocation = this.props.startingLocation
    const destination = this.props.destination
    return (
      <div className="box">
        <div className="columns is-mobile">
          <div className="column">
            <a className="button is-radiusless" onClick={this.handleClick}>
              <span className="icon">
                <FontAwesomeIcon icon="arrow-left" />
              </span>
            </a>
          </div>
          <div className="column is-11">
            <div className="field">
              <div className="control">
                <input className="input"
                  type="text"
                  placeholder="Add your location to plan route"
                  value={startingLocation}
                />
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
        </div>
      </div>
    )
  }
}

export default DirectionsDisplay






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
