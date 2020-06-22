import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class BottomDestinationDisplay extends React.Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    this.props.onHandleDirectionsButtonClick()
  }

  render() {
    return(
      <div className="bottomFormContainer">
        <div className="box is-radiusless">
          <p className="button is-static is-fullwidth">{this.props.bottomDestinationData}
          </p>
          <button className="button is-info" onClick={this.handleClick} >
            <span className="icon">
              <FontAwesomeIcon icon="directions"/>
            </span>
            <span>Directions</span>
          </button>
        </div>
      </div>
    )
  }

}
