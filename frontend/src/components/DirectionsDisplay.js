import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class DirectionsDisplay extends React.Component {
  constructor() {
    super()
    this.handleArrowLeftClick = this.handleArrowLeftClick.bind(this)
    this.triggerOriginSearchMenu = this.triggerOriginSearchMenu.bind(this)
    this.triggerDestinationSearchMenu = this.triggerDestinationSearchMenu.bind(this)
  }

  handleArrowLeftClick() {
    this.props.onArrowLeft()
  }

  triggerOriginSearchMenu() {
    this.props.onTriggerOriginSearchMenu()
  }

  triggerDestinationSearchMenu() {
    this.props.onTriggerDestinationSearchMenu()
  }

  render() {
    const destination = this.props.destination
    const origin = this.props.origin
    return (
      <div className="box">
        <div className="columns is-mobile">
          <div className="column">
            <a className="button is-radiusless" onClick={this.handleArrowLeftClick}>
              <span className="icon">
                <FontAwesomeIcon icon="arrow-left" />
              </span>
            </a>
          </div>
          <div className="column is-11">
            <div className="field">
              <div className="control">
                <input
                  readOnly
                  className="input"
                  type="text"
                  placeholder="Choose starting point"
                  value={origin}
                  onClick={this.triggerOriginSearchMenu}
                />
              </div>
              <div className="control">
                <input
                  readOnly
                  className="input"
                  type="text"
                  placeholder="Choose destination"
                  value={destination}
                  onClick={this.triggerDestinationSearchMenu}
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
